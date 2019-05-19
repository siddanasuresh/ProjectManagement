import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  styles: [`
  .active   {
    color: #00000 !important;
  }
`],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {
  }
  onNaviagteToUserAdd() {
    this.router.navigate(['/addUser']);
  };

  onNaviagteToProjectAdd() {
    this.router.navigate(['/addProject']);
  };

  onNaviagteToTaskAdd() {
    this.router.navigate(['/addTask']);
  };
  onNaviagteToTaskView() {
    this.router.navigate(['/viewTask']);
  };
  title = 'Project Management';
}
