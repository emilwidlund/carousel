import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider, observer} from 'mobx-react';
import * as monaco from 'monaco-editor';
import {ipcRenderer, shell} from 'electron';

import * as stores from './stores';
import Icon from './components/Icon';
import Popup from './components/Popup';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Editor from './components/Editor';

import {remote} from 'electron';

import './scss/main.scss';



const framerTheme = require('./misc/framer-theme.json');
monaco.editor.defineTheme('syntax', framerTheme);


const AppAction = (props: any) => {
    return (
        <div className="action" onClick={props.onClick}>
            <Icon name={props.icon} />
            <span className="label">{props.text}</span>
        </div>
    );
}


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
                <div className="app-header">
                    <div className="app-project">
                        <img src="img/logo_inv.svg" />
                        <h2 className="project-name">{stores.ProjectStore.projectName}</h2>
                    </div>
                    <div className="app-actions">
                        <AppAction 
                            icon="play_arrow"
                            text="Preview"
                            onClick={() => {
                                ipcRenderer.send('start-preview', stores.ProjectStore.projectTempPath);
                            }}
                        />
                        <AppAction 
                            icon="folder"
                            text="Explore Project"
                            onClick={() => {
                                shell.openItem(stores.ProjectStore.projectTempPath);
                            }}
                        />
                        <AppAction 
                            icon="import_contacts"
                            text="Framer Docs"
                            onClick={() => {
                                shell.openExternal('https://classic.framer.com/docs');
                            }}
                        />
                    </div>
                </div>
                <div className="app-content">
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