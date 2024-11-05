import { Component, inject } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [ServiceService]
})
export class RegisterComponent {

  user = {
    nombre: '',
    email: '',
    password: ''
  };

  private _serviceService = inject(ServiceService) //Traemos la clase de service.service y la guardamos en la variable _serviceService
  private _router = inject(Router);

  register() {
    this._serviceService.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);  // Aquí manejas la respuesta exitosa
        this._router.navigate(['']);// Redirige al componente 'home' después del registro
      },
      error: (error) => console.error('Error al registrar el usuario:', error),  // Aquí manejas errores
      complete: () => console.log('Registro completado')  // Ocurre cuando el `Observable` se completa
    });
  }
}
