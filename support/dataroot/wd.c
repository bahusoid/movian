const char *app_dataroot(void)
{
#ifdef __EMSCRIPTEN__
  return "/";
#endif
  return "./";
}
