{Gamepad} = require '../Gamepad.coffee'

class FocusStore extends Framer.EventEmitter
    constructor: ->
        super()

        @focusableElements = []
        @focusedElement = null
        @previouslyFocusedElement = null

    focus: (focusable) ->

        # If an element is focused, set it as previouslyFocused and change state to default
        # Loop through descendant elements and update their states as well

        if @focusedElement
            @previouslyFocusedElement = @focusedElement
            @previouslyFocusedElement.animate 'default'

            @previouslyFocusedElement.descendants.map (desc, index) ->
                if desc.states.focused
                    desc.animate 'default'
        
        # Focus focusable and change state to focused
        # Loop through descendant elements and update their states as well

        @focusedElement = focusable
        @focusedElement.animate 'focused'

        for desc, index in @focusedElement.descendants
            if desc.states.focused
                desc.animate 'focused'
        
        @emit 'focusEvent', 
            previouslyFocusedElement: @previouslyFocusedElement
            focusedElement: @focusedElement
    
    addFocusable: (focusable) ->
        @focusableElements.push focusable

    clearFocusables: ->
        @focusableElements = []
        @emit 'focusableElementsCleared'
    
    clearFocus: ->
        if @focusedElement
            @previouslyFocusedElement = @focusedElement
            @previouslyFocusedElement.animate 'default'

            @previouslyFocusedElement.descendants.map (desc, index) ->
                if desc.states.focused
                    desc.animate 'default'
        
        @focusedElement = null
        @emit 'focusedElementCleared'

exports.focusStore = new FocusStore