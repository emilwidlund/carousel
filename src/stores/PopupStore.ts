import * as React from 'react';
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

const store = new PopupStore();
export default store;