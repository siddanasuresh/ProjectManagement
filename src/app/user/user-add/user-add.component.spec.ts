import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAddComponent } from './user-add.component';
import { UserService } from '../../SharedService/user.service';
import { MockUserService } from '../../SharedService/mock-user-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { User } from '../../models/user';
import { NO_ERRORS_SCHEMA } from '@angular/core'

describe('UserAddComponent', () => {
  let component: UserAddComponent;
  let fixture: ComponentFixture<UserAddComponent>;
  let service : UserService; 

  const USERS : any[] = [
    { "userId": 1, "firstName": "User 1","LastName": "","employeeId" : 10  },
    { "userId": 2, "firstName": "User 2","LastName": "","employeeId" : 20  }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule],
      declarations: [ UserAddComponent ] , 
      providers: [
        {provide: UserService, useClass: MockUserService}       
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })    
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddComponent);
    component = fixture.componentInstance;
    service = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return User details', () =>
  {
    spyOn(service,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.ngOnInit();
    expect(2).toBe(component.updatedUsers.length);
    expect("User 1").toBe(component.updatedUsers[0].firstName);
  });

  it('Add should return Success', () =>
  {
    component.user = new User();
    spyOn(service,'AddUser').and.returnValue(Observable.of("1"));
    spyOn(service,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.onAddUser();
   
    expect(true).toBe(component.success);
    expect(service.AddUser).toHaveBeenCalled();    
    expect(service.GetAllUsers).toHaveBeenCalled();    
  });

  
  it('Add should return Bad Request', () =>
  {
    component.user = new User();   
    var error = { status: 400, _body :'"Bad Request"'};   
    spyOn(service,'AddUser').and.returnValue(Observable.throw(error));
    component.onAddUser();    
    expect(true).toBe(component.failure);
    expect("Bad Request").toBe(component.results);
    expect(service.AddUser).toHaveBeenCalled();        
  });

  it('Add should return Internal Server Error', () =>
  {
    component.user = new User();   
    var error = { status: 500, _body :'"Internal Server Error"'};   
    spyOn(service,'AddUser').and.returnValue(Observable.throw(error));
    component.onAddUser();    
    expect(true).toBe(component.failure);
    expect("Internal Server Error").toBe(component.results);
    expect(service.AddUser).toHaveBeenCalled();        
  });

  it('Update should return Success', () =>
  {
    component.user = new User();
    spyOn(service,'EditUser').and.returnValue(Observable.of("1"));
    spyOn(service,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.onUpdateUser();
   
    expect(true).toBe(component.success);
    expect(false).toBe(component.showUpdate);
    expect(true).toBe(component.showAdd);
    expect(service.EditUser).toHaveBeenCalled();    
    expect(service.GetAllUsers).toHaveBeenCalled();    
  });

  
  it('Update should return Bad Request', () =>
  {
    component.user = new User();   
    var error = { status: 400, _body :'"Bad Request"'};   
    spyOn(service,'EditUser').and.returnValue(Observable.throw(error));
    component.onUpdateUser();    
    expect(true).toBe(component.failure);
    expect("Bad Request").toBe(component.results);
    expect(service.EditUser).toHaveBeenCalled();   
    expect(false).toBe(component.showUpdate);
    expect(true).toBe(component.showAdd);     
  });

  it('Update should return Internal Server Error', () =>
  {
    component.user = new User();   
    var error = { status: 500, _body :'"Internal Server Error"'};   
    spyOn(service,'EditUser').and.returnValue(Observable.throw(error));
    component.onUpdateUser();    
    expect(true).toBe(component.failure);
    expect("Internal Server Error").toBe(component.results);
    expect(service.EditUser).toHaveBeenCalled();  
    expect(false).toBe(component.showUpdate);
    expect(true).toBe(component.showAdd);      
  });

  it('userSelectionChangedHandler should value to User Object', () =>
  {
    var user = new User();
    user.userId = 1;
    spyOn(service,'GetUser').and.returnValue(Observable.of(user));
    
    component.userSelectionChangedHandler(1);
   
    expect(user.userId).toBe(component.user.userId);
    expect(true).toBe(component.showUpdate);
    expect(false).toBe(component.showAdd);
    expect(false).toBe(component.success);
    expect(false).toBe(component.failure);
    expect(service.GetUser).toHaveBeenCalled();        
  });

  it('onGetAllUsers should set value to UpdateUsers', () =>
  {
    spyOn(service,'GetAllUsers').and.returnValues(Observable.of(USERS));
    component.onGetAllUsers();
    expect(2).toBe(component.updatedUsers.length);
    expect("User 1").toBe(component.updatedUsers[0].firstName);
    expect(service.GetAllUsers).toHaveBeenCalled();        
  });

  it('Should reset User Object', () =>
  {
    var user = new User();
    user.userId = 1;
    component.user =  user;    
    component.onResetUser();    
    expect(undefined).toBe(component.user.userId);
    expect(false).toBe(component.showUpdate);
    expect(true).toBe(component.showAdd);       
  });

});
