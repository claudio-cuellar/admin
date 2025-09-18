import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { GlobalStateService } from '@services/global-state/global-state.service';
import { User } from '@models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [
    CommonModule,
    TitleCasePipe,
    RouterLink
],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnInit {
  private globalState = inject(GlobalStateService);
  @Output() menuClick = new EventEmitter<void>();
  
  user: User | null = null;
  displayName: string = '';
  

  toggleMenu() {
    this.menuClick.emit();
  }

  constructor() {
    this.displayName = '';
  }

  ngOnInit(): void {
    this.globalState.user$.subscribe((user: User | null) => {
      if (user) {
        this.user = user;
        console.log(this.user);
        if (this.user.first_name && this.user.last_name) {
          this.displayName = `${this.user.first_name} ${this.user.last_name}`;
        } else {
          this.displayName = this.user.username;
        }
      }
    });
  }
}
