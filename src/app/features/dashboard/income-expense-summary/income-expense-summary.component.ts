import { CurrencyPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  input,
} from '@angular/core';
import ApexCharts from 'apexcharts';

interface IncomeExpenseSummaryData {
  month: string;
  total_expense: number;
  total_income: number;
}

@Component({
  selector: 'app-dashboard-income-expense-summary',
  templateUrl: './income-expense-summary.component.html',
})
export class IncomeExpenseSummaryComponent {
  data = input.required<IncomeExpenseSummaryData[]>();

  // Define consistent colors
  private readonly INCOME_COLOR = '#31C48D';
  private readonly EXPENSE_COLOR = '#F05252';

  // Convert date string (yy-mm-dd) to month literal
  private convertToMonthLiteral(dateString: string): string {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    try {
      // Handle different date formats
      let date: Date;

      if (dateString.includes('-')) {
        // Parse yy-mm-dd or yyyy-mm-dd format
        const parts = dateString.split('-');
        let year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const day = parts[2] ? parseInt(parts[2]) : 1;

        // Handle 2-digit year (assume 20xx)
        if (year < 100) {
          year += 2000;
        }

        date = new Date(year, month, day);
      } else {
        // Try to parse as regular date string
        date = new Date(dateString);
      }

      // Return month name if valid date
      if (!isNaN(date.getTime())) {
        return monthNames[date.getMonth()];
      }
    } catch (error) {
      console.warn('Error parsing date:', dateString, error);
    }

    // Fallback: return original string if parsing fails
    return dateString;
  }

  // Computed chart options that map to response data
  chartOptions = computed(() => {
    const months = this.data().map((item) =>
      this.convertToMonthLiteral(item.month)
    );
    const incomeData = this.data().map((item) => item.total_income.toString());
    const expenseData = this.data().map((item) =>
      item.total_expense.toString()
    );

    return {
      series: [
        {
          name: 'Income',
          color: this.INCOME_COLOR,
          data: incomeData,
        },
        {
          name: 'Expense',
          data: expenseData,
          color: this.EXPENSE_COLOR,
        },
      ],
      chart: {
        sparkline: {
          enabled: false,
        },
        type: 'bar',
        width: '100%',
        height: 150,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '100%',
          borderRadiusApplication: 'end',
          borderRadius: 6,
          dataLabels: {
            position: 'top',
          },
        },
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        intersect: false,
        formatter: (value: any) => {
          return '$' + value;
        },
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
          },
          formatter: (value: any) => {
            return '$' + value;
          },
        },
        categories: months,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
          },
        },
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -20,
        },
      },
      fill: {
        opacity: 1,
      },
    };
  });

  // Getter for chart options
  get options() {
    return this.chartOptions();
  }

  constructor() {
    effect(() => {
      if (
        document.getElementById('bar-chart') &&
        typeof ApexCharts !== 'undefined' &&
        this.data()
      ) {
        const chart = new ApexCharts(
          document.getElementById('bar-chart'),
          this.options
        );
        chart.render();
      }
    });
  }
}
