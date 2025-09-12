import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private destroy$ = new Subject<boolean>();
  title = 'admin';

  ngOnInit(): void {
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
