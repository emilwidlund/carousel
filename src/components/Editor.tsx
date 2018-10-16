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
        this.props.EditorStore.editor = this._editor;

        this._editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
            this.props.ProjectStore.saveProject();
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

    renderMeta() {
        return (
            <div className="editor-meta">
                <h2>{this.props.EditorStore.selectedFile.shortName}</h2>
                <span>{this.props.EditorStore.selectedFile.name}</span>
            </div>
        );
    }

    render() {
        return (
            <div id="editor-wrapper">
                {this.props.EditorStore.selectedFile ? this.renderMeta() : null}
                <div 
                    className="editor"
                    ref={c => this._node = c} 
                />
            </div>
        );
    }
}