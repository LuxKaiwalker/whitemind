import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { TutorialMdComponent } from '../tutorial-md/tutorial-md.component';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
 

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [RouterLink, RouterOutlet, TutorialMdComponent, HeaderComponent, FooterComponent],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css'
})
export class TutorialsComponent {
assets: any;
  onLoad(event: any) {
    console.log(event);
  }
}
