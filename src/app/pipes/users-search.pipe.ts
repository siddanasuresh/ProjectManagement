import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'usersSearch'
})
export class UsersSearchPipe implements PipeTransform {
  transform(items: User[], userSearch: any): any {
    if (items && items.length){
      return items.filter(item =>{ 
        if (userSearch)
        {
          if(item.firstName.toLowerCase().indexOf(userSearch.toLowerCase()) === 0 || 
          item.lastName.toLowerCase().indexOf(userSearch.toLowerCase()) === 0 || 
          item.employeeId.toString().indexOf(userSearch) === 0 
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
