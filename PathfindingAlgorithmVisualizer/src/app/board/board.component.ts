import { Component, Input, OnInit } from '@angular/core';
import { ICell } from '../interfaces/ICell';
import { AlgorithmsService } from '../services/algorithms.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  //0-nothing,1-visited,2-wall,3-start,4-end,5-finalPath,6-bomb
  @Input()mode:number=0;
  @Input()algorithm:number=0;
  value:number=5;
  defaultValue:number=1;
  board:Array<Array<ICell>>=Array.from({length: 20}, () => Array.from({length: 20}, ()=>{return{value:this.defaultValue,state:0}}));
  slideMode:boolean=false;
  startPos:Array<number>=[];
  buttonTitle:string="Visualize";
  buttonColor:string="btn-primary";
  boardState:number=0;
  endPos:Array<number>=[];
  constructor(private algorithmService:AlgorithmsService){  }

  ngOnInit(): void {
    this.algorithmService.getButtonTitleSubject().subscribe((buttonInfo)=>{
      this.buttonTitle=buttonInfo.buttonName;
      this.buttonColor=buttonInfo.buttonStyle;
      this.boardState=buttonInfo.boardState;
    });
  }

   getAlgorithmName(){
    if (this.algorithm==0){
      return "BFS";
    }
    if(this.algorithm==1){
      return "DFS";
    }
    if(this.algorithm==2){
      return "Dijkstra";
    }
    if(this.algorithm==3){
      return "A*";
    }
    return "None"
  }
  mouseDown(row:number,col:number){
    this.slideMode=true;
    this.mouseDownWhenBoardIsClear(row,col);
  }
  private mouseDownWhenBoardIsClear(row:number,col:number){
    if(this.mode==6 && this.board[row][col].value!=this.value){
      this.slideMode=true;
      this.board[row][col]={value:this.value,state:0};
    }
    else if((this.mode==2||this.mode==0)&&this.mode!=this.board[row][col].state){
      this.slideMode=true;
      this.board[row][col]={value:this.defaultValue,state:this.mode};
    }
    else if((this.mode==3||this.mode==4)&&this.mode!=this.board[row][col].state  ){
      if(this.mode==3){
        if(this.startPos.length>0){
          this.board[this.startPos![0]][this.startPos![1]]={value:this.defaultValue,state:0};
        }
        this.startPos=[row,col];
      }
      else {
        if(this.endPos.length>0){
          this.board[this.endPos![0]][this.endPos![1]]={value:this.defaultValue,state:0};
        }
        this.endPos=[row,col];
      }
     this.board[row][col]={value:this.defaultValue,state:this.mode};
    }
    else if(this.mode==0&&this.mode==this.board[row][col].state&&this.board[row][col].value==this.value){
      this.board[row][col]={value:this.defaultValue,state:this.mode};
      this.slideMode=true;
   }
  }
  clearPaths(){
    for(let row=0;row<this.board.length;row++){
      for(let col=0;col<this.board[0].length;col++){
        if(this.board[row][col].state==1||this.board[row][col].state==5){
          this.board[row][col]={value:this.board[row][col].value,state:0};
        }
      }
    }
    this.boardState=0;
    this.algorithmService.clear();
  }
  mouseHover(row:number,col:number){
    if(this.boardState==0){
      this.mouseHoverWhenBoardIsClear(row,col);
    }
    else if(this.boardState==3){
      this.mouseHoverWhneAlgorithmWasVisualized(row,col);
    }
  }
  private mouseHoverWhneAlgorithmWasVisualized(row:number,col:number){
    if(this.mode==4 && this.slideMode && this.board[row][col].state!=4){
      this.board[this.endPos![0]][this.endPos![1]]={value:this.defaultValue,state:0};
      this.endPos=[row,col];
      this.board[row][col]={value:this.defaultValue,state:this.mode};
      this.algorithmService.clearPaths(this.board);
      this.visualize();
      this.board[row][col]={value:this.defaultValue,state:this.mode};
      this.board[this.startPos[0]][this.startPos[1]]={value:this.defaultValue,state:3};
    }
    else if(this.mode==3 && this.slideMode && this.board[row][col].state!=3){
      this.board[this.startPos![0]][this.startPos![1]]={value:this.defaultValue,state:0};
      this.startPos=[row,col];
      this.board[row][col]={value:this.defaultValue,state:this.mode};
      this.algorithmService.clearPaths(this.board);
      this.visualize();
      this.board[row][col]={value:this.defaultValue,state:this.mode};
      this.board[this.endPos[0]][this.endPos[1]]={value:this.defaultValue,state:4};
    }
    else if(this.mode==0 && this.slideMode && (this.board[row][col].value!=this.defaultValue || this.board[row][col].state!=0)){
      this.board[row][col]={value:this.defaultValue,state:0};
    }
    else if(this.mode==2 && this.slideMode && this.board[row][col].state!=2){
      this.board[row][col]={value:this.defaultValue,state:this.mode};
    }
    else if(this.mode==6 && this.slideMode && this.board[row][col].value==this.defaultValue){
      this.board[row][col]={value:this.value,state:0};
    }
  }
  private mouseHoverWhenBoardIsClear(row:number,col:number){
    if(this.slideMode && this.board[row][col].state!=this.mode){
      if(this.mode==6){
        if(this.board[row][col].value==this.defaultValue)this.board[row][col]={value:this.value,state:0};
      }
      else if(this.mode!=3 && this.mode!=4){
        this.board[row][col]={value:this.defaultValue,state:this.mode};
      }  
    }
    else if(this.slideMode&&this.mode==0&&this.mode==this.board[row][col].state&&this.board[row][col].value==this.value){
      this.board[row][col]={value:this.defaultValue,state:this.mode};
    }
  }
  mouseUp(){
    this.slideMode=false;
  }
  visualize(){
    if(this.startPos.length<=0){
      return;
    }
    if(this.algorithm==0){
      this.algorithmService.breadFirstSearch(this.board,this.startPos);
    }
    else if(this.algorithm==1){
      this.algorithmService.depthFirstSearch(this.board,this.startPos);
    }
    else if(this.algorithm==2){
      this.algorithmService.dijkstra(this.board,this.startPos);
    }
    else if(this.algorithm==3){
      this.algorithmService.AStar(this.board,this.startPos,this.endPos);
    }
    if(this.boardState==0){
      this.algorithmService.applyAlgorithmVisualizationWithAnimations(this.board);
    }
    else{
      this.algorithmService.applyAlgorithmVisualizationWithoutAnimations(this.board,this.endPos);
    }
  }
  clear(){
    this.boardState=0;
    this.board=Array.from({length: 20}, () => Array.from({length: 20}, ()=>{return{value:this.defaultValue,state:0}}));
    this.startPos=[];
    this.endPos=[];
    this.algorithmService.clear();
  }
}
