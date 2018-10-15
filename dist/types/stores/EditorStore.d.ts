import { IProjectFile } from '../types';
export declare class EditorStore {
    selectedFile: IProjectFile;
    selectFile(file: IProjectFile): void;
}
declare const editorStore: EditorStore;
export default editorStore;
