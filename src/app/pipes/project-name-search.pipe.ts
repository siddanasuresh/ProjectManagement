import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../models/project';


@Pipe({
  name: 'projectNameSearch'
})
export class ProjectNameSearchPipe implements PipeTransform {

  transform(items: Project[], projectSearch: any): any {
    if (items && items.length){
      return items.filter(item =>{ 
        if (projectSearch)
        {
          if(item.projectName.toLowerCase().indexOf(projectSearch.toLowerCase()) === 0 || 
          item.priority.toString().toLowerCase().indexOf(projectSearch.toLowerCase()) === 0 
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
