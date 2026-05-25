#include <unistd.h>
#ifdef _WIN32
#include <windows.h>
#endif
#include "arch/arch.h"
#include "glw.h"
#include <GLFW/glfw3.h>
#include "main.h"

void *glw_glfw_start(void *nav);

typedef struct glw_glfw {
    glw_root_t gr;
    GLFWwindow* window;
    int width;
    int height;
} glw_glfw_t;

static void error_callback(int error, const char* description) {
    fprintf(stderr, "GLFW Error: %s\n", description);
}

static void char_callback(GLFWwindow* window, unsigned int codepoint) {
    glw_glfw_t *g = glfwGetWindowUserPointer(window);
    if (!g) return;
    event_t *ev = event_create_int(EVENT_UNICODE, codepoint);
    ev->e_flags |= EVENT_KEYPRESS;
    glw_inject_event(&g->gr, ev);
}

static void mouse_button_callback(GLFWwindow* window, int button, int action, int mods) {
    glw_glfw_t *g = glfwGetWindowUserPointer(window);
    if (!g) return;
    double x, y;
    glfwGetCursorPos(window, &x, &y);
    glw_pointer_event_t gpe = {0};
    gpe.screen_x =  (2.0 * x / g->width) - 1;
    gpe.screen_y = -(2.0 * y / g->height) + 1;
    gpe.ts = arch_get_ts();
    if (action == GLFW_PRESS) {
        if (button == GLFW_MOUSE_BUTTON_LEFT) gpe.type = GLW_POINTER_LEFT_PRESS;
        else if (button == GLFW_MOUSE_BUTTON_RIGHT) gpe.type = GLW_POINTER_RIGHT_PRESS;
    } else if (action == GLFW_RELEASE) {
        if (button == GLFW_MOUSE_BUTTON_LEFT) gpe.type = GLW_POINTER_LEFT_RELEASE;
        else if (button == GLFW_MOUSE_BUTTON_RIGHT) gpe.type = GLW_POINTER_RIGHT_RELEASE;
    }
    if (gpe.type != 0) {
        glw_lock(&g->gr);
        glw_pointer_event(&g->gr, &gpe);
        glw_unlock(&g->gr);
    }
}

static void scroll_callback(GLFWwindow* window, double xoffset, double yoffset) {
    glw_glfw_t *g = glfwGetWindowUserPointer(window);
    if (!g) return;
    event_t *ev = event_create_int(EVENT_SCROLL, yoffset*120);
    if (yoffset < 0) ev->e_flags |= EVENT_MOUSE;
    glw_inject_event(&g->gr, ev);
}
static void cursor_position_callback(GLFWwindow* window, double xpos, double ypos) {
    glw_glfw_t *g = glfwGetWindowUserPointer(window);
    if (!g) return;
    glw_pointer_event_t gpe = {0};
    gpe.screen_x =  (2.0 * xpos / g->width) - 1;
    gpe.screen_y = -(2.0 * ypos / g->height) + 1;
    gpe.ts = arch_get_ts();
    gpe.type = GLW_POINTER_MOTION_UPDATE;
    glw_lock(&g->gr);
    glw_pointer_event(&g->gr, &gpe);
    glw_unlock(&g->gr);
}

static void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods) {
    glw_glfw_t *g = glfwGetWindowUserPointer(window);
    if (!g) return;

    if (action != GLFW_PRESS && action != GLFW_REPEAT)
        return;

    int movian_key = 0;
    switch(key) {
        case GLFW_KEY_RIGHT: movian_key = ACTION_RIGHT; break;
        case GLFW_KEY_LEFT:  movian_key = ACTION_LEFT; break;
        case GLFW_KEY_UP:    movian_key = ACTION_UP; break;
        case GLFW_KEY_DOWN:  movian_key = ACTION_DOWN; break;
        case GLFW_KEY_ENTER: movian_key = ACTION_ENTER; break;
        case GLFW_KEY_ESCAPE:
        case GLFW_KEY_BACKSPACE: movian_key = ACTION_NAV_BACK; break;
    }
    
    if (movian_key) {
        event_t *ev = event_create_action(movian_key);
        glw_inject_event(&g->gr, ev);
    }
}

static void resize_callback(GLFWwindow *window, int width, int height) {
    glw_glfw_t *g = glfwGetWindowUserPointer(window);
    if (!g) return;
    glViewport(0, 0, width, height);
    glw_lock(&g->gr);
    g->gr.gr_width = width;
    g->gr.gr_height = height;
    glw_unlock(&g->gr);
}

void *glw_glfw_start(void *nav) {
    glfwSetErrorCallback(error_callback);

    if (!glfwInit()) {
        fprintf(stderr, "glfwInit failed\n");
        fflush(stderr);
        exit(1);
    }

    fprintf(stderr, "glfwInit success\n");
    fflush(stderr);

    glfwWindowHint(GLFW_CLIENT_API, GLFW_OPENGL_ES_API);
#ifdef _WIN32
    glfwWindowHint(GLFW_CONTEXT_CREATION_API, GLFW_EGL_CONTEXT_API);
#endif
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 2);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);

    glw_glfw_t *g = calloc(1, sizeof(glw_glfw_t));
    g->window = glfwCreateWindow(1280, 720, "Movian", NULL, NULL);
    if (!g->window) {
        fprintf(stderr, "glfwCreateWindow failed\n");
        fflush(stderr);
        glfwTerminate();
        exit(1);
    }

    fprintf(stderr, "GLFW window created successfully!\n");
    fflush(stderr);

    glfwSetWindowUserPointer(g->window, g);
    glfwSetKeyCallback(g->window, key_callback);
    glfwSetMouseButtonCallback(g->window, mouse_button_callback);
    glfwSetCursorPosCallback(g->window, cursor_position_callback);
    glfwSetScrollCallback(g->window, scroll_callback);
    glfwSetCharCallback(g->window, char_callback);
    glfwSetFramebufferSizeCallback(g->window, resize_callback);

    glfwMakeContextCurrent(g->window);
    glfwSwapInterval(1);
    
    fprintf(stderr, "GLFW OpenGL context created and made current\n");
    fflush(stderr);

    fprintf(stderr, "Creating ui prop...\n"); fflush(stderr);
    g->gr.gr_prop_ui = prop_create_root("ui");
    g->gr.gr_prop_nav = nav;

    fprintf(stderr, "Calling glw_init...\n"); fflush(stderr);
    if (glw_init(&g->gr)) {
        fprintf(stderr, "glw_init failed\n");
        fflush(stderr);
        glfwTerminate();
        exit(1);
    }

    fprintf(stderr, "glw_init success\n");
    fflush(stderr);

    glfwGetFramebufferSize(g->window, &g->width, &g->height);
    resize_callback(g->window, g->width, g->height);

    fprintf(stderr, "[GLFW] Loading universe...\n");
    fflush(stderr);
    glw_lock(&g->gr);
    glw_load_universe(&g->gr);
    glw_unlock(&g->gr);
    fprintf(stderr, "[GLFW] Universe loaded. Entering loop.\n");
    fflush(stderr);

    int frames = 0;
    while (!glfwWindowShouldClose(g->window)) {
        if (frames < 10) { fprintf(stderr, "Frame %d: glfwPollEvents()\n", frames); fflush(stderr); }
        glfwPollEvents();

        glw_lock(&g->gr);
        glw_prepare_frame(&g->gr, 0);
        int refresh = g->gr.gr_need_refresh;
        g->gr.gr_need_refresh = 0;

        if (frames < 10) { fprintf(stderr, "Frame %d: refresh=%d\n", frames, refresh); fflush(stderr); }

        if (refresh) {
            glw_rctx_t rc;
            int zmax = 0;
            if (frames < 10) { fprintf(stderr, "Frame %d: glw_rctx_init layout...\n", frames); fflush(stderr); }
            glw_rctx_init(&rc, g->gr.gr_width, g->gr.gr_height, 1, &zmax);
            
            if (frames < 10) { fprintf(stderr, "Frame %d: glw_layout0...\n", frames); fflush(stderr); }
            glw_layout0(g->gr.gr_universe, &rc);
            
            if (refresh & GLW_REFRESH_FLAG_RENDER) {
                if (frames < 10) { fprintf(stderr, "Frame %d: glw_rctx_init render...\n", frames); fflush(stderr); }
                glw_rctx_init(&rc, g->gr.gr_width, g->gr.gr_height, 1, &zmax);
                
                glViewport(0, 0, g->gr.gr_width, g->gr.gr_height);
                glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);

                if (frames < 10) { fprintf(stderr, "Frame %d: glw_render0...\n", frames); fflush(stderr); }
                glw_render0(g->gr.gr_universe, &rc);
            }
        }
        glw_unlock(&g->gr);

        if (frames < 10) { fprintf(stderr, "Frame %d: after render. Swapping or sleeping...\n", frames); fflush(stderr); }

        if (refresh & GLW_REFRESH_FLAG_RENDER) {
            glfwSwapBuffers(g->window);
        } else {
            glfwWaitEventsTimeout(0.010);
        }
        if (frames < 10) { fprintf(stderr, "Frame %d: done.\n", frames); fflush(stderr); }
        frames++;
    }

    fprintf(stderr, "Exited loop. Terminating.\n");
    fflush(stderr);
    glfwDestroyWindow(g->window);
    glfwTerminate();
    exit(0);
    return NULL;
}
