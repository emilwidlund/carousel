import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider, observer} from 'mobx-react';

import * as stores from './stores';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Editor from './components/Editor';

import './scss/main.scss';

@observer
class App extends React.Component {

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