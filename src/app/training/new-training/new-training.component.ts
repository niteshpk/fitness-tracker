import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../excercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
 exercises: Exercise[] = [];

  constructor(private trianingService: TrainingService) { }

  ngOnInit(): void {
    this.exercises = this.trianingService.getAvailableExcercise();
  }

  onStartTraining(form: NgForm) {
    this.trianingService.startExercise(form.value.exercise);
  }
}
