import {
  Component,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { CurrencyService } from '@services/currency/currency.service';
import ApexCharts from 'apexcharts';

interface ExpensesByCategoryData {
  category_name: string;
  total: number;
  count: number;
}

@Component({
  selector: 'app-dashboard-expenses-by-category',
  templateUrl: 'expenses-by-category.component.html',
})
export class ExpensesByCategoryComponent {
  private currencyService = inject(CurrencyService);

  data = input.required<ExpensesByCategoryData[]>();

  constructor() {
    effect(() => {
      if (
        document.getElementById('pie-chart') &&
        typeof ApexCharts !== 'undefined' &&
        this.data()
      ) {
        const chart = new ApexCharts(
          document.getElementById('pie-chart'),
          this.getChartOptions()
        );
        chart.render();
      }
    });
  }

  chartOptions = computed(() => {
    if (!this.data()) {
      return;
    }

    const labels = this.data().map((item) => item.category_name);
    const series = this.data().map((item) => item.total);
    const colors = this.generateVibrantColors(this.data().length);

    return {
      series: series,
      colors: colors,
      chart: {
        height: 420,
        width: '100%',
        type: 'pie',
      },
      stroke: {
        colors: ['white'],
        lineCap: '',
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: '100%',
          dataLabels: {
            offset: -25,
          },
        },
      },
      labels: labels,
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'Inter, sans-serif',
        },
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            return this.currencyService.formatAmount(value);
          },
        },
      },
      xaxis: {
        labels: {
          formatter: (value: number) => {
            return value + '%';
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  });

  getChartOptions = () => {
    return this.chartOptions();
  };

  private generateVibrantColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate HSL colors for better control over saturation and lightness
      const hue = Math.floor(Math.random() * 360);
      const saturation = Math.floor(Math.random() * 30) + 70; // 70-100% saturation
      const lightness = Math.floor(Math.random() * 20) + 45; // 45-65% lightness
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
    }
    return colors;
  }
}
