import { IRecentProject, IProjectFile, ProjectFileType } from '../types';
export declare class ProjectStore {
    recentProjects: IRecentProject[];
    projectInitialized: boolean;
    projectPath: string;
    projectTempPath: string;
    projectName: string;
    projectFiles: IProjectFile[];
    constructor();
    createProject(projectType: string, projectPath: string, cb?: Function): void;
    initializeProject(projectPath: string): void;
    traverseFiles(p: string, cb?: Function): void;
    buildModels(files: IProjectFile[]): void;
    saveFile(file: IProjectFile, cb?: Function): void;
    saveProject(cb?: Function): void;
    createNewFile(fileType: ProjectFileType, fileName: string, cb?: Function): void;
    addToRecentProjects(project: IRecentProject): void;
    readonly fileFormat: string;
    readonly mainFile: IProjectFile;
    readonly viewFiles: IProjectFile[];
    readonly componentFiles: IProjectFile[];
    readonly imageFiles: IProjectFile[];
    readonly genericFiles: IProjectFile[];
}
declare const projectStore: ProjectStore;
export default projectStore;
