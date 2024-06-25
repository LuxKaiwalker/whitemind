import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Define a component
@Component({
    selector: 'app-root',
    template: `
        <h1>Hello world!</h1>
        <p>{{ message }}</p>
    `,
})
export class AppComponent {
    message = 'This should display some messages';
}

// Define a module
@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    bootstrap: [AppComponent],
})
export class AppModule {}

// Bootstrap the Angular app
platformBrowserDynamic().bootstrapModule(AppModule);
console.log('hello there\n');
