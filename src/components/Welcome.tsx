import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {remote} from 'electron';
const dialog = remote.dialog;

import Icon from './Icon';

@inject('ProjectStore')
@observer
export default class Welcome extends React.Component<any> {
    handleNewProject() {
        dialog.showSaveDialog({defaultPath: 'project.zip'}, (filename: string) => {
            this.props.ProjectStore.createProject(filename);
        });
    }

    render() {
        console.log(remote);
        return (
            <div id="welcome">
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
                    <div className="action open-project">
                        <Icon 
                            name="folder" 
                            size={48}
                        />
                        <h3>Open Project</h3>
                    </div>
                </div>
            </div>
        );
    }
}