{View, Focusable, Grid} = require '../modules/joystick'
{CardCarousel} = require '../components/CardCarousel.component'

view = new View
    size: Screen.size
    title: 'Home'
    background:
        backgroundColor: '#000'

cc = new CardCarousel
    parent: view
    width: Grid.getWidth(23)
    height: Grid.getHeight(60)
    y: Align.center()
    x: Align.center()
    clip: false

for i in [0..10]
    l = new Focusable
        parent: cc.content
        width: 400
        height: 600
        x: (400 + 20) * i
        backgroundColor: 'rgba(255, 255, 255, .1)'
        focusProperties:
            backgroundColor: '#fff'
            scale: 1.1
            options:
                time: .2
        animationOptions:
            time: .2



exports.HomeView = view