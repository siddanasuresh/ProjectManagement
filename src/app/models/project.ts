import { User } from './user';
import { TaskDetail } from './task-detail';

export class Project {
    projectId:number;
    projectName : string;
    startDate: Date;
    endDate:Date;
    priority: number;
    userId:number;
    activeStatus:boolean;
    userDetail:User;
    taskDetails:TaskDetail[];
}
