{Gamepad} = require '../FocusSystem.coffee';
{viewStore} = require './ViewStore.coffee'
{focusStore} = require './FocusStore.coffee'
_ = Framer._

Function::define = (prop, desc) ->
    Object.defineProperty this.prototype, prop, desc

class ActionStore extends Framer.EventEmitter
    constructor: ->
        super()
        
        @focusableActions = []
        @viewActions = []

        window.addEventListener 'keydown', (event) =>
            if event.keyCode == 13
                action = _.find @actions, {keyCode: 0}
                if action
                    action.function()
            else if event.keyCode == 8
                action = _.find @actions, {keyCode: 1}
                if action
                    action.function()

        Gamepad.on 'gamepadevent', (event) =>
            action = _.find @actions, {keyCode: event.keyCode}
            if action
                action.function()

        viewStore.on 'transitionEvent', (transitionEvent) =>
            @populateViewActions(transitionEvent.view.actions)
        
        focusStore.on 'focusEvent', (focusEvent) =>
            if focusEvent.focusedElement
                @populateFocusableActions(focusEvent.focusedElement.actions)

        focusStore.on 'focusedElementCleared', =>
            @clearFocusableActions()

    @define 'actions',
        get: -> @focusableActions.concat @viewActions

    populateFocusableActions: (focusableActions) ->
        @focusableActions = focusableActions
        @emit 'focusableActionsPopulated', focusableActions

    clearFocusableActions: (viewActions) ->
        @focusableActions = []
        @emit 'focusableActionsCleared'

    populateViewActions: (viewActions) ->
        @viewActions = viewActions
        @emit 'viewActionsPopulated', viewActions

exports.actionStore = new ActionStore