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
#pragma once

#include "prop/prop.h"
#include "misc/rstr.h"

/**
 * Callback invoked to populate the picker's nodes prop.
 * Add child props to `nodes`, each with "title" (string) and "value" (string).
 */
typedef void (*optionpicker_populate_t)(prop_t *nodes, void *opaque);

/**
 * Show an option picker popup (blocking).
 * Returns the selected item's "value" as an rstr_t, or NULL if cancelled.
 * Caller must rstr_release() the result.
 */
rstr_t *optionpicker_pick(const char *title,
                          optionpicker_populate_t populate,
                          void *opaque);

/**
 * Show an option picker popup asynchronously (spawns a task internally).
 * `cb` is called with the selected value (or NULL if cancelled) and cb_opaque.
 * The rstr_t passed to cb is owned by the callback; release it when done.
 */
void optionpicker_pick_async(const char *title,
                             optionpicker_populate_t populate,
                             void *opaque,
                             void (*cb)(rstr_t *value, void *cb_opaque),
                             void *cb_opaque);

