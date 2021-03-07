import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Exercise } from './excercise.model';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  ongoiningTraining = false;
  exerciseSubscription : Subscription

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe((exercise) => {
      this.ongoiningTraining = !!(exercise);
    });
    
  }

  onTrainingStart() {
    this.ongoiningTraining = true;
  }

}
