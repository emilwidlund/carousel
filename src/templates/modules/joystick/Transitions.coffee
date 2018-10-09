exports.Transitions =
    goIn: ->
        options =
            curve: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
            time: .4
        
        return (
            layerA:
                show:
                    opacity: 1
                    scale: 1
                    options: options
                hide:
                    opacity: 0
                    scale: 1.2
                    options: options
            layerB:
                show:
                    opacity: 1
                    scale: 1
                    options: options
                hide:
                    opacity: 0
                    scale: .8
                    options: options
            options: options
        )
    
    goOut: ->
        options =
            curve: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
            time: .4
        
        return (
            layerA:
                show:
                    opacity: 1
                    scale: 1
                    options: options
                hide:
                    opacity: 0
                    scale: .8
                    options: options
            layerB:
                show:
                    opacity: 1
                    scale: 1
                    options: options
                hide:
                    opacity: 0
                    scale: 1.2
                    options: options
            options: options
        )
    
    fade: ->
        options =
            curve: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
            time: .4
        
        return (
            layerA:
                show:
                    opacity: 1
                    options: options
                hide:
                    opacity: 0
                    options: options
            layerB:
                show:
                    opacity: 1
                    options: options
                hide:
                    opacity: 0
                    options: options
            options: options
        )