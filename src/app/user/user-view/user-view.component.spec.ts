import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserViewComponent } from './user-view.component';
import { UserService } from '../../SharedService/user.service';
import { MockUserService } from '../../SharedService/mock-user-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { UsersSearchPipe } from '../../pipes/users-search.pipe'
import { UsersSortPipe } from '../../pipes/users-sort.pipe'

describe('UserViewComponent', () => {
  let component: UserViewComponent;
  let fixture: ComponentFixture<UserViewComponent>;
  let service: UserService;

  const USERS: any[] = [
    { "userId": 1, "firstName": "User 1", "LastName": "", "employeeId": 10 },
    { "userId": 2, "firstName": "User 2", "LastName": "", "employeeId": 20 }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [UserViewComponent, UsersSortPipe, UsersSearchPipe],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewComponent);
    component = fixture.componentInstance;
    service = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should created', () => {
    expect(component).toBeTruthy();
  });

  it('Delete User should return Success when confirm true', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert').and.stub()
    spyOn(service, 'DeleteUser').and.returnValues(Observable.of("1"));
    spyOn(service, 'GetAllUsers').and.returnValues(Observable.of(USERS));

    component.onDeleteUser(1);
    expect(service.GetAllUsers).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(component.results);
    expect(window.confirm).toHaveBeenCalledWith('Are sure you want to delete this user ?');
  });

  it('Delete User should not delete when confirm false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDeleteUser(1);
    expect(component.results).toBeUndefined();
    expect(window.confirm).toHaveBeenCalledWith('Are sure you want to delete this user ?');
  });

  it('Delete User should return Internal Server Error', () => {
    var error = { status: 500, _body: '"Internal Server Error"' };
    spyOn(service, 'DeleteUser').and.returnValue(Observable.throw(error));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert').and.stub()
    component.onDeleteUser(1);
    expect("Internal Server Error").toBe(component.results);
    expect(service.DeleteUser).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(component.results);
  });

  it('Sort User', () => {
    component.sortUser('firstName');
    expect("firstName").toBe(component.path[0]);
    expect(-1).toBe(component.order);
  }
  );
});

