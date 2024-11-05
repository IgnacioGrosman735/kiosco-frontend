import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { NgFor } from '@angular/common';
import { DxDataGridModule, DxChartModule } from 'devextreme-angular';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [NgFor, DxDataGridModule, DxChartModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {
  productos: any[] = [];

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.cargarStock();
  }

  cargarStock(): void {
    this.stockService.getStock().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al obtener el stock', error);
      },
      complete: () => {
        console.log('Obtención de stock completada');
      }
    });
  }
}
