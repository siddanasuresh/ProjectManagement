import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrEditComponent } from './taskmgr-edit.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { UserService } from '../../SharedService/user.service';
import { MockUserService } from '../../SharedService/mock-user-service';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { Router,ActivatedRoute} from '@angular/router';
import { ProjectNameSearchPipe } from '../../pipes/project-name-search.pipe'
import { UsersSearchPipe } from '../../pipes/users-search.pipe'
import { TaskmgrSearchPipe } from '../../pipes/taskmgr-search.pipe'

describe('TaskmgrEditComponent', () => {
  let component: TaskmgrEditComponent;
  let fixture: ComponentFixture<TaskmgrEditComponent>;
  let userService : UserService; 
  let taskService : TaskService; 
  let projectService : ProjectService; 

  const USER : any =   { "userId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  };
  const PROJECT : any =   { "projectId": 1, "projectName": "Project 1",
  "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":10, "userId" : 1, "activeStatus" : true,
   "userDetail" : USER };
 

  const TASK_DETAILS : any[] = [{ "id": 1, "name": "Task 1", "startDate": Date.now, 
  "endDate" :Date.now, "priority":10, 
      "activeStatus":true, "parentId":2, "parentName":"parent", "userDetail" : USER,"projectDetail" : PROJECT },
      { "id": 2, "name": "Task 2", "startDate": Date.now, "endDate" :Date.now, "priority":10, 
      "activeStatus":false, "parentId":2, "parentName":"parent","userDetail" : USER,"projectDetail" : PROJECT }
    ];    

    const PROJECTS : any[] = [
      { "projectId": 1, "projectName": "Project 1",
      "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":10, "userId" : 1, "activeStatus" : true
       },
      { "projectId": 2, "projectName": "Project 2",
      "startDate": "2019-04-23","endDate" :"2019-04-28", "priority":20, "userId" : 1, "activeStatus" : true
        }
    ];

    const USERS : any[] = [
      { "userId": 1, "firstName": "User 1","lastName": "","employeeId" : 10  },
      { "userId": 2, "firstName": "User 2","lastName": "","employeeId" : 20  }
    ];

    let mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ TaskmgrEditComponent,ProjectNameSearchPipe,UsersSearchPipe,TaskmgrSearchPipe ] , 
      providers: [
        {provide: TaskService, useClass: MockTaskService},
        {provide: UserService, useClass: MockUserService},
        {provide: ProjectService, useClass: MockProjectService},
        { provide: ActivatedRoute, useValue: { 'queryParams': Observable.from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrEditComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
    projectService = TestBed.get(ProjectService);
    userService = TestBed.get(UserService);
    fixture.detectChanges();   
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });  

  it('should return false when task details are invalid for submit', () =>
  {
    var taskDetail = new TaskDetail();
    component.taskDetail = taskDetail;
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.name = "task 1";    
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.userDetail = new User();
    var result = component.onValidate();
    expect(result).toBe(true);
    taskDetail.startDate =  new Date();
    
    taskDetail.projectDetail = new Project();
    
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);  
    taskDetail.startDate =  new Date();
    taskDetail.endDate = endDate;
    component.isParentTaskSelected = false;
    taskDetail.priority = 0;
    var result = component.onValidate();
 
    expect(result).toBe(true);

    taskDetail.priority = 1
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.parentId = 1
    var result = component.onValidate();
    expect(result).toBe(false);
  });

  it('onUpdateTask should show validation alert', () =>
  {
    component.isParentTaskSelected = false;      
    var startDate = new Date();
    startDate.setDate(new Date().getDate() + 1);  
    component.taskDetail.startDate =  startDate;
    component.taskDetail.endDate = new Date();    
    spyOn(window,'alert').and.stub();

    var result = component.onUpdateTask();

    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith("End Date should not be prior/equal to start date");
  });

  it('Update should return Success', () =>
  {
    component.isParentTaskSelected = true;   
    spyOn(taskService,'PutTask').and.returnValue(Observable.of("1")); 
    component.onUpdateTask();   
    expect(component.results.length).toBeGreaterThan(0);         
  });

  it('Update should return Bad Request', () =>
  {
    component.isParentTaskSelected = true;  
    var error = { status: 400, _body :'"Bad Request"'};   
    spyOn(taskService,'PutTask').and.returnValue(Observable.throw(error));
    component.onUpdateTask();  
    expect(component.results).toBe("Bad Request");             
  });

  it('onCancel should go to view', () =>
  {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  })

  it('onSearchManager should have been called onGetAllUsers', () =>
  {
    spyOn(component,"onGetAllUsers").and.stub();
    component.onSearchManager();
    expect(component.onGetAllUsers).toHaveBeenCalled();
  });

  it('onSelectManager should set managername', () =>
  {
    var user= new User();
    component.taskDetail = new TaskDetail();
   
    user.userId =1001;
    user.firstName ="first";
    user.lastName ="last";

    component.onSelectManager(user);

    expect(component.taskDetail.userId).toBe(1001);
    expect(component.managerName).toBe("first last");
  });

  it('onSearchParent should have been called onGetAllParentTask', () =>
  {
    spyOn(component,"onGetAllParentTask").and.stub();
    component.onSearchParent();

    expect(component.onGetAllParentTask).toHaveBeenCalled();
  });

  it('Should return active tasks 1', () =>
  {
    spyOn(taskService,'GetParentList').and.returnValues(Observable.of(TASK_DETAILS));
    
    component.onGetAllParentTask();    

    expect(component.parentTaskDetails.length).toBe(1);   
    expect(taskService.GetParentList).toHaveBeenCalled();
  });

  it('onSelectParentTask should set parentTaskName', () =>
  {
    var parentTaskDetail= new TaskDetail();
    parentTaskDetail.id = 1001;
    parentTaskDetail.name = "parent task";
    component.taskDetail = new TaskDetail();

    component.onSelectParentTask(parentTaskDetail);

    expect(component.taskDetail.parentId).toBe(1001);
    expect(component.parentTaskName).toBe("parent task");
  });

  it('closeModal should go to view', () =>
  {
    component.closeModal();     

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  })

  it('onGetAllUsers Should return users', () =>
  {
    spyOn(userService,'GetAllUsers').and.returnValues(Observable.of(USERS));

    component.onGetAllUsers();    

    expect(component.users.length).toBe(2);   
    expect(userService.GetAllUsers).toHaveBeenCalled();
  });

});
