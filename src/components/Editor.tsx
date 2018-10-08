import * as React from 'react';
import * as monaco from 'monaco-editor';
import {reaction} from 'mobx';
import {inject, observer} from 'mobx-react';

import {IEditorProps} from '../types';

@inject('ProjectStore', 'EditorStore')
@observer
export default class Editor extends React.Component<IEditorProps, {}> {

    _node: HTMLElement;
    _editor: monaco.editor.IStandaloneCodeEditor;
    
    componentDidMount() {
        const {options} = this.props;
        this._editor = monaco.editor.create(this._node, options);

        this._editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
            this.props.ProjectStore.saveFile(this.props.EditorStore.selectedFile, () => {
                this.props.ProjectStore.saveProject();
            });
        }, '');

        reaction(
            () => this.props.EditorStore.selectedFile,
            (file) => {
                this._editor.setModel(file.model);
            }
        );
    }

    componentWillUnmount() {
        this._editor && this._editor.dispose();
    }

    render() {
        return (
            <div 
                id="editor"
                ref={c => this._node = c} 
            />
        );
    }
}