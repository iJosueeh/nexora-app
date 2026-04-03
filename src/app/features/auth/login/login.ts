import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  activeTab: 'login' | 'signup' = 'login';

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;

  constructor(private router: Router) { }

  goToSignUp(): void {
    this.router.navigate(['/register']);
  }

  onLogin(): void {
    if (!this.email || !this.password) return;

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/home']);
    }, 1500);
  }

  onUtpLogin(): void {
    console.log('UTP ID login');
  }
}
