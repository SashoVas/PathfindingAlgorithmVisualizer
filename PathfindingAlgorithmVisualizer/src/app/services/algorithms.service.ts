import { Injectable } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmsService {

  private movesStack:Array<Array<number>>=[];
  private parents:any={};
  private sub!:Subscription;
  private buttonTitleSubject:Subject<Array<string>>=new Subject<Array<string>>();;
  constructor() { }

  getButtonTitleSubject():Subject<Array<string>>{
    return this.buttonTitleSubject!;
  }
  applyAlgorithm(board:Array<Array<number>>){
    this.buttonTitleSubject?.next(["Visualizing","btn-danger"]);
    let last=this.movesStack[this.movesStack.length-1];
    this.sub =interval(20)
    .subscribe(() => { 
      if(this.movesStack.length<=0){
        if(this.parents[last.toString()])
        {
          this.buttonTitleSubject?.next(["Drawing path with","btn-warning"]);
          board[last[0]][last[1]]=4;
          let sub2=interval(100).subscribe(()=>{
            last=this.parents[last.toString()];
            if (last==undefined){
              sub2.unsubscribe();
              this.buttonTitleSubject?.next(["Visualize","btn-primary"]);
              this.parents={};
            }
            else{
              board[last[0]][last[1]]=5;
            }
          })
        }
        this.sub.unsubscribe();
        this.movesStack=[];
      }
      else{
        let current=this.movesStack.shift();
        let row=current![0];
        let col=current![1];
        board[row][col]=1;
      }
    });
  }
  breadFirstSearch(board:Array<Array<number>>,stack:Array<Array<number>>){
    let set = new Set();
    while(stack.length>0)
    {
      let current=stack.shift();
      let row=current![0];
      let col=current![1];
      if(set.has(current!.toString())){
        continue;
      }
      set.add(current!.toString());
      if(row<0||col<0||row>=board.length||col>=board[0].length){
        continue;
      }
      if(board[row][col]==0){
        stack.push([row-1,col]);
        if(!set.has([row-1,col].toString())) this.parents[[row-1,col].toString()]=current;
        stack.push([row,col+1]);
        if(!set.has([row,col+1].toString())) this.parents[[row,col+1].toString()]=current;
        stack.push([row+1,col]);
        if(!set.has([row+1,col].toString())) this.parents[[row+1,col].toString()]=current;
        stack.push([row,col-1]);
        if(!set.has([row,col-1].toString())) this.parents[[row,col-1].toString()]=current;
        this.movesStack.push(current!);
      }
      else if(board[row][col]==3){
        stack.push([row-1,col]);
        stack.push([row,col+1]);
        stack.push([row+1,col]);
        stack.push([row,col-1]);
      }
      else if(board[row][col]==4){
        this.movesStack.push(current!);
        return;
      }
    }
    this.parents={};
  }
}
