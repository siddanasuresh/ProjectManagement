import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { Project } from '../models/project';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

    const TASK_DETAILS : any[] = [
      { "id": 101, "name": "Task 101", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"activeStatus":true, "parentId":null, "parentName":null },
      { "id": 102, "name": "Task 102", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"activeStatus":false, "parentId":null, "parentName":null },
      { "id": 103, "name": "Task 103", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"activeStatus":false, "parentId":102, "parentName":null },
      { "id": 104, "name": "Task 104", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"activeStatus":true, "parentId":101, "parentName":null},
      ];

    const USERS : any[] = [
      { "userId": 1, "firstName": "User 1","LastName": "","employeeId" : 10  },
      { "userId": 2, "firstName": "User 2","LastName": "","employeeId" : 20  }
    ];
  
    const PROJECT_DETAILS : any[] = [
      { "projectId": 1, "projectName": "Project 1",
      "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10, "userId" : 1, "activeStatus" : true,"taskDetails" : TASK_DETAILS },
      { "projectId": 2, "projectName": "Project 2",
      "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":20, "userId" : 1, "activeStatus" : true , "taskDetails" : TASK_DETAILS  }
    ];
    const PROJECT_DETAIL : Project = new Project();

export class MockProjectService {
    public GetAllProjects(): Observable<Project[]> {
     
        return Observable.of(PROJECT_DETAILS);
      }

      public GetProject(): Observable<Project> {
        return Observable.of(PROJECT_DETAIL);
      }

      public AddProject(Item:Project): Observable<string> {
        return Observable.of("Success");
      }

      public EditProject(Item:Project, Id:number): Observable<string> {
        return Observable.of("Success");
      }

      public DeleteProject(Item:Project): Observable<string> {
        return Observable.of("Success");
      }
}
