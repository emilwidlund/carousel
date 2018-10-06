import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Editor from './components/Editor';

class App extends React.Component {
    render() {
        return (
            <div>
                <Editor />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('carousel')
);