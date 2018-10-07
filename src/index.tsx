import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider, observer} from 'mobx-react';
import * as monaco from 'monaco-editor';

import * as stores from './stores';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Editor from './components/Editor';

import {remote} from 'electron';

import './scss/main.scss';


const framerTheme = require('./misc/framer-theme.json');
monaco.editor.defineTheme('syntax', framerTheme);

@observer
class App extends React.Component {

    componentDidMount() {
        if (remote.process.argv.length >= 2) {
            const filePath = remote.process.argv[1];
            if (filePath) {
                // stores.ProjectStore.initializeProject(filePath);
            }
        }
    }

    handleEditorValueChange(value: string) {
        console.log(value);
    }

    renderContent() {
        return (
            <div id="app">
                <Sidebar />
                <Editor 
                    onValueChange={this.handleEditorValueChange}
                    options={{
                        theme: 'syntax',
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

    render() {
        return (
            <Provider {...stores}>
                {
                    stores.ProjectStore.projectInitialized ? 
                    this.renderContent() : 
                    <Welcome />
                }
            </Provider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('carousel')
);