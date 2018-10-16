import {observable} from 'mobx';

export class PopupStore {
    @observable popupContent: JSX.Element = null;

    displayPopup(content: JSX.Element) {
        this.popupContent = content;
    }

    disposePopup() {
        this.popupContent = null;
    }
}

const popupStore = new PopupStore();
export default popupStore;