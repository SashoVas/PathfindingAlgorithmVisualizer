import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ICell } from '../interfaces/ICell';
import { IKruskalAlgorithmCell } from '../interfaces/IKruskalAlgorithmCell';
import { IRandomizedDFSMazeCell } from '../interfaces/IRandomizedDFSMazeCell';
import { IRecursiveDevisionMazeCell } from '../interfaces/IRecursiveDevisionMazeCell';

@Injectable({
  providedIn: 'root'
})
export class MazeService {
  //1-horizontal,2-vertical
  movesOrderRecursiveDevision!:Array<IRecursiveDevisionMazeCell>;
  movesOrderWhenAlgorithmCreatesPath!:Array<IRandomizedDFSMazeCell>;
  private holes!:Array<Array<boolean>>;
  private sub!:Subscription;
  constructor() { }
  visualizeMazeAlgorithm(board:Array<Array<ICell>>,algorithm:number){
    if(algorithm==0){
      this.applyRecursiveDevisionAlgorithm(board);
    }
    else if(algorithm==1){
      this.applyRandomizedDFSAlgorithm(board);
    }
    else if(algorithm==2){
      this.applyRandomizedDFSAlgorithm(board);
    }
  }
  private applyRandomizedDFSAlgorithm(board:Array<Array<ICell>>){
    this.sub =interval(20)
    .subscribe(() => { 
      let current=this.movesOrderWhenAlgorithmCreatesPath.shift();
      if(current==undefined){
        this.sub.unsubscribe();
      }
      else{
        board[current!.cellRow][current!.cellCol].state=0;
      }
      
    });
  }
  private applyRecursiveDevisionAlgorithm(board:Array<Array<ICell>>){
    this.sub =interval(40)
    .subscribe(() => { 
      let current=this.movesOrderRecursiveDevision.shift();
      if(!current){
        this.sub.unsubscribe();
      }
      else if(current!.isHorizontal){
        for(let i=0;i<=current!.wallEnd-current!.wallStart;i++){
          if(i+current!.wallStart==current?.firstHole||i+current!.wallStart==current?.secondHole)continue;
          board[current!.wallStart+i][current!.wallPos]={state:2,value:1}
        }
      }
      else{
        for(let i=0;i<=current!.wallEnd-current!.wallStart;i++){
          if(i+current!.wallStart==current?.firstHole||i+current!.wallStart==current?.secondHole)continue;
          board[current!.wallPos][current!.wallStart+i]={state:2,value:1}
        }
      }
    });
  }
  recursiveDevision(board:Array<Array<ICell>>){
    this.movesOrderRecursiveDevision=[];
    this.holes=Array.from({length: board.length}, () => Array.from({length: board[0].length}, ()=>false));
    this.recursionForRecursiveDevision(board,0,board[0].length-1,0,board.length-1);
  }
  private recursionForRecursiveDevision(board:Array<Array<ICell>>,wStart:number,wEnd:number,hStart:number,hEnd:number){
    if(wEnd-wStart>hEnd-hStart &&wEnd-wStart>=2){
      
      let wallW=Math.round(Math.random() * ((wEnd - wStart)-2) + wStart+1);
      let cellToAdd={wallPos:wallW,
        wallEnd:hEnd,
        wallStart:hStart,
        firstHole:-1,
        secondHole:-1,
        isHorizontal:true}
      let first=false;
      let second=false;
      if(hStart>=1&&this.holes[hStart-1][wallW]){
        cellToAdd.firstHole=hStart;
        first=true;
        this.holes[hStart][wallW]=true;
      }
      if(hEnd+1<board.length&&this.holes[hEnd+1][wallW]){
        cellToAdd.secondHole=hEnd;
        second=true;
        this.holes[hEnd][wallW]=true;
      }
      if(!first && !second){
        let wallHole=Math.round(Math.random() * (hEnd - hStart) + hStart);
        cellToAdd.firstHole=wallHole;
        this.holes[wallHole][wallW]=true;
      }
      this.movesOrderRecursiveDevision.push(cellToAdd);
      this.recursionForRecursiveDevision(board,wStart,wallW-1,hStart,hEnd);
      this.recursionForRecursiveDevision(board,wallW+1,wEnd,hStart,hEnd);
    }
    else if(wEnd-wStart<=hEnd-hStart&&hEnd-hStart>=2){
      let wallH=Math.round(Math.random() * ((hEnd - hStart)-2) + hStart+1);
      let cellToAdd={wallPos:wallH,
        wallEnd:wEnd,
        wallStart:wStart,
        firstHole:-1,
        secondHole:-1,
        isHorizontal:false}
      let first=false;
      let second=false;
      if(wStart>=1&&this.holes[wallH][wStart-1]){
        cellToAdd.firstHole=wStart;
        first=true;
        this.holes[wallH][wStart]=true;
      }
      if(wEnd+1<board[0].length&&this.holes[wallH][wEnd+1]){
        cellToAdd.secondHole=wEnd;
        second=true;
        this.holes[wallH][wEnd]=true;
      }
      if(!first && !second){
        let wallHole=Math.round(Math.random() * (wEnd - wStart) + wStart);
        cellToAdd.firstHole=wallHole;
        this.holes[wallH][wallHole]=true;
      }
      this.movesOrderRecursiveDevision.push(cellToAdd);
      this.recursionForRecursiveDevision(board,wStart,wEnd,hStart,wallH-1);
      this.recursionForRecursiveDevision(board,wStart,wEnd,wallH+1,hEnd);
    }
  }
  randomizedDFS(board:Array<Array<ICell>>){
    this.movesOrderWhenAlgorithmCreatesPath=[];
    this.holes=Array.from({length: board.length}, () => Array.from({length: board[0].length}, ()=>true));
    let row=Math.floor((Math.random()*board.length)/2)*2;
    let col=Math.floor((Math.random()*board[0].length)/2)*2;
    this.randomizedDFSRecursion(board,row,col);
  }
  private randomizedDFSRecursion(board:Array<Array<ICell>>,cellRow:number,cellCol:number){
    this.holes[cellRow][cellCol]=false;
    this.movesOrderWhenAlgorithmCreatesPath.push({cellRow:cellRow,
      cellCol:cellCol});
    let visitingOrder:Array<Array<number>>=[[2,0,1,0],[0,2,0,1],[-2,0,-1,0],[0,-2,0,-1]];
    while(visitingOrder.length>0){
      let currentPos=Math.round(Math.random()*(visitingOrder.length-1));
      let current=visitingOrder[currentPos];
      visitingOrder[currentPos]=visitingOrder[visitingOrder.length-1];
      visitingOrder.pop();
      if(cellRow+current[0]<0||cellRow+current[0]>board.length-1||cellCol+current[1]<0||cellCol+current[1]>board[0].length-1||!this.holes[cellRow+current[0]][cellCol+current[1]]){
        continue;
      }
      this.holes[cellRow+current[2]][cellCol+current[3]]=false;
      this.movesOrderWhenAlgorithmCreatesPath.push({cellRow:cellRow+current[2],
        cellCol:cellCol+current[3]});
      this.randomizedDFSRecursion(board,cellRow+current[0],cellCol+current[1]);
    }

  }
  private kruskalFind(parents:Map<string,Array<number>>,current:Array<number>,valueToAsign:Array<number>):boolean{
    while(parents.get(current.toString())){
      current=parents.get(current.toString())!;
      if(current.toString()==valueToAsign.toString()){
        return false;
      }
    }
    while(parents.get(valueToAsign.toString())){
      valueToAsign=parents.get(valueToAsign.toString())!;
      if(current.toString()==valueToAsign.toString()){
        return false;
      }
    }
    parents.set(current.toString(),valueToAsign);
    return true;
  }
  kruskal(board:Array<Array<ICell>>){
    this.movesOrderWhenAlgorithmCreatesPath=[];
    let edges:Array<IKruskalAlgorithmCell>=[];
    let parents:Map<string,Array<number>>=new  Map();
    this.holes=Array.from({length: board.length}, () => Array.from({length: board[0].length}, ()=>false));
    for(let i=0;i<board.length-2;i+=2){
      for(let j=0;j<board[0].length-2;j+=2){
        edges.push({
          firstCellRow:i,
          firstCellCol:j,
          secondCellRow:i+2,
          secondCellCol:j,
          wallCellRow:i+1,
          wallCellCol:j,
        });
        edges.push({
          firstCellRow:i,
          firstCellCol:j,
          secondCellRow:i,
          secondCellCol:j+2,
          wallCellRow:i,
          wallCellCol:j+1,
        });
      }
    }
    for(let i=0;i<board[0].length-2;i+=2){
      edges.push({
        firstCellRow:board.length-1,
        firstCellCol:i,
        secondCellRow:board.length-1,
        secondCellCol:i+2,
        wallCellRow:board.length-1,
        wallCellCol:i+1,
      });
    }
    for(let i=0;i<board.length-2;i+=2){
      edges.push({
        firstCellRow:i,
        firstCellCol:board[0].length-1,
        secondCellRow:i+2,
        secondCellCol:board[0].length-1,
        wallCellRow:i+1,
        wallCellCol:board[0].length-1,
      });
    }
    while(edges.length>0){
      let currentPos=Math.round(Math.random()*(edges.length-1));
      let current=edges[currentPos];
      edges[currentPos]=edges[edges.length-1];
      edges.pop();
      if(this.holes[current.firstCellRow][current.firstCellCol]&&this.holes[current.secondCellRow][current.secondCellCol]){
        if(this.kruskalFind(parents,[current.firstCellRow,current.firstCellCol],[current.secondCellRow,current.secondCellCol])){
          this.movesOrderWhenAlgorithmCreatesPath.push({cellRow:current.wallCellRow,
            cellCol:current.wallCellCol});
        }
        continue;
      }
      this.movesOrderWhenAlgorithmCreatesPath.push({cellRow:current.firstCellRow,
        cellCol:current.firstCellCol});
      this.movesOrderWhenAlgorithmCreatesPath.push({cellRow:current.secondCellRow,
        cellCol:current.secondCellCol});
      this.movesOrderWhenAlgorithmCreatesPath.push({cellRow:current.wallCellRow,
        cellCol:current.wallCellCol});
      if(parents.has([current.firstCellRow,current.firstCellCol].toString())){
        parents.set([current.secondCellRow,current.secondCellCol].toString(),[current.firstCellRow,current.firstCellCol]);
      }
      else{
        parents.set([current.firstCellRow,current.firstCellCol].toString(),[current.secondCellRow,current.secondCellCol]);
      }
      
      this.holes[current.firstCellRow][current.firstCellCol]=true;
      this.holes[current.secondCellRow][current.secondCellCol]=true;
      this.holes[current.wallCellRow][current.wallCellCol]=true;
    }
  }
}
