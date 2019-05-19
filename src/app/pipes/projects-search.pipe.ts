import { Pipe, PipeTransform } from '@angular/core';
import { ProjectView } from '../models/project-view';

@Pipe({
  name: 'projectsSearch'
})
export class ProjectsSearchPipe implements PipeTransform {
  transform(items: ProjectView[], projectSearch: any): any {
    if (items && items.length){
      return items.filter(item =>{ 
        if (projectSearch)
        {
          if(item.projectName.toLowerCase().indexOf(projectSearch.toLowerCase()) === 0 || 
          item.priority.toString().toLowerCase().indexOf(projectSearch.toLowerCase()) === 0 || 
          item.numberOfTasks.toString().indexOf(projectSearch) === 0 || 
          item.completedTasks.toString().indexOf(projectSearch) === 0 
        )        
          return true;
          else
          return false;
        }        
       return true;
    })
  }
    else{
        return items;
    }
  }
}
