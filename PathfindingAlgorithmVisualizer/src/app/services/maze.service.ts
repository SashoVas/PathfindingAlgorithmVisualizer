import { Injectable } from '@angular/core';
import { ICell } from '../interfaces/ICell';

@Injectable({
  providedIn: 'root'
})
export class MazeService {
  //1-horizontal,2-vertical
  constructor() { }
  recursiveDevision(board:Array<Array<ICell>>){
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
      for(let i=0;i<=hEnd-hStart;i++){
        board[hStart+i][wallW].state=2;
      }
      let first=false;
      let second=false;
      if(hStart>=1&&board[hStart-1][wallW].state==0){
        board[hStart][wallW].state=0;
        first=true;
      }
      if(hEnd+1<board.length&&board[hEnd+1][wallW].state==0){
        board[hEnd][wallW].state=0;
        second=true;
      }
      if(!first && !second){
        let wallHole=Math.floor(Math.random() * (hEnd - hStart) + hStart);
        board[wallHole][wallW].state=0;
      }
      this.recursion(board,wStart,wallW-1,hStart,hEnd);
      this.recursion(board,wallW+1,wEnd,hStart,hEnd);
    }
    else if(wEnd-wStart<=hEnd-hStart&&hEnd-hStart>2){
      let wallH=Math.floor(Math.random() * ((hEnd - hStart)-2) + hStart+1);
      for(let i=0;i<=wEnd-wStart;i++){
        board[wallH][wStart+i].state=2;
      }
      let first=false;
      let second=false;
      if(wStart>=1&&board[wallH][wStart-1].state==0){
        board[wallH][wStart].state=0;
        first=true;
      }
      if(wEnd+1<board[0].length&&board[wallH][wEnd+1].state==0){
        console.log('yes')
        board[wallH][wEnd].state=0;
        second=true;
      }
      if(!first && !second){
        let wallHole=Math.floor(Math.random() * (wEnd - wStart) + wStart);
        board[wallH][wallHole].state=0;
      }
      
      this.recursion(board,wStart,wEnd,hStart,wallH-1);
      this.recursion(board,wStart,wEnd,wallH+1,hEnd);
    }
  }
}
