import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import Icon from './Icon';

import {IProjectFileItemProps, ProjectFileItemType} from '../types';

class ProjectFileItem extends React.Component<IProjectFileItemProps> {
    render() {

        let iconName;

        switch (this.props.type) {
            case ProjectFileItemType.Main:
                iconName = 'all_inclusive';
                break;
            case ProjectFileItemType.View:
                iconName = 'panorama_horizontal';
                break;
            case ProjectFileItemType.Generic:
                iconName = 'bookmark';
                break;
            default:
                iconName = "bookmark";
        }

        return (
            <div className={classnames(['project-file-item'])}>
                <Icon name={iconName} />
                <span>{this.props.fileName}</span>
            </div>
        );
    }
}

@inject('ProjectStore')
@observer
export default class Sidebar extends React.Component<any> {

    render() {
        return (
            <div id="sidebar">
                <div className="sidebar-header">
                    <h3>Example Project</h3>
                    <p>This is an example project</p>
                </div>
                <div className="sidebar-navigator">
                    <div className="main">
                        <ProjectFileItem fileName="Main" type={ProjectFileItemType.Main} />
                    </div>
                    <div className="view">
                        <h4>Views</h4>
                        {this.props.ProjectStore.projectFiles.views.map((file: any, index: number) => {
                            const name = file.name.substring(0, file.name.indexOf('.'));
                            return <ProjectFileItem fileName={name} type={ProjectFileItemType.View} />;
                        })}
                    </div>
                    <div className="generic">
                        <h4>Generic</h4>
                        {this.props.ProjectStore.projectFiles.generic.map((file: any, index: number) => {
                            return <ProjectFileItem fileName={file.name} type={ProjectFileItemType.Generic} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}