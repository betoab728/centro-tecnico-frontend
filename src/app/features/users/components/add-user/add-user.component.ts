import { Component,ViewChild,ElementRef } from '@angular/core';
import { Router, } from '@angular/router';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.interface';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';  



@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})


export class AddUserComponent {


  @ViewChild('password') password!: ElementRef;
  @ViewChild('confirmPassword') confirmPassword!: ElementRef;

  //usuario
  user: User = {
    usuarioId: 0,
    nombre: '',
    clave: '',
    estado: 'a',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  //mensaje de error
  errorMessage: string = '';
  confirmPasswordValue: string = '';

 
  //constructor
  constructor(private usersService: UsersService ,private router: Router ) { }

  //al cargar el componente
  ngOnInit(): void {
  }

  //agregar usuario
  agregarUSuario(): void {

    console.log(this.user);

   
     //si no hay usuario o clave
  if (!this.user.nombre || !this.user.clave) {
    this.errorMessage = 'Nombre y clave son requeridos';
    return;
  }

   //si las claves no coinciden
   if (this.user.clave !== this.confirmPasswordValue) { // Compara con la variable local
    this.errorMessage = 'Las claves no coinciden';
    console.log('Las claves no coinciden');
    return;
  }
    // Si las validaciones pasan, se llama a la confirmación
    this.confirmarAgregarUsuario();

  }

  //confirmacion de agregar usuario
  confirmarAgregarUsuario(): void {
    Swal.fire({
      title: 'Agregar usuario',
      text: '¿Está seguro de agregar el usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.addUser(this.user).subscribe(() => {
          Swal.fire('Usuario agregado', 'El usuario se ha agregado correctamente', 'success');
          //navegar a la lista de usuarios
          this.router.navigate(['/admin/usuarios']);
        });
  
      }
    });
  }
}
