import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import {remote} from 'electron';

import Icon from './Icon';

import {ISidebarProps, IProjectFileItemProps, IProjectFile, ProjectFileType} from '../types';

@inject('EditorStore')
@observer
class ProjectFileItem extends React.Component<IProjectFileItemProps> {
    handleClick() {
        this.props.EditorStore.selectFile(this.props.file);
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
            case ProjectFileType.Component:
                iconName = 'bubble_chart';
                break;
            default:
                iconName = 'description';
        }

        return (
            <div 
                className={classnames([
                    'project-file-item', 
                    this.props.selected ? 'active' : null
                ])}
                onClick={this.handleClick.bind(this)}
            >
                <Icon name={iconName} size={24} />
                <span>
                    {
                        this.props.file.type === ProjectFileType.Generic ? 
                        this.props.file.name : 
                        this.props.file.shortName
                    }
                </span>
            </div>
        );
    }
}

@inject('ProjectStore', 'EditorStore')
@observer
export default class Sidebar extends React.Component<ISidebarProps> {
    componentDidMount() {
        window.onbeforeunload = (e) => {
            e.returnValue = false;
            remote.dialog.showMessageBox({
                type: 'warning',
                buttons: ['Save', 'Don\'t Save', 'Cancel'],
                message: 'Your project has not been saved. How do you want to proceed?',
                noLink: true
            }, (response: number) => {
                if (response === 0) {
                    this.props.ProjectStore.saveProject(() => {
                        remote.getCurrentWindow().destroy();
                    });
                } else if (response === 1) {
                    remote.getCurrentWindow().destroy();
                }
            });
        }
    }

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
                    <div className="views">
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
                    <div className="components">
                        <h4>Components</h4>
                        {this.props.ProjectStore.componentFiles.map((file: IProjectFile, index: number) => {
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