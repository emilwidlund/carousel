import {observable} from 'mobx';

import {remote} from 'electron';
const fs = remote.require('fs');
const path = remote.require('path');

export interface ProjectFilesProperties {
    main: string;
    views: string[];
    generic: string[];
}

export class ProjectStore {

    @observable projectFiles: ProjectFilesProperties = {
        main: null,
        views: [],
        generic: []
    }

    constructor() {
        this.initializeProject('C:/Users/ewidlund/Documents/Emils_Topp_5_Kriminalfall.txt');
    }

    initializeProject(projectPath: string) {
        fs.readFile(projectPath, (err: Error, fileBuffer: Buffer) => {
            if (err) console.error(err);

            console.log(fileBuffer.toString());
        });
    }
}

const store = new ProjectStore();
export default store;