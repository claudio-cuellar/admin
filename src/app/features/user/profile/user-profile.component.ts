import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '@components/container/container.component';
import { GlobalStateService } from '@services/global-state/global-state.service';
import { UserService } from '@services/user/user.service';
import { switchMap, take, throwError } from 'rxjs';
import { User } from '@models/user.model';

export interface UserProfile {
  email: string;
  family_role: string;
  first_name: string;
  last_name: string;
  username: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContainerComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private globalState = inject(GlobalStateService);
  private userService = inject(UserService);
  profileForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  displayName: string = '';
	profilePictureUrl: string = '';
  defaultProfilePicture: string =
		'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png';

  // Mock user data
  userData: UserProfile = {
    email: "claudio.cuellar@gmail.com",
    family_role: "guest",
    first_name: "",
    last_name: "",
    username: "claudio"
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      email: [{value: '', disabled: true}],
      family_role: [{value: '', disabled: true}],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      username: [{value: '', disabled: true}]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getCurrentUserDetails().pipe(
      take(1),
      switchMap((user: User | null) => {
        if (user) {
						this.profileForm.patchValue(user);

            return this.userService.getUserImage(user?.id);
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

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    
    if (!this.isEditMode) {
      // Cancel edit - reload original data
      this.loadUserData();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const formData = this.profileForm.getRawValue();
        this.userData = { ...this.userData, ...formData };
        this.isEditMode = false;
        this.isLoading = false;
        console.log('Profile updated:', this.userData);
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.replace('_', ' ')} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}