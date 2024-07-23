import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { ClusterComponent } from '../cluster/cluster.component';  // ClusterComponent is a child component of NetworkComponent

@Component({
  selector: 'app-network',
  standalone: true,
  imports: [ClusterComponent, CommonModule, NgFor],
  templateUrl: './network.component.html',
  styleUrl: './network.component.css'
})
export class NetworkComponent {
  @Input() value = ''; // Input value from parent component
  boxes: string [] = [];
  addNewBox(value: string){
    const newBox = `item ${this.boxes.length + 1},${value}`;
    this.boxes.push(newBox);

  }
}

