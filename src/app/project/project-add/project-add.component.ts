import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Project } from '../../models/project';
import { ProjectView } from '../../models/project-view';
import { ProjectService } from '../../SharedService/project.service';
import { UserService } from '../../SharedService/user.service';
import 'rxjs/add/operator/catch';
import { DatePipe } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  @ViewChild('showDateCheckbox') showDateCheckbox: ElementRef;
  public project: Project;
  public projectsToView: ProjectView[] = [];
  enableDate: boolean = false;
  userSearch: string;
  startDate: string;
  managerName: string;
  public updatedProjects: Project[];
  public users: User[];
  public success: boolean = false;
  public failure: boolean = false;
  showAdd: boolean = true;
  showUpdate: boolean = false;
  results: string
  constructor(private service: ProjectService, private userService: UserService) {
    this.project = new Project();
    this.project.priority = 0;
    this.project.activeStatus = true;
  }

  ngOnInit() {
    this.onGetAllProject();
  }

  onDateSelected(e) {
    this.enableDate = e.target.checked;
    if (e.target.checked) {
      var endDate = new Date();
      endDate.setDate(new Date().getDate() + 1);
      this.project.startDate = new Date();
      this.project.endDate = endDate;
    }
    else {
      console.log(this.project.startDate);
      console.log(this.project.endDate);
      this.project.startDate = null;
      this.project.endDate = null;
    }

    console.log(e.target.checked);
  }

  onValidate() {
    if (this.project.projectName == undefined || this.project.projectName.trim().length == 0)
      return true;
    else if (this.project.userDetail == null)
      return true;
    else if (this.enableDate && (this.project.startDate.toString().trim().length == 0 ||
      this.project.endDate.toString().trim().length == 0))
      return true;
    else
      return false;
  }

  onAddProject() {
    var projectStartDate = new Date(this.project.startDate);
    var projectEndDate = new Date(this.project.endDate);

    if (this.enableDate && (projectEndDate <= projectStartDate)) {
      window.alert("End Date should not be prior/equal to start date");
      return false;
    }

    this.service.AddProject(this.project).subscribe(response => {
      this.results = "Project is added successfully and the id is " + response;
      console.log("AddProject response is:" + this.results);
      this.onResetProject();
      console.log("AddProject response is:" + this.results);
      this.projectsToView.splice(0);
      this.onGetAllProject()
      this.success = true;
    },
      error => {
        if (error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
        this.failure = true;
      }
    );

  }

  onUpdateProject() {
    var projectStartDate = new Date(this.project.startDate);
    var projectEndDate = new Date(this.project.endDate);

    if (this.enableDate && (projectEndDate <= projectStartDate)) {
      window.alert("End Date should not be prior/equal to start date");
      return false;
    }

    this.service.EditProject(this.project, this.project.projectId).subscribe(response => {
      this.results = "Project has been updated successfully for the project id " + response;
      console.log("result text:" + this.results);
      this.project = new Project();
      this.onResetProject();
      this.projectsToView.splice(0);
      this.onGetAllProject()
      this.success = true;
      this.showUpdate = false;
      this.showAdd = true;
    },
      error => {
        if (error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
        this.project = new Project();
        this.failure = true;
        this.showUpdate = false;
        this.showAdd = true;
      }
    );
  }

  onResetProject() {
    this.project = new Project();
    this.project.priority = 0;
    this.showUpdate = false;
    this.showAdd = true;
    this.managerName = "";
    this.enableDate = false;
    this.showDateCheckbox.nativeElement.checked = false;
  }

  onSearchManager() {
    this.onGetAllUsers();
  }

  onSelectManager(selectedUser: User) {
    this.project.userDetail = selectedUser;
    this.project.userId = selectedUser.userId;
    this.managerName = selectedUser.firstName + " " + selectedUser.lastName;
  }

  closeModal() {
    return false;
  }

  onGetAllUsers() {
    this.userService.GetAllUsers().subscribe(
      u => this.users = u);
  }

  onGetAllProject() {
    this.service.GetAllProjects().subscribe(
      projectResponse => {
        (projectResponse as Project[]).forEach(element => {
          var projectToView = new ProjectView();
          projectToView.priority = element.priority;
          projectToView.startDate = element.startDate;
          projectToView.endDate = element.endDate;
          projectToView.projectId = element.projectId;
          projectToView.projectName = element.projectName;
          // projectToView.numberOfTasks = element.taskDetails.length;
          projectToView.completedTasks = element.taskDetails.filter(t => !t.activeStatus).length;
          this.projectsToView.push(projectToView);
        });
      }
    );
  }

  projectSelectionChangedHandler(selectedProjectId: number) {
    this.service.GetProject(selectedProjectId).subscribe(
      projectResponse => {
        this.project = projectResponse as Project;
        this.managerName = this.project.userDetail.firstName + " " + this.project.userDetail.lastName;
        if (this.project.startDate.toString().length > 0 || this.project.endDate.toString().length > 0)
          this.showDateCheckbox.nativeElement.checked = true;
        this.enableDate = true;
      });

    this.showUpdate = true;
    this.showAdd = false;
    this.success = false;
    this.failure = false;
  }

}
