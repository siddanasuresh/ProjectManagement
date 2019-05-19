import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ProjectView } from '../../models/project-view';
import 'rxjs/add/operator/catch';
import { ProjectService } from '../../SharedService/project.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  @Input() projectViews:ProjectView[]; 
  projectSearch :string;
  results:string;
  path: string[] = ['startDate'];
  order: number = 1; // 1 asc, -1 desc;
  @Output() projectSelectionChanged = new EventEmitter();
  constructor(private service:ProjectService) { }

  ngOnInit() {
  }

  sortProject(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  onSelectProject(projectId:number)
  {
    this.projectSelectionChanged.emit(projectId);
    return false;
  }

  onGetAllProject()
  {      
   this.service.GetAllProjects().subscribe(
     projectResponse =>
        {
          (projectResponse as Project[]).forEach(element => 
            {
              var projectToView = new ProjectView();
              projectToView.priority = element.priority;
              projectToView.startDate = element.startDate;
              projectToView.endDate = element.endDate;
              projectToView.projectId = element.projectId;
              projectToView.projectName = element.projectName;
             // projectToView.numberOfTasks = element.taskDetails.length;
              projectToView.completedTasks = element.taskDetails.filter(t=> t.activeStatus == false).length;
             this.projectViews.push(projectToView);
            }); 
        }
     );
  }

  onDeleteProject(projectId:number)
  {   
    if(window.confirm('Are sure you want to suspend this project ?')){
     
      this.service.DeleteProject(projectId).subscribe(response => 
        {
          this.results = "Project has been suspended successfully for the project id " + response;
          console.log("result text:" + this.results); 
          window.alert(this.results);
          this.projectViews.splice(0);
          this.onGetAllProject();
        },
        error =>
        {         
          if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);      
            window.alert(this.results);     
        })

      return false;    
     }
    return false;
  }

}
