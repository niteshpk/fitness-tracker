import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { Exercise } from '../excercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource: any = new MatTableDataSource<Exercise>();
  exerciseSubscription: Subscription;
  isLoading = false;
  private loadingSubs: Subscription;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
    ) { }
  
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;    
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {  
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.exerciseSubscription = this.trainingService.pastExercisesChanged.subscribe(
      (exercises) => {
        this.dataSource = new MatTableDataSource<Exercise>(exercises);
        this.dataSource.sort = this.sort;    
        this.dataSource.paginator = this.paginator;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    );
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  doFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLocaleLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
}
