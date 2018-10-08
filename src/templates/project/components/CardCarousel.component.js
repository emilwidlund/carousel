export default class CardCarousel extends ScrollComponent {
    constructor(props={}) {
        super(props);

        this.content.clip = props.clip;


    }
}