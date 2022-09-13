import { Component, Input, OnInit } from '@angular/core';
import { AlgorithmsService } from '../services/algorithms.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  //0-nothing,1-visited,2-wall,3-start,4-end,5-finalPath
  @Input()mode:number=0;
  @Input()algorithm:number=0;
  board:Array<Array<number>>=Array.from({length: 20}, () => Array.from({length: 20}, () => 0));
  slideMode:boolean=false;
  startPos:Array<Array<number>>=[];
  buttonTitle:string="Visualize BFS";
  buttonColor:string="btn-primary";
  constructor(private algorithmService:AlgorithmsService){  }

  ngOnInit(): void {
    this.algorithmService.getButtonTitleSubject().subscribe((buttonInfo)=>{
      this.buttonTitle=buttonInfo[0]+' '+this.getAlgorithmName();
      this.buttonColor=buttonInfo[1];
    });
  }

  private getAlgorithmName(){
    if (this.algorithm==0){
      return "BFS";
    }
    return "None"
  }

  trackByFn(row:number,col:number){
    return row.toString()+col.toString();
  }
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
    if(this.algorithm==0){
      this.algorithmService.breadFirstSearch(this.board,this.startPos);
    }
    
    this.algorithmService.applyAlgorithm(this.board);
  }
  clear(){
    this.board=Array.from({length: 20}, () => Array.from({length: 20}, () => 0));
    this.startPos=[];
  }
}
