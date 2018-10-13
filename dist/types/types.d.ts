import * as monaco from 'monaco-editor';
export interface IRecentProject {
    path: string;
    name: string;
    lastOpen: number;
}
export interface IRecentProjectsProps {
    ProjectStore?: any;
}
export declare enum ProjectFileType {
    Main = 0,
    View = 1,
    Component = 2,
    Generic = 3
}
export interface IProjectFile {
    name: string;
    shortName: string;
    path: string;
    model: monaco.editor.IModel;
    selected: boolean;
    type: ProjectFileType;
}
export interface IEditorProps {
    EditorStore?: any;
    ProjectStore?: any;
    value?: string;
    language?: string;
    uri?: monaco.Uri;
    options?: monaco.editor.IEditorConstructionOptions;
    onValueChange?(value: string): void;
}
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
export interface IButtonProps {
    text: string;
    secondary?: boolean;
    onClick?(): void;
}
export interface IIconProps {
    name: string;
    size?: number;
    color?: string;
    onClick?(): void;
}
