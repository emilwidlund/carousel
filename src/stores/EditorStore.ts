import {observable} from 'mobx';
import * as monaco from 'monaco-editor';

import ProjectStore from './ProjectStore';
import {IProjectFile} from '../types';

export class EditorStore {
    @observable selectedFile: IProjectFile = null;

    selectFile(file: IProjectFile) {
        if (this.selectedFile && this.selectedFile.model) {
            ProjectStore.saveFile(this.selectedFile, () => {
                this.selectedFile = file;
            });
        } else {
            this.selectedFile = file;
        }
    }
}

const editorStore = new EditorStore();
export default editorStore;