import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: false
})
export class ReportsComponent implements OnInit {
  isLoading = false;
  selectedPeriod = 'month';

  reportData = {
    totalSales: 0,
    salesGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    newCustomers: 0,
    customersGrowth: 0,
    averageTicket: 0,
    ticketGrowth: 0,
    
    dailySales: [] as any[],
    salesByCategory: [] as any[],
    topProducts: [] as any[],
    topSellers: [] as any[],
    recentActivity: [] as any[],
    detailedMetrics: [] as any[]
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.isLoading = true;
    console.log('📊 Cargando datos del período:', this.selectedPeriod);

    setTimeout(() => {
      this.reportData = this.generateMockData();
      this.isLoading = false;
      console.log('✅ Datos de reporte cargados');
    }, 1000);
  }

  generateMockData(): any {
    const multiplier = this.getPeriodMultiplier();

    return {
      totalSales: 45670.50 * multiplier,
      salesGrowth: Math.floor(Math.random() * 30) + 10,
      totalOrders: Math.floor(85 * multiplier),
      ordersGrowth: Math.floor(Math.random() * 25) + 5,
      newCustomers: Math.floor(34 * multiplier),
      customersGrowth: Math.floor(Math.random() * 20) + 8,
      averageTicket: (45670.50 / 85),
      ticketGrowth: Math.floor(Math.random() * 15) + 3,

      dailySales: [
        { day: 'Lunes', amount: 8234.50 },
        { day: 'Martes', amount: 9876.30 },
        { day: 'Miércoles', amount: 7432.10 },
        { day: 'Jueves', amount: 10234.80 },
        { day: 'Viernes', amount: 12456.20 },
        { day: 'Sábado', amount: 15234.90 },
        { day: 'Domingo', amount: 11245.70 }
      ],

      salesByCategory: [
        { category: 'Electrónica', amount: 20551.73, percentage: 45 },
        { category: 'Accesorios', amount: 13701.15, percentage: 30 },
        { category: 'Audio', amount: 6850.58, percentage: 15 },
        { category: 'Otros', amount: 4567.05, percentage: 10 }
      ],

      topProducts: [
        { name: 'Laptop HP Pavilion', sales: 23, revenue: 29899.77 },
        { name: 'Mouse Logitech MX Master 3', sales: 45, revenue: 4499.55 },
        { name: 'Teclado Mecánico RGB', sales: 32, revenue: 5119.68 },
        { name: 'Monitor LG UltraWide', sales: 12, revenue: 5999.88 },
        { name: 'Auriculares Sony', sales: 28, revenue: 9799.72 }
      ],

      topSellers: [
        { name: 'TechStore', sales: 67, revenue: 35234.50 },
        { name: 'Peripherals Inc', sales: 45, revenue: 22145.80 },
        { name: 'Gaming Pro', sales: 38, revenue: 18976.40 },
        { name: 'AudioPro', sales: 29, revenue: 15234.90 },
        { name: 'DisplayWorld', sales: 21, revenue: 12456.70 }
      ],

      recentActivity: [
        { icon: '💰', title: 'Nueva venta: $1,299.99', time: 'Hace 5 min' },
        { icon: '👤', title: 'Nuevo cliente registrado', time: 'Hace 12 min' },
        { icon: '📦', title: 'Producto agregado: Mouse Gamer', time: 'Hace 25 min' },
        { icon: '⭐', title: 'Nueva reseña 5 estrellas', time: 'Hace 1 hora' },
        { icon: '🚚', title: 'Pedido #1234 enviado', time: 'Hace 2 horas' }
      ],

      detailedMetrics: [
        { name: 'Ingresos Totales', current: '$45,670.50', previous: '$38,234.20', change: 19.4 },
        { name: 'Pedidos Completados', current: '85', previous: '72', change: 18.1 },
        { name: 'Tasa de Conversión', current: '3.2%', previous: '2.8%', change: 14.3 },
        { name: 'Valor Promedio de Pedido', current: '$537.30', previous: '$530.75', change: 1.2 },
        { name: 'Productos Vendidos', current: '234', previous: '198', change: 18.2 },
        { name: 'Clientes Activos', current: '120', previous: '105', change: 14.3 },
        { name: 'Tasa de Retorno', current: '2.1%', previous: '3.5%', change: -40.0 },
        { name: 'Satisfacción Cliente', current: '4.8/5', previous: '4.6/5', change: 4.3 }
      ]
    };
  }

  getPeriodMultiplier(): number {
    switch (this.selectedPeriod) {
      case 'today': return 0.1;
      case 'week': return 0.25;
      case 'month': return 1;
      case 'year': return 12;
      default: return 1;
    }
  }

  exportReport(): void {
    console.log('📥 Exportando reporte...');
    
    const reportText = `
REPORTE DE VENTAS - ${this.selectedPeriod.toUpperCase()}
===============================================

RESUMEN GENERAL
- Ventas Totales: $${this.reportData.totalSales.toFixed(2)}
- Pedidos: ${this.reportData.totalOrders}
- Clientes Nuevos: ${this.reportData.newCustomers}
- Ticket Promedio: $${this.reportData.averageTicket.toFixed(2)}

TOP PRODUCTOS
${this.reportData.topProducts.map((p, i) => 
  `${i+1}. ${p.name} - ${p.sales} ventas - $${p.revenue.toFixed(2)}`
).join('\n')}

TOP VENDEDORES
${this.reportData.topSellers.map((s, i) => 
  `${i+1}. ${s.name} - ${s.sales} ventas - $${s.revenue.toFixed(2)}`
).join('\n')}

Generado: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${this.selectedPeriod}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert('✅ Reporte exportado exitosamente');
    console.log('✅ Reporte descargado');
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}