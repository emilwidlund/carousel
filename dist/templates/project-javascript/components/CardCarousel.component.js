export default class CardCarousel extends ScrollComponent {
    constructor(props={}) {
        super(props);

        this.content.clip = props.clip;
        this.content.draggable.enabled = false;

        FocusStore.on('focusEvent', (focusEvent) => {
            if (focusEvent.focusedElement && focusEvent.focusedElement.parent == this.content) {
                this.scrollToCard(focusEvent.focusedElement);
            }
        });
    }

    scrollToCard(focusable) {
        if ((focusable.screenFrame.x + focusable.screenFrame.width) > (this.screenFrame.x + this.screenFrame.width)) {
            this.scrollToLayer(focusable, 1, 0, true);
        }
        else if (focusable.screenFrame.x < this.screenFrame.x) {
            this.scrollToLayer(focusable, 0, 0, true);
        }
    }
}