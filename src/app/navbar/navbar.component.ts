import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DxToolbarModule, DxMenuModule, DxButtonModule } from 'devextreme-angular';

// Definimos nuestro tipo personalizado con la propiedad `path`
interface CustomMenuItem {
  path?: string;
  text: string;
  items?: CustomMenuItem[]; // Submenús anidados
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ DxToolbarModule, DxMenuModule, DxButtonModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Menú de navegación con las rutas correspondientes
  menuItems: CustomMenuItem[] = [
    { text: 'Home', path: '' },
    { text: 'Caja', path: 'caja' },
    {
      text: 'Ventas', // Item con submenú
      items: [
        { text: 'Realizar Venta', path: 'ventas' },
        { text: 'Tabla de ventas', path: 'pivot-ventas' }
      ]
    },
    {
      text: 'Compras', // Item con submenú
      items: [
        { text: 'Realizar compras', path: 'compras' },
        { text: 'Proveedores', path: 'proveedores' }
      ]
    },
    {
      text: 'Productos', // Item con submenú
      items: [
        { text: 'Agregar Productos', path: 'productos' },
        { text: 'Stock', path: 'stock' }
      ]
    }
  ];

  constructor(private router: Router) {}

  // Método para manejar la navegación
  navigateTo(path: string ): void {
    if (path !== undefined) {
      this.router.navigate([path]);
    } else {
      console.warn('La ruta proporcionada es inválida o no está definida.');
    }
  }

  // Método para encontrar el item seleccionado recursivamente
  findMenuItemByText(items: CustomMenuItem[], text: string): CustomMenuItem | undefined {
    for (const item of items) {
      if (item.text === text) {
        return item; // Elemento encontrado
      }
      // Si el elemento tiene submenús, buscamos recursivamente
      if (item.items) {
        const found = this.findMenuItemByText(item.items, text);
        if (found) return found;
      }
    }
    return undefined; // No se encontró
  }

  // Método para manejar el clic en el elemento del menú
  handleMenuItemClick(event: any): void {
    const selectedItem = this.findMenuItemByText(this.menuItems, event.itemData.text);

    if (selectedItem?.path !== undefined) {
      this.navigateTo(selectedItem.path);
    } else {
      console.warn('Ruta no encontrada para el elemento del menú:', event.itemData.text);
    }
  }
}
