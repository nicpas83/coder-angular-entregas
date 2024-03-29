import { selectCourseState } from './../store/course.selectors';
import { DialogAlertComponent } from './../../../shared/components/dialog-alert/dialog-alert.component';
import { InscriptionsService } from './../../../services/inscriptions.service';
import { Inscriptions } from './../../../interfaces/student.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CourseFormComponent } from './../course-form/course-form.component';

// MATERIAL
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

import { debounceTime, distinctUntilChanged, fromEvent, Subject } from 'rxjs';
import { Course } from 'src/app/interfaces/courses.interface';
import { CoursesService } from 'src/app/services/courses.service';

import { Store } from '@ngrx/store';
import { loadCourses } from '../store/course.actions';

@Component({
  selector: 'app-courses-index',
  templateUrl: './courses-index.component.html',
  styleUrls: ['./courses-index.component.css'],
})
export class CoursesIndexComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'teacher',
    'class_duration',
    'number_classes',
    'count_inscriptions',
    'actions',
  ];
  dataSource = new MatTableDataSource<Course>();

  //observable para buscador de cursos
  search$ = new Subject<string>();
  searchText!: string;

  constructor(
    private coursesService: CoursesService,
    private inscriptionsService: InscriptionsService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    // this.getAllCourses();  ANTES DE APLICAR REDUX.

    this.store.dispatch(loadCourses())

    this.store.select(selectCourseState).subscribe(courses => {
      this.dataSource.data = courses.data
    })

    //me subscribo al observable para realizar el filtrado del listado.
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchText) => {
        this.dataSource.filter = searchText.trim().toLowerCase();
      });
  }

  ngOnDestroy(): void {
    this.search$.unsubscribe();
  }

  // ANTES DE APLICAR REDUX
  // getAllCourses() {
  //   this.coursesService.getAll().subscribe({
  //     next: (resp: Course[]) => {
  //       this.dataSource.data = resp;
  //     },
  //     error: (err) => console.log(err),
  //   });
  // }

  openDialogCourseForm(id?: number) {
    let title = id ? 'Editar curso' : 'Agregar curso';
    const dialogRef = this.dialog.open(CourseFormComponent, {
      data: {
        title: title,
        course_id: id,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (id) {
        this.coursesService
          .update(id, data)
          .subscribe(() => this.store.dispatch(loadCourses()));
      } else {
        if (data)
          this.coursesService
            .create(data)
            .subscribe(() => this.store.dispatch(loadCourses()));
      }
    });
  }

  deleteCourse(id: number) {
    //validar que no tenga inscripciones previas
    this.inscriptionsService.getInscriptionsByCourseId(id).subscribe((data) => {
      if (data.length > 0) {
        this.dialog.open(DialogAlertComponent, {
          data: {
            message:
              'No puedes eliminar el curso porque ya tiene inscripciones',
          },
        });
      } else {
        this.coursesService
          .delete(id)
          .subscribe(() => this.store.dispatch(loadCourses()));
      }
    });
  }
}
