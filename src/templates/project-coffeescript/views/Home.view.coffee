{CardCarousel} = require '../components/CardCarousel.component.coffee'

view = new Layer
    size: Screen.size
    backgroundColor: '#000'

cc = new CardCarousel
    parent: view

exports.HomeView = view