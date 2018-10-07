import {observable} from 'mobx';
import * as monaco from 'monaco-editor';

export class EditorStore {
    @observable selectedFile: any = null;
}

const store = new EditorStore();
export default store;