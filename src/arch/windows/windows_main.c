#include <stdio.h>
#include <stdlib.h>
#include "main.h"
#include "navigator.h"

extern void *glw_glfw_start(void *nav);

int main(int argc, char **argv) {
    gconf.binary = argv[0];
    parse_opts(argc, argv);
    main_init();

    struct prop *nav = nav_spawn();

    glw_glfw_start(nav);

    main_fini();
    return 0;
}
