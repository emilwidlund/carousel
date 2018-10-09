import * as React from 'react';

export default class Popup extends React.Component {
    render() {
        return (
            <div className="popup-container">
                <div className="popup-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}