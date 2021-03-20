import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-stop-training',
  template: `
    <h1 mat-dialog-title>
        Are you sure?
    </h1>
    <div matDialogContent>
        <p>You already got {{ passedData.progress }}%</p>
    </div>
    <div MatDialogActions>
        <button mat-button matDialogClose="true">Yes</button>
        <button mat-button matDialogClose="false">No</button>
    </div>
    `,
})
export class StopTrainingComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public passedData: any
    ) {}
}