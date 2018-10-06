import * as monaco from 'monaco-editor';

// ----- EDITOR

export interface IEditorProps {
    value: string;
    language?: string;
    path?: monaco.Uri;
    options?: monaco.editor.IEditorConstructionOptions;
    onValueChange?(value: string): void; 
}