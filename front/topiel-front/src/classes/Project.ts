export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject{
    name: string,
    description: string,
    status: ProjectStatus,
    useRole: UserRole,
    finishDate: string,
    cost: number,
    progress: number,
    id: number,
}

export class Project implements IProject {
    name: string
    description: string
    status: "pending" | "active" | "finished"
    useRole: "architect" | "engineer" | "developer"
    finishDate: string
    cost: number = 0
    progress: number=0
    id: number=0

    constructor(data: IProject){
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
        this.useRole = data.useRole;
        this.finishDate = data.finishDate;
        this.cost = data.cost;
        this.progress = data.progress;
        this.id = data.id
        
    }
}