import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '@components/container/container.component';

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
  profileForm: FormGroup;
  isEditMode = false;
  isLoading = false;

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
    this.profileForm.patchValue(this.userData);
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