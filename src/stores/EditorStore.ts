import {observable} from 'mobx';
import * as monaco from 'monaco-editor';

import {IProjectFile} from '../types';

export class EditorStore {
    @observable selectedFile: IProjectFile = null;
}

const store = new EditorStore();
export default store;