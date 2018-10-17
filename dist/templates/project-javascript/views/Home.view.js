import CardCarousel from '../components/CardCarousel.component';

const view = new View({
    size: Screen.size,
    title: 'Home',
    background: {
        backgroundColor: '#000'
    }
});

const cc = new CardCarousel({
    parent: view,
    width: Grid.getWidth(23),
    height: Grid.getHeight(60),
    y: Align.center(),
    x: Align.center(),
    clip: false
});

Array(10).fill(0).forEach((x, i) => {
    const l = new Focusable({
        parent: cc.content,
        width: 400,
        height: 600,
        x: (400 + 20) * i,
        backgroundColor: 'rgba(255, 255, 255, .1)',
        focusProperties: {
            backgroundColor: '#fff',
            scale: 1.1,
            options: {
                time: .2
            }
        },
        animationOptions: {
            time: .2
        }
    });
});    

export default view;

