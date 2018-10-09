_ = Framer._

class GridSystem
    constructor: ->
        @safezoneBounds =
            width: Screen.width * .9
            height: Screen.height * .9
        
        @dangerzoneBounds =
            width: (Screen.width * .1) / 2
            height: (Screen.height * .1) / 2

        @columnCount = 24
        @columnGutterCount = @columnCount - 1
        @columnGutter = 10
        @columnWidth = (@safezoneBounds.width - (@columnGutterCount * @columnGutter)) / @columnCount

        @rowHeight = 10

    getWidth: (cells) ->
        return (@columnWidth * cells) + (@columnGutter * (cells - 1))

    getHeight: (rows) ->
        return @rowHeight * rows

    getSafezone: (parent) ->
        return new Layer
            parent: parent
            name: 'safezone'
            width: @safezoneBounds.width
            height: @safezoneBounds.height
            y: Align.center
            x: Align.center
            backgroundColor: 'transparent'

exports.Grid = new GridSystem()