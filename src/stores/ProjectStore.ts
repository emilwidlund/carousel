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

export class ProjectStore {

    @observable projectInitialized = false;
    @observable projectPath: string = null;
    @observable projectTempPath: string = null;
    @observable projectName: string = null;
    @observable projectFiles: any = {
        main: null,
        views: [],
        generic: []
    }

    createProject(projectPath: string) {
        const walker = walk.walk(path.resolve(__dirname, '/carousel/src/templates/project'));

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
                    this.projectTempPath = dirPath;
                    this.projectInitialized = true;

                    this.traverseProjectFiles((files: object[]) => {
                        files.map((file: any, index: number) => {

                            if (file.name.includes('Main.js')) {
                                this.projectFiles.main = file;
                            } else if (file.name.includes('.view.js')) {
                                this.projectFiles.views.push(file);
                            } else {
                                this.projectFiles.generic.push(file);
                            }

                        });

                        this.buildModels();

                        EditorStore.selectedFile = this.projectFiles.main;
                    });
                });
        });
    }

    traverseProjectFiles(cb?: Function) {
        const walker = walk.walk(this.projectTempPath);

        const files: object[] = [];

        walker.on('file', (root: string, fileStats: any, next: Function) => {
            files.push({
                path: `${root}/${fileStats.name}`,
                name: fileStats.name
            });

            next();
        });

        walker.on('end', () => {
            cb(files);
        });
    }

    buildModels() {
        Object.keys(this.projectFiles).map((k: string, i: number) => {

            if (!Array.isArray(this.projectFiles[k])) {
                if (this.projectFiles[k].name.endsWith('.js')) {
                    const model = monaco.editor.createModel(fs.readFileSync(this.projectFiles[k].path, 'utf8'), 'javascript');
                    this.projectFiles[k].model = model;
                }
            } else {
                this.projectFiles[k].map((file: any, i: number) => {
                    if (file.name.endsWith('.js')) {
                        const model = monaco.editor.createModel(fs.readFileSync(file.path, 'utf8'), 'javascript');
                        this.projectFiles[k][i].model = model;
                    }
                });
            }
        });
    }
}

const store = new ProjectStore();
export default store;