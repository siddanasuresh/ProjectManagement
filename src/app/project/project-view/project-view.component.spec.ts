import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectViewComponent } from './project-view.component';
import { ProjectService } from '../../SharedService/project.service';
import { MockProjectService } from '../../SharedService/mock-project-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { ProjectsSearchPipe } from '../../pipes/projects-search.pipe'
import { ProjectsSortPipe } from '../../pipes/projects-sort.pipe'

describe('ProjectViewComponent', () => {
  let component: ProjectViewComponent;
  let fixture: ComponentFixture<ProjectViewComponent>;
  let service: ProjectService;

  const TASK_DETAILS: any[] = [
    { "id": 101, "name": "Task 101", "startDate": "2018-07-23", "endDate": "2018-07-28", "priority": 10, "activeStatus": true, "parentId": null, "parentName": null },
    { "id": 102, "name": "Task 102", "startDate": "2018-07-23", "endDate": "2018-07-28", "priority": 10, "activeStatus": false, "parentId": null, "parentName": null },
    { "id": 103, "name": "Task 103", "startDate": "2018-07-23", "endDate": "2018-07-28", "priority": 10, "activeStatus": false, "parentId": 102, "parentName": null },
    { "id": 104, "name": "Task 104", "startDate": "2018-07-23", "endDate": "2018-07-28", "priority": 10, "activeStatus": true, "parentId": 101, "parentName": null },
  ];


  const USERS: any[] = [
    { "userId": 1, "firstName": "User 1", "lastName": "", "employeeId": 10 },
    { "userId": 2, "firstName": "User 2", "lastName": "", "employeeId": 20 }
  ];

  const PROJECTS: any[] = [
    {
      "projectId": 1, "projectName": "Project 1",
      "startDate": "2018-07-23", "endDate": "2018-07-28", "priority": 10, "userId": 1, "activeStatus": true,
      "taskDetails": TASK_DETAILS, "userDetail": USERS[0]
    },
    {
      "projectId": 2, "projectName": "Project 2",
      "startDate": "2018-07-23", "endDate": "2018-07-28", "priority": 20, "userId": 1, "activeStatus": true,
      "taskDetails": TASK_DETAILS, "userDetail": USERS[1]
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ProjectViewComponent, ProjectsSearchPipe, ProjectsSortPipe],
      providers: [
        { provide: ProjectService, useClass: MockProjectService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ProjectService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Delete project should return Success when confirm true', () => {
    component.projectViews = [];
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert').and.stub()
    spyOn(service, 'DeleteProject').and.returnValues(Observable.of("1"));
    spyOn(component, 'onGetAllProject').and.stub();

    component.onDeleteProject(1);

    expect(component.onGetAllProject).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(component.results);
    expect(window.confirm).toHaveBeenCalledWith('Are sure you want to suspend this project ?');
  });

  it('Delete Project should not delete when confirm false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDeleteProject(1);
    expect(component.results).toBeUndefined();
    expect(window.confirm).toHaveBeenCalledWith('Are sure you want to suspend this project ?');
  });

  it('Delete Project should return Internal Server Error', () => {
    var error = { status: 500, _body: '"Internal Server Error"' };
    spyOn(service, 'DeleteProject').and.returnValue(Observable.throw(error));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert').and.stub()
    component.onDeleteProject(1);
    expect("Internal Server Error").toBe(component.results);
    expect(service.DeleteProject).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(component.results);
  });

  it('Sort Project', () => {
    component.sortProject('projectName');
    expect(component.path[0]).toBe("projectName");
    expect(component.order).toBe(-1);
  });

});
