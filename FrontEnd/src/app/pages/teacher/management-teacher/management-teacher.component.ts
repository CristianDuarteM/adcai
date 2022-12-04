import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';
import { DepartmentModel } from 'src/app/models/DepartmentModel';
import { FacultyModel } from 'src/app/models/FacultyModel';

@Component({
  selector: 'app-management-teacher',
  templateUrl: './management-teacher.component.html',
  styleUrls: ['./management-teacher.component.css']
})
export class ManagementTeacherComponent implements OnInit {

  backRouteTeacher: string;
  titleTeacher: string;
  isPrincipalTeacher: boolean;
  teacher: FormGroup;
  facultyList: FacultyModel[];
  departmentList: DepartmentModel[];
  facultyControl: FormControl;
  departmentControl: FormControl;
  form: FormGroup;

  constructor(private ngxPermissonsService: NgxPermissionsService) {
    this.backRouteTeacher = '/home';
    this.titleTeacher = 'Gestionar Docentes';
    this.isPrincipalTeacher = true;
    this.teacher = new FormGroup({});
    this.facultyList = [
      {id: '1', name: 'Ingeniería', description: 'Descripción de ingeniería', dean: 'Decano 1'},
      {id: '2', name: 'Ingeniería 2', description: 'Descripción de ingeniería 2', dean: 'Decano 2'},
    ];
    this.departmentList = [
      {id: '1', name: 'Sistemas e informática', description: 'Descripción de Sistemas e informática', director: 'Director 1'},
      {id: '2', name: 'Sistemas e informática 2', description: 'Descripción de Sistemas e informática 2', director: 'Director 2'},
    ];
    this.facultyControl = new FormControl(this.facultyList[0]);
    this.departmentControl = new FormControl(this.departmentList[0]);
    this.form = new FormGroup({
      facultySelect: this.facultyControl,
      departmentSelect: this.departmentControl
    });
  }

  ngOnInit(): void {
    let activeRole = sessionStorage.getItem("activeRole") || '';
    this.ngxPermissonsService.loadPermissions([activeRole]);
    this.teacher = new FormGroup({
      facultySelect: new FormControl('none'),
      departmentSelect: new FormControl('none'),
      filterSelect: new FormControl('none'),
      filterText: new FormControl(''),
    });
  }

  onSubmit() {

  }

}