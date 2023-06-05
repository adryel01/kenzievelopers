import { type } from "os";

export interface iProject {
    id: number;
    name: string;
    description?: string;
    estimatedTime: string;
    repository: string;
    startDate: Date; //YYYY-MM-DD
    endDate?: Date; //YYYY-MM-DD
    developerId: number | null;
}

export type TProject = Omit<iProject, 'id'>

export interface iProjectTechnologies {
    id: number;
    addedId: Date;
    technologyId: number;
    projectId: number;
}

export interface iTechnologies {
    id: number;
    technologyName: 'JavaScript' | 'Python' | 'React' | 'Express.js' | 'HTML' | 'CSS' | 'Django' | 'PostgreSQL' | 'MongoDB';
}

export interface iRequestTechnologyName {
    name: 'JavaScript' | 'Python' | 'React' | 'Express.js' | 'HTML' | 'CSS' | 'Django' | 'PostgreSQL' | 'MongoDB';
}

export type TTechnology = Omit<iTechnologies, 'id'>

export type TProjectTechnology = Pick<iProjectTechnologies, 'projectId' | 'technologyId'>

export interface iAllProjects extends iProject, Pick<iProjectTechnologies, 'technologyId'>, Pick<iTechnologies, 'technologyName'>{}