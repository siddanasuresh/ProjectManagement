import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'usersSort'
})
export class UsersSortPipe implements PipeTransform {

      transform(users: User[], path: string[], order: number = 1): any {
        if (!users || !path || !order) return users;

        return users.sort((a: User, b: User) => {     
          path.forEach(property => {
            a = a[property];
            b = b[property];
          })     
          return a > b ? order : order * (- 1);
        })
      }
   
  }


