import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { StudentsIndexComponent } from './students/students-index/students-index.component';
import { StudentFormComponent } from './students/student-form/student-form.component';
import { SharedModule } from '../shared/shared.module';


//ANGULAR MATERIAL
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    HomeComponent,
    StudentsIndexComponent,
    StudentFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class PagesModule { }
