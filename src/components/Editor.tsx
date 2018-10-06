import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';

export default class Editor extends React.Component {

    state = {
        code: ''
    }
    
    editorDidMount(editor: any, monaco: any) {
        editor.getModel().getOptions().insertSpaces = false;        

        editor.focus();

        // Set Save Binding
        const saveBinding = editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
            console.log('Save Macro!');
        });
    }

    onChange(code: string) {
        this.setState({
            code: code
        });
    }

    render() {
        return (
            <MonacoEditor
                language="coffeescript"
                theme="vs-dark"
                value={this.state.code}
                options={{
                    selectOnLineNumbers: true,
                    scrollBeyondLastLine: false,
                    minimap: {
                        enabled: false
                    },
                    automaticLayout: true,
                    fixedOverflowWidgets: true
                }}
                onChange={this.onChange.bind(this)}
                editorDidMount={this.editorDidMount.bind(this)}
            />
        );
    }
}