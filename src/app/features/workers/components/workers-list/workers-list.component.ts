import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Worker } from '../../models/worker.interface';
import { WorkersService } from '../../services/workers.service'; 


@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css'
})
export class WorkersListComponent {

   //array de  trabajadores
    workers: Worker[] = [];

    //constructor
    constructor(private workersService: WorkersService) { }

    //al cargar el componente
    ngOnInit(): void {
        //obtener los trabajadores
        this.workersService.workers$.subscribe((workers) => {
            this.workers = workers;
        });
        this.workersService.getWorkers().subscribe();
    }

}
