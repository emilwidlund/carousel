import CardCarousel from '../components/CardCarousel.component';

const view = new Layer({
    size: Screen.size,
    backgroundColor: '#000'
});

const cc = new CardCarousel({
    parent: view
});

export default view;