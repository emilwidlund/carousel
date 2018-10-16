export default [
    {
        name: 'Gamepad',
        icon: 'gamepad',
        jsSnippet: () => {
            return [
                `// If you want throttled events, uncomment the line below`,
                `// Gamepad.throttled = true;`,
                ``,
                `Gamepad.on('gamepadevent', (e) => {`,
                `\t// Gamepad Right Stick Going Up`,
                `\tif (e.keyCode == 41) {`,
                `\t\tprint('Up');`,
                `\t}`,
                `\t`,
                `\t// Gamepad Right Stick Going Left`,
                `\tif (e.keyCode == 42) {`,
                `\t\tprint('Left');`,
                `\t}`,
                `\t`,
                `\t// Gamepad Right Stick Going Down`,
                `\tif (e.keyCode == 43) {`,
                `\t\tprint('Down');`,
                `\t}`,
                `\t`,
                `\t// Gamepad Right Stick Going Right`,
                `\tif (e.keyCode == 44) {`,
                `\t\tprint('Right');`,
                `\t}`,
                `});`
            ].join('\n');
        },
        csSnippet: () => {
            return [
                `# If you want throttled events, uncomment the line below`,
                `# Gamepad.throttled = true`,
                ``,
                `Gamepad.on 'gamepadevent', (e) ->`,
                `\t# Gamepad Right Stick Going Up`,
                `\tif e.keyCode == 41`,
                `\t\tprint 'Up'`,
                ``,
                `\t# Gamepad Right Stick Going Left`,
                `\tif e.keyCode == 42`,
                `\t\tprint 'Left'`,
                ``,
                `\t# Gamepad Right Stick Going Down`,
                `\tif e.keyCode == 43`,
                `\t\tprint 'Down'`,
                ``,
                `\t# Gamepad Right Stick Going Right`,
                `\tif e.keyCode == 44`,
                `\t\tprint 'Right'`
            ].join('\n');
        }
    }
]


