import { Component, inject, OnInit } from '@angular/core';
import { CajaService } from '../../services/caja.service';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxDateBoxModule, DxButtonModule } from 'devextreme-angular';
import { RegistroCaja } from '../../models/registro-caja.model';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxDateBoxModule, DxButtonModule],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.css',
  providers: [CajaService]
})
export class CajaComponent implements OnInit {

  // Formateador de fecha
  dateFormatter = {
    type: 'date',
    formatter: (date: Date) => this.formatDate(date),
  };

   // Función para dar formato día/mes/año
   formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  registrosCaja: RegistroCaja[] = [];
  fechaInicio: Date = new Date(); // Inicializa como fecha actual
  fechaFin: Date = new Date(); // Inicializa como fecha actual

  private _cajaService = inject(CajaService)

  ngOnInit(): void {
    this.cargarRegistrosCaja();
  }

  cargarRegistrosCaja(): void {
    this._cajaService.obtenerRegistrosCaja().subscribe({
      next: (data) => {
        this.registrosCaja = data;
      }, 
      error: (error) => {
      console.error('Error al cargar los registros de caja:', error);
    }
    });
  }

  // Método para filtrar registros por rango de fechas
  filtrarPorRango(): void {
    if (this.fechaInicio && this.fechaFin) {
      this._cajaService.obtenerRegistrosPorRango(this.fechaInicio, this.fechaFin).subscribe({
        next: (data) => {
          this.registrosCaja = data;
        },
        error: (error) => {
          console.error('Error al filtrar registros:', error);
        }
      });
    }
  }
}
