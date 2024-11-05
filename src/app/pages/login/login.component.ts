import { Component, inject } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [ServiceService]
})
export class LoginComponent {

  /* user = {
    email: '',
    password: ''
  }; */

  loginForm: FormGroup;

  private _serviceService = inject(ServiceService) //Traemos la clase de service.service y la guardamos en la variable _serviceService
  private _router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  hasErrors(controlName: string, errorType: string){
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched
  }

  login(): void {
    this._serviceService.loginUser(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
        this._router.navigate(['']);
      },
      error: (error: any) => {
        console.error('Login failed', error);
      }
    });
  }
}
