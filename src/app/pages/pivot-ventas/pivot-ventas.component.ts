import { Component, inject, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { VentasService } from '../../services/ventas.service';
import { DxPivotGridModule, DxPivotGridComponent, DxChartModule } from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { exportPivotGrid } from "devextreme/excel_exporter";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import {VentaDataGrafico} from '../../services/ventas.service';

@Component({
  selector: 'app-pivot-ventas',
  standalone: true,
  imports: [ DxPivotGridModule, DxChartModule, NgIf, NgFor ],
  templateUrl: './pivot-ventas.component.html',
  styleUrl: './pivot-ventas.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Agrega este esquema
})
export class PivotVentasComponent {

  ventasDataSource!: PivotGridDataSource;
  chartData: any[] = [];  // Declaración de chartData
  chartData2: VentaDataGrafico[] = [];
  uniqueProducts: string[] = [];
  ventasPorMes: any[] = [];
  productosCategorias: any[] = [];
  productNames: string[] = [];

  private _ventasService = inject(VentasService);

  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid!: DxPivotGridComponent; // Acceder al PivotGrid

  ngOnInit(): void {
    this.cargarVentasAgrupadas(); // Carga de datos en ngOnInit
    // Obtener ventas agrupadas
    this._ventasService.obtenerVentasPorMes().subscribe(data => {
      this.ventasPorMes = data.sort((a:any, b:any) => {
        // Convierte los nombres de los meses a números para poder compararlos cronológicamente
        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthOrder.indexOf(a.fecha.trim()) - monthOrder.indexOf(b.fecha.trim());
      });
      this.productNames = this.obtenerNombresProductos();
      console.log('Ventas por mes:', this.ventasPorMes);
    });

    // Obtener productos y categorías
    this._ventasService.obtenerProductosCategorias().subscribe(data => {
      this.productosCategorias = data;
      console.log('Productos y categorías:', this.productosCategorias);
    });

    this.productNames = this.obtenerNombresProductos();
    console.log('productsNames:', this.productNames);
  }

  datosCargados = false;

  cargarVentasAgrupadas(): void {
    if (this.datosCargados) {
      console.warn('Los datos ya se cargaron. No se vuelve a cargar.');
      return;
    }

    console.log('Cargando datos por primera vez...');
    this._ventasService.getVentasAgrupadas().subscribe({
      next: (data) => {
        console.log('Datos cargados desde el servicio:', data);  // Log de los datos recibidos
        this.datosCargados = true;
        this.inicializarPivotDataSource(data);
      },
      error: (error) => {
        console.error('Error al obtener las ventas agrupadas:', error);
      },
    });
  }

  inicializarPivotDataSource(data: any[]): void {
    // Log para verificar los datos recibidos
    console.log('Datos recibidos:', data);

    // Transformar las fechas de string a objetos Date
    const dataTransformada = data.map(item => ({
      ...item,
      fecha_venta: new Date(item.fecha_venta)  // Conversión a Date
    }));

    // Verificar que las fechas se hayan transformado correctamente
    console.log('Datos transformados:', dataTransformada);

    this.ventasDataSource = new PivotGridDataSource({
      fields: [
        { dataField: 'categoria', area: 'row' },  // Categoría en filas
        { dataField: 'producto', area: 'row', caption: 'Producto' },
        {
          dataField: 'fecha_venta',
          area: 'column',
          dataType: 'date',
          caption: 'Año',
          groupInterval: 'year',  // Agrupar por año
          showTotals: false,
        },
        {
          dataField: 'fecha_venta',
          area: 'column',
          dataType: 'date',
          caption: 'Mes',
          groupInterval: 'month',  // Agrupar por mes
        },
        {
          dataField: 'total_unidades',
          area: 'data',
          caption: 'Unidades',
          visible: true,
          format: 'number',
          customizeText: (cellInfo) => {
            return `${cellInfo.value || 0}`;  // Mostrar 0 si no hay valor
          }
        },
        {
          dataField: 'total_venta',
          area: 'data',
          summaryType: 'sum',
          caption: 'Total Venta',
          format: { type: 'currency', precision: 2 },
          customizeText: (cellInfo) => {
            const valor = Number(cellInfo.value) || 0;  // Mostrar 0 si no hay ventas
            return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);
          }
        }
      ],
      store: dataTransformada  // Pasar los datos recibidos desde el backend
    });

    this.chartData = this.extraerDatosParaGrafico(dataTransformada);
    this.chartData2 = this.agruparDatosPorCategoriaYProducto(this.chartData);  // Asignar el resultado agrupado a chartData2
    console.log('Datos agrupados:', this.chartData2);
    
    // Establecer uniqueProducts aquí, después de agrupar los datos
    this.uniqueProducts = Array.from(new Set(this.chartData2.map(item => item.producto)));
    console.log('Unique Products:', this.uniqueProducts);
  }

  exportar() {
    if (this.pivotGrid) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Main sheet');
      exportPivotGrid({
        component: this.pivotGrid.instance,
        worksheet: worksheet
      }).then(() => {
        workbook.xlsx.writeBuffer()
          .then((buffer: BlobPart) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PivotGrid.xlsx');
          });
      });
    }
  }

  extraerDatosParaGrafico(data: any[]): any[] {
    return data.map(item => {
        // Convierte `fecha_venta` a un objeto Date
        const fecha = new Date(item.fecha_venta);

        // Extrae el mes (por ejemplo, "Enero", "Febrero") y el año opcionalmente
        const mes = fecha.toLocaleString('default', { month: 'long' }); // Solo el nombre del mes
        // const mes = `${fecha.toLocaleString('default', { month: 'long' })} ${fecha.getFullYear()}`; // Con año

        return {
            fecha: mes,
            categoria: item.categoria,
            producto: item.producto,
            total_venta: item.total_venta,
        };
    });
  }

  agruparDatosPorCategoriaYProducto(data: any[]): VentaDataGrafico[] {
    console.log('Agrupando datos:', data);  // Agrega esta línea
    const groupedData = data.reduce((acc: any, current: any) => {
      const key = `${current.fecha}-${current.categoria}-${current.producto}`;
      if (!acc[key]) {
        acc[key] = {
          fecha: current.fecha,
          categoria: current.categoria,
          producto: current.producto,
          total_venta: 0
        };
      }
      acc[key].total_venta += current.total_venta;
      return acc;
    }, {});

    return Object.values(groupedData);
  }

  obtenerNombresProductos(): string[] {
    // Crea un conjunto para evitar duplicados
    const productosSet = new Set<string>();
  
    // Recorre todos los objetos de ventasPorMes y agrega todos los nombres de productos al conjunto
    this.ventasPorMes.forEach(mesData => {
      Object.keys(mesData).forEach(key => {
        if (key !== 'fecha') {
          productosSet.add(key);
        }
      });
    });
  
    // Convierte el conjunto a un array y lo devuelve
    return Array.from(productosSet);
  }

  getCategoryForProduct(productName: string): string | undefined {
    // Busca el primer producto en chartData2 que coincide
    const productData = this.productosCategorias.find(item => item.producto === productName);
    return productData ? productData.categoria : undefined;
  }
    
}
