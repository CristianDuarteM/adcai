import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { config } from 'src/app/constants/config';
import { Dialog } from 'src/app/services/Dialog';
import { UserRequest } from 'src/app/models/request/UserRequest';
import { DepartmentResponse } from 'src/app/models/response/DepartmentResponse';
import { FacultyResponse } from 'src/app/models/response/FacultyResponse';
import { Role } from 'src/app/models/Role';
import { User } from 'src/app/models/User';
import { DepartmentService } from 'src/app/services/department/department.service';
import { FacultyService } from 'src/app/services/faculty/faculty.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userModel: User;
  @Input() isEditable: boolean;
  @Input() onlyViewDirector: boolean;
  @Input() textButton: string;
  isDean: boolean;
  isAdmin: boolean;
  user: FormGroup;
  departmentList: DepartmentResponse[];
  facultyList: FacultyResponse[];
  isLoaded: boolean;
  @Input() canUpdate: boolean;
  isComplete: boolean;
  nameFaculty: string;
  fileEvent: File | null;

  constructor(public dialog: Dialog, private departmentService: DepartmentService, private userService: UserService,
    private route: ActivatedRoute, private facultyService: FacultyService) {
    this.userModel = new User();
    this.isDean = false;
    this.isAdmin = sessionStorage.getItem('activeRole') === 'ADMIN';
    this.isEditable = false;
    this.onlyViewDirector = false;
    this.user = new FormGroup({});
    this.departmentList = [];
    this.facultyList = [];
    this.textButton = 'Actualizar';
    this.isLoaded = false;
    this.canUpdate = false;
    this.isComplete = true;
    this.nameFaculty = '';
    this.fileEvent = null;
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('activeRole') === 'DECANO'){
      this.isDean = true;
    }

    if((sessionStorage.getItem(config.SESSION_STORAGE.IS_COMPLETE) || '') !== ''){
      this.isComplete = false;
    }

    this.user = new FormGroup({
      nameInput: new FormControl(''),
      lastNameInput: new FormControl(''),
      codeInput: new FormControl(''),
      emailInput: new FormControl(''),
      departmentInput: new FormControl(''),
      facultyInput: new FormControl(''),
      isRoleDeanInput: new FormControl(''),
      isRoleDirectorInput: new FormControl(''),
      isRoleTeacherInput: new FormControl(''),
      signatureInput: new FormControl(),
      signatureInputFile: new FormControl(''),
      doCai: new FormControl(''),
    });

    this.getDataUser();
  }

  onSubmit() {
    if(this.user.valid) {
      if(this.textButton === 'Actualizar') {
        this.updateUser();
      }
    } else {
      this.dialog.openDialog('Debe llenar todos los campos requeridos', '');
    }
  }

  updateUser() {
    let userRequest: UserRequest = {
      id: this.userModel.id,
      nombre: this.getItemValue('nameInput'),
      apellido: this.getItemValue('lastNameInput'),
      codigo: this.getItemValue('codeInput'),
      id_departamento: this.getItemValue('departmentInput'),
      realizaCai: (this.getItemValue('doCai') === 'true') ? true : false,
    }
    if(this.userModel.codigo === userRequest.codigo) {
      delete userRequest.codigo;
    }
    this.userService.updateUser(userRequest.id + '', userRequest).subscribe({
      next: userUpdateResponse => {
        if(this.fileEvent !== null) {
          this.addSignature(this.fileEvent);
        }
        if(!this.isComplete){
          sessionStorage.removeItem(config.SESSION_STORAGE.IS_COMPLETE);
          this.dialog.openDialog(userUpdateResponse.msg, '/home');
        } else{
          this.dialog.openDialog(userUpdateResponse.msg, '/perfil/editar/' + this.userModel.id);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.dialog.openDialog(this.dialog.getErrorMessage(error), this.dialog.validateError('/gestion-docentes', error));
      }
    });
  }

  loadFile(event: any) {
    if(event.target.files.length > 0) {
      this.fileEvent = event.target.files[0];
    }
  }

  addSignature(file: File) {
    this.userService.addSignature(file).subscribe({
      next: () => {}
    });
  }

  containsRole(roleList: Role[], roleUser: string) {
    let haveRole = false;
    if(roleList !== undefined && roleList.length > 0) {
      roleList.forEach(role => {
        if(role !== null && role.nombre === roleUser) {
          haveRole = true;
        }
      });
    }
    return haveRole;
  }

  getDataUser() {
    let idUser = this.route.snapshot.paramMap.get('idUser');
    this.userService.getUserById(idUser +'').subscribe({
      next: userResponse => {
        this.userModel = userResponse.usuario;
        if(userResponse.usuario.id_departamento !== null) {
          this.departmentService.getDepartmentById(userResponse.usuario.id_departamento).subscribe({
            next: departmentResponse => {
              this.nameFaculty = departmentResponse.facultad.nombre;
              this.getDepartmentListByFaculty(departmentResponse.id_facultad);
            },
            error: (error: HttpErrorResponse) => {
              this.dialog.openDialog(this.dialog.getErrorMessage(error), this.dialog.validateError('/gestion-docentes', error));
            }
          });
        } else {
          this.getFacultyByDean();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.dialog.openDialog(this.dialog.getErrorMessage(error), this.dialog.validateError('/gestion-docentes', error));
      }
    });
  }

  getDepartmentListByFaculty(idFaculty: string) {
    this.departmentService.getDepartmentListByFaculty(idFaculty).subscribe({
      next: departmentListResponse => {
        this.departmentList = departmentListResponse;
        if(this.isDean && this.nameFaculty === '') {
          this.getFacultyByDean();
        } else{
          this.loadInputs();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.dialog.openDialog(this.dialog.getErrorMessage(error), this.dialog.validateError('/gestion-docentes', error));
      }
    });
  }

  getFacultyByDean() {
    this.facultyService.getFacultyByDean(this.userModel.id + '').subscribe({
      next: facultyByDeanResponse => {
        this.nameFaculty = facultyByDeanResponse.nombre;
        if(this.userModel.id_departamento === null) {
          this.getDepartmentListByFaculty(facultyByDeanResponse.id);
        } else {
          this.loadInputs();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.dialog.openDialog(this.dialog.getErrorMessage(error), this.dialog.validateError('/home', error));
      }
    });
  }

  loadInputs() {
    let activeRole = sessionStorage.getItem('activeRole');
    let changeDepartmentDisable = activeRole !== 'ADMIN';
    if(activeRole === 'DECANO' && !this.isComplete && this.userModel.id_departamento === null) {
      changeDepartmentDisable = false;
    }
    if(this.containsRole(this.userModel.rols, 'DIRECTOR') && activeRole === 'ADMIN') {
      changeDepartmentDisable = true;
    }
    this.user = new FormGroup({
      nameInput: new FormControl({value: this.userModel.nombre, disabled: !this.isEditable}, [Validators.required]),
      lastNameInput: new FormControl({value: this.userModel.apellido, disabled: !this.isEditable}, [Validators.required]),
      codeInput: new FormControl({value: this.userModel.codigo, disabled: !this.isEditable}, [Validators.required]),
      emailInput: new FormControl({value: this.userModel.correo, disabled: true}, [Validators.required, Validators.email]),
      departmentInput: new FormControl({value: this.userModel.id_departamento, disabled: changeDepartmentDisable}, [Validators.required]),
      facultyInput: new FormControl({value: this.nameFaculty, disabled: true}),
      isRoleDeanInput: new FormControl({value: this.containsRole(this.userModel.rols, 'DECANO'), disabled: true}),
      isRoleDirectorInput: new FormControl({value: this.containsRole(this.userModel.rols, 'DIRECTOR'), disabled: true}),
      isRoleTeacherInput: new FormControl({value: this.containsRole(this.userModel.rols, 'DOCENTE'), disabled: true}),
      signatureInput: new FormControl({value: (this.userModel.id_firma !== null) ? 'Asociada' : 'No Asociada', disabled: true}),
      signatureInputFile: new FormControl(''),
      doCai: new FormControl({value: this.userModel.realizaCai + '', disabled: (activeRole === 'ADMIN') ? false : true}),
    });
    this.isLoaded = true;
  }

  getItemValue(name: string) {
    return this.user.get(name)?.value;
  }

}
