import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do';
import { User } from '../models/user';

@Injectable()
export class UserService {
  baseUrl: string ="http://localhost/ProjectManagerApi/api/users/";  
  constructor(private http:Http) { }

  private extractResponse(response: Response) {
    if (response.status < 200 || response.status >= 300) {
       throw new Error('Bad response code: ' + response.status);
    }
    let body = response.json(); 
    return body || { };
  }

  GetAllUsers():Observable<User[]>
  {   
    console.log('calling user api end point');    
    return this.http.get(this.baseUrl).map((data:Response)=><User[]>data.json());      
  }

  GetUser(Id:number):Observable<User>
  {   
      return this.http.get(this.baseUrl+Id).map((data:Response)=><User>data.json())     
  }

  AddUser(Item:User):Observable<string>
    {
        return this.http.post(this.baseUrl,Item)
        .map((data:Response)=><string>data.json())
    };

    EditUser(Item:User, Id:number):Observable<string>
    {
      return this.http.put(this.baseUrl+Id,Item)
      .map((data:Response)=><string>data.json())
    };

    DeleteUser(Id:number):Observable<string>
    {
      return this.http.delete(this.baseUrl+Id)
      .map((data:Response)=><string>data.json())
    };

      
}
