import * as React from 'react';
import * as monaco from 'monaco-editor';

import {IEditorProps} from '../types';

export default class Editor extends React.Component<IEditorProps, {}> {

    _node: HTMLElement;
    _editor: monaco.editor.IEditor;
    
    componentDidMount() {
        const {uri, value, language, options} = this.props;
        const model = monaco.editor.createModel(value, language, uri);

        this._editor = monaco.editor.create(this._node, options);
        this._editor.setModel(model);

        model.onDidChangeContent(() => {
            const value = model.getValue();
            this.props.onValueChange(value);
        });
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