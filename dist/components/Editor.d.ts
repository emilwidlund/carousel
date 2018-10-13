import * as React from 'react';
import * as monaco from 'monaco-editor';
import { IEditorProps } from '../types';
export default class Editor extends React.Component<IEditorProps, {}> {
    _node: HTMLElement;
    _editor: monaco.editor.IStandaloneCodeEditor;
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderMeta(): JSX.Element;
    render(): JSX.Element;
}
