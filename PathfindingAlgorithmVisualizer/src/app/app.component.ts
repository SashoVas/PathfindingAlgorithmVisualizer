import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PathfindingAlgorithmVisualizer';
  mode:number=0;
  algorithm:number=0;
}
