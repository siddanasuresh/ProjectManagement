import { Pipe, PipeTransform } from '@angular/core';
import { ProjectView } from '../models/project-view';

@Pipe({
  name: 'projectsSort'
})
export class ProjectsSortPipe implements PipeTransform {

  transform(users: ProjectView[], path: string[], order: number = 1): any {
    if (!users || !path || !order) return users;

    return users.sort((a: ProjectView, b: ProjectView) => {     
      path.forEach(property => {
        a = a[property];
        b = b[property];
      })     
      return a > b ? order : order * (- 1);
    })
  }

}
