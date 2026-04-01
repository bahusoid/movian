/*
 *  Copyright (C) 2006-2018 Lonelycoder AB
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
 */

#include "main.h"
#include "task.h"
#include "event.h"
#include "optionpicker.h"


/**
 *
 */
typedef struct optionpicker {
  rstr_t *op_result;
  int     op_run;
} optionpicker_t;


/**
 *
 */
static void
op_eventsink(void *opaque, prop_event_t event, ...)
{
  optionpicker_t *op = opaque;
  va_list ap;
  va_start(ap, event);

  switch(event) {
  case PROP_DESTROYED:
    op->op_run = 0;
    break;

  case PROP_EXT_EVENT: {
    event_t *e = va_arg(ap, event_t *);
    if(event_is_type(e, EVENT_OPENURL)) {
      const event_openurl_t *eo = (const event_openurl_t *)e;
      if(eo->url && *eo->url)
        op->op_result = rstr_alloc(eo->url);
      op->op_run = 0;
    } else if(event_is_action(e, ACTION_CANCEL) ||
              event_is_action(e, ACTION_NAV_BACK)) {
      op->op_run = 0;
    }
    break;
  }

  default:
    break;
  }
  va_end(ap);
}


/**
 *
 */
rstr_t *
optionpicker_pick(const char *title,
                  optionpicker_populate_t populate,
                  void *opaque)
{
  optionpicker_t op = {0};
  op.op_run = 1;

  prop_t *p = prop_create_root(NULL);
  prop_set(p, "type",  PROP_SET_STRING, "optionpicker");
  prop_set(p, "title", PROP_SET_STRING, title);

  prop_t *nodes = prop_create_r(p, "nodes");
  populate(nodes, opaque);
  prop_ref_dec(nodes);

  prop_courier_t *pc = prop_courier_create_waitable();

  prop_sub_t *s =
    prop_subscribe(PROP_SUB_TRACK_DESTROY,
                   PROP_TAG_CALLBACK, op_eventsink, &op,
                   PROP_TAG_NAMED_ROOT, p, "node",
                   PROP_TAG_COURIER, pc,
                   PROP_TAG_NAME("node", "eventSink"),
                   NULL);

  if(prop_set_parent(p, prop_create(prop_get_global(), "popups")))
    abort();

  while(op.op_run)
    prop_courier_wait_and_dispatch(pc);

  prop_unsubscribe(s);
  prop_courier_destroy(pc);
  prop_destroy(p);

  return op.op_result;
}


/**
 * Async wrapper state
 */
typedef struct op_async {
  char *title;
  optionpicker_populate_t populate;
  void *opaque;
  void (*cb)(rstr_t *value, void *cb_opaque);
  void *cb_opaque;
} op_async_t;


/**
 *
 */
static void
op_async_task(void *aux)
{
  op_async_t *a = aux;
  rstr_t *result = optionpicker_pick(a->title, a->populate, a->opaque);
  a->cb(result, a->cb_opaque);
  rstr_release(result);
  free(a->title);
  free(a);
}


/**
 *
 */
void
optionpicker_pick_async(const char *title,
                        optionpicker_populate_t populate,
                        void *opaque,
                        void (*cb)(rstr_t *value, void *cb_opaque),
                        void *cb_opaque)
{
  op_async_t *a = calloc(1, sizeof(op_async_t));
  a->title     = title ? strdup(title) : NULL;
  a->populate  = populate;
  a->opaque    = opaque;
  a->cb        = cb;
  a->cb_opaque = cb_opaque;
  task_run(op_async_task, a);
}

