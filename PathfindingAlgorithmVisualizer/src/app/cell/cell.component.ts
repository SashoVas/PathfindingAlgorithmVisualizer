import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICell } from '../interfaces/ICell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
  animations: [
    trigger('visited',[
      transition("void=>visited",[
        style({scale:0.3,'border-radius' : '100%','background-color': 'rgba(0, 0, 66, 0.75)'}),
        animate(300,style({ 'background-color':'rgba(17, 104, 217, 0.75)',scale:1,'border-radius' : '50%'})),
        animate(300,style([{scale:1.2,'background-color': 'rgba(0, 217, 159, 0.75)','border-radius' : '25%'}])),
        animate(300,style([{scale:1,'border-radius' : '0%'}]))
      ]),
    ]),
    trigger('wall', [
      transition("void=>wall",[
        style({scale:0.3}),
        animate(300,style({ scale:1.2})),
        animate(200,style({ scale:1}))
      ])
    ]),
    trigger("path",[
      transition("void=>path",[
      style({scale:0.5,'border-radius' : '25%'}),
      animate(150,style({ scale:0.7,'border-radius' : '10%'})),
      animate(150,style({ scale:1,'border-radius' : '0%'}))
      ])
    ]),
    trigger("popup",[
      transition("void=>popup",[
        style({scale:0.3}),
        animate(100,style({scale:0.7})),
        animate(100,style({scale:1.2})),
        animate(100,style({scale:1})),
      ])
    ])
  ],
})
export class CellComponent implements OnInit,DoCheck{
  @Input()boardState!:number;
  @Input()cell!:ICell;
  backgroundColor:string='white';
  animation!:string;
  private oldState=0;
  private oldValue=1;
  constructor() { }
  ngDoCheck(): void {
    
    if(this.cell.state!==this.oldState||this.cell.value!==this.oldValue){
      this.oldState=this.cell.state;
      this.oldValue=this.cell.value;
      this.setColors();
    }
  }
  ngOnInit(): void {
    this.setColors();
  }
  setColors(){
    if(this.cell.state==0){
      this.backgroundColor='white';
    }
    if(this.cell.state==1){
      this.backgroundColor='rgba(0, 190, 218, 0.75)';
      if(this.boardState!=3)this.animation="visited";
    }
    else if(this.cell.state==2){
      this.backgroundColor='rgb(12, 53, 71)';
      this.animation="wall";
    }
    else if(this.cell.state==5){
      this.backgroundColor='rgba(255, 215, 0, 0.75)';
      if(this.boardState!=3)this.animation="path";
    }
  }
}