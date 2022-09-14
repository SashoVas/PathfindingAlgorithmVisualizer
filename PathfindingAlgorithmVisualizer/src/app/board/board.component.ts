import { Component, Input, OnInit } from '@angular/core';
import { ICell } from '../interfaces/ICell';
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
  board:Array<Array<ICell>>=Array.from({length: 20}, () => Array.from({length: 20}, ()=>{return{value:0,state:0}}));
  slideMode:boolean=false;
  startPos:Array<Array<number>>=[];
  buttonTitle:string="Visualize";
  buttonColor:string="btn-primary";
  constructor(private algorithmService:AlgorithmsService){  }

  ngOnInit(): void {
    this.algorithmService.getButtonTitleSubject().subscribe((buttonInfo)=>{
      this.buttonTitle=buttonInfo[0];
      this.buttonColor=buttonInfo[1];
    });
  }

   getAlgorithmName(){
    if (this.algorithm==0){
      return "BFS";
    }
    if(this.algorithm==1){
      return "DFS";
    }
    return "None"
  }

  trackByFn(row:number,col:number){
    return row.toString()+col.toString();
  }
  mouseDown(row:number,col:number){
    if((this.mode==2||this.mode==0)&&this.mode!=this.board[row][col].state){
      this.slideMode=true;
      this.board[row][col]={value:this.board[row][col].value,state:this.mode};
    }
  }
  addWall(row:number,col:number){
    if(this.slideMode && this.board[row][col].state!=this.mode){
      //this.board[row][col].state=this.mode;
      this.board[row][col]={value:this.board[row][col].value,state:this.mode};
    }
  }
  mouseUp(){
    this.slideMode=false;
    console.log('up')
  }
  cellClicked(row:number,col:number){
    //this.board[row][col].state=this.mode;
    if(this.mode!=this.board[row][col].state){
       if(this.mode==3){
        this.startPos.push([row,col]);
      }
      this.board[row][col]={value:this.board[row][col].value,state:this.mode};
    }
  }
  visualize(){
    if(this.algorithm==0){
      this.algorithmService.breadFirstSearch(this.board,this.startPos);
    }
    else if(this.algorithm==1){
      this.algorithmService.depthFirstSearch(this.board,this.startPos);
    }
    this.algorithmService.applyAlgorithm(this.board);
  }
  clear(){
    this.board=Array.from({length: 20}, () => Array.from({length: 20}, ()=>{return{value:0,state:0}}));
    this.startPos=[];
  }
}
