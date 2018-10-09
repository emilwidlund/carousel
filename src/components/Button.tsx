import * as React from 'react';
import classnames from 'classnames';

import {IButtonProps} from '../types';

export default class Button extends React.Component<IButtonProps> {
    render() {
        return (
            <button 
                onClick={this.props.onClick}
                className={classnames(this.props.secondary ? 'secondary' : 'primary')}
            >
                {this.props.text}
            </button>
        );
    }
}