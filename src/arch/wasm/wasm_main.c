/*
 *  Copyright (C) 2007-2015 Lonelycoder AB
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 */
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include "main.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/html5.h>
#endif

#include "arch/posix/posix.h"
#include "prop/prop.h"
#include "navigator.h"
#include "service.h"
#include "ui/glw/glw.h"
#include "arch/arch.h"
#include "event.h"
#include "misc/str.h"

int running = 0;
typedef struct wasm_glw_root {
  glw_root_t gr;
  float mouse_x;
  float mouse_y;
  int fb_width;
  int fb_height;
  int full_window;
} wasm_glw_root_t;

static wasm_glw_root_t *uiroot;

static EMSCRIPTEN_WEBGL_CONTEXT_HANDLE gl_context;

void arch_get_random_bytes(void *ptr, size_t size) {
#ifdef __EMSCRIPTEN__
    EM_ASM_({
    // Some browsers reject getRandomValues() on a SharedArrayBuffer-backed view.
    var tmp = new Uint8Array($1);
    crypto.getRandomValues(tmp);
    HEAPU8.set(tmp, $0);
    }, ptr, size);
#endif
}

static void glw_in_fullwindow(void *opaque, int fullwindow) {
  wasm_glw_root_t *ngr = opaque;
  ngr->full_window = fullwindow;
  if(fullwindow) {
    emscripten_request_fullscreen("#canvas", 1);
  } else {
    emscripten_exit_fullscreen();
  }
}

static void wasm_update_sizes(wasm_glw_root_t *ngr) {
  double css_w = 0;
  double css_h = 0;
  double dpr = emscripten_get_device_pixel_ratio();
  if(dpr < 1.0)
    dpr = 1.0;

  emscripten_get_element_css_size("#canvas", &css_w, &css_h);
  if(css_w <= 0 || css_h <= 0) {
    css_w = 1280;
    css_h = 720;
  }

  ngr->gr.gr_width = (int)css_w;
  ngr->gr.gr_height = (int)css_h;
  ngr->fb_width = (int)(css_w * dpr);
  ngr->fb_height = (int)(css_h * dpr);

  emscripten_set_canvas_element_size("#canvas", ngr->fb_width, ngr->fb_height);
}

static EM_BOOL wasm_resize_cb(int eventType, const EmscriptenUiEvent *e, void *userData) {
  (void)eventType;
  (void)e;
  wasm_glw_root_t *ngr = userData;
  wasm_update_sizes(ngr);
  
  if (ngr->gr.gr_universe) {
      glw_lock(&ngr->gr);
      ngr->gr.gr_need_refresh = GLW_REFRESH_FLAG_LAYOUT | GLW_REFRESH_FLAG_RENDER;
      glw_unlock(&ngr->gr);
  }
  return EM_TRUE;
}

static void send_pointer_event(wasm_glw_root_t *ngr, glw_pointer_event_t *gpe) {
  glw_pointer_event(&ngr->gr, gpe);
}

static EM_BOOL wasm_mouse_cb(int eventType, const EmscriptenMouseEvent *e, void *userData) {
  wasm_glw_root_t *ngr = userData;
  glw_pointer_event_t gpe = {0};
  gpe.screen_x =  (2.0f * e->canvasX / ngr->gr.gr_width ) - 1.0f;
  gpe.screen_y = -(2.0f * e->canvasY / ngr->gr.gr_height) + 1.0f;
  ngr->mouse_x = gpe.screen_x;
  ngr->mouse_y = gpe.screen_y;
  gpe.ts = e->timestamp * 1000;

  switch(eventType) {
      case EMSCRIPTEN_EVENT_MOUSEDOWN:
          gpe.type = (e->button == 0) ? GLW_POINTER_LEFT_PRESS : GLW_POINTER_RIGHT_PRESS;
          break;
      case EMSCRIPTEN_EVENT_MOUSEUP:
          gpe.type = (e->button == 0) ? GLW_POINTER_LEFT_RELEASE : GLW_POINTER_RIGHT_RELEASE;
          break;
      case EMSCRIPTEN_EVENT_MOUSEMOVE:
          gpe.type = GLW_POINTER_MOTION_UPDATE;
          break;
      case EMSCRIPTEN_EVENT_MOUSEENTER:
          gpe.type = GLW_POINTER_MOTION_UPDATE;
          break;
      case EMSCRIPTEN_EVENT_MOUSELEAVE:
          gpe.type = GLW_POINTER_GONE;
          break;
      default:
          return EM_FALSE;
  }
  send_pointer_event(ngr, &gpe);
  return EM_TRUE;
}


static EM_BOOL wasm_wheel_cb(int eventType, const EmscriptenWheelEvent *e, void *userData) {
  (void)eventType;
  wasm_glw_root_t *ngr = userData;
  glw_pointer_event_t gpe = {0};
  gpe.screen_x = ngr->mouse_x;
  gpe.screen_y = ngr->mouse_y;
  gpe.delta_x = e->deltaX;
  gpe.delta_y = -e->deltaY;
  gpe.type = GLW_POINTER_FINE_SCROLL;
  gpe.ts = e->mouse.timestamp * 1000;
  send_pointer_event(ngr, &gpe);
  return EM_TRUE;
}

static void send_action(wasm_glw_root_t *ngr, action_type_t action) {
  action_type_t av[1] = { action };
  event_t *e = event_create_action_multi(av, 1);
  if(e) {
    e->e_flags |= EVENT_KEYPRESS;
    glw_lock(&ngr->gr);
    glw_inject_event(&ngr->gr, e);
    glw_unlock(&ngr->gr);
  }
}

static void send_char(wasm_glw_root_t *ngr, uint32_t uc) {
  event_t *e = event_create_int(EVENT_UNICODE, uc);
  if(e) {
    glw_lock(&ngr->gr);
    glw_inject_event(&ngr->gr, e);
    glw_unlock(&ngr->gr);
  }
}

static EM_BOOL wasm_key_cb(int eventType, const EmscriptenKeyboardEvent *e, void *userData) {
  wasm_glw_root_t *ngr = userData;
  
  if (eventType == EMSCRIPTEN_EVENT_KEYDOWN) {
      if (strcmp(e->key, "Enter") == 0) send_action(ngr, ACTION_ENTER);
      else if (strcmp(e->key, "Escape") == 0) send_action(ngr, ACTION_NAV_BACK);
      else if (strcmp(e->key, "ArrowUp") == 0) send_action(ngr, ACTION_UP);
      else if (strcmp(e->key, "ArrowDown") == 0) send_action(ngr, ACTION_DOWN);
      else if (strcmp(e->key, "ArrowLeft") == 0) send_action(ngr, ACTION_LEFT);
      else if (strcmp(e->key, "ArrowRight") == 0) send_action(ngr, ACTION_RIGHT);
      else if (strcmp(e->key, "Backspace") == 0) send_action(ngr, ACTION_BS);
      else if (strcmp(e->key, " ") == 0 || strcmp(e->key, "Space") == 0) send_action(ngr, ACTION_PLAYPAUSE);
      else if (strlen(e->key) == 1) {
          // It's a character
          const char *s = e->key;
          uint32_t uc = utf8_get(&s);
          if(uc > 31 && uc != 0xfffd) {
             send_char(ngr, uc);
          }
      }
      return EM_FALSE;
  }
  return EM_FALSE; 
}


static void mainloop(void)
{
  wasm_glw_root_t *ngr = uiroot;
  glw_root_t *gr = &ngr->gr;
  int zmax = 0;
  glw_rctx_t rc;

  glw_lock(gr);
  glw_prepare_frame(gr, 0);

  int refresh = gr->gr_need_refresh;
  gr->gr_need_refresh = 0;

  if (refresh && gr->gr_universe != NULL) {
    glw_rctx_init(&rc, gr->gr_width, gr->gr_height, 1, &zmax);
    glw_layout0(gr->gr_universe, &rc);

    if (refresh & GLW_REFRESH_FLAG_RENDER) {
      glViewport(0, 0, ngr->fb_width, ngr->fb_height);
      glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
      glw_render0(gr->gr_universe, &rc);
      glw_post_scene(gr);
    }
  }

  glw_unlock(gr);
}

int arch_stop_req(void) {
  emscripten_cancel_main_loop();
  return 0;
}

void arch_exit(void) {
  exit(0);
}

int main(int argc, char **argv) {
  posix_init();
  main_init();

  uiroot = calloc(1, sizeof(wasm_glw_root_t));
  
  EmscriptenWebGLContextAttributes attr;
  emscripten_webgl_init_context_attributes(&attr);
  attr.alpha = 0;
  attr.depth = 1;
  attr.stencil = 0;
  attr.antialias = 0;
  attr.preserveDrawingBuffer = 0;
  attr.majorVersion = 2; // WebGL 2

  gl_context = emscripten_webgl_create_context("#canvas", &attr);
  emscripten_webgl_make_context_current(gl_context);

  prop_courier_t *pc = prop_courier_create_passive();

  if(glw_init4(&uiroot->gr, NULL, pc, 0)) {
    panic("GLW failed to initialize");
  }

  prop_subscribe(0,
                 PROP_TAG_NAME("ui", "fullwindow"),
                 PROP_TAG_COURIER, pc,
                 PROP_TAG_CALLBACK_INT, glw_in_fullwindow, uiroot,
                 PROP_TAG_ROOT, uiroot->gr.gr_prop_ui,
                 NULL);

  glw_lock(&uiroot->gr);
  glw_load_universe(&uiroot->gr);
  glw_unlock(&uiroot->gr);

  if(glw_opengl_init_context(&uiroot->gr)) {
    panic("GLW OpenGL context init failed");
  }

  emscripten_set_resize_callback(EMSCRIPTEN_EVENT_TARGET_WINDOW, uiroot, 0, wasm_resize_cb);
  emscripten_set_mousedown_callback("#canvas", uiroot, 0, wasm_mouse_cb);
  emscripten_set_mouseup_callback("#canvas", uiroot, 0, wasm_mouse_cb);
  emscripten_set_mousemove_callback("#canvas", uiroot, 0, wasm_mouse_cb);
  emscripten_set_mouseenter_callback("#canvas", uiroot, 0, wasm_mouse_cb);
  emscripten_set_mouseleave_callback("#canvas", uiroot, 0, wasm_mouse_cb);
  emscripten_set_wheel_callback("#canvas", uiroot, 0, wasm_wheel_cb);
  emscripten_set_keydown_callback(EMSCRIPTEN_EVENT_TARGET_WINDOW, uiroot, 0, wasm_key_cb);

  wasm_update_sizes(uiroot);

  emscripten_set_main_loop(mainloop, 0, 1);
  return 0;
}
