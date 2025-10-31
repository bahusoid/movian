# Debugging Movian with Plugins in VS Code

This guide explains how to debug the Movian media player application and its plugins using Visual Studio Code.

## Prerequisites

- Movian built in `build.linux/movian`
- gdb installed (`which gdb` should return `/usr/bin/gdb`)
- Plugin installed in `~/.hts/showtime/installedplugins/`

## Setting Up the Debug Configuration

1. Open the `.vscode/launch.json` file in your Movian workspace.

2. The launch configuration should look like this:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Movian",
            "type": "cppdbg",
            "request": "launch",
            "program": "${workspaceFolder}/build.linux/movian",
            "args": ["-d", "-p", "/home/roman/.hts/showtime/installedplugins/HDRezka.TV.MOD"],
            "stopAtEntry": false,
            "cwd": "${workspaceFolder}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "miDebuggerPath": "/usr/bin/gdb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ]
        }
    ]
}
```

### Configuration Explanation

- `program`: Path to the Movian executable
- `args`:
  - `-d`: Enables general debug output
  - `-p <path>`: Loads the specified plugin directory with ECMAScript debugging enabled
- `MIMode` and `miDebuggerPath`: Use gdb for debugging
- `setupCommands`: Enable pretty-printing in gdb

## Debugging the Plugin

Since Movian uses Duktape for JavaScript execution and doesn't expose a full debugger interface, debugging plugins requires using `console.log` statements.

### Steps to Debug a Plugin

1. **Open the plugin file**: Use `File > Open File` in VS Code and navigate to the plugin's JavaScript file, e.g., `/home/roman/.hts/showtime/installedplugins/HDRezka.TV.MOD/HDRezka.TV.js`

2. **Add debug statements**: Insert `console.log()` calls in your JavaScript code:

```javascript
console.log("Plugin loaded");
console.log("Variable value:", someVariable);
console.log("Function called with args:", arguments);
```

3. **Save the file**

4. **Start debugging**: Press F5 or go to Run > Start Debugging

5. **View output**: Debug messages will appear in the VS Code Debug Console

## Debugging Native Code

For debugging the C/C++ parts of Movian:

1. Set breakpoints in the source files (e.g., `src/plugins.c`, `src/ecmascript/ecmascript.c`)

2. Press F5 to start debugging

3. The debugger will stop at breakpoints, allowing you to inspect variables and step through code

## Additional Debug Options

- `--ecmascript <file>`: Load a specific JavaScript file
- `--libav-log`: Enable libav logging
- `--debug-glw`: Enable GLW debugging

## Troubleshooting

- Ensure the plugin path in `-p` is correct and the directory exists
- Check that gdb is installed and accessible
- For plugin issues, verify the `plugin.json` is valid
- If debug output is too verbose, remove `-d` from args

## Notes

- Plugins loaded with `-p` are treated as development plugins with debug mode enabled
- Installed plugins are loaded automatically, but using `-p` ensures debug mode for the specific plugin
- JavaScript debugging is limited to console output; breakpoints in JS code are not supported</content>
<parameter name="filePath">/home/roman/Code/movian/DEBUGGING.md