import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection} from  '@angular/http/testing';
import { User } from '../models/user';

describe('UserService', () => {
  let mockBackend: MockBackend;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpModule],
      providers: [UserService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        deps: [MockBackend, BaseRequestOptions],
        useFactory:
          (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
          }
       }
      ]
    });

    mockBackend = getTestBed().get(MockBackend);
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Users', done => {
    let userService: UserService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {userId: 1, firstName: 'User 1', lastName:'lastName', employeeId:10},
                  {userId: 2, firstName: 'User 2', lastName:'last user', employeeId:20},
                ]
              }
            )));
        });

        userService = getTestBed().get(UserService);
        expect(userService).toBeDefined();

        userService.GetAllUsers().subscribe((users: User[]) => {
            expect(users.length).toBeDefined();
            expect(users.length).toEqual(2);
            expect(users[0].userId).toEqual(1);
            expect(users[0].employeeId).toEqual(10);
            expect(users[1].employeeId).toEqual(20);
            done();
        });
    });
  });

  it('should get user for the given userId', done => {
    let userService: UserService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                      body:                
                        {userId: 2, firstName: 'User 2', lastName:'last user', employeeId:20}                
                  }
            )));
        });

        userService = getTestBed().get(UserService);
        expect(userService).toBeDefined();
        userService.GetUser(2).subscribe((user: User) => {          
            expect(user.userId).toEqual(2);
            expect(user.employeeId).toEqual(20);           
            done();
        });
    });
  });


  it('should insert new user',
    async(inject([UserService], (userService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Post);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, body:{userId: 2, firstName: 'User 2', lastName:'last user', employeeId:20}})));
      });

      let user = new User ();
      user.employeeId = 20;
      user.firstName="user 2";
      userService.AddUser(user).subscribe(
        (userResponse: User) => {
          expect(userResponse).toBeDefined();
          console.log(userResponse);  
          //let userResponse = <User>JSON.parse(successResult);  
        expect(userResponse.userId).toBe(2);
        });
    })));

    it('should update existing user',
    async(inject([UserService], (userService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Put);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, body:{userId: 2, firstName: 'User 2 updated', lastName:'last user', employeeId:20}})));
      });

      let user = new User ();
      user.userId = 2;
      user.employeeId = 10;
      user.firstName="User 2 updated";
      userService.EditUser(2, user).subscribe(
        (userResponse: User) => {
          expect(userResponse).toBeDefined();
          console.log(userResponse);
        expect(userResponse.firstName).toBe("User 2 updated");
        });
    })));

    it('should delete existing user',
    async(inject([UserService], (userService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Delete);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200})));
      });
      
      userService.DeleteUser(2).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();         
        //expect(successResult.status).toBe(200);
        },
        (errorResult) => {
          throw (errorResult);
        });
    })));
});
