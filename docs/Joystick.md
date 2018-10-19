# Joystick Documentation


## App
An app-instance is the brain of the prototype. It handles view-transitions, manages focusables and takes care of all views.
The App class extends the FlowComponent class, which means that all applicable properties & methods for FlowComponents are supported on App-instances.

### Properties
All regular FlowComponent-properties are applicable on an App.
- view: `View` - The initial view to show.


## View
A View is exactly what you think it is. It is a layer that covers the screen and holds content.
The View class extends the Layer class, which means that all applicable properties & methods for Layers are supported on View-instances.

### Properties
All regular Layer-properties are applicable on Views.
- safezone: `Layer` - Returns the safezone-layer that covers 90% of the screen. A safezone is widely used in TV-applications to prevent clipping of content. You should usually add children to this properties. For example: `parent: myView.safezone`.
- background?: `object` - An object containing some properties on what the background should be. Important to use this instead of setting the backgroundColor/image on the View-instance.
    - image?: `string` - Path to image to use as background.
    - backgroundColor?: `string` - Color to use as background.
    - blur?: `number` - Useful if you want to blur the specified image.
- actions?: `object[]` - An array of objects defining what should happen when a key-event occurs. Used to trigger functions when a pressing a button on a Gamepad or a keyboard.
    - keyCode: `number` - The key-code that should trigger the action. Can be a Keyboard-keycode or Gamepad-keycode.
    - function: `function` - The function to execute when desired keycode is pressed.



## Focusable
A Focusable is a navigatable entity. It has a default state and a focused state defined, which are cycled between depending on if it's focused or not.
Focusables are navigatable with keyboard-arrows and gamepads.
The Focusable class extends the Layer class, which means that all applicable properties & methods for Layers are supported on Focusable-instances.

### Properties
All regular Layer-properties are applicable on Focusables.
- focusProperties: `object` - An object containing properties to use when the Focusable is focused. This is pretty much just a state. This can hold animationOptions if you want to define the animation going from the default state to the focused state.
- animationOptions?: `object` - An object that defines the animation options when going from the focused state to the default state.
- actions?: `object[]` - An array of objects defining what should happen when a key-event occurs. Used to trigger functions when a pressing a button on a Gamepad or a keyboard.
    - keyCode: `number` - The key-code that should trigger the action. Can be a Keyboard-keycode or Gamepad-keycode.
    - function: `function` - The function to execute when desired keycode is pressed.

### Tips
- If a focusable has opacity set to 0 or has visible set to false, that Focusable won't be navigatable. This means that it is handy to set one of these properties if you need to temporarily disable the navigation to a Focusable.