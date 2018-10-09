{focusStore} = require './FocusStore.coffee'
{Focusable} = require '../Focusable.coffee'
{Transitions} = require '../Transitions.coffee'

class ViewStore extends Framer.EventEmitter
    constructor: ->
        super()

        @currentView = null
        @previousView = null
        @historyStack = []
        @viewTransition = null

    transition: (view, transition) ->
        @previousView = @currentView
        @currentView = view
        @viewTransition = transition

        focusStore.clearFocusables()

        # Handle the new view

        viewObj =
            view: @currentView
            transition: @viewTransition
        
        @historyStack.push viewObj

        view.descendants.map (child, index) ->
            if child instanceof Focusable
                focusStore.addFocusable child
        
        if focusStore.focusableElements.length
            focusStore.focus focusStore.focusableElements[0]
        else
            focusStore.clearFocus()
        
        @emit 'transitionEvent',
            view: view
            previousView: @previousView
            viewTransition: transition
    
    goBack: ->
        @previousView = @currentView
        
        if @historyStack[@historyStack.length - 1].transition == Transitions.goIn
            @viewTransition = Transitions.goOut
        else if @historyStack[@historyStack.length - 1].transition == Transitions.goOut
            @viewTransition = Transitions.goIn
        else if @historyStack[@historyStack.length - 1].transition == Transitions.fade
            @viewTransition = Transitions.fade
        
        @historyStack.pop()
        @currentView = @historyStack[@historyStack.length - 1].view

        focusStore.clearFocusables()

        # Handle the new view

        @currentView.descendants.map (child, index) ->
            if child instanceof Focusable
                focusStore.addFocusable child
        
        if focusStore.focusableElements.length
            focusStore.focus focusStore.focusableElements[0]
        else
            focusStore.clearFocus()
        
        @emit 'transitionEvent', 
            view: if @historyStack.length then @historyStack[@historyStack.length - 1].view else undefined
            previousView: @previousView
            viewTransition: @viewTransition

exports.viewStore = new ViewStore