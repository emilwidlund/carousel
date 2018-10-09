import {observable} from 'mobx';
import * as monaco from 'monaco-editor';

import {remote, ipcRenderer} from 'electron';
const fs = remote.require('fs');
const walk = remote.require('walk');
const path = remote.require('path');
const zip = remote.require('node-zip')();
const archiver = remote.require('archiver');
const unzip = remote.require('unzip-stream');
const temp = remote.require('temp');

import EditorStore from './EditorStore';

import {IProjectFile, ProjectFileType} from '../types';

export class ProjectStore {

    @observable projectInitialized = false;
    @observable projectPath: string = null;
    @observable projectTempPath: string = null;
    @observable projectName: string = null;
    @observable projectFiles: IProjectFile[] = [];

    createProject(projectType: string, projectPath: string, cb?: Function) {
        const projectTemplate: string = projectType === 'coffee' ? './src/templates/project-coffeescript' : './src/templates/project-javascript';
        const modulesTemplate: string = './src/templates/modules';

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
        this.projectPath = projectPath;
        this.projectName = projectPath.substring(projectPath.lastIndexOf('\\') + 1, projectPath.lastIndexOf('.crsl'));

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

                        EditorStore.selectFile(this.mainFile);
                    });
                });
        });
    }

    traverseFiles(path: string, cb?: Function) {
        const walker = walk.walk(path);

        const files: IProjectFile[] = [];

        walker.on('file', (root: string, fileStats: any, next: Function) => {

            const projectFile: IProjectFile = {
                name: fileStats.name,
                shortName: fileStats.name.substring(0, fileStats.name.indexOf('.')),
                path: `${root}/${fileStats.name}`,
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

const store = new ProjectStore();
export default store;