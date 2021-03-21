import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Exercise } from './excercise.model';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
  private subscriptions : Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
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
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching exercises failed, please try again', null, 3000);
     }));
  }

  fetchCompletedOrCancelledExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.subscriptions.push(this.db.collection('/finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
         this.uiService.showSnackbar('Fetching past exercises failed, please try again', null, 3000)
      }));
  }

  cancelSubscriptions() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining)
    .pipe(take(1))
    .subscribe((exercise) => {
      this.addDataToDatabase({
        ...exercise, 
        date: new Date(), 
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining)
    .pipe(take(1))
    .subscribe((exercise) => {
      this.addDataToDatabase({
        ...exercise, 
        duration: exercise.duration * (progress/ 100),
        calories: exercise.calories * (progress/ 100),
        date: new Date(), 
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('/finishedExercises')
    .add(exercise);
  }
}
