export interface DetalleCompra {
    cantidad: number;
    costo_total: string; // O number, dependiendo de cómo lo manejes
    costo_unitario: string; // O number
    producto_id: number;
  }
  
export interface Compras {
id: number;             // Identificador único del proveedor (primary key)
proveedor_id: number;
costo_total: number;
fecha: string;
detalles: DetalleCompra[];
}

export interface Compra {
    proveedor_id: number | null; // Puede ser null hasta que se le asigne un valor
    productos: {
      producto_id: number | null; // También inicializado como null
      cantidad: number;
      costo_unitario?: number; // Opcional si necesitas agregarlo después
    }[];
}

export interface ProductoTemporal {
    proveedor_id: number | null;
    producto_id: number | null;
    nombre: string,
    cantidad: number,
    precio: number
  };
  
  