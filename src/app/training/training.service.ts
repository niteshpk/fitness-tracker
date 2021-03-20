import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Exercise } from './excercise.model';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  public exerciseChanged = new Subject<Exercise>();
  public exercisesChanged = new Subject<Exercise[]>();
  public pastExercisesChanged = new Subject<Exercise[]>();
  private finishedExercises: Exercise[] = [];

  constructor(
    private db: AngularFirestore
  ) {
    // this.fetchFinishedExercises();
  }

  fetchAvailableExercises() {
    this.db.collection('/availableExercises')
      .snapshotChanges()
      .pipe(
        map((docArray: any) => {
          return docArray.map( d => {
            const doc = d.payload.doc.data();
            return {
              id: d.payload.doc.id,
              ...doc
            }
          })
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.db.collection('/finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercises = exercises;
        this.pastExercisesChanged.next([...this.finishedExercises]);
      });
  }

  getAvailableExcercise() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise, 
      date: new Date(), 
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise, 
      duration: this.runningExercise.duration * (progress/ 100),
      calories: this.runningExercise.calories * (progress/ 100),
      date: new Date(), 
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('/finishedExercises')
    .add(exercise);
    //this.exercises.push(exercise);
  }
}
