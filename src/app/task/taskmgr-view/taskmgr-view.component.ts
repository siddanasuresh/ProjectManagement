import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TaskDetail } from '../../models/task-detail';
import { Project } from '../../models/project';
import { TaskService } from '../../SharedService/task.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectService } from '../../SharedService/project.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-taskmgr-view',
  templateUrl: './taskmgr-view.component.html',
  styleUrls: ['./taskmgr-view.component.css']
})
export class TaskmgrViewComponent implements OnInit {

  @ViewChild('showmodalClick') showmodalClick: ElementRef;
  taskDetails: TaskDetail[] = [];
  public taskDetailsFiltered: TaskDetail[] = [];
  projectSearch: string;
  public projects: Project[];
  public project: Project;
  nameSearch: string;
  parentTaskSearch: string;
  priorityFromSearch: number;
  priorityToSearch: number;
  startDateSearch: string;
  endDateSearch: string;
  taskDetail: TaskDetail;
  results: string;
  showError: boolean;
  projectName: string;
  path: string[] = ['startDate'];
  order: number = 1; // 1 asc, -1 desc;

  constructor(private service: TaskService, private projectService: ProjectService,
    private router: Router, private location: Location) { }

  ngOnInit() {


  }

  onSearchProject() {
    this.onGetAllProjects();
  }

  onGetAllProjects() {
    this.projectService.GetAllProjects().subscribe(
      p => this.projects = p.filter(pelement => pelement.activeStatus));
  }

  onSelectProject(selectedProject: Project) {
    this.project = selectedProject;
    this.projectName = selectedProject.projectName;
    this.service.GetAllTasks().subscribe(response => {
      (response as TaskDetail[]).filter(resElement => resElement.projectId == this.project.projectId).
        forEach(element => {
          let taskDetail = (response as TaskDetail[]).find(res => res.id == element.parentId);
          if (taskDetail != undefined)
            element.parentName = taskDetail.name;
          else
            element.parentName = "Parent is not available for this given task.";

        });

      this.taskDetailsFiltered = response.filter(resElement => resElement.projectId == this.project.projectId);
      this.showError = false;
    },
      error => {
        if (error.status < 200 || error.status > 300) {
          this.showError = true;
          this.results = JSON.parse(error._body);
        }
        console.log("error " + error.statusText);
      }
    );
  }

  edit(taskId) {
    this.router.navigate(['/editTask'], { queryParams: { id: taskId } });
  }

  sortTask(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  endTask(taskId) {

    this.taskDetail = this.taskDetailsFiltered.find(taskElement => taskElement.id == taskId);
    this.taskDetail.activeStatus = false;
    this.service.PutTask(this.taskDetail, this.taskDetail.id).subscribe(response => {
      if (response.length > 0) {
        this.results = this.taskDetail.name + " has been closed successfully.";
      }
      console.log("result text:" + this.results);
    },
      error => {
        if (error.status < 200 || error.status > 300) {
          this.taskDetail.activeStatus = true;
          this.results = error.statusText + "-" + JSON.parse(error._body);
        }
        console.log("error " + JSON.parse(error._body));
      }
    );
  }
  closeModal() {
    
  }
}
