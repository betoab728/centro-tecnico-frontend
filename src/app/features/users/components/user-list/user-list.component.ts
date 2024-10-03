import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.interface';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  //array de usuarios
  users: User[] = [];

  //constructor
  constructor(private usersService: UsersService) { }

  //al cargar el componente
  ngOnInit(): void {
    //obtener los usuarios
    this.usersService.users$.subscribe((users) => {
      this.users = users;
    });
    this.usersService.getUsers().subscribe();
  }

}
