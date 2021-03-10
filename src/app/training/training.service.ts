import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Exercise } from './excercise.model';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 1, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 2, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 3, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 4, calories: 4 },
  ];
  private runningExercise: Exercise;
  public exerciseChanged = new Subject<Exercise>();
  private exercises: Exercise[] = [];

  constructor() {}

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
    this.exercises.push({
      ...this.runningExercise, 
      date: new Date(), 
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise, 
      duration: this.runningExercise.duration * (progress/ 100),
      calories: this.runningExercise.calories * (progress/ 100),
      date: new Date(), 
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getPastExercises() {
    return this.exercises.slice();
  }
}
