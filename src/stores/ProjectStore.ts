import {observable} from 'mobx';
import * as monaco from 'monaco-editor';

import {remote} from 'electron';
const fs = remote.require('fs');
const walk = remote.require('walk');
const path = remote.require('path');
const zip = remote.require('node-zip')();
const unzip = remote.require('unzip');
const temp = remote.require('temp').track();

import EditorStore from './EditorStore';

import {IProjectFile, ProjectFileType} from '../types';

export class ProjectStore {

    @observable projectInitialized = false;
    @observable projectPath: string = null;
    @observable projectTempPath: string = null;
    @observable projectName: string = null;
    @observable projectFiles: IProjectFile[] = [];

    createProject(projectPath: string) {
        const walker = walk.walk(path.resolve('./src/templates/project'));

        walker.on('file', (root: string, fileStats: any, next: Function) => {

            let folder = root.substring(root.lastIndexOf('\\') + 1, root.length);
            const filename = fileStats.name;

            if (folder.endsWith('project')) {
                folder = null;
            }

            const path = folder ? `${folder}/${filename}` : filename;

            zip.file(path, fs.readFileSync(`${root}/${fileStats.name}`));
            next();
        });

        walker.on('end', () => {
            const data = zip.generate({
                base64: false,
                compression: 'DEFLATE'
            });
    
            fs.writeFile(projectPath, data, 'binary', (err: Error) => {
                if (err) console.error(err);

                this.initializeProject(projectPath);
            });
        });
    }

    initializeProject(projectPath: string) {
        this.projectPath = projectPath;
        this.projectName = projectPath.substring(projectPath.lastIndexOf('\\') + 1, projectPath.lastIndexOf('.crsl'));

        temp.mkdir({prefix: `carousel-${this.projectName}`}, (err: Error, dirPath: string) => {
            fs.createReadStream(projectPath)
                .pipe(unzip.Extract({path: dirPath}))
                .on('close', () => {

                    this.traverseFiles(dirPath, (files: IProjectFile[]) => {
                        files.map((file: any, index: number) => {

                            if (file.name.includes('Main.js')) {
                                file.type = ProjectFileType.Main;
                            } else if (file.name.includes('.view.js')) {
                                file.type = ProjectFileType.View;
                            } else if (file.name.includes('.component.js')) {
                                file.type = ProjectFileType.Component;
                            }

                        });


                        this.buildModels(files);

                        this.projectFiles = files;
                        this.projectTempPath = dirPath;

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
            }
        });
    }

    saveFile(file: IProjectFile, cb?: Function) {
        fs.writeFile(file.path, file.model.getValue(), (err: Error) => {
            if (err) return console.error(err);

            console.log('File Saved!');

            cb();
        });
    }

    saveProject() {
        const walker = walk.walk(this.projectTempPath);

        walker.on('file', (root: string, fileStats: any, next: Function) => {

            let folder = root.substring(root.lastIndexOf('\\') + 1, root.length);
            const filename = fileStats.name;

            if (folder.endsWith('project')) {
                folder = null;
            }

            const path = folder ? `${folder}/${filename}` : filename;

            zip.file(path, fs.readFileSync(`${root}/${fileStats.name}`));
            next();
        });

        walker.on('end', () => {
            const data = zip.generate({
                base64: false,
                compression: 'DEFLATE'
            });
    
            fs.writeFile(this.projectPath, data, 'binary', (err: Error) => {
                if (err) console.error(err);

                console.log('Project Saved!');
            });
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