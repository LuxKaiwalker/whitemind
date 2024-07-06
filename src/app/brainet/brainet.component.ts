import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-brainet',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './brainet.component.html',
  styleUrl: './brainet.component.css'
})
export class BrainetComponent {

}
