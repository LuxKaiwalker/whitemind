import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [RouterOutlet, MarkdownModule.forRoot(), HttpClientModule],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css'
})
export class TutorialsComponent {
  markdownContent: string = `
    # Dynamic Markdown
    This content is **dynamically** bound from the component class.
  `;
}
