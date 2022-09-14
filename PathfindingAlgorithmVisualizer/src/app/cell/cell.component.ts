import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
    ])
  ],
})
export class CellComponent implements OnInit, OnChanges{
  @Input()value!:ICell;
  backgroundColor:string='white';
  animation!:string;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
  }
  ngOnInit(): void {
    if(this.value.state==1){
      this.backgroundColor='rgba(0, 190, 218, 0.75)';
      this.animation="visited";
    }
    else if(this.value.state==2){
      this.backgroundColor='rgb(12, 53, 71)';
      this.animation="wall";
    }
    else if(this.value.state==5){
      this.backgroundColor='rgba(255, 215, 0, 0.75)';
      this.animation="path";
    }
  }
}
//[ngClass]="value==1?'node-visited':value==2?'wall':''"