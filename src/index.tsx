import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';

import * as stores from './stores';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

import './scss/main.scss';

class App extends React.Component {

    handleEditorValueChange(value: string) {
        console.log(value);
    }

    render() {
        return (
            <Provider {...stores}>
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
            </Provider>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('carousel')
);