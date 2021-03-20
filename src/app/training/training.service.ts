import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Exercise } from './excercise.model';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  public exerciseChanged = new Subject<Exercise>();
  public exercisesChanged = new Subject<Exercise[]>();
  public pastExercisesChanged = new Subject<Exercise[]>();
  private finishedExercises: Exercise[] = [];
  private subscriptions : Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService
  ) {
  }

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.subscriptions.push(this.db.collection('/availableExercises')
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
        this.uiService.loadingStateChanged.next(false);
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('Fetching exercises failed, please try again', null, 3000);
        this.exercisesChanged.next(null);
     }));
  }

  fetchCompletedOrCancelledExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.subscriptions.push(this.db.collection('/finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.uiService.loadingStateChanged.next(false);
        this.finishedExercises = exercises;
        this.pastExercisesChanged.next([...this.finishedExercises]);
      }, error => {
        this.uiService.loadingStateChanged.next(false);
         this.uiService.showSnackbar('Fetching past exercises failed, please try again', null, 3000)
      }));
  }

  cancelSubscriptions() {
    this.subscriptions.forEach(s => s.unsubscribe());
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
