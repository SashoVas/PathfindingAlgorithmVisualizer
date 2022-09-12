import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input()value!:number;
  backgroundColor:string='white';
  constructor() { }
  ngOnInit(): void {
    if(this.value==1){
      this.backgroundColor='rgb(30, 144, 255)';
    }
    else if(this.value==2){
      this.backgroundColor='rgb(26, 26, 26)';
    }
    else if(this.value==5){
      this.backgroundColor='rgb(255, 215, 0)';
    }
  }
}
