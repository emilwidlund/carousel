import * as React from 'react';
import { observable } from 'mobx';
import {inject, observer} from 'mobx-react';
import classnames from 'classnames';
import {remote} from 'electron';
const dialog = remote.dialog;
const os = remote.require('os');

import Button from './Button';
import Icon from './Icon';
import {IRecentProjectsProps, IRecentProject} from '../types';


@inject('ProjectStore', 'PopupStore')
@observer
class NewProjectPopup extends React.Component<any> {

    defaultFilename: string = 'Untitled.crsl';

    state = {
        filename: `${os.homedir()}\\${this.defaultFilename}`,
        projectType: 'js'
    }

    handleProjectTypeChange(e: any) {
        this.setState({
            projectType: e.target.value
        });
    }

    render() {
        return (
            <div className="new-project-popup">
                <h3>Create New Project</h3>
                <div className="new-project-path">
                    <input
                        type="url" 
                        value={this.state.filename} 
                        onChange={(e) => {
                            this.setState({
                                filename: e.target.value
                            });
                        }}
                    />
                    <Button 
                        secondary={true}
                        text="..."
                        onClick={() => {
                            dialog.showSaveDialog({defaultPath: this.defaultFilename}, (filename: string) => {
                                if (!filename) return;
                                this.setState({
                                    filename: filename
                                });
                            });
                        }}
                    />
                </div>
                <div className="new-project-type">
                    <div className={classnames(this.state.projectType === 'js' ? 'active' : null)}>
                        <input 
                            type="radio"
                            value="js"
                            onChange={this.handleProjectTypeChange.bind(this)}
                            checked={this.state.projectType === 'js'}
                        />
                        <span>JavaScript</span>
                    </div>
                    <div className={classnames(this.state.projectType === 'coffee' ? 'active' : null)}>
                        <input 
                            type="radio"
                            value="coffee"
                            onChange={this.handleProjectTypeChange.bind(this)}
                            checked={this.state.projectType === 'coffee'}
                        />
                        <span>CoffeeScript</span>
                    </div>
                </div>
                <div className="new-project-actions">
                    <Button
                        text="Create Project"
                        onClick={() => {
                            this.props.ProjectStore.createProject(this.state.projectType, this.state.filename, () => {
                                this.props.PopupStore.disposePopup();
                            });
                        }}
                    />
                    <Button
                        secondary={true}
                        text="Cancel"
                        onClick={() => this.props.PopupStore.disposePopup()}
                    />
                </div>
            </div>
        );
    }
}



@inject('ProjectStore')
@observer
class RecentProjects extends React.Component<IRecentProjectsProps> {
    render() {
        return (
            <div className="recent-projects">
                {this.props.ProjectStore.recentProjects.map((p: IRecentProject, i: number) => {
                    return (
                        <div 
                            key={i}
                            className="recent-project"
                            onClick={() => {
                                this.props.ProjectStore.initializeProject(p.path);
                            }}
                        >
                            <h4>{p.name}.crsl</h4>
                            <span>{p.path}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
}


@inject('ProjectStore', 'PopupStore')
@observer
export default class Welcome extends React.Component<any> {
    
    handleNewProject() {
        this.props.PopupStore.displayPopup(<NewProjectPopup />);
    }

    handleOpenProject() {
        dialog.showOpenDialog({
            filters: [
                {
                    name: 'Carousel', 
                    extensions: ['crsl']
                }
            ]
        }, (filepaths: string[]) => {
            if (!filepaths) return;
            this.props.ProjectStore.initializeProject(filepaths[0]);
        });
    }

    render() {
        return (
            <div id="welcome">
                <div className="welcome-info">
                    <h1>Welcome to Carousel</h1>
                    <p>Version 1.1.6.2</p>
                    <div className="welcome-actions">
                        <div 
                            className="action new-project"
                            onClick={this.handleNewProject.bind(this)}
                        >
                            <Icon 
                                name="add" 
                                size={48}
                            />
                            <h3>New Project</h3>
                        </div>
                        <div 
                            className="action open-project"
                            onClick={this.handleOpenProject.bind(this)}
                        >
                            <Icon 
                                name="folder" 
                                size={48}
                            />
                            <h3>Open Project</h3>
                        </div>
                    </div>
                </div>
                <RecentProjects />
            </div>
        );
    }
}