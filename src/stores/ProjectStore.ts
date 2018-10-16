import {observable} from 'mobx';
import * as monaco from 'monaco-editor';

import {remote, ipcRenderer} from 'electron';
const fs = remote.require('fs');
const walk = remote.require('walk');
const path = remote.require('path');
const archiver = remote.require('archiver');
const unzip = remote.require('unzip-stream');
const temp = remote.require('temp').track();
const Store = remote.require('electron-store');

import EditorStore from './EditorStore';

import {IRecentProject, IProjectFile, ProjectFileType} from '../types';

const store = new Store();

export class ProjectStore {

    recentProjects: IRecentProject[] = [];

    @observable projectInitialized = false;
    @observable projectPath: string = null;
    @observable projectTempPath: string = null;
    @observable projectName: string = null;
    @observable projectFiles: IProjectFile[] = [];

    constructor() {
        const projects = store.get('recent-projects') || [];
    
        // Make sure that recentProjects exists on disc
        this.recentProjects = projects.filter((p: IRecentProject) => {
            return fs.existsSync(p.path);
        });
    }

    createProject(projectType: string, projectPath: string, cb?: Function) {
        const projectTemplate: string = projectType === 'coffee' ? 
            path.join(remote.app.getAppPath(), './dist/templates/project-coffeescript') : 
            path.join(remote.app.getAppPath(), './dist/templates/project-javascript');

        const modulesTemplate: string = path.join(remote.app.getAppPath(), './dist/templates/modules');

        const output = fs.createWriteStream(projectPath);
        const archive = archiver('zip');

        output.on('close', () => {
            console.log('Project Created!');
            if (cb) cb();
            this.initializeProject(projectPath);
        });

        archive.pipe(output);
        archive.directory(projectTemplate, false);
        archive.directory(modulesTemplate, 'modules');
        archive.finalize();
    }

    initializeProject(projectPath: string) {
        projectPath = path.resolve(projectPath);

        if (!projectPath.endsWith('.crsl')) return;

        this.projectPath = projectPath;
        this.projectName = path.parse(projectPath).name;

        temp.mkdir(`carousel-${this.projectName}`, (err: Error, dirPath: string) => {
            fs.createReadStream(projectPath)
                .pipe(unzip.Extract({path: dirPath}))
                .on('close', () => {

                    this.traverseFiles(dirPath, (files: IProjectFile[]) => {
                        files.map((file: any, index: number) => {

                            if (file.name.includes('Main.js') || file.name.includes('Main.coffee')) {
                                file.type = ProjectFileType.Main;
                            } else if (file.name.includes('.view.js') || file.name.includes('.view.coffee')) {
                                file.type = ProjectFileType.View;
                            } else if (file.name.includes('.component.js') || file.name.includes('.component.coffee')) {
                                file.type = ProjectFileType.Component;
                            }

                        });


                        this.buildModels(files);

                        this.projectFiles = files;
                        this.projectTempPath = dirPath;

                        ipcRenderer.send('start-preview', this.projectTempPath);

                        this.projectInitialized = true;

                        this.addToRecentProjects({
                            path: this.projectPath,
                            name: this.projectName,
                            lastOpen: Date.now()
                        });

                        EditorStore.selectFile(this.mainFile);
                    });
                });
        });
    }

    traverseFiles(p: string, cb?: Function) {
        const walker = walk.walk(p);

        const files: IProjectFile[] = [];

        walker.on('file', (root: string, fileStats: any, next: Function) => {

            const projectFile: IProjectFile = {
                name: fileStats.name,
                shortName: fileStats.name.substring(0, fileStats.name.indexOf('.')),
                path: path.resolve(root, fileStats.name),
                model: null,
                selected: false,
                type: ProjectFileType.Generic
            }

            files.push(projectFile);

            next();
        });

        walker.on('end', () => {
            cb(files);
        });
    }

    buildModels(files: IProjectFile[]) {
        files.map((f, i) => {
            if (f.name.endsWith('.js')) {
                f.model = monaco.editor.createModel(fs.readFileSync(f.path, 'utf8'), 'javascript');
            } else if (f.name.endsWith('.coffee')) {
                f.model = monaco.editor.createModel(fs.readFileSync(f.path, 'utf8'), 'coffeescript');
            }
        });
    }

    saveFile(file: IProjectFile, cb?: Function) {
        fs.writeFile(file.path, file.model.getValue(), (err: Error) => {
            if (err) return console.error(err);

            console.log('File Saved!');

            if (cb) cb();
        });
    }

    saveProject(cb?: Function) {
        this.saveFile(EditorStore.selectedFile, () => {
            const output = fs.createWriteStream(this.projectPath);
            const archive = archiver('zip');

            output.on('close', () => {
                console.log('Project Saved!');
                if (cb) cb();
            });

            archive.pipe(output);
            archive.directory(this.projectTempPath, false);
            archive.finalize();
        });
    }

    createNewFile(fileType: ProjectFileType, fileName: string, cb?: Function) {
        let filePath: string;

        switch(fileType) {
            case ProjectFileType.View:
                filePath = `views/${fileName}.view.`;
                break;
            case ProjectFileType.Component:
                filePath = `components/${fileName}.component.`;
                break;
            case ProjectFileType.Generic:
                filePath = `generic/${fileName}.generic.`;
                break;
        }

        filePath += this.fileFormat;

        fs.writeFile(path.resolve(this.projectTempPath, filePath), '', (err: Error) => {
            if (err) return console.error(err);

            const file: IProjectFile = {
                name: fileName + '.' + this.fileFormat,
                shortName: fileName,
                path: path.resolve(this.projectTempPath, filePath),
                model: null,
                selected: false,
                type: fileType
            };

            if (this.fileFormat === 'js') {
                file.model = monaco.editor.createModel('', 'javascript');
            } else if (this.fileFormat === 'coffee') {
                file.model = monaco.editor.createModel('', 'coffeescript');
            }

            this.projectFiles.push(file);

            if (cb) cb(path.resolve(this.projectTempPath, filePath));
        });
    }

    addToRecentProjects(project: IRecentProject) {
        let existingProject = this.recentProjects.find(p => p.path === project.path);

        if (existingProject) {
            const existingIndex = this.recentProjects.indexOf(existingProject);
            this.recentProjects[existingIndex] = project;

            this.recentProjects.sort((a: IRecentProject, b: IRecentProject) => {
                return b.lastOpen - a.lastOpen;
            });
        } else {
            this.recentProjects.unshift(project);
        }

        store.set('recent-projects', this.recentProjects);
    }

    get fileFormat() {
        const mainFilePath = this.mainFile.path;
        return mainFilePath.slice(mainFilePath.lastIndexOf('.') + 1, mainFilePath.length);
    }

    get mainFile() {
        return this.projectFiles.filter(f => f.type === ProjectFileType.Main)[0];
    }

    get viewFiles() {
        return this.projectFiles.filter(f => f.type === ProjectFileType.View);
    }

    get componentFiles() {
        return this.projectFiles.filter(f => f.type === ProjectFileType.Component);
    }

    get genericFiles() {
        return this.projectFiles.filter(f => f.type === ProjectFileType.Generic);
    }
}

const projectStore = new ProjectStore();
export default projectStore;