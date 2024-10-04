import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Client } from '../../models/client.interface';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent {

  //array de  trabajadores
  clients: Client[] = [];

  //constructor
  constructor(private clientsService: ClientsService) { }

  //al cargar el componente
  ngOnInit(): void {
      //obtener los trabajadores
      this.clientsService.clients$.subscribe(( clients ) => {
          this.clients = clients; ;
      });
      this.clientsService.getClients().subscribe();
  }

}
