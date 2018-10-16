import * as monaco from 'monaco-editor';
import { IProjectFile } from '../types';
export declare class EditorStore {
    selectedFile: IProjectFile;
    editor: monaco.editor.IStandaloneCodeEditor;
    selectFile(file: IProjectFile): void;
    pasteSnippet(snippet: string): void;
}
declare const editorStore: EditorStore;
export default editorStore;
