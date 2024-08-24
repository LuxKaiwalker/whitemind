import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TutorialMdComponent } from '../tutorial-md/tutorial-md.component';
 

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [RouterOutlet, TutorialMdComponent],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css'
})
export class TutorialsComponent {
  onLoad(event: any) {
    console.log(event);
  }
}
