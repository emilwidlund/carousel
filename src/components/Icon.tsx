import * as React from 'react';
import classnames from 'classnames';

import {IIconProps} from '../types';

const Icon: React.SFC<IIconProps> = (props) => (
    <i 
        className={classnames([
            'icon',
            'material-icon',
            props.onClick ? 'action' : null
        ])}
        style={{fontSize: props.size, color: props.color}}
        onClick={props.onClick}
    >
        {props.name}
    </i>
);

export default Icon;