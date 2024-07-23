import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NetworkComponent } from './network/network.component';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DragDropModule, CommonModule, NgFor, NetworkComponent],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})
export class BrainetComponent {
  value: any;

  constructor() {
    this.value = null; // Initialize value to null
  }

  setValue(input: any) {
    this.value = input; // Set the variable value to the input parameter
  }
}
