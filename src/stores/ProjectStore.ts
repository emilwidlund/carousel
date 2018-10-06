import {observable} from 'mobx';

import {remote} from 'electron';
const fs = remote.require('fs');
const walk = remote.require('walk');
const path = remote.require('path');
const zip = remote.require('node-zip')();

export interface ProjectFilesProperties {
    main: string;
    views: string[];
    generic: string[];
}

export class ProjectStore {

    @observable projectInitialized = false;
    @observable projectFiles: ProjectFilesProperties = {
        main: null,
        views: [],
        generic: []
    }

    constructor() {
        // this.initializeProject('C:/Users/ewidlund/Documents/Emils_Topp_5_Kriminalfall.txt');
    }

    createProject(filename: string) {
        const walker = walk.walk('E:/Projects/carousel/src/templates/project');

        walker.on('file', (root: string, fileStats: any, next: any) => {
            console.log(root);
            zip.file(`${fileStats.name}`, fs.readFileSync(`${root}/${fileStats.name}`));
            next();
        });

        walker.on('end', () => {
            const data = zip.generate({
                base64: false,
                compression: 'DEFLATE'
            });
    
            fs.writeFileSync(filename, data, 'binary', (err: Error) => {
                if (err) console.error(err);
    
                this.projectInitialized = true;
            });
        });
    }

    initializeProject(projectPath: string) {
        fs.readFile(projectPath, (err: Error, fileBuffer: Buffer) => {
            if (err) console.error(err);

            console.log(fileBuffer.toString());
            this.projectInitialized = true;
        });
    }
}

const store = new ProjectStore();
export default store;