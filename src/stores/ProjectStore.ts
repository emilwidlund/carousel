import {observable} from 'mobx';

import {remote} from 'electron';
const fs = remote.require('fs');
const walk = remote.require('walk');
const path = remote.require('path');
const zip = remote.require('node-zip')();
const unzip = remote.require('unzip');
const temp = remote.require('temp').track();
const rimraf = remote.require('rimraf');

export interface ProjectFilesProperties {
    main: string;
    views: string[];
    generic: string[];
}

export class ProjectStore {

    @observable projectInitialized = false;
    @observable projectPath: string = null;
    @observable projectTempPath: string = null;
    @observable projectName: string = null;
    @observable projectFiles: ProjectFilesProperties = {
        main: null,
        views: [],
        generic: []
    }

    createProject(projectPath: string) {
        const walker = walk.walk(path.resolve(__dirname, '/carousel/src/templates/project'));

        walker.on('file', (root: string, fileStats: any, next: any) => {
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

                this.projectPath = projectPath;
                this.projectName = projectPath.substring(projectPath.lastIndexOf('\\') + 1, projectPath.lastIndexOf('.zip'));

                this.initializeProject(this.projectPath, this.projectName);
            });
        });
    }

    initializeProject(projectPath: string, projectName: string) {
        temp.mkdir({prefix: `carousel-${projectName}`}, (err: Error, dirPath: string) => {
            fs.createReadStream(projectPath)
                .pipe(unzip.Extract({path: dirPath}))
                .on('close', () => {
                    this.projectTempPath = dirPath;
                    this.projectInitialized = true;
                });
        });
    }
}

const store = new ProjectStore();
export default store;