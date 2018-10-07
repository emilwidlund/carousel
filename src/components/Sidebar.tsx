import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import Icon from './Icon';

import {ISidebarProps, IProjectFileItemProps, IProjectFile, ProjectFileType} from '../types';

@inject('EditorStore')
@observer
class ProjectFileItem extends React.Component<IProjectFileItemProps> {
    handleClick() {
        this.props.EditorStore.selectedFile = this.props.file;
    }

    render() {

        let iconName;

        switch (this.props.file.type) {
            case ProjectFileType.Main:
                iconName = 'all_inclusive';
                break;
            case ProjectFileType.View:
                iconName = 'panorama_horizontal';
                break;
            case ProjectFileType.Generic:
                iconName = 'bookmark';
                break;
            default:
                iconName = "bookmark";
        }

        return (
            <div 
                className={classnames([
                    'project-file-item', 
                    this.props.selected ? 'active' : null
                ])}
                onClick={this.handleClick.bind(this)}
            >
                <Icon name={iconName} />
                <span>{this.props.file.shortName}</span>
            </div>
        );
    }
}

@inject('ProjectStore', 'EditorStore')
@observer
export default class Sidebar extends React.Component<ISidebarProps> {
    render() {
        return (
            <div id="sidebar">
                <div className="sidebar-header">
                    <h3>{this.props.ProjectStore.projectName}</h3>
                    <p>This is an example project</p>
                </div>
                <div className="sidebar-navigator">
                    <div className="main">
                        <ProjectFileItem 
                            file={this.props.ProjectStore.mainFile} 
                            selected={this.props.ProjectStore.mainFile === this.props.EditorStore.selectedFile}
                        />
                    </div>
                    <div className="view">
                        <h4>Views</h4>
                        {this.props.ProjectStore.viewFiles.map((file: IProjectFile, index: number) => {
                            return (
                                <ProjectFileItem 
                                    key={index} 
                                    file={file} 
                                    selected={file === this.props.EditorStore.selectedFile}
                                />
                            );
                        })}
                    </div>
                    <div className="generic">
                        <h4>Generic</h4>
                        {this.props.ProjectStore.genericFiles.map((file: IProjectFile, index: number) => {
                            return (
                                <ProjectFileItem
                                    key={index} 
                                    file={file}
                                    selected={file === this.props.EditorStore.selectedFile}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}