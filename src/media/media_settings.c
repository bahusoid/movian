/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  This program is also available under a commercial proprietary license.
 *  For more information, contact andreas@lonelycoder.com
 */
#include <stdio.h>

#include "media.h"
#include "media_settings.h"
#include "video/video_settings.h"
#include "subtitles/subtitles.h"

#include "db/kvstore.h"
#include "misc/minmax.h"


#define MAX_USER_AUDIO_GAIN 12 // dB


/**
 *
 */
static void
update_av_delta(void *opaque, int v)
{
  media_pipe_t *mp = opaque;
  mp->mp_avdelta = v * 1000;
  TRACE(TRACE_DEBUG, "AVSYNC", "Set to %d ms", v);
}


/**
 *
 */
static void
update_sv_delta(void *opaque, int v)
{
  media_pipe_t *mp = opaque;
  mp->mp_svdelta = v * 1000;
  TRACE(TRACE_DEBUG, "SVSYNC", "Set to %ds", v);
}

#ifdef HW_VIDEO_DECODER
static void
update_video_accel_user(void *opaque, int value)
{
  media_pipe_t *mp = opaque;
  printf("update_video_accel_user: value=%d, inited=%d\n", value, mp->mp_video_accel_cb_inited);
  if(mp->mp_video_accel_cb_inited) {
    if(mp->mp_video_accel != value) {
      mp->mp_video_accel = value;
      event_dispatch(event_create_action(ACTION_RELOAD_DATA));
    }
  } else {
    mp->mp_video_accel_cb_inited = 1;
    mp->mp_video_accel = value;
  }
}
#endif

/**
 *
 */
static void
update_audio_volume_user(void *opaque, int value)
{
  media_pipe_t *mp = opaque;
  mp->mp_vol_user = MIN(MAX_USER_AUDIO_GAIN, value);
  mp_send_volume_update_locked(mp);
}

/**
 *
 */
void
mp_settings_clear(media_pipe_t *mp)
{
  mp->mp_vol_setting = NULL;
  setting_group_destroy(&mp->mp_settings_video);
  setting_group_destroy(&mp->mp_settings_audio);
  setting_group_destroy(&mp->mp_settings_subtitle);

  setting_group_destroy(&mp->mp_settings_video_dir);
  setting_group_destroy(&mp->mp_settings_audio_dir);
  setting_group_destroy(&mp->mp_settings_subtitle_dir);

  setting_group_destroy(&mp->mp_settings_other);
}


static void
reset_video_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_reset(&mp->mp_settings_video);
}

static void
reset_audio_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_reset(&mp->mp_settings_audio);
}

static void
reset_subtitle_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_reset(&mp->mp_settings_subtitle);
}

// -- Video setting action ------------------------------------

static void
set_video_global_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_push_to_ancestor(&mp->mp_settings_video, "global");
  setting_group_reset(&mp->mp_settings_video);
}


static void
set_video_directory_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_push_to_ancestor(&mp->mp_settings_video, "directory");
  setting_group_reset(&mp->mp_settings_video);
}

// -- Audio setting action ------------------------------------

static void
set_audio_global_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_push_to_ancestor(&mp->mp_settings_audio, "global");
  setting_group_reset(&mp->mp_settings_audio);
}


static void
set_audio_directory_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_push_to_ancestor(&mp->mp_settings_audio, "directory");
  setting_group_reset(&mp->mp_settings_audio);
}

// -- Subtitle setting action ------------------------------------


static void
set_subtitle_global_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_push_to_ancestor(&mp->mp_settings_subtitle, "global");
  setting_group_reset(&mp->mp_settings_subtitle);
}


static void
set_subtitle_directory_defaults(void *opaque)
{
  media_pipe_t *mp = opaque;
  setting_group_push_to_ancestor(&mp->mp_settings_subtitle, "directory");
  setting_group_reset(&mp->mp_settings_subtitle);
}

/**
 *
 */
static setting_t *
make_dir_setting(int type, const char *id, struct setting_list *group,
                 const char *dir_url, setting_t *parent,
                 media_pipe_t *mp)
{
  if(dir_url == NULL)
    return parent;

  return setting_create(type, NULL, SETTINGS_INITIAL_UPDATE,
                        SETTING_MUTEX(mp),
                        SETTING_LOCKMGR(mp_lockmgr),
                        SETTING_KVSTORE(dir_url, id),
                        SETTING_GROUP(group),
                        SETTING_INHERIT(parent),
                        SETTING_VALUE_ORIGIN("directory"),
                        NULL);
}



/**
 *
 */
void
mp_settings_init(media_pipe_t *mp, const char *url, const char *dir_url,
                 const char *parent_title)
{
  setting_t *p, *more;
  prop_t *c = mp->mp_prop_ctrl;
  char set_directory_title[256];

  mp_settings_clear(mp);

  if(url == NULL || !(mp->mp_flags & MP_VIDEO))
    return;

  if(parent_title == NULL)
    dir_url = NULL;

  TRACE(TRACE_DEBUG, "media",
        "Settings initialized for URL %s in folder: %s [%s]",
        url, parent_title ?: "<unset>", dir_url ?: "<unset>");

  if(dir_url != NULL) {
    rstr_t *fmt;

    fmt = _("Save as defaults for folder '%s'");
    snprintf(set_directory_title, sizeof(set_directory_title), rstr_get(fmt),
             parent_title);
    rstr_release(fmt);
  }

  // --- Video -------------------------------------------------

#ifdef HW_VIDEO_DECODER
  p = make_dir_setting(SETTING_BOOL, "video_accel", &mp->mp_settings_video_dir,
                       dir_url, video_settings.video_accel_setting, mp);

  setting_create(SETTING_BOOL, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("Hardware accelerated decoding")),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_WRITE_PROP(prop_create(c, "video_accel")),
                 SETTING_KVSTORE(url, "video_accel"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 SETTING_CALLBACK(update_video_accel_user, mp),
                 NULL);
#endif

  p = make_dir_setting(SETTING_INT, "vzoom", &mp->mp_settings_video_dir,
                       dir_url, video_settings.vzoom_setting, mp);

  setting_create(SETTING_INT, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("Video zoom")),
                 SETTING_RANGE(50, 200),
                 SETTING_UNIT_CSTR("%"),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_WRITE_PROP(prop_create(c, "vzoom")),
                 SETTING_KVSTORE(url, "vzoom"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_INT, "panhorizontal", &mp->mp_settings_video_dir,
                       dir_url, video_settings.pan_horizontal_setting, mp);

  setting_create(SETTING_INT, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("Horizontal pan")),
                 SETTING_RANGE(-100, 100),
                 SETTING_UNIT_CSTR("%"),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_WRITE_PROP(prop_create(c, "panhorizontal")),
                 SETTING_KVSTORE(url, "panhorizontal"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_INT, "panvertical", &mp->mp_settings_video_dir,
                       dir_url, video_settings.pan_vertical_setting, mp);

  setting_create(SETTING_INT, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("Vertical pan")),
                 SETTING_RANGE(-100, 100),
                 SETTING_UNIT_CSTR("%"),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_WRITE_PROP(prop_create(c, "panvertical")),
                 SETTING_KVSTORE(url, "panvertical"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_INT, "scalehorizontal", &mp->mp_settings_video_dir,
                       dir_url, video_settings.scale_horizontal_setting, mp);

  setting_create(SETTING_INT, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("Horizontal scale")),
                 SETTING_RANGE(10, 300),
                 SETTING_UNIT_CSTR("%"),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_WRITE_PROP(prop_create(c, "scalehorizontal")),
                 SETTING_KVSTORE(url, "scalehorizontal"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_INT, "scalevertical", &mp->mp_settings_video_dir,
                       dir_url, video_settings.scale_vertical_setting, mp);

  setting_create(SETTING_INT, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_TITLE(_p("Vertical scale")),
                 SETTING_RANGE(10, 300),
                 SETTING_UNIT_CSTR("%"),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_WRITE_PROP(prop_create(c, "scalevertical")),
                 SETTING_KVSTORE(url, "scalevertical"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_BOOL, "hstretch", &mp->mp_settings_video_dir,
                       dir_url, video_settings.stretch_horizontal_setting, mp);

  setting_create(SETTING_BOOL, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_TITLE(_p("Stretch video to widescreen")),
                 SETTING_WRITE_PROP(prop_create(c, "hstretch")),
                 SETTING_KVSTORE(url, "hstretch"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_BOOL, "fstretch", &mp->mp_settings_video_dir,
                       dir_url, video_settings.stretch_fullscreen_setting, mp);

  setting_create(SETTING_BOOL, mp->mp_setting_video_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_TITLE(_p("Stretch video to fullscreen")),
                 SETTING_WRITE_PROP(prop_create(c, "fstretch")),
                 SETTING_KVSTORE(url, "fstretch"),
                 SETTING_GROUP(&mp->mp_settings_video),
                 SETTING_INHERIT(p),
                 NULL);

  if(video_settings.vinterpolate_setting != NULL) {
    p = make_dir_setting(SETTING_BOOL, "vinterpolate",
                         &mp->mp_settings_video_dir,
                         dir_url, video_settings.vinterpolate_setting, mp);

    setting_create(SETTING_BOOL, mp->mp_setting_video_root,
                   SETTINGS_INITIAL_UPDATE,
                   SETTING_MUTEX(mp),
                   SETTING_LOCKMGR(mp_lockmgr),
                   SETTING_TITLE(_p("Video frame interpolation")),
                   SETTING_WRITE_PROP(prop_create(c, "vinterpolate")),
                   SETTING_KVSTORE(url, "vinterpolate"),
                   SETTING_GROUP(&mp->mp_settings_video),
                   SETTING_INHERIT(p),
                   NULL);
  }

  setting_create(SETTING_SEPARATOR, mp->mp_setting_video_root, 0,
                 SETTING_GROUP(&mp->mp_settings_video),
                 NULL);

  more = setting_create(SETTING_SEPARATOR, mp->mp_setting_video_root, 0,
                        SETTING_TITLE(_p("More...")),
                        SETTING_GROUP(&mp->mp_settings_video),
                        NULL);
  if(more) {
    prop_t *more_root = setting_get_root(more);
    if (more_root) {
      prop_set(more_root, "type", PROP_SET_STRING, "settings");
      prop_set(more_root, "url", PROP_SET_STRING, "settings:video");
      prop_set(more_root, "subtype", PROP_SET_STRING, "video");
    }
  }

  setting_create(SETTING_ACTION, mp->mp_setting_video_root, 0,
                 SETTING_TITLE(_p("Save as global default")),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_CALLBACK(set_video_global_defaults, mp),
                 SETTING_GROUP(&mp->mp_settings_video),
                 NULL);

  if(dir_url != NULL) {
    setting_create(SETTING_ACTION, mp->mp_setting_video_root, 0,
                   SETTING_TITLE_CSTR(set_directory_title),
                   SETTING_MUTEX(mp),
                   SETTING_LOCKMGR(mp_lockmgr),
                   SETTING_CALLBACK(set_video_directory_defaults, mp),
                   SETTING_GROUP(&mp->mp_settings_video),
                   NULL);
  }

  setting_create(SETTING_ACTION, mp->mp_setting_video_root, 0,
                 SETTING_TITLE(_p("Reset to defaults")),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_CALLBACK(reset_video_defaults, mp),
                 SETTING_GROUP(&mp->mp_settings_video),
                 NULL);

  // --- Audio ---------------------------------------------


  p = make_dir_setting(SETTING_INT, "audiovolume", &mp->mp_settings_audio_dir,
                       dir_url, gconf.setting_av_volume, mp);

  mp->mp_vol_setting =
  setting_create(SETTING_INT, mp->mp_setting_audio_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_TITLE(_p("Audio volume")),
                 SETTING_RANGE(-12, MAX_USER_AUDIO_GAIN),
                 SETTING_UNIT_CSTR("dB"),
                 SETTING_CALLBACK(update_audio_volume_user, mp),
                 SETTING_WRITE_PROP(prop_create(c, "audiovolume")),
                 SETTING_KVSTORE(url, "audiovolume"),
                 SETTING_PROP_ENABLER(prop_create(c, "canAdjustVolume")),
                 SETTING_GROUP(&mp->mp_settings_audio),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_INT, "avdelta", &mp->mp_settings_audio_dir,
                       dir_url, gconf.setting_av_sync, mp);

  setting_create(SETTING_INT, mp->mp_setting_audio_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_TITLE(_p("Audio delay")),
                 SETTING_RANGE(-5000, 5000),
                 SETTING_STEP(50),
                 SETTING_UNIT_CSTR("ms"),
                 SETTING_CALLBACK(update_av_delta, mp),
                 SETTING_WRITE_PROP(prop_create(c, "avdelta")),
                 SETTING_KVSTORE(url, "avdelta"),
                 SETTING_GROUP(&mp->mp_settings_audio),
                 SETTING_INHERIT(p),
                 NULL);

  setting_create(SETTING_SEPARATOR, mp->mp_setting_audio_root, 0,
                 SETTING_GROUP(&mp->mp_settings_audio),
                 NULL);

  more = setting_create(SETTING_SEPARATOR, mp->mp_setting_audio_root, 0,
                        SETTING_TITLE(_p("More...")),
                        SETTING_GROUP(&mp->mp_settings_audio),
                        NULL);
  if(more) {
    prop_t *more_root = setting_get_root(more);
    if (more_root) {
      prop_set(more_root, "type", PROP_SET_STRING, "settings");
      prop_set(more_root, "url", PROP_SET_STRING, "settings:audio");
      prop_set(more_root, "subtype", PROP_SET_STRING, "audio");
    }
  }

  setting_create(SETTING_ACTION, mp->mp_setting_audio_root, 0,
                 SETTING_TITLE(_p("Save as global default")),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_CALLBACK(set_audio_global_defaults, mp),
                 SETTING_GROUP(&mp->mp_settings_audio),
                 NULL);

  if(dir_url != NULL) {
    setting_create(SETTING_ACTION, mp->mp_setting_audio_root, 0,
                   SETTING_TITLE_CSTR(set_directory_title),
                   SETTING_MUTEX(mp),
                   SETTING_LOCKMGR(mp_lockmgr),
                   SETTING_CALLBACK(set_audio_directory_defaults, mp),
                   SETTING_GROUP(&mp->mp_settings_audio),
                   NULL);
  }

  setting_create(SETTING_ACTION, mp->mp_setting_audio_root, 0,
                 SETTING_TITLE(_p("Reset to defaults")),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_CALLBACK(reset_audio_defaults, mp),
                 SETTING_GROUP(&mp->mp_settings_audio),
                 NULL);

  // --- Subtitle ------------------------------------------

  setting_create(SETTING_INT, mp->mp_setting_subtitle_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_TITLE(_p("Delay")),
                 SETTING_RANGE(-600000, 600000),
                 SETTING_STEP(500),
                 SETTING_UNIT_CSTR("ms"),
                 SETTING_CALLBACK(update_sv_delta, mp),
                 SETTING_WRITE_PROP(prop_create(c, "svdelta")),
                 SETTING_KVSTORE(url, "svdelta"),
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 NULL);

  p = make_dir_setting(SETTING_INT, "subscale", &mp->mp_settings_subtitle_dir,
                       dir_url, subtitle_settings.scaling_setting, mp);

  setting_create(SETTING_INT, mp->mp_setting_subtitle_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_TITLE(_p("Scaling")),
                 SETTING_RANGE(30, 500),
                 SETTING_STEP(5),
                 SETTING_UNIT_CSTR("%"),
                 SETTING_WRITE_PROP(prop_create(c, "subscale")),
                 SETTING_KVSTORE(url, "subscale"),
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_BOOL, "subalign", &mp->mp_settings_subtitle_dir,
                       dir_url, subtitle_settings.align_on_video_setting, mp);

  setting_create(SETTING_BOOL, mp->mp_setting_subtitle_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_TITLE(_p("Align on video frame")),
                 SETTING_WRITE_PROP(prop_create(c, "subalign")),
                 SETTING_KVSTORE(url, "subalign"),
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_INT, "subvdisplace",
                       &mp->mp_settings_subtitle_dir,
                       dir_url, subtitle_settings.vertical_displacement_setting,
                       mp);

  setting_create(SETTING_INT, mp->mp_setting_subtitle_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_RANGE(-300, 300),
                 SETTING_STEP(5),
                 SETTING_UNIT_CSTR("px"),
                 SETTING_TITLE(_p("Vertical position")),
                 SETTING_WRITE_PROP(prop_create(c, "subvdisplace")),
                 SETTING_KVSTORE(url, "subvdisplace"),
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 SETTING_INHERIT(p),
                 NULL);

  p = make_dir_setting(SETTING_INT, "subhdisplace", 
                       &mp->mp_settings_subtitle_dir,
                       dir_url,
                       subtitle_settings.horizontal_displacement_setting,
                       mp);

  setting_create(SETTING_INT, mp->mp_setting_subtitle_root,
                 SETTINGS_INITIAL_UPDATE,
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_RANGE(-300, 300),
                 SETTING_STEP(5),
                 SETTING_UNIT_CSTR("px"),
                 SETTING_TITLE(_p("Horizontal position")),
                 SETTING_WRITE_PROP(prop_create(c, "subhdisplace")),
                 SETTING_KVSTORE(url, "subhdisplace"),
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 SETTING_INHERIT(p),
                 NULL);

  setting_create(SETTING_SEPARATOR, mp->mp_setting_subtitle_root, 0,
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 NULL);

  more = setting_create(SETTING_SEPARATOR, mp->mp_setting_subtitle_root, 0,
                        SETTING_TITLE(_p("More...")),
                        SETTING_GROUP(&mp->mp_settings_subtitle),
                        NULL);
  if(more) {
    prop_t *more_root = setting_get_root(more);
    if (more_root) {
      prop_set(more_root, "type", PROP_SET_STRING, "settings");
      prop_set(more_root, "url", PROP_SET_STRING, "settings:subtitles");
      prop_set(more_root, "subtype", PROP_SET_STRING, "subtitle");
    }
  }

  setting_create(SETTING_ACTION, mp->mp_setting_subtitle_root, 0,
                 SETTING_TITLE(_p("Save as global default")),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_CALLBACK(set_subtitle_global_defaults, mp),
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 NULL);

  if(dir_url != NULL) {
    setting_create(SETTING_ACTION, mp->mp_setting_subtitle_root, 0,
                   SETTING_TITLE_CSTR(set_directory_title),
                   SETTING_MUTEX(mp),
                   SETTING_LOCKMGR(mp_lockmgr),
                   SETTING_CALLBACK(set_subtitle_directory_defaults, mp),
                   SETTING_GROUP(&mp->mp_settings_subtitle),
                   NULL);
  }

  setting_create(SETTING_ACTION, mp->mp_setting_subtitle_root, 0,
                 SETTING_TITLE(_p("Reset to defaults")),
                 SETTING_MUTEX(mp),
                 SETTING_LOCKMGR(mp_lockmgr),
                 SETTING_CALLBACK(reset_subtitle_defaults, mp),
                 SETTING_GROUP(&mp->mp_settings_subtitle),
                 NULL);

  // ----------------------------------------------------------------


  if(gconf.can_standby) {
      setting_create(SETTING_BOOL, mp->mp_setting_root,
                     SETTINGS_INITIAL_UPDATE,
                     SETTING_MUTEX(mp),
                     SETTING_LOCKMGR(mp_lockmgr),
                     SETTING_WRITE_INT(&mp->mp_auto_standby),
                     SETTING_TITLE(_p("Go to standby after video ends")),
                     SETTING_GROUP(&mp->mp_settings_other),
                     NULL);
  }
}


