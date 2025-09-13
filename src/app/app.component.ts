import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyService } from './core/services/currency/currency.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private currencyService = inject(CurrencyService);
  private destroy$ = new Subject<boolean>();
  title = 'admin';

  ngOnInit(): void {
    // Log initialization info
    console.log('App loaded with currency:', this.currencyService.getCurrentCurrency());
    console.log('User locale:', this.currencyService.getUserLocale());
    
    // For some reason initFlowbite needs to called in order to have data attributes working
    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {  initFlowbite(); })
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
