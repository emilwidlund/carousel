import * as React from 'react';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';

import {remote, ipcRenderer} from 'electron';
const shell = remote.shell;

import Tabs from './Tabs';
import Icon from './Icon';
import Button from './Button';
import snippets from '../snippets';

import {
    ISidebarProps, 
    IProjectFileCategoryHeaderProps,
    IProjectFileItemProps, 
    IProjectFile, 
    ProjectFileType
} from '../types';

@inject('ProjectStore', 'PopupStore')
class CreateFilePopup extends React.Component<any> {

    state = {
        filename: ''
    }

    render() {

        let title;

        switch(this.props.type) {
            case ProjectFileType.View:
                title = 'Create New View';
                break;
            case ProjectFileType.Component:
                title = 'Create New Component';
                break;
            case ProjectFileType.Generic:
                title = 'Create New Generic File';
                break;
            default:
                title = 'Create New Generic File';
        }

        return (
            <div className="create-new-file-popup">
                <h3>{title}</h3>
                <input
                    placeholder="Name"
                    type="url" 
                    value={this.state.filename} 
                    onChange={(e) => {
                        this.setState({
                            filename: e.target.value.trim()
                        });
                    }}
                />
                <div className="new-file-actions">
                    <Button 
                        text="Create"
                        onClick={() => {
                            if (this.state.filename) {
                                this.props.ProjectStore.createNewFile(this.props.type, this.state.filename, () => {
                                    this.props.PopupStore.disposePopup();
                                });
                            }
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

@inject('PopupStore')
class ProjectFileCategoryHeader extends React.Component<IProjectFileCategoryHeaderProps> {
    render() {
        return (
            <div
                className="file-category-header"
            >
                <h4>{this.props.title}</h4>
                <Icon 
                    name="add"
                    onClick={() => {
                        this.props.PopupStore.displayPopup(<CreateFilePopup type={this.props.type} />);
                    }}
                />
            </div>
        );
    }
}


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
                    'sidebar-interactive-item', 
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
class ProjectPanelHeader extends React.Component<any> {
    render() {
        return (
            <div className="project-panel-header">
                <h2>{this.props.ProjectStore.projectName}</h2>
                <div className="project-actions">
                    <Icon
                        name="folder"
                        size={20}
                        onClick={() => {
                            shell.openItem(this.props.ProjectStore.projectTempPath);
                        }}
                    />
                    <Icon
                        name="tab"
                        size={20}
                        onClick={() => {
                            ipcRenderer.send('start-preview', this.props.ProjectStore.projectTempPath);
                        }}
                    />
                    <Icon
                        name="chrome_reader_mode"
                        size={20}
                        onClick={() => {
                            shell.openExternal('https://classic.framer.com/docs');
                        }}
                    />
                </div>
            </div>
        );
    }
}



@inject('ProjectStore', 'EditorStore')
@observer
class ProjectPanelNavigator extends React.Component<any> {
    render() {
        return (
            <div className="project-panel-navigator">
                <div className="main">
                    <ProjectFileItem 
                        file={this.props.ProjectStore.mainFile} 
                        selected={this.props.ProjectStore.mainFile === this.props.EditorStore.selectedFile}
                    />
                </div>
                <div className="views">
                    <ProjectFileCategoryHeader 
                        title="Views"
                        type={ProjectFileType.View}
                    />
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
                    <ProjectFileCategoryHeader 
                        title="Components"
                        type={ProjectFileType.Component}
                    />
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
                    <ProjectFileCategoryHeader 
                        title="Generic"
                        type={ProjectFileType.Generic}
                    />
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
        );
    }
}


class ProjectPanel extends React.Component<any> {
    render() {
        return (
            <div className="project-panel">
                <ProjectPanelHeader />
                <ProjectPanelNavigator />
            </div>
        );
    }
}



@inject('ProjectStore', 'EditorStore')
@observer
class SnippetItem extends React.Component<any> {
    handleClick() {
        if (this.props.ProjectStore.fileFormat == 'js') {
            this.props.EditorStore.pasteSnippet(this.props.snippet.jsSnippet());
        } else if (this.props.ProjectStore.fileFormat == 'coffee') {
            this.props.EditorStore.pasteSnippet(this.props.snippet.csSnippet());
        }
    }

    render() {
        return (
            <div 
                className="sidebar-interactive-item"
                onClick={this.handleClick.bind(this)}
            >
                <Icon name={this.props.snippet.icon} size={24} />
                <span>{this.props.snippet.name}</span>
            </div>
        );
    }
}



class SnippetPanel extends React.Component<any> {
    render() {
        return (
            <div className="snippet-panel">
                <h3>Snippets</h3>
                <div className="snippet-items">
                    {snippets.map((s, i) => {
                        return <SnippetItem key={i} snippet={s} />;
                    })}
                </div>
            </div>
        );
    }
}


@inject('ProjectStore')
@observer
export default class Sidebar extends React.Component<ISidebarProps> {
    componentDidMount() {
        ipcRenderer.on('save-project', () => {
            this.props.ProjectStore.saveProject(() => {
                remote.getCurrentWindow().destroy();
            });
        });
    }

    render() {
        return (
            <div id="sidebar">
                <Tabs 
                    tabs={[
                        {
                            title: 'Project',
                            iconName: 'style',
                            content: <ProjectPanel />
                        },
                        {
                            title: 'Snippets',
                            iconName: 'short_text',
                            content: <SnippetPanel />
                        }
                    ]}
                />
            </div>
        );
    }
}