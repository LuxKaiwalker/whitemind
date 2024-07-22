import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { GraphComponent } from '../graph/graph.component';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DragDropModule, CommonModule, NgFor, GraphComponent],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})
export class BrainetComponent {
  boxes: string [] = [];
  addNewBox(value: string){
    const newBox = `item ${this.boxes.length + 1},${value}`;
    this.boxes.push(newBox);

  }
}
