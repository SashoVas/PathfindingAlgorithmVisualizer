import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ICell } from '../interfaces/ICell';
import { IMazeCell } from '../interfaces/IMazeCell';

@Injectable({
  providedIn: 'root'
})
export class MazeService {
  //1-horizontal,2-vertical
  movesOrder:Array<IMazeCell>=[];
  private holes!:Array<Array<boolean>>;
  private sub!:Subscription;
  constructor() { }
  aplyAlgorithm(board:Array<Array<ICell>>){
    this.sub =interval(40)
    .subscribe(() => { 
      let current=this.movesOrder.shift();
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
    this.holes=Array.from({length: board.length}, () => Array.from({length: board[0].length}, ()=>false));
    this.recursion(board,0,board[0].length-1,0,board.length-1);
  }
  private recursion(board:Array<Array<ICell>>,wStart:number,wEnd:number,hStart:number,hEnd:number){
    let widthOutOfRange:boolean=false;
    let heighthOutOfRange:boolean=false;
    if(wEnd-wStart<=2){
      widthOutOfRange=true;
    }
    if(hEnd-hStart<=2){
      if(widthOutOfRange)return;
      heighthOutOfRange=true;
    }
    if(wEnd-wStart>hEnd-hStart &&wEnd-wStart>2){
      let wallW=Math.floor(Math.random() * ((wEnd - wStart)-2) + wStart+1);
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
        let wallHole=Math.floor(Math.random() * (hEnd - hStart) + hStart);
        cellToAdd.firstHole=wallHole;
        this.holes[wallHole][wallW]=true;
      }
      this.movesOrder.push(cellToAdd);
      this.recursion(board,wStart,wallW-1,hStart,hEnd);
      this.recursion(board,wallW+1,wEnd,hStart,hEnd);
    }
    else if(wEnd-wStart<=hEnd-hStart&&hEnd-hStart>2){
      let wallH=Math.floor(Math.random() * ((hEnd - hStart)-2) + hStart+1);
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
        let wallHole=Math.floor(Math.random() * (wEnd - wStart) + wStart);
        cellToAdd.firstHole=wallHole;
        this.holes[wallH][wallHole]=true;
      }
      this.movesOrder.push(cellToAdd);
      this.recursion(board,wStart,wEnd,hStart,wallH-1);
      this.recursion(board,wStart,wEnd,wallH+1,hEnd);
    }
  }
}
