# Movian Build Fixes for GCC 13.3.0

This document describes the compilation fixes applied to build Movian successfully with GCC 13.3.0 on Ubuntu 24.04.

## Context

Movian (formerly Showtime) is a media player application that hadn't been updated for modern GCC versions. When attempting to build with GCC 13.3.0, numerous compilation errors occurred due to:

- Stricter compiler warnings treated as errors (`-Werror`)
- Changes in GCC's handling of attributes and warnings
- Improved static analysis detecting potential issues
- Deprecation of older OpenSSL APIs

## Fixes Applied

### 1. libav Inline Assembly Compatibility

**File**: `configure.linux`
**Change**: Added `--disable-inline-asm` to `LIBAV_ARCH_FLAGS`

```bash
LIBAV_ARCH_FLAGS="--disable-shared --enable-static --disable-inline-asm"
```

**Reason**: GCC 13.3.0's assembler is stricter about operand types in inline assembly. The libav library (FFmpeg fork) contains x86-specific inline assembly that uses `shr` (shift right) operations with incompatible operand types. Disabling inline assembly forces libav to use C implementations instead.

### 2. VMIR Function Return Type

**File**: `ext/vmir/src/vmir.c`
**Change**: Changed `vmir_load` function signature

```c
vmir_errcode_t vmir_load(ir_unit_t *iu, const uint8_t *u8, int len)
```

**Reason**: The function was declared to return `vmir_errcode_t` (an enum) but implemented to return `int`. GCC 13.3.0 is stricter about type mismatches.

### 3. File Stream Management

**Files**: `src/arch/linux/linux_main.c`, `src/arch/posix/posix.c`
**Change**: Replaced `fclose()` with `pclose()` for `popen()` streams

```c
pclose(fp);  // instead of fclose(fp);
```

**Reason**: GCC 13.3.0 includes a new warning `-Wmismatched-dealloc` that detects when the wrong deallocation function is used. `popen()` streams must be closed with `pclose()`, not `fclose()`.

### 4. alloc_size Attribute Warning

**File**: `Makefile`
**Change**: Added specific CFLAGS rule for `linux_misc.o`

```makefile
${BUILDDIR}/src/arch/linux/linux_misc.o : CFLAGS = ${CFLAGS_std} ${OPTFLAGS} -Wno-error=attributes
```

**Reason**: The libav header `libavutil/mem.h` uses the `alloc_size` attribute on a function returning `int`, but this attribute is meant for functions returning pointers. GCC 13.3.0 treats this as an error with `-Werror=attributes`.

### 5. NULL Format String Arguments

**Files**: `src/backend/bittorrent/tracker_udp.c`, `src/backend/icecast/icecast.c`, `src/ui/glw/glw_texture_loader.c`
**Change**: Added null checks for `rstr_get()` calls

```c
TRACE(TRACE_DEBUG, "Tag", "Value: %s", rstr_get(str) ? rstr_get(str) : "(null)")
```

**Reason**: GCC 13.3.0's `-Wformat-overflow=` warning detects when NULL pointers might be passed to `%s` format specifiers. The `rstr_get()` function can return NULL.

### 6. Redundant NULL Check on Static Array

**File**: `src/i18n.c`
**Change**: Removed unnecessary NULL check

```c
// Before
if(vec[i] && !strcasecmp(vec[i], str))

// After
if(!strcasecmp(vec[i], str))
```

**Reason**: `vec` is a static 2D array parameter, so `vec[i]` can never be NULL. GCC 13.3.0's `-Waddress` warning detects this always-true comparison.

### 7. Use-After-Free in realloc

**File**: `src/ui/glw/glw_renderer.c`
**Change**: Restructured pointer adjustment logic

```c
// Save offsets before realloc
ptrdiff_t *offsets = malloc(old_capacity * sizeof(ptrdiff_t));
for(int i = 0; i < old_capacity; i++) {
  offsets[i] = gr->gr_render_order[i].job - gr->gr_render_jobs;
}

// After realloc
for(int i = 0; i < old_capacity; i++) {
  gr->gr_render_order[i].job = gr->gr_render_jobs + offsets[i];
}
```

**Reason**: GCC 13.3.0's `-Wuse-after-free` warning detects potential use of invalidated pointers after `realloc()`. The original code used the old pointer in arithmetic after `realloc` might have moved the memory.

## GCC 13.3.0 Impact

GCC 13.3.0 introduced several new warnings and stricter enforcement:

- **`-Wattributes`**: Now errors on incorrect attribute usage
- **`-Wmismatched-dealloc`**: Detects wrong deallocation functions
- **`-Wformat-overflow=`**: Stricter format string checking
- **`-Waddress`**: Detects always-true pointer comparisons
- **`-Wuse-after-free`**: Better detection of use-after-free patterns

Combined with Movian's use of `-Werror`, these became compilation failures.

## Build Instructions

After applying these fixes:

```bash
./configure.linux
make
```

The resulting binary will be at `build.linux/movian`.

## Notes

- These fixes maintain backward compatibility with older GCC versions
- No functional changes were made, only compilation warnings/errors were addressed
- The libav inline assembly disable may have minor performance impact but ensures compatibility
- All fixes follow the principle of minimal, targeted changes</content>
<parameter name="filePath">/home/roman/Code/movian/GCC13_BUILD_FIXES.md