import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Position } from '../../models/position.interface';
import { PositionsService } from '../../services/positions.service';


@Component({
  selector: 'app-positions-list',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './positions-list.component.html',
  styleUrl: './positions-list.component.css'
})
export class PositionsListComponent {

  //array de posiciones
  positions: Position[] = [];

  //constructor
  constructor(private positionsService: PositionsService) { }

  //al cargar el componente
  ngOnInit(): void {
    //obtener las posiciones
    this.positionsService.positions$.subscribe((positions) => {
      this.positions = positions;
    });
    this.positionsService.getPositions().subscribe();
  }

}
