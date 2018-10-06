import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

import './scss/main.scss';

class App extends React.Component {

    handleEditorValueChange(value: string) {
        console.log(value);
    }

    render() {
        return (
            <div id="app">
                <Sidebar />
                <Editor 
                    value="Text"
                    onValueChange={this.handleEditorValueChange}
                    options={{
                        theme: 'vs-dark',
                        selectOnLineNumbers: true,
                        scrollBeyondLastLine: false,
                        minimap: {
                            enabled: false
                        },
                        automaticLayout: true,
                        fixedOverflowWidgets: true
                    }}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('carousel')
);