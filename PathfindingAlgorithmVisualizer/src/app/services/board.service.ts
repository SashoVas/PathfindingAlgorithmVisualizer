import { Injectable } from '@angular/core';
import { ICell } from '../interfaces/ICell';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor() { }
  clearBoard(board:Array<Array<ICell>>,defaultValue:number){
    for(let row=0;row<board.length;row++){
      for(let col=0;col<board[0].length;col++){
        board[row][col]={value:defaultValue,state:0};
      }
    }
  }
  clearPaths(board:Array<Array<ICell>>){
    for(let row=0;row<board.length;row++){
      for(let col=0;col<board[0].length;col++){
        if(board[row][col].state==1||board[row][col].state==5){
          board[row][col]={value:board[row][col].value,state:0};
        }
      }
    }
  }
  fillWalls(board:Array<Array<ICell>>,defaultValue:number){
    for(let row=0;row<board.length;row++){
      for(let col=0;col<board[0].length;col++){
        board[row][col].value=defaultValue;
        board[row][col].state=2;
      }
    }
  }
}
