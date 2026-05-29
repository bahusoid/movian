# Agent Instructions

- **FORBIDDEN ACTIONS**: Do not run configure, clean, git reset, or any other destructive actions without explicit user permission.
- **PROCESS EXECUTION**: Always run build/configure processes synchronously. Wait until the process is fully complete before taking further action. **NEVER assume a build or configure process is stuck**.
- **BUILD COMMAND**: For Windows target always use `make BUILD=windows -j4` for building. In general `make BUILD=targetname -j4`  (and expect binaries in `build.targetname/`). IMPORTANT: MAKE SURE YOU DON"T ADD "build." to BUILD arg (BUILD=build.windows is incorrect)
- **NON-INTERACTIVE COMMANDS**: Ensure all terminal commands are non-interactive and do not require user interaction to finish (e.g., use `--no-pager`, etc.).
- **FILE MODIFICATIONS**: NEVER use terminal commands (like `sed`, `cat`, `patch`, `echo`) to create or modify files. ALWAYS use the provided Chat API tools (`create_file`, `replace_string_in_file`, `insert_edit_into_file`) so changes are tracked by the IDE.
- ALWAYS check this file before executing arbitrary tasks.
