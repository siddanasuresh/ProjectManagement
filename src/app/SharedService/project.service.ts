import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do';
import { Project } from '../models/project';

@Injectable()
export class ProjectService {
  baseUrl: string = "http://localhost/ProjectManagerApi/api/projects/";

  constructor(private http: Http) { }

  private extractResponse(response: Response) {
    if (response.status < 200 || response.status >= 300) {
       throw new Error('Bad response code: ' + response.status);
    }
    let body = response.json(); 

    return body || { };
  };
  GetAllProjects(): Observable<Project[]> {
    console.log('calling projects api end point');  
    return this.http.get(this.baseUrl).map((data: Response) => <Project[]>data.json());
  }

  GetProject(Id: number): Observable<Project> {
    return this.http.get(this.baseUrl + Id).map((data: Response) => <Project>data.json())
  }

  AddProject(Item: Project): Observable<string> {
    return this.http.post(this.baseUrl, Item)
      .map((data: Response) => <string>data.json())
  };

  EditProject(Item: Project, Id: number): Observable<string> {
    return this.http.put(this.baseUrl + Id, Item)
      .map((data: Response) => <string>data.json())
  };

  DeleteProject(Id: number): Observable<string> {
    return this.http.delete(this.baseUrl + Id)
      .map((data: Response) => <string>data.json())
  };
}
