import * as React from 'react';

import {IIconProps} from '../types';

const Icon: React.SFC<IIconProps> = (props) => (
    <i 
        className="icon material-icon" 
        style={{fontSize: props.size, color: props.color}}
        onClick={props.onClick}
    >
        {props.name}
    </i>
);

export default Icon;