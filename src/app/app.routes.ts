import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { StockComponent } from './pages/stock/stock.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { CajaComponent } from './pages/caja/caja.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { PivotVentasComponent } from './pages/pivot-ventas/pivot-ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'stock', component: StockComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'compras', component: ComprasComponent },
  { path: 'caja', component: CajaComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'pivot-ventas', component: PivotVentasComponent },
  { path: '**', redirectTo: 'home' } // Redirección para rutas inválidas
  // Otras rutas
];

