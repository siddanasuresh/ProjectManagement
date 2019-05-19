import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserViewComponent } from './user/user-view/user-view.component';
import { ProjectAddComponent } from './project/project-add/project-add.component';
import { ProjectViewComponent } from './project/project-view/project-view.component';
import { TaskmgrAddComponent } from './task/taskmgr-add/taskmgr-add.component';
import { TaskmgrViewComponent } from './task/taskmgr-view/taskmgr-view.component';
import { TaskmgrEditComponent } from './task/taskmgr-edit/taskmgr-edit.component';
import { UserService } from './SharedService/user.service';
import { ProjectService } from './SharedService/project.service';
import { TaskService } from './SharedService/task.service';
import { UsersSearchPipe } from './pipes/users-search.pipe';
import { UsersSortPipe } from './pipes/users-sort.pipe';
import { ProjectsSearchPipe } from './pipes/projects-search.pipe';
import { ProjectsSortPipe } from './pipes/projects-sort.pipe';
import { ProjectNameSearchPipe } from './pipes/project-name-search.pipe';
import { TaskmgrSearchPipe } from './pipes/taskmgr-search.pipe';
import { TaskmgrSortPipe } from './pipes/taskmgr-sort.pipe';

const appRoutes:Routes=[
  {path:'',component:ProjectAddComponent},
  {path:'addTask',component:TaskmgrAddComponent},
  {path:'viewTask',component:TaskmgrViewComponent},
  {path:'editTask',component:TaskmgrEditComponent},
  {path:'addUser',component:UserAddComponent},
  {path:'addProject',component:ProjectAddComponent},
  {path:'**',component:ProjectAddComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    UserAddComponent,
    UserViewComponent,
    ProjectAddComponent,
    ProjectViewComponent,
    TaskmgrAddComponent,
    TaskmgrViewComponent,
    TaskmgrEditComponent,
    TaskmgrSearchPipe,
    UsersSearchPipe,
    UsersSortPipe,
    ProjectsSearchPipe,
    ProjectsSortPipe,
    ProjectNameSearchPipe,
    TaskmgrSortPipe
  ],
  
  imports: [
    BrowserModule,FormsModule, HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UserService,ProjectService,TaskService,TaskmgrSearchPipe, UsersSearchPipe, UsersSortPipe],
  bootstrap: [AppComponent],
  exports:[TaskmgrSearchPipe, UsersSearchPipe, UsersSortPipe]
})
export class AppModule { }
