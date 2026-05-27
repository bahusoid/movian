# Agent Instructions

- **FORBIDDEN ACTIONS**: Do not run configure, clean, git reset, or any other destructive actions without explicit user permission.
- **BUILD COMMAND**: Always use `make BUILD=windows -j4` for building.
- **NON-INTERACTIVE COMMANDS**: Ensure all terminal commands are non-interactive and do not require user interaction to finish (e.g., use `--no-pager`, etc.).
- ALWAYS check this file before executing arbitrary tasks.
