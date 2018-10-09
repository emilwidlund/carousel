{Grid} = require './Grid.coffee'
_ = Framer._

class exports.View extends Layer
	constructor: (properties={}) ->

		properties.backgroundColor = 'transparent'

		super _.defaults properties,
			width: Screen.width
			height: Screen.height

		@safezone = Grid.getSafezone(@)

		@actions = properties.actions || []
		@background = properties.background || {}
		@title = properties.title || ''