import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from '@components/container/container.component';
import { EnhancedContainerComponent } from '@components/enhanced-container/enhanced-container.component';

export interface TransactionStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  selected?: boolean;
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  selected?: boolean;
}

export interface TransactionDetails {
  amount: number;
  description: string;
  date: string;
}

@Component({
  selector: 'app-transactions-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContainerComponent,
    EnhancedContainerComponent,
  ],
  templateUrl: './transactions-create.component.html',
  styleUrl: './transactions-create.component.css',
})
export class TransactionsCreateComponent {
  currentStep = 1;
  isLoading = false;

  steps: TransactionStep[] = [
    {
      id: 1,
      title: 'Categories',
      description: '',
      completed: false,
      active: true,
    },
    {
      id: 2,
      title: 'Subcategories',
      description: '',
      completed: false,
      active: false,
    },
    {
      id: 3,
      title: 'Details',
      description: '',
      completed: false,
      active: false,
    },
  ];

  categories: Category[] = [
    { id: 1, name: 'Food & Dining', icon: '🍽️' },
    { id: 2, name: 'Transportation', icon: '🚗' },
    { id: 3, name: 'Shopping', icon: '🛍️' },
    { id: 4, name: 'Entertainment', icon: '🎬' },
    { id: 5, name: 'Bills & Utilities', icon: '💡' },
    { id: 6, name: 'Healthcare', icon: '🏥' },
  ];

  subcategories: Subcategory[] = [
    { id: 1, name: 'Restaurants', categoryId: 1 },
    { id: 2, name: 'Groceries', categoryId: 1 },
    { id: 3, name: 'Gas', categoryId: 2 },
    { id: 4, name: 'Public Transport', categoryId: 2 },
    { id: 5, name: 'Clothing', categoryId: 3 },
    { id: 6, name: 'Electronics', categoryId: 3 },
  ];

  transactionDetails: TransactionDetails = {
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  };

  selectedCategory: Category | null = null;
  selectedSubcategory: Subcategory | null = null;

  get filteredSubcategories(): Subcategory[] {
    return this.selectedCategory
      ? this.subcategories.filter(
          (sub) => sub.categoryId === this.selectedCategory!.id
        )
      : [];
  }

  get canProceedToStep2(): boolean {
    return this.selectedCategory !== null;
  }

  get canProceedToStep3(): boolean {
    return this.selectedSubcategory !== null;
  }

  get canComplete(): boolean {
    return (
      this.transactionDetails.amount > 0 &&
      this.transactionDetails.description.trim() !== ''
    );
  }

  selectCategory(category: Category): void {
    this.categories.forEach((cat) => (cat.selected = false));
    category.selected = true;
    this.selectedCategory = category;
    this.selectedSubcategory = null;
    this.subcategories.forEach((sub) => (sub.selected = false));
  }

  selectSubcategory(subcategory: Subcategory): void {
    this.subcategories.forEach((sub) => (sub.selected = false));
    subcategory.selected = true;
    this.selectedSubcategory = subcategory;
  }

  goToStep(stepNumber: number): void {
    if (
      stepNumber === 1 ||
      (stepNumber === 2 && this.canProceedToStep2) ||
      (stepNumber === 3 && this.canProceedToStep3)
    ) {
      this.currentStep = stepNumber;
      this.updateStepStates();
    }
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      if (
        (this.currentStep === 1 && this.canProceedToStep2) ||
        (this.currentStep === 2 && this.canProceedToStep3)
      ) {
        this.currentStep++;
        this.updateStepStates();
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepStates();
    }
  }

  private updateStepStates(): void {
    this.steps.forEach((step, index) => {
      step.active = step.id === this.currentStep;
      step.completed = step.id < this.currentStep;
    });
  }

  submitTransaction(): void {
    if (this.canComplete) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        console.log('Transaction submitted:', {
          category: this.selectedCategory,
          subcategory: this.selectedSubcategory,
          details: this.transactionDetails,
        });
        this.isLoading = false;
        // Reset form or navigate away
      }, 2000);
    }
  }

  onCardClick(): void {
    // Implementation for card click if needed
  }

  // Add these helper methods to the component class
  getStepClasses(step: TransactionStep, hasConnector: boolean): string {
    const baseClasses = 'flex items-center cursor-pointer';
    const connectorClasses = hasConnector ? 'w-full' : '';
    const stateClasses = step.active
      ? 'text-blue-600 dark:text-blue-500'
      : step.completed
      ? 'text-green-600 dark:text-green-500'
      : 'text-gray-500 dark:text-gray-400';

    return `${baseClasses} ${connectorClasses} ${stateClasses}`;
  }

  getStepNumberClasses(step: TransactionStep): string {
    const baseClasses =
      'flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0';

    if (step.completed) {
      return `${baseClasses} bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300`;
    } else if (step.active) {
      return `${baseClasses} bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300`;
    } else {
      return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400`;
    }
  }

  getCategoryCardClasses(category: Category): string {
    return category.selected
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
  }

  getSubcategoryCardClasses(subcategory: Subcategory): string {
    return subcategory.selected
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
  }

  getButtonClasses(enabled: boolean): string {
    return enabled
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400';
  }

  getSubmitButtonClasses(): string {
    return this.canComplete && !this.isLoading
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400';
  }
}
