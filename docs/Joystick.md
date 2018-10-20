# Joystick Documentation

#### Table of Contents
- [App](#app)
- [View](#view)
- [Focusable](#focusable)
- [Grid](#grid)

## App
An app-instance is the brain of the prototype. It handles view-transitions, manages focusables and takes care of all views.
The App class extends the FlowComponent class, which means that all applicable properties & methods for FlowComponents are supported on App-instances.

```
app = new App
    view: myView
```

### Properties
All regular FlowComponent-properties are applicable on an App.
- view: `View` - The initial view to show.


## View
A View is exactly what you think it is. It is a layer that covers the screen and holds content.
The View class extends the Layer class, which means that all applicable properties & methods for Layers are supported on View-instances.

```
myView = new View
    background:
        backgroundColor: '#f66'
    actions: [
        {
            keyCode: 41
            function: () ->
                print 'Something happens when moving the right stick up on my Gamepad, on this view'
        }
    ]

l = new Layer
    parent: myView.safezone
    backgroundColor: '#fff'
```

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

```
foc = new Focusable
    parent: myView.safezone
    width: Grid.getWidth(4)
    height: Grid.getHeight(45)
    backgroundColor: 'rgba(255, 255, 255, .5)'
    focusProperties:
        scale: 1.1
        backgroundColor: '#fff'
        animationOptions:
            time: .2
    animationOptions:
        time: .2
    actions: [
        {
            keyCode: 41
            function: () ->
                print 'Something happens when moving the right stick up on my Gamepad, while focusing this focusable'
        }
    ]
```

### Properties
All regular Layer-properties are applicable on Focusables.
- focusProperties: `object` - An object containing properties to use when the Focusable is focused. This is pretty much just a state. This can hold animationOptions if you want to define the animation going from the default state to the focused state.
- animationOptions?: `object` - An object that defines the animation options when going from the focused state to the default state.
- actions?: `object[]` - An array of objects defining what should happen when a key-event occurs. Used to trigger functions when a pressing a button on a Gamepad or a keyboard.
    - keyCode: `number` - The key-code that should trigger the action. Can be a Keyboard-keycode or Gamepad-keycode.
    - function: `function` - The function to execute when desired keycode is pressed.

### Tips
- If a focusable has opacity set to 0 or has visible set to false, that Focusable won't be navigatable. This means that it is handy to set one of these properties if you need to temporarily disable the navigation to a Focusable.


## Grid
The Grid is used to achieve coherent and perfectly aligned prototypes. It primarly utilizes two methods that should be used whenever you want to define sizes & margins.

The Grid contain 24 columns, 23 gutters and infinite vertical rows. Gutters & Rows are always 10px. Columns have a variable width, depending on how big the Screen is. When you want to define a size for an element, you can simply do like this:

```
new Layer
    width: Grid.getWidth(4) # Returns the width of 4 columns + 3 gutters
    height: Grid.getHeight(15) # Returns the height of 15 rows
```

### Properties
All these properties are readonly.
- safezoneBounds: `object` - Returns width & height of the Grid safezone
- dangerzoneBounds: `object` - Returns the width of the dangergap between the left screen edge and the horizontal safezone start point & height of the dangergap between the top screen edge and the vertical safezone start point.
- columnCount: `number` - Returns the amount of columns in the Grid
- columnGutterCount: `number` - Returns the amount of column gutters in the Grid
- columnGutter: `number` - Returns the column gutter width
- columnWidth: `number` - Returns the width of a single column
- rowHeight: `number` - Returns the height of a row

### Methods
- getWidth(columnCount: number) - Returns the pixels of the amount of columns + (amount of columns - 1) gutters
- getHeight(rowCount: number) - Returns the pixels of rowCount * 10px


## Gamepad
The Gamepad instance emits gamepadevents whenever you trigger a button on your gamepad.
The Gamepad is an EventEmitter under the hood. To handle gamepad events, simply do like this:

```
# If you want throttled events, uncomment the line below
# Gamepad.throttle = true

Gamepad.on 'gamepadevent', (e) ->
    # Gamepad Right Stick Going Up
    if e.keyCode == 41
        print 'Up'

    # Gamepad Right Stick Going Left
    if e.keyCode == 42
        print 'Left'

    # Gamepad Right Stick Going Down
    if e.keyCode == 43
        print 'Down'

    # Gamepad Right Stick Going Right
    if e.keyCode == 44
        print 'Right'
```

### Properties
- throttle: `boolean` - By default, all gamepad events are emitted multiple times a second. Setting this value to true will limit the events to be emitted less frequently.
