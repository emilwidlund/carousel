import * as monaco from 'monaco-editor';



// ----- PROJECT

export interface IRecentProject {
    path: string;
    name: string;
    lastOpen: number;
}

export interface IRecentProjectsProps {
    ProjectStore?: any;
}

export enum ProjectFileType {
    Main,
    View,
    Component,
    Image,
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
    ProjectStore?: any;
    value?: string;
    language?: string;
    uri?: monaco.Uri;
    options?: monaco.editor.IEditorConstructionOptions;
    onValueChange?(value: string): void; 
}


// ----- SIDEBAR

export interface IProjectFileCategoryHeaderProps {
    title: string;
    type: ProjectFileType;
    PopupStore?: any;
}

export interface IProjectFileItemProps {
    file: IProjectFile;
    selected: boolean;
    EditorStore?: any;
}

export interface ISidebarProps {
    ProjectStore?: any;
    EditorStore?: any;
}


// ----- BUTTON

export interface IButtonProps {
    text: string;
    secondary?: boolean;
    onClick?(): void;
}


// ----- ICON

export interface IIconProps {
    name: string;
    size?: number;
    color?: string;
    onClick?(): void;
}