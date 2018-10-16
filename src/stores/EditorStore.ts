import {observable} from 'mobx';
import * as monaco from 'monaco-editor';

import ProjectStore from './ProjectStore';
import {IProjectFile} from '../types';

export class EditorStore {
    @observable selectedFile: IProjectFile = null;
    @observable editor: monaco.editor.IStandaloneCodeEditor = null;

    selectFile(file: IProjectFile) {
        if (this.selectedFile && this.selectedFile.model) {
            ProjectStore.saveFile(this.selectedFile, () => {
                this.selectedFile = file;
            });
        } else {
            this.selectedFile = file;
        }
    }

    pasteSnippet(snippet: string) {
        const line = this.editor.getPosition();
        
        const range = new monaco.Range(line.lineNumber, line.column, line.lineNumber, line.column);
        const id = { major: 1, minor: 1 };             
        const text = snippet;
        const op = {identifier: id, range: range, text: text, forceMoveMarkers: true};
        this.editor.executeEdits('', [op]);
    }
}

const editorStore = new EditorStore();
export default editorStore;