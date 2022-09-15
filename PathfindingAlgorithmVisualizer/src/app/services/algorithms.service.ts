import { Injectable } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { ICell } from '../interfaces/ICell';
import { INode } from '../interfaces/INode';

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
  applyAlgorithm(board:Array<Array<ICell>>){
    this.buttonTitleSubject?.next(["Visualizing","btn-danger"]);
    let last=this.movesStack[this.movesStack.length-1];
    this.sub =interval(50)
    .subscribe(() => { 
      if(this.movesStack.length<=0){
        if(this.parents[last.toString()])
        {
          this.buttonTitleSubject?.next(["Drawing path with","btn-warning"]);
          board[last[0]][last[1]]={value:board[last[0]][last[1]].value,state:4};
          let sub2=interval(100).subscribe(()=>{
            last=this.parents[last.toString()];
            if (last==undefined){
              sub2.unsubscribe();
              this.buttonTitleSubject?.next(["Visualize","btn-primary"]);
              this.parents={};
            }
            else{
              board[last[0]][last[1]]={value:board[last[0]][last[1]].value,state:5};
            }
          })
        }
        else{
          this.buttonTitleSubject?.next(["Visualize","btn-primary"]);
        }
        this.sub.unsubscribe();
        this.movesStack=[];
      }
      else{
        let current=this.movesStack.shift();
        let row=current![0];
        let col=current![1];
        board[row][col]={value:board[row][col].value,state:1};
      }
    });
  }
  breadFirstSearch(board:Array<Array<ICell>>,stack:Array<Array<number>>){
    let set = new Set<string>();
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
      if(board[row][col].state==0){
        stack.push([row-1,col]);
        if(!set.has([row-1,col].toString())) this.parents[[row-1,col].toString()]=current;
        stack.push([row,col+1]);
        if(!set.has([row,col+1].toString())) this.parents[[row,col+1].toString()]=current;
        stack.push([row+1,col]);
        if(!set.has([row+1,col].toString())) this.parents[[row+1,col].toString()]=current;
        stack.push([row,col-1]);
        if(!set.has([row,col-1].toString())) this.parents[[row,col-1].toString()]=current;
        this.movesStack.push([row,col]);
      }
      else if(board[row][col].state==3){
        stack.push([row-1,col]);
        stack.push([row,col+1]);
        stack.push([row+1,col]);
        stack.push([row,col-1]);
      }
      else if(board[row][col].state==4){
        this.movesStack.push([row,col]);
        return;
      }
    }
    this.parents={};
  }
  depthFirstSearch(board:Array<Array<ICell>>,stack:Array<Array<number>>){
    let set = new Set<string>();
    for(let i=0;i<stack.length;i++){
      let dfsOutput:boolean=this.DFS(board,stack[i],set);
      board[stack[i][0]][stack[i][1]]={value:board[stack[i][0]][stack[i][1]].value,state:3};
      if(dfsOutput){
        return;
      }
    }
    this.parents={};
  }
  private DFS(board:Array<Array<ICell>>,current:Array<number>,set:Set<string>):boolean{
    let row=current[0];
    let col=current[1];
    if(row<0||col<0||row>=board.length||col>=board[0].length)return false;
    if(board[row][col].state==2)return false;
    if(board[row][col].state!=3)this.movesStack.push(current!);
    set.add(current.toString());
    if(board[row][col].state==4){
      return true;
    }
    if(!set.has([row-1,col].toString())){
      if(board[row][col].state!=3)this.parents[[row-1,col].toString()]=current;
      if(this.DFS(board,[row-1,col],set))return true;
    }
    if(!set.has([row,col+1].toString())){
      if(board[row][col].state!=3)this.parents[[row,col+1].toString()]=current;
      if(this.DFS(board,[row,col+1],set))return true;
    }
    if(!set.has([row+1,col].toString())){
      if(board[row][col].state!=3)this.parents[[row+1,col].toString()]=current;
      if(this.DFS(board,[row+1,col],set))return true;
    }
    if(!set.has([row,col-1].toString())){
      if(board[row][col].state!=3)this.parents[[row,col-1].toString()]=current;
      if(this.DFS(board,[row,col-1],set))return true;
    }
    return false;
  }
  dijkstra(board:Array<Array<ICell>>,startPos:Array<Array<number>>){
    //"1,2":[[1,2],5]
    let ds=new Map<string,INode>();
    startPos.forEach((item)=>ds.set(item.toString(),{position:item,value:0}));
    let set = new Set<string>();
    while(ds.size>0){
      let key=this.getMinPos(ds)!;
      if(key==null){
        return;
      }
      let currentPos=ds.get(key);
      let row=currentPos?.position[0]!; 
      let col=currentPos?.position[1]!; 
      ds.delete(key);
      if(set.has(key)){
        continue
      }
      set.add(key);
      if(board[row][col].state==2)continue;
      if(board[row][col].state!=3)this.movesStack.push(currentPos?.position!);
      if(board[row][col].state==4){
        return;
      }
      
      if(board[row][col].state==0||board[row][col].state==3)
      {
        if(row>0 && !set.has([row-1,col].toString())){
          if(!(ds.has([row-1,col].toString())&&ds.get([row-1,col].toString())!.value<currentPos?.value!+board[row-1][col].value)){
            ds.set([row-1,col].toString(),{position:[row-1,col],value:currentPos?.value!+board[row-1][col].value});
            if(board[row][col].state!=3)this.parents[[row-1,col].toString()]=currentPos?.position!;
          }
        }
        if(col<board[0].length-1 && !set.has([row,col+1].toString())){
          if(!(ds.has([row,col+1].toString())&&ds.get([row,col+1].toString())!.value<currentPos?.value!+board[row][col+1].value)){
            ds.set([row,col+1].toString(),{position:[row,col+1],value:currentPos?.value!+board[row][col+1].value});
            if(board[row][col].state!=3)this.parents[[row,col+1].toString()]=currentPos?.position!;
          }
        }
        if(row<board.length-1 && !set.has([row+1,col].toString())){
          if(!(ds.has([row+1,col].toString())&&ds.get([row+1,col].toString())!.value<currentPos?.value!+board[row+1][col].value)){
            ds.set([row+1,col].toString(),{position:[row+1,col],value:currentPos?.value!+board[row+1][col].value});
            if(board[row][col].state!=3)this.parents[[row+1,col].toString()]=currentPos?.position!;
          }
        }
        if(col>0 && !set.has([row,col-1].toString())){
          if(!(ds.has([row,col-1].toString())&&ds.get([row,col-1].toString())!.value<currentPos?.value!+board[row][col-1].value)){
            ds.set([row,col-1].toString(),{position:[row,col-1],value:currentPos?.value!+board[row][col-1].value})
            if(board[row][col].state!=3)this.parents[[row,col-1].toString()]=currentPos?.position!;            
          }
        }
      }
    }
    this.parents={};
  }
  private getMinPos(ds:Map<string,INode>):string|null{
    let minVal:number=Infinity;
    let result:string|null=null;
    ds.forEach((value,key)=>{
      if(value.value<minVal){
        minVal=value.value;
        result=key;
      }
    })
    return result;
  }
}
