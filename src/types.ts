import * as monaco from 'monaco-editor';

// ----- EDITOR

export interface IEditorProps {
    value: string;
    language?: string;
    path?: monaco.Uri;
    options?: monaco.editor.IEditorConstructionOptions;
    onValueChange?(value: string): void; 
}


// ----- SIDEBAR

export enum ProjectFileItemType {
    Main,
    View,
    Generic
}

export interface IProjectFileItemProps {
    fileName: string;
    type: ProjectFileItemType;
}


// ----- ICON

export interface IIconProps {
    name: string;
    size?: number;
    color?: string;
}