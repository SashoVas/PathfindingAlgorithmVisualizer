import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PathfindingAlgorithmVisualizer';
  mode:number=0;
  algorithm:number=0;
  @ViewChild("board")board!:BoardComponent;
  
}
