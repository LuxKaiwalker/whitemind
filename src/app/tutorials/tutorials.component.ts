import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [RouterOutlet, MarkdownModule],
  providers: [{ provide: HttpClient }],//dunno how it works
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css'
})
export class TutorialsComponent {
  onLoad(event: any) {
    console.log(event);
  }
}
