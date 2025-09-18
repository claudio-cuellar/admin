import {
	Component,
	EventEmitter,
	inject,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { GlobalStateService } from '@services/global-state/global-state.service';
import { User } from '@models/user.model';
import { RouterLink } from '@angular/router';
import { Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@services/index';

@Component({
	selector: 'app-topbar',
	imports: [CommonModule, TitleCasePipe, RouterLink],
	templateUrl: './topbar.component.html',
	styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnInit, OnDestroy {
	@Output() menuClick = new EventEmitter<void>();
	private globalState = inject(GlobalStateService);
	private userService = inject(UserService);
	private destroy$: Subject<boolean> = new Subject<boolean>();

	private http = inject(HttpClient);

	user: User | null = null;
	displayName: string = '';
	profilePictureUrl: string = '';
	defaultProfilePicture: string =
		'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png';

	constructor() {
		this.displayName = '';
		this.profilePictureUrl = this.defaultProfilePicture;
	}

	toggleMenu() {
		this.menuClick.emit();
	}

	closeDropdown() {
		const dropdown = document.getElementById('dropdown');
		if (dropdown) {
			dropdown.classList.add('hidden');
		}
	}

	ngOnInit(): void {
		this.globalState.user$
			.pipe(
				takeUntil(this.destroy$),
				switchMap((user: User | null) => {
					if (user) {
						this.user = user;

						// Set display name
						if (this.user.first_name && this.user.last_name) {
							this.displayName = `${this.user.first_name} ${this.user.last_name}`;
						} else {
							this.displayName = this.user.username;
						}

						return this.userService.getUserImage(this.user?.id);
					}

					return throwError(() => new Error('User not found'));
				})
			).subscribe({
        next: (blob: Blob) => {
          this.profilePictureUrl = URL.createObjectURL(blob);
        },
        error: () => {
          this.profilePictureUrl = this.defaultProfilePicture;
        }
      });
	}

	onProfilePictureError(): void {
		// Fallback to default picture if API call fails
		this.profilePictureUrl = this.defaultProfilePicture;
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		URL.revokeObjectURL(this.profilePictureUrl);
	}
}
