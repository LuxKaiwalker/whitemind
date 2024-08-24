import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-tutorial-md',
  standalone: true,
  imports: [RouterOutlet, MarkdownModule],
  providers: [{ provide: HttpClient }],//dunno how it works
  templateUrl: './tutorial-md.component.html',
  styleUrl: './tutorial-md.component.css'
})
export class TutorialMdComponent {

}
