import { Component, inject, OnInit } from '@angular/core';
import { IncomeExpenseSummaryComponent } from "./income-expense-summary/income-expense-summary.component";
import { ReportsService } from '@services/reports/reports.service';
import { concatMap, map, take } from 'rxjs';
import { ExpensesByCategoryComponent } from "./expenses-by-category/expenses-by-category.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IncomeExpenseSummaryComponent, ExpensesByCategoryComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{
  private reportsService = inject(ReportsService);
  incomeVsExpensesData: any;
  expensesByCategoryData: any;
  isLoading = false;

  ngOnInit(): void {
    const incomeVsExpensesData$ = this.reportsService.getIncomeVsExpenseSummary();
    const expensesByCategory$ = this.reportsService.getExpensesByCategory();
    this.isLoading = true;

    incomeVsExpensesData$.pipe(
      take(1),
      concatMap(incomeVsExpensesData => {
        return expensesByCategory$.pipe(
          map(expensesByCategory => {
            return {
              incomeVsExpensesData,
              expensesByCategory
            }
          })
        )
      })
    ).subscribe({
      next: (response) => {
        this.incomeVsExpensesData = response.incomeVsExpensesData;
        this.expensesByCategoryData = response.expensesByCategory;
        this.isLoading = false;
      }
    });
  }
}
