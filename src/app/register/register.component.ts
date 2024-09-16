import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

import { TokenService } from '../token.service';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ RouterOutlet, FooterComponent, HeaderComponent, FormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService) { }

  //api request setup
  readonly ROOT_URL = 'https://backmind.icinoxis.net';

  username: string = "";
  password: string = "";
  confirmPassword: string = "";

  token: string = "";

  register() {
    this.router.navigate(['/login']);
  }

  onSubmit(event: any, username: string, password: string, confirmPassword: string) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      const data = JSON.stringify({//switch to parse
        user: {
          email: `${username}`,
          brainet_tag: `${username}${password}`,
          plain_password: `${password}`
        }
      });

      console.log('Data:', data);


      // @note: http requeast to fix
      /*
      const istakent = JSON.stringify({//switch to parse
        user: {
          email: `${username}`,
          brainet_tag: `${username}${password}`
        }
      });
      const istaken = JSON.parse(istakent);

      this.http.post(`${this.ROOT_URL}/api/user/is-taken`, istaken).subscribe({
        next: (response: any) => {
          console.log('User is taken:', response);
        },
        error: (error: any) => {
          console.error('Error checking if user is taken:', error);
        },
        complete: () => {
          // Handle any cleanup or finalization logic here
        }
      });

      const send = JSON.stringify(data);

      this.http.post(`${this.ROOT_URL}/api/auth/register`, send).subscribe({
        next: (response: any) => {
          console.log('User registered:', response);
        },
        error: (error: any) => {
          console.error('Error registering user:', error);
        },
        complete: () => {
          // Handle any cleanup or finalization logic here
        }
      });
*/

      this.token = "d9f8vz10qe8r3h1q";//this is a placeholder token
    }
    
    this.tokenService.setToken(this.token);
  }
  }
