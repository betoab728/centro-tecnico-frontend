import { Component,OnInit,ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { User  } from '../../models/user.interface';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ FormsModule, CommonModule, RouterModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {

    //mensaje de error
    errorMessage: string = '';
    confirmPasswordValue: string = '';

  //modelo usuario
  user: User = {
    usuarioId: 0,
    nombre: '',
    clave: '',
    estado: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  @ViewChild('password') password!: ElementRef;
  @ViewChild('confirmPassword') confirmPassword!: ElementRef;


  //constructor
  constructor(private usersService: UsersService,  private router: Router, private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
     // Obtiene el ID del usuario de la URL
      const id =Number(this.activatedRoute.snapshot.paramMap.get('id'));

      // Obtiene usuario por ID
      this.usersService.getUserById(id).subscribe(
        (user: User) => {
          this.user = user;
        }
      );
  }

  //actualizar usuario
  updateUser(): void {
  
    // Validación básica
    if (!this.user.nombre || !this.user.clave || !this.user.estado) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    // Si las validaciones son correctas, proceder con la confirmación
    this.confirmarEditarUsuario();
  }


  confirmarEditarUsuario(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de Actualizar este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Actualizar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamada al servicio de edición
        this.usersService.updateUser(this.user.usuarioId, this.user).subscribe({
          next: (updatedUser) => {
            Swal.fire('Usuario actualizado', 'El usuario fue actualizado correctamente', 'success');
            this.router.navigate(['/admin/usuarios']); // Redirige a la lista de usuarios
          },
          error: (error) => {
            console.error('Error al editar usuario', error);
            Swal.fire('Error', 'Ocurrió un error al editar el usuario', 'error');
          }
        });
      }
    });
  }


}
