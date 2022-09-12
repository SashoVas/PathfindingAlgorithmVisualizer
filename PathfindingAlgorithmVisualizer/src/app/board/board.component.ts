import { Component, OnInit } from '@angular/core';
import { AlgorithmsService } from '../services/algorithms.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  //0-nothing,1-visited,2-wall,3-start,4-end,5-finalPath
  board:Array<Array<number>>=Array.from({length: 20}, () => Array.from({length: 20}, () => 0));
  slideMode:boolean=false;
  startPos:Array<Array<number>>=[];
  mode:number=1;
  constructor(private algorithmService:AlgorithmsService){  }
  mouseDown(row:number,col:number){
    if(this.mode==2||this.mode==0){
      this.slideMode=true;
      this.board[row][col]=this.mode;
    }
   
  }
  addWall(row:number,col:number){
    if(this.slideMode){
      this.board[row][col]=this.mode;
    }
  }
  mouseUp(){
    this.slideMode=false;
  }
  cellClicked(row:number,col:number){
    this.board[row][col]=this.mode;
    if(this.mode==3){
      this.startPos.push([row,col]);
    }
  }
  BFS(){
    this.algorithmService.breadFirstSearch(this.board,this.startPos);
    this.algorithmService.applyAlgorithm(this.board);
  }
  clear(){
    this.board=Array.from({length: 20}, () => Array.from({length: 20}, () => 0));
    this.startPos=[];
  }
}
