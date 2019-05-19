import { Component, OnInit} from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../SharedService/user.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit { 
  public user:User;
  public updatedUsers:User[];
  public success:boolean = false;
  public failure:boolean = false;
  showAdd:boolean = true;
  showUpdate:boolean = false;
  results:string
  constructor(private service:UserService) { 
    this.user = new User();
  }

  ngOnInit() {
    this.onGetAllUsers();
  }

  onAddUser()
    {     
      this.service.AddUser(this.user).subscribe(response => 
        {
          this.results = "User is added successfully and the id is " + response;
          console.log("result text:" + this.results);  
          this.user = new User();     
          this.onGetAllUsers()
          this.success = true;        
        },
        error =>
        {         
          if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
            this.failure = true;          
        }
      );
    }

    onUpdateUser()
    {     
      this.service.EditUser(this.user, this.user.userId).subscribe(response => 
        {
          this.results = "User has been updated successfully for the user id " + response;
          console.log("result text:" + this.results);  
          this.user = new User();     
          this.onGetAllUsers()
          this.success = true;  
          this.showUpdate = false;
          this.showAdd = true;
        },
        error =>
        {         
          if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
            this.user = new User();    
            this.failure = true;     
            this.showUpdate = false;
            this.showAdd = true;     
        }
      );
    }

    userSelectionChangedHandler(selectedUserId:number)
    {
      this.service.GetUser(selectedUserId).subscribe(
        u => this.user= u);     
        this.showUpdate = true;
        this.showAdd = false;
        this.success = false; 
        this.failure = false;
    }

    onGetAllUsers()
    {
      this.service.GetAllUsers().subscribe(
        u=>this.updatedUsers=u);
    }

    onResetUser()
    {
      this.user = new User();  
      this.showUpdate = false;
      this.showAdd = true;      
    }   
}
