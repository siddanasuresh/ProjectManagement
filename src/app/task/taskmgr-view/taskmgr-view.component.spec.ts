import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrViewComponent } from './taskmgr-view.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Project } from '../../models/project';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectNameSearchPipe } from '../../pipes/project-name-search.pipe'
import { TaskmgrSortPipe } from '../../pipes/taskmgr-sort.pipe'
import { DatePipe } from '@angular/common';

describe('TaskmgrViewComponent', () => {
  let component: TaskmgrViewComponent;
  let fixture: ComponentFixture<TaskmgrViewComponent>;

  let taskService: TaskService;
  let projectService: ProjectService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const PROJECT: any = {
    "projectId": 1, "projectName": "Project 1",
    "startDate": "2019-04-23", "endDate": "2019-04-28", "priority": 10, "userId": 1, "activeStatus": true
  };

  const PROJECT1: any = {
    "projectId": 2, "projectName": "Project 2",
    "startDate": "2019-04-23", "endDate": "2019-04-28", "priority": 10, "userId": 1, "activeStatus": true
  };


  const taskDetails: any[] = [{
    "id": 1, "name": "Task 1", "startDate": Date.now,
    "endDate": Date.now, "priority": 10,
    "activeStatus": true, "parentId": 2, "parentName": "parent", "projectDetail": PROJECT
  },
  {
    "id": 2, "name": "Task 2", "startDate": Date.now, "endDate": Date.now, "priority": 10,
    "activeStatus": false, "parentId": 2, "parentName": "parent", "projectDetail": PROJECT1
  }
  ];

  const PROJECTS: any[] = [
    {
      "projectId": 1, "projectName": "Project 1",
      "startDate": "2019-04-23", "endDate": "2019-04-28", "priority": 10, "userId": 1, "activeStatus": true
    },
    {
      "projectId": 2, "projectName": "Project 2",
      "startDate": "2019-04-23", "endDate": "2019-04-28", "priority": 20, "userId": 1, "activeStatus": false
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [TaskmgrViewComponent, ProjectNameSearchPipe, TaskmgrSortPipe],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: ProjectService, useClass: MockProjectService },
        { provide: ActivatedRoute, useValue: { 'queryParams': Observable.from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrViewComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
    projectService = TestBed.get(ProjectService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSearchProject should have been called onGetAllProjects', () => {
    spyOn(component, "onGetAllProjects").and.stub();
    component.onSearchProject();

    expect(component.onGetAllProjects).toHaveBeenCalled();
  });

  it('onGetAllProjects Should return projects', () => {
    spyOn(projectService, 'GetAllProjects').and.returnValues(Observable.of(PROJECTS));

    component.onGetAllProjects();

    expect(component.projects.length).toBe(1);
    expect(projectService.GetAllProjects).toHaveBeenCalled();
  });

  it('onSelectProject Should handle error', () => {
    var error = { status: 400, _body: '"Bad Request"' };
    spyOn(taskService, 'GetAllTasks').and.returnValues(Observable.throw(error));

    component.onSelectProject(PROJECT);

    expect(component.projectName).toBe("Project 1");

    expect(taskService.GetAllTasks).toHaveBeenCalled();
    expect(component.showError).toBe(true);
  });

  it('Edit method should go to Edit Route', () => {
    component.edit(101);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/editTask'], Object({ queryParams: Object({ id: 101 }) }));
  })

  it('Sort Task', () => {
    component.sortTask('startDate');
    expect("startDate").toBe(component.path[0]);
    expect(-1).toBe(component.order);
  });

  it('EndTask should handle Internal server error and Active Status should be true', () => {
    component.taskDetailsFiltered = taskDetails;

    var error = { status: 500, statusText: "500", _body: '"Internal server error"' };
    spyOn(taskService, 'PutTask').and.returnValue(Observable.throw(error));
    component.endTask(1);
    expect("500-Internal server error").toBe(component.results);
    expect(taskService.PutTask).toHaveBeenCalledWith(taskDetails[0], 1);
    expect(component.taskDetail.activeStatus).toBe(true);
  });

});
