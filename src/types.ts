import * as monaco from 'monaco-editor';



// ----- PROJECT

export enum ProjectFileType {
    Main,
    View,
    Component,
    Generic
}

export interface IProjectFile {
    name: string;
    shortName: string;
    path: string;
    model: monaco.editor.IModel;
    selected: boolean;
    type: ProjectFileType;
}


// ----- EDITOR

export interface IEditorProps {
    EditorStore?: any;
    value?: string;
    language?: string;
    uri?: monaco.Uri;
    options?: monaco.editor.IEditorConstructionOptions;
    onValueChange?(value: string): void; 
}


// ----- SIDEBAR

export interface IProjectFileItemProps {
    file: IProjectFile;
    selected: boolean;
    EditorStore?: any;
}

export interface ISidebarProps {
    ProjectStore?: any;
    EditorStore?: any;
}


// ----- ICON

export interface IIconProps {
    name: string;
    size?: number;
    color?: string;
}