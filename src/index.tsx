import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider, observer} from 'mobx-react';
import * as monaco from 'monaco-editor';

import * as stores from './stores';
import Popup from './components/Popup';
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
        if (remote.app.isPackaged) {
            if (remote.process.argv.length >= 2) {
                const filePath = remote.process.argv[1];
                if (filePath) {
                    stores.ProjectStore.initializeProject(filePath);
                }
            }
        }
    }

    renderContent() {
        return (
            <div id="app">
                <Sidebar />
                <Editor 
                    options={{
                        theme: 'syntax',
                        selectOnLineNumbers: true,
                        scrollBeyondLastLine: false,
                        minimap: {
                            enabled: false
                        },
                        overviewRulerBorder: false,
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
                <div id="carousel-content">
                    {
                        stores.PopupStore.popupContent ? 
                        <Popup>{stores.PopupStore.popupContent}</Popup> : 
                        null
                    }
                    {
                        stores.ProjectStore.projectInitialized ? 
                        this.renderContent() : 
                        <Welcome />
                    }
                </div>
            </Provider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('carousel')
);