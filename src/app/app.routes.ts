import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { BrainetComponent } from './brainet/brainet.component';
import { TutorialsComponent } from './tutorials/tutorials.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';




export const routes: Routes = [
    {
        path:'',
        title:'Home',
        component: HomeComponent,
    },
    {
        path:'brainet',
        title:'Brainet',
        component: BrainetComponent,
    },
    {
        path: 'tutorials',
        title: 'Tutorials',
        component: TutorialsComponent,
    },
    {
        path:'about',
        title:'About',
        component: AboutComponent,
    },
    {
        path: 'contact',
        title: 'Contact',
        component: ContactComponent,
    },
    {
        path: 'register',
        title: 'Register',
        component: RegisterComponent,
    },
    {
        path: 'login',
        title: 'Login',
        component: LoginComponent,
    },
];
