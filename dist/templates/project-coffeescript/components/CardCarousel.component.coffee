{FocusStore} = require '../modules/joystick'

class exports.CardCarousel extends ScrollComponent
    constructor: (props={}) ->
        super(props)

        @content.clip = props.clip
        @content.draggable.enabled = false

        FocusStore.on 'focusEvent', (focusEvent) => 
            if focusEvent.focusedElement && focusEvent.focusedElement.parent == @content
                @scrollToCard focusEvent.focusedElement

    scrollToCard: (focusable) ->
        if (focusable.screenFrame.x + focusable.screenFrame.width) > (@screenFrame.x + @screenFrame.width)
            @scrollToLayer(focusable, 1, 0, true)
        else if focusable.screenFrame.x < @screenFrame.x
            @scrollToLayer(focusable, 0, 0, true)