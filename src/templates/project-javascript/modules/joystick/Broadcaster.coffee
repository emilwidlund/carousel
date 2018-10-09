_ = Framer._

class BroadcasterSystem extends Framer.EventEmitter
    viewTransitionEvent: (view) ->
        @emit 'viewTransitionEvent', view
    
    focusEvent: (focusable) ->
        @emit 'focusEvent', focusable

exports.Broadcaster = new BroadcasterSystem()