import { Injectable } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { IBoardModeChange } from '../interfaces/IBoardModeChange';
import { ICell } from '../interfaces/ICell';
import { INode } from '../interfaces/INode';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmsService {

  private movesStack:Array<Array<number>>=[];
  private parents:any={};
  private sub!:Subscription;
  private buttonTitleSubject:Subject<IBoardModeChange>=new Subject<IBoardModeChange>();
  constructor() { }

  getButtonTitleSubject():Subject<IBoardModeChange>{
    return this.buttonTitleSubject!;
  }
  clear(){
    this.parents={};
    this.movesStack=[];
  }
  clearPaths(board:Array<Array<ICell>>){
    for(let i=0;i<this.movesStack.length;i++){
      let row=this.movesStack[i][0];
      let col=this.movesStack[i][1];
      board[row][col].state=0;
    }
  }
  applyAlgorithmVisualizationWithoutAnimations(board:Array<Array<ICell>>,target:Array<number>){
    let found:boolean=false;
    for(let i=0;i<this.movesStack.length;i++){
      let row=this.movesStack[i][0];
      let col=this.movesStack[i][1];
      if(row==target[0]&&col==target[1]){
        found=true;
      }
      if(found){
        board[row][col].state=0;
      }
      else if(board[row][col].state!=1){
        board[row][col].state=1;
      }
    }
  }
  applyAlgorithmVisualizationWithAnimations(board:Array<Array<ICell>>){
    let movesStackCopy=[...this.movesStack];
    this.buttonTitleSubject?.next({buttonName:"Visualizing",buttonStyle:"btn-danger",boardState:1});
    let last=movesStackCopy[movesStackCopy.length-1];
    this.sub =interval(20)
    .subscribe(() => { 
      if(movesStackCopy.length<=0){
        if(this.parents[last.toString()])
        {
          this.buttonTitleSubject?.next({buttonName:"Drawing path with",buttonStyle:"btn-warning",boardState:2});
          //board[last[0]][last[1]].state=4;
          board[last[0]][last[1]]={state:4,value:board[last[0]][last[1]].value};
          let sub2=interval(100).subscribe(()=>{
            last=this.parents[last.toString()];
            if (last==undefined){
              sub2.unsubscribe();
              this.buttonTitleSubject?.next({buttonName:"Visualize",buttonStyle:"btn-primary",boardState:3});
              this.parents={};
            }
            else{
              //board[last[0]][last[1]].state=5;
              board[last[0]][last[1]]={state:5,value:board[last[0]][last[1]].value};
            }
          })
        }
        else{
          this.buttonTitleSubject?.next({buttonName:"Visualize",buttonStyle:"btn-primary",boardState:3});
        }
        this.sub.unsubscribe();
        movesStackCopy=[];
      }
      else{
        let current=movesStackCopy.shift();
        let row=current![0];
        let col=current![1];
        //board[row][col].state=1;
        board[row][col]={state:1,value:board[row][col].value};
      }
    });
    
  }
  breadFirstSearch(board:Array<Array<ICell>>,start:Array<number>){
    this.movesStack=[];
    let used:Array<Array<boolean>>=Array.from({length: board.length}, () => Array.from({length: board[0].length}, ()=>false));
    let stack=[start];
    let currentPos=0;
    while(currentPos<stack.length)
    {
      let current=stack[currentPos];
      currentPos++;      
      let row=current![0];
      let col=current![1];
      if(row<0||row>=board.length||col<0||col>=board[0].length ||used[row][col]){

        continue;
      }
      used[row][col]=true;
      if(board[row][col].state==0 ||board[row][col].state==1||board[row][col].state==5){
        stack.push([row-1,col]);
        if(row>0&& !used[row-1][col]) this.parents[[row-1,col].toString()]=current;
        stack.push([row,col+1]);
        if(col<board[0].length&&!used[row][col+1]) this.parents[[row,col+1].toString()]=current;
        stack.push([row+1,col]);
        if(row<board.length-1&& !used[row+1][col]) this.parents[[row+1,col].toString()]=current;
        stack.push([row,col-1]);
        if(col>0&&!used[row][col-1]) this.parents[[row,col-1].toString()]=current;
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
  depthFirstSearch(board:Array<Array<ICell>>,start:Array<number>){
    this.movesStack=[];
    let set = new Set<string>();
    let dfsOutput:boolean=this.DFS(board,start,set);
    board[start[0]][start[1]].state=3;
    if(dfsOutput){
      return;
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
  dijkstra(board:Array<Array<ICell>>,start:Array<number>){
    //"1,2":[[1,2],5]
    this.movesStack=[];
    let ds=new Map<string,INode>();
    ds.set(start.toString(),{position:start,value:0,AStarDistance:0})
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
            ds.set([row-1,col].toString(),{position:[row-1,col],value:currentPos?.value!+board[row-1][col].value,AStarDistance:0});
            if(board[row][col].state!=3)this.parents[[row-1,col].toString()]=currentPos?.position!;
          }
        }
        if(col<board[0].length-1 && !set.has([row,col+1].toString())){
          if(!(ds.has([row,col+1].toString())&&ds.get([row,col+1].toString())!.value<currentPos?.value!+board[row][col+1].value)){
            ds.set([row,col+1].toString(),{position:[row,col+1],value:currentPos?.value!+board[row][col+1].value,AStarDistance:0});
            if(board[row][col].state!=3)this.parents[[row,col+1].toString()]=currentPos?.position!;
          }
        }
        if(row<board.length-1 && !set.has([row+1,col].toString())){
          if(!(ds.has([row+1,col].toString())&&ds.get([row+1,col].toString())!.value<currentPos?.value!+board[row+1][col].value)){
            ds.set([row+1,col].toString(),{position:[row+1,col],value:currentPos?.value!+board[row+1][col].value,AStarDistance:0});
            if(board[row][col].state!=3)this.parents[[row+1,col].toString()]=currentPos?.position!;
          }
        }
        if(col>0 && !set.has([row,col-1].toString())){
          if(!(ds.has([row,col-1].toString())&&ds.get([row,col-1].toString())!.value<currentPos?.value!+board[row][col-1].value)){
            ds.set([row,col-1].toString(),{position:[row,col-1],value:currentPos?.value!+board[row][col-1].value,AStarDistance:0})
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
      if(value.value<=minVal){
        minVal=value.value;
        result=key;
      }
    })
    return result;
  }
  AStar(board:Array<Array<ICell>>,start:Array<number>,end:Array<number>){
    //"1,2":[[1,2],5]
    this.movesStack=[];
    let ds=new Map<string,INode>();
    ds.set(start.toString(),{position:start,value:0,AStarDistance:0})
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
        let oldDistanceFromEnd=currentPos?.AStarDistance!;
        let currentValue=currentPos?.value!-oldDistanceFromEnd;
        if(row>0 && !set.has([row-1,col].toString())){
          let distanceFromEnd=Math.abs(end[0]-(row-1))+Math.abs(end[1]-col);
          let netxCellValue=currentValue+board[row-1][col].value+distanceFromEnd;
          if(!(ds.has([row-1,col].toString())&&ds.get([row-1,col].toString())!.value<netxCellValue)){
            ds.set([row-1,col].toString(),{position:[row-1,col],value:netxCellValue,AStarDistance:distanceFromEnd});
            if(board[row][col].state!=3)this.parents[[row-1,col].toString()]=currentPos?.position!;
          }
        }
        if(col<board[0].length-1 && !set.has([row,col+1].toString())){
          let distanceFromEnd=Math.abs(end[0]-row)+Math.abs(end[1]-(col+1));
          let nextCellValue=currentValue+board[row][col+1].value+distanceFromEnd;
          if(!(ds.has([row,col+1].toString())&&ds.get([row,col+1].toString())!.value<nextCellValue)){
            ds.set([row,col+1].toString(),{position:[row,col+1],value:nextCellValue,AStarDistance:distanceFromEnd});
            if(board[row][col].state!=3)this.parents[[row,col+1].toString()]=currentPos?.position!;
          }
        }
        if(row<board.length-1 && !set.has([row+1,col].toString())){
          let distanceFromEnd=Math.abs(end[0]-(row+1))+Math.abs(end[1]-col);
          let nextCellValue=currentValue+board[row+1][col].value+distanceFromEnd;
          if(!(ds.has([row+1,col].toString())&&ds.get([row+1,col].toString())!.value<nextCellValue)){
            ds.set([row+1,col].toString(),{position:[row+1,col],value:nextCellValue,AStarDistance:distanceFromEnd});
            if(board[row][col].state!=3)this.parents[[row+1,col].toString()]=currentPos?.position!;
          }
        }
        if(col>0 && !set.has([row,col-1].toString())){
          let distanceFromEnd=Math.abs(end[0]-row)+Math.abs(end[1]-(col-1));
          let nextCellValue=currentValue+board[row][col-1].value+distanceFromEnd;
          if(!(ds.has([row,col-1].toString())&&ds.get([row,col-1].toString())!.value<nextCellValue)){
            ds.set([row,col-1].toString(),{position:[row,col-1],value:nextCellValue,AStarDistance:distanceFromEnd})
            if(board[row][col].state!=3)this.parents[[row,col-1].toString()]=currentPos?.position!;            
          }
        }
      }
    }
    this.parents={};
  }
}
