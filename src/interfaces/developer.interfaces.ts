
export interface iDeveloper {
    id: number;
    name: string;
    email: string;
}

export type TDeveloper = Omit<iDeveloper, 'id'>

export interface iDeveloperInfo {
    id: number;
    developerSince: Date;
    preferredOS: "Windows" | "Linux" | "MacOS";
    developerId?: number;
}

export type TDeveloperInfo = Omit<iDeveloperInfo, 'id'>

export interface iAllDeveloperInfos extends iDeveloper, Omit<iDeveloperInfo, 'id' | 'developerId'>{ 
}