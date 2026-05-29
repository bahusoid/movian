
/**
 *
 */
static void
Instance_DidDestroy(PP_Instance instance)
{
}




static void
swap_done(void *user_data, int32_t flags)
{
  mainloop(user_data);
}


/**
 *
 */
static void
mainloop(nacl_glw_root_t *ngr)
{
  glw_root_t *gr = &ngr->gr;
  int zmax = 0;
  glw_rctx_t rc;

  autohide_cursor(ngr);

  glw_lock(gr);
  glw_prepare_frame(gr, 0);

  int refresh = gr->gr_need_refresh;
  gr->gr_need_refresh = 0;

  if(refresh) {

    glw_rctx_init(&rc, gr->gr_width, gr->gr_height, 1, &zmax);
    glw_layout0(gr->gr_universe, &rc);

    if(refresh & GLW_REFRESH_FLAG_RENDER && !is_hidden) {
      glViewport(0, 0, gr->gr_width, gr->gr_height);
      glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
      glw_render0(gr->gr_universe, &rc);

    }
  }

  glw_unlock(gr);

  struct PP_CompletionCallback cc;
  cc.func = &swap_done;
  cc.user_data = ngr;

  if(refresh & GLW_REFRESH_FLAG_RENDER && !is_hidden) {
    glw_post_scene(gr);
    ppb_graphics3d->SwapBuffers(nacl_3d_context, cc);
  } else {
    ppb_core->CallOnMainThread(16, cc, 0);
  }
}


/**
 *
 */
static void
Instance_DidChangeView(PP_Instance instance, PP_Resource view)
{
  struct PP_Rect rect;
  ppb_view->GetRect(view, &rect);

  uiroot->gr.gr_width  = rect.size.width;
  uiroot->gr.gr_height = rect.size.height;

  init_ui(uiroot, 0);

  int fs = ppb_fullscreen->IsFullscreen(g_Instance);

  if(gconf.enable_input_event_debug)
    TRACE(TRACE_DEBUG, "Input", "View changed to %d x %d%s",
          uiroot->gr.gr_width, uiroot->gr.gr_height,
          fs ? ", (Fullscreen)" : "");

  glw_set_fullscreen(&uiroot->gr, fs);
  if(fs)
    hide_cursor(uiroot);
}


/**
 *
 */
static void
Instance_DidChangeFocus(PP_Instance instance, PP_Bool has_focus)
{
}


/**
 *
 */
static PP_Bool
Instance_HandleDocumentLoad(PP_Instance instance, PP_Resource url_loader)
{
  return PP_FALSE;
}



/**
 *
 */
static void
hide_cursor(nacl_glw_root_t *ngr)
{
  glw_pointer_event_t gpe = {0};

  if(ngr->cursor_hidden)
    return;

  ngr->cursor_hidden = 1;

  if(gconf.enable_input_event_debug)
    TRACE(TRACE_DEBUG, "Input", "Cursor hidden");

  ppb_mousecursor->SetCursor(g_Instance, PP_MOUSECURSOR_TYPE_NONE, 0, NULL);
  gpe.type = GLW_POINTER_GONE;
  glw_lock(&ngr->gr);
  glw_pointer_event(&ngr->gr, &gpe);
  glw_unlock(&ngr->gr);
}


/**
 *
 */
static void
autohide_cursor(nacl_glw_root_t *ngr)
{
  if(!ngr->full_window)
    return;

  if(ngr->cursor_hidden)
    return;

  if(ngr->gr.gr_time_usec > ngr->hide_cursor_at) {
    hide_cursor(ngr);
  }
}


/**
 *
 */
static void
show_cursor(nacl_glw_root_t *ngr)
{
  ngr->hide_cursor_at = ngr->gr.gr_time_usec + GLW_CURSOR_AUTOHIDE_TIME;
  if(!ngr->cursor_hidden)
    return;

  ngr->cursor_hidden = 0;
  ppb_mousecursor->SetCursor(g_Instance, PP_MOUSECURSOR_TYPE_POINTER, 0, NULL);
  if(gconf.enable_input_event_debug)
    TRACE(TRACE_DEBUG, "Input", "Cursor shown");
}



#define KC_LEFT  37
#define KC_UP    38
#define KC_RIGHT 39
#define KC_DOWN  40
#define KC_ESC   27

#define KC_F1    112
#define KC_F11   122
#define KC_F12   123

#define KC_HOME    36
#define KC_END     35
#define KC_PAGE_UP   33
#define KC_PAGE_DOWN 34
#define KC_ENTER   13
#define KC_TAB     9
#define KC_BACKSPACE 8

#define MOD_SHIFT 0x1
#define MOD_CTRL  0x2
#define MOD_ALT   0x4



static const struct {
  int code;
  int modifier;
  int action1;
  int action2;
  int action3;
} keysym2action[] = {

  { KC_LEFT,         0,           ACTION_LEFT },
  { KC_RIGHT,        0,           ACTION_RIGHT },
  { KC_UP,           0,           ACTION_UP },
  { KC_DOWN,         0,           ACTION_DOWN },

  { KC_LEFT,         MOD_SHIFT,   ACTION_MOVE_LEFT },
  { KC_RIGHT,        MOD_SHIFT,   ACTION_MOVE_RIGHT },
  { KC_UP,           MOD_SHIFT,   ACTION_MOVE_UP },
  { KC_DOWN,         MOD_SHIFT,   ACTION_MOVE_DOWN },

  { KC_TAB,          0,           ACTION_FOCUS_NEXT },
  { KC_TAB,          MOD_SHIFT,   ACTION_FOCUS_PREV },

  { KC_ESC,          0,           ACTION_CANCEL, ACTION_NAV_BACK},
  { KC_ENTER,        0,           ACTION_ACTIVATE, ACTION_ENTER},
  { KC_BACKSPACE,    0,           ACTION_BS, ACTION_NAV_BACK},

  { KC_LEFT,         MOD_ALT,    ACTION_NAV_BACK},
  { KC_RIGHT,        MOD_ALT,    ACTION_NAV_FWD},

  { KC_LEFT,         MOD_SHIFT | MOD_CTRL,   ACTION_SKIP_BACKWARD},
  { KC_RIGHT,        MOD_SHIFT | MOD_CTRL,   ACTION_SKIP_FORWARD},

  { KC_PAGE_UP,      0, ACTION_PAGE_UP,   ACTION_PREV_CHANNEL, ACTION_SKIP_BACKWARD},
  { KC_PAGE_DOWN,    0, ACTION_PAGE_DOWN, ACTION_NEXT_CHANNEL, ACTION_SKIP_FORWARD},

  { KC_HOME,         0,           ACTION_TOP},
  { KC_END,          0,           ACTION_BOTTOM},
};


/**
 *
 */
static int
handle_keydown(nacl_glw_root_t *ngr, PP_Resource input_event)
{

  glw_root_t *gr = &ngr->gr;

  action_type_t av[10];
  uint32_t code = ppb_keyboardinputevent->GetKeyCode(input_event);
  uint32_t mod  = ppb_inputevent->GetModifiers(input_event) & 0xf;
  event_t *e = NULL;


  if(code == KC_F11) {
    int fs = ppb_fullscreen->IsFullscreen(g_Instance);
    ppb_fullscreen->SetFullscreen(g_Instance, !fs);
    return 1;
  }
  hide_cursor(ngr);

  if(gconf.enable_input_event_debug)
    TRACE(TRACE_DEBUG, "Input", "Input keycode: %d mod: 0x%x",
          code, mod);

  for(int i = 0; i < sizeof(keysym2action) / sizeof(*keysym2action); i++) {

    if(keysym2action[i].code == code &&
       keysym2action[i].modifier == mod) {

      av[0] = keysym2action[i].action1;
      av[1] = keysym2action[i].action2;
      av[2] = keysym2action[i].action3;

      if(keysym2action[i].action3 != ACTION_NONE)
        e = event_create_action_multi(av, 3);
      else if(keysym2action[i].action2 != ACTION_NONE)
        e = event_create_action_multi(av, 2);
      else
        e = event_create_action_multi(av, 1);
      break;
    }
  }

  if(e == NULL && code >= KC_F1 && code <= KC_F12)
    e = event_from_Fkey(code - KC_F1 + 1, mod & 1);


  if(e != NULL) {
    e->e_flags |= EVENT_KEYPRESS;
    glw_lock(gr);
    glw_inject_event(gr, e);
    glw_unlock(gr);
    return 1;
  }
  return 0;
}


/**
 *
 */
static int
handle_char(nacl_glw_root_t *ngr, PP_Resource input_event)
{
  hide_cursor(ngr);

  glw_root_t *gr = &ngr->gr;
  event_t *e  = NULL;
  struct PP_Var v = ppb_keyboardinputevent->GetCharacterText(input_event);
  uint32_t len;
  const char *s = ppb_var->VarToUtf8(v, &len);
  if(s != NULL) {
    char *x = alloca(len + 1);
    memcpy(x, s, len);
    x[len] = 0;
    const char *X = x;
    if(gconf.enable_input_event_debug)
      TRACE(TRACE_DEBUG, "Input", "Input characters: %s", X);
    uint32_t uc = utf8_get(&X);
    if(uc > 31 && uc != 0xfffd)
      e = event_create_int(EVENT_UNICODE, uc);

  }

  ppb_var->Release(v);

  if(e != NULL) {
    glw_lock(gr);
    glw_inject_event(gr, e);
    glw_unlock(gr);
    return 1;
  }
  return 0;
}


/**
 *
 */
static PP_Bool
handle_mouse_event(nacl_glw_root_t *ngr, PP_Resource mouse_event,
                   PP_InputEvent_Type type)
{
  glw_pointer_event_t gpe = {0};

  struct PP_Point pos = ppb_mouseinputevent->GetPosition(mouse_event);

  gpe.screen_x =  (2.0 * pos.x / ngr->gr.gr_width ) - 1;
  gpe.screen_y = -(2.0 * pos.y / ngr->gr.gr_height) + 1;

  ngr->mouse_x = gpe.screen_x;
  ngr->mouse_y = gpe.screen_y;

  PP_InputEvent_MouseButton ppbtn =
    ppb_mouseinputevent->GetButton(mouse_event);

  if(gconf.enable_input_event_debug)
    TRACE(TRACE_DEBUG, "Input", "Mouse %f %f type %d",
          gpe.screen_x, gpe.screen_y, type);

  switch(type) {
  case PP_INPUTEVENT_TYPE_MOUSEDOWN:

    switch(ppbtn) {
    default:
      return PP_FALSE;
    case PP_INPUTEVENT_MOUSEBUTTON_LEFT:
      gpe.type = GLW_POINTER_LEFT_PRESS;
      break;
    case PP_INPUTEVENT_MOUSEBUTTON_RIGHT:
      gpe.type = GLW_POINTER_RIGHT_PRESS;
      break;
    }
    break;

  case PP_INPUTEVENT_TYPE_MOUSEUP:
    switch(ppbtn) {
    default:
      return PP_FALSE;
    case PP_INPUTEVENT_MOUSEBUTTON_LEFT:
      gpe.type = GLW_POINTER_LEFT_RELEASE;
      break;
    case PP_INPUTEVENT_MOUSEBUTTON_RIGHT:
      gpe.type = GLW_POINTER_RIGHT_RELEASE;
      break;
    }
    break;
  case PP_INPUTEVENT_TYPE_MOUSEMOVE:
    show_cursor(ngr);
  case PP_INPUTEVENT_TYPE_MOUSEENTER:
    gpe.type = GLW_POINTER_MOTION_UPDATE;
    break;

  case PP_INPUTEVENT_TYPE_MOUSELEAVE:
    gpe.type = GLW_POINTER_GONE;
    break;
  default:
    return PP_FALSE;
  }

  glw_lock(&ngr->gr);
  glw_pointer_event(&ngr->gr, &gpe);
  glw_unlock(&ngr->gr);
  return PP_TRUE;
}


/**
 *
 */
static PP_Bool
handle_wheel_event(nacl_glw_root_t *ngr, PP_Resource wheel_event)
{
  glw_pointer_event_t gpe = {0};

  struct PP_FloatPoint pos = ppb_wheelinputevent->GetDelta(wheel_event);
  //  int pagemode = ppb_wheelinputevent->GetScrollByPage(wheel_event);

  gpe.screen_x = ngr->mouse_x;
  gpe.screen_y = ngr->mouse_y;
  gpe.delta_x = pos.x;
  gpe.delta_y = -pos.y;

  if(gconf.enable_input_event_debug)
    TRACE(TRACE_DEBUG, "Input", "Wheel %f %f delta: %f %f",
          gpe.screen_x, gpe.screen_y, gpe.delta_x, gpe.delta_y);

  gpe.type = GLW_POINTER_FINE_SCROLL;
  glw_lock(&ngr->gr);
  glw_pointer_event(&ngr->gr, &gpe);
  glw_unlock(&ngr->gr);
  return PP_TRUE;
}


/**
 *
 */
static PP_Bool
Input_HandleInputEvent(PP_Instance instance, PP_Resource input_event)
{
  PP_InputEvent_Type type = ppb_inputevent->GetType(input_event);
  nacl_glw_root_t *ngr = uiroot;

  switch(type) {
  case PP_INPUTEVENT_TYPE_MOUSEDOWN:
  case PP_INPUTEVENT_TYPE_MOUSEUP:
  case PP_INPUTEVENT_TYPE_MOUSEMOVE:
  case PP_INPUTEVENT_TYPE_MOUSELEAVE:
  case PP_INPUTEVENT_TYPE_MOUSEENTER:
    return handle_mouse_event(ngr, input_event, type);

  case PP_INPUTEVENT_TYPE_KEYDOWN:
    return handle_keydown(ngr, input_event);
  case PP_INPUTEVENT_TYPE_CHAR:
    return handle_char(ngr, input_event);

  case PP_INPUTEVENT_TYPE_WHEEL:
    return handle_wheel_event(ngr, input_event);

  default:
    break;
  }
  return PP_FALSE;
}

/**
 *
 */
static struct PP_Var
nacl_jsrpc(struct PP_Var req)
{
  hts_mutex_lock(&nacl_jsrpc_mutex);
  int id = ++nacl_jsrpc_counter;

  nacl_dict_set_int(req, "reqid", id);

  nacl_jsrpc_t *nj = calloc(1, sizeof(nacl_jsrpc_t));
  nj->nj_reqid = id;
  LIST_INSERT_HEAD(&nacl_jsrpcs, nj, nj_link);

  ppb_messaging->PostMessage(g_Instance, req);
  ppb_var->Release(req);

  while(nj->nj_reqid != 0)
    hts_cond_wait(&nacl_jsrpc_cond, &nacl_jsrpc_mutex);

  LIST_REMOVE(nj, nj_link);

  hts_mutex_unlock(&nacl_jsrpc_mutex);

  struct PP_Var result = nj->nj_result;
  free(nj);

  return result;
}


/**
 *
 */
static void
jsrpc_handle_reply(struct PP_Var reply)
{
