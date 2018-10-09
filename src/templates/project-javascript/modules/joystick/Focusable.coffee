_ = Framer._

class exports.Focusable extends Layer
    constructor: (properties={}) ->
        super properties

        @meta = properties.meta
        @actions = properties.actions || []

        @states.default.animationOptions = properties.animationOptions
        @states.focused = properties.focusProperties