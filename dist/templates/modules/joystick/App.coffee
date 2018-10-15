{FocusSystem} = require './FocusSystem.coffee'
{Focusable} = require './Focusable.coffee'
{Background} = require './Background.coffee'
{viewStore} = require './stores/ViewStore.coffee'
{actionStore} = require './stores/ActionStore.coffee'
_ = Framer._

Utils.isFramerStudio = () -> true

Device = new DeviceComponent
    hideBezel: true

Device.setupContext()

Device.customize
    screenWidth: 1920
    screenHeight: 1080
    devicePixelRatio: 1
    deviceZoom: 1

Device.screenBackground.visible = false

# Disable Hints
Framer.Extras.Hints.disable()

class exports.App extends FlowComponent

    constructor: (properties={}) ->
        background = new Background

        super _.defaults properties,
            backgroundColor: 'transparent'
        
        @focusSystem = new FocusSystem()
        @background = background
        @setupTransitionListener()

        # Manipulate FlowComponent's ScrollComponent content insets
        @on 'transitionstart', (previousView, nextView, direction) =>
            if @_wrappedLayer
                sc = @_wrappedLayer nextView
            else
                sc = @_tempScroll
            sc.contentInset = 0
        
        @on 'transitionend', (previousView, nextView, direction) =>
            if @_wrappedLayer
                sc = @_wrappedLayer nextView
            else
                sc = @_tempScroll
            sc.draggable.enabled = false
        
        viewStore.transition properties.view
    
    setupTransitionListener: ->
        viewStore.on 'transitionEvent', (transitionEvent) =>
            if transitionEvent.viewTransition
                @transition transitionEvent.view, transitionEvent.viewTransition
            else
                @showNext transitionEvent.view