import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAddComponent } from './project-add.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { UserService } from '../../SharedService/user.service';
import { MockUserService } from '../../SharedService/mock-user-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { User } from '../../models/user';
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { UsersSearchPipe } from '../../pipes/users-search.pipe'
import { Project } from '../../models/project';

describe('ProjectAddComponent', () => {
  let component: ProjectAddComponent;
  let fixture: ComponentFixture<ProjectAddComponent>;
  let service : ProjectService; 
  let userService : UserService; 

  const taskDetails : any[] = [
    { "id": 101, "name": "Task 101", "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":10,"activeStatus":true, "parentId":null, "parentName":null },
    { "id": 102, "name": "Task 102", "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":10,"activeStatus":false, "parentId":null, "parentName":null },
    { "id": 103, "name": "Task 103", "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":10,"activeStatus":false, "parentId":102, "parentName":null },
    { "id": 104, "name": "Task 104", "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":10,"activeStatus":true, "parentId":101, "parentName":null},
    ];

    
  const USERS : any[] = [
    { "userId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  },
    { "userId": 2, "firstName": "User 2","lastName": "","employeeId" : 20  }
  ];

  const PROJECTS : any[] = [
    { "projectId": 1, "projectName": "Project 1",
    "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":10, "userId" : 1, "activeStatus" : true,
    "taskDetails" : taskDetails, "userDetail" : USERS[0] },
    { "projectId": 2, "projectName": "Project 2",
    "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":20, "userId" : 1, "activeStatus" : true ,
     "taskDetails" : taskDetails, "userDetail" : USERS[1]  }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule],
      declarations: [ ProjectAddComponent,UsersSearchPipe ],
      providers: [
        {provide: ProjectService, useClass: MockProjectService} ,
        {provide: UserService, useClass: MockUserService}      
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAddComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ProjectService);
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

 it('should return false when project details are invalid for submit', () =>
  {
    component.project = new Project();
    var result = component.onValidate();
    expect(result).toBe(true);

    component.project.projectName = "project 1";
    var result = component.onValidate();
    expect(result).toBe(true);

    component.project.userDetail = new User();
    component.enableDate = true;  
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);  
    component.project.startDate =  new Date();
    component.project.endDate = endDate;
    
    var result = component.onValidate();
    expect(result).toBe(false);
  });

  it('Add should return validation alert', () =>
  {
    component.project = new Project();
    component.project.userDetail = new User();
    component.enableDate = true;  
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);  
    component.project.startDate = endDate;
    component.project.endDate = new Date();

    spyOn(window,'alert').and.stub();
    
    component.projectsToView = []; 
    var result = component.onAddProject();
   
    expect(result).toBe(false);
  });

  it('Add should return Success', () =>
  {
    component.project = new Project();
    component.project.userDetail = new User();
    component.enableDate = false;  
    spyOn(service,'AddProject').and.returnValue(Observable.of("1"));
    spyOn(service,'GetAllProjects').and.returnValues(Observable.of(PROJECTS));
    spyOn(component,"onResetProject").and.stub();
    component.projectsToView = []; 
    component.onAddProject();
   
    expect(true).toBe(component.success);
    expect(service.AddProject).toHaveBeenCalled();    
     
  });

  it('Add should return Bad Request', () =>
  {
    component.project = new Project();
    component.project.userDetail = new User();
    component.enableDate = false;  
    var error = { status: 400, _body :'"Bad Request"'};   
    spyOn(service,'AddProject').and.returnValue(Observable.throw(error));
    component.onAddProject();    
    expect(true).toBe(component.failure);
    expect(component.results).toBe("Bad Request");
    expect(service.AddProject).toHaveBeenCalled();        
  });

  it('Update should return validation alert', () =>
  {
    component.project = new Project();
    component.project.userDetail = new User();
    component.enableDate = true;  
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);  
    component.project.startDate = endDate;
    component.project.endDate = new Date();
    spyOn(window,'alert').and.stub();    
    var result = component.onUpdateProject();
   
    expect(result).toBe(false);
  });

  it('Update should return Success', () =>
  {
    component.project = new Project();
    component.project.userDetail = new User();
    component.enableDate = false;  
    spyOn(service,'EditProject').and.returnValue(Observable.of("1"));
    spyOn(service,'GetAllProjects').and.returnValues(Observable.of(PROJECTS));
    spyOn(component,"onResetProject").and.stub();
    component.projectsToView = []; 
    component.onUpdateProject();
   
    expect(component.success).toBe(true);
    expect(service.EditProject).toHaveBeenCalled();   
    expect(component.showUpdate).toBe(false);
    expect(component.showAdd).toBe(true);      
  });

  it('Update should return Bad Request', () =>
  {
    component.project = new Project();
    var error = { status: 400, _body :'"Bad Request"'};   
    component.project.userDetail = new User();
    component.enableDate = false;  
    spyOn(service,'EditProject').and.returnValue(Observable.throw(error));  
   
    component.projectsToView = []; 
    component.onUpdateProject();
   
    expect(true).toBe(component.failure);
    expect("Bad Request").toBe(component.results);
    expect(service.EditProject).toHaveBeenCalled();   
    expect(false).toBe(component.showUpdate);
    expect(true).toBe(component.showAdd);         
  });

  it('Should reset Project Object', () =>
  {
    var project = new Project();
    project.projectId = 1;
    component.project =  project;    
    component.onResetProject();    
    expect(undefined).toBe(component.project.projectId);
    expect(false).toBe(component.showUpdate);
    expect(true).toBe(component.showAdd);       
  });

  it('Should return users', () =>
  {
    spyOn(userService,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.onSearchManager();    
    expect(component.users.length).toBe(2);   
  });

  it('Should set manager name', () =>
  {
    var user = new User();
    user.userId = 1001;
    user.firstName ="firstname";
    user.lastName ="lastname";    
    component.onSelectManager(user);    
    expect(component.project.userId).toBe(1001);   
    expect(component.managerName).toBe("firstname lastname");  
  });

  it('Should have been called onGetAllUsers', () =>
  {
    spyOn(userService,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.onGetAllUsers();    
    expect(component.users.length).toBe(2);   
    expect(userService.GetAllUsers).toHaveBeenCalled();  
  }); 

it('should have been called GetProject', () =>
{
  component.projectsToView = []; 
  spyOn(service,'GetProject').and.returnValues(Observable.of(PROJECTS[0]));
  component.projectSelectionChangedHandler(1); 
  expect(component.managerName).toBe("User 1 ");  
  expect(service.GetProject).toHaveBeenCalled();  
  expect(true).toBe(component.showUpdate);
  expect(false).toBe(component.showAdd);    
  expect(false).toBe(component.success); 
  expect(false).toBe(component.failure); 
});  


});
