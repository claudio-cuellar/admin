import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuItem, MenuSection } from '@models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private sanitizer = inject(DomSanitizer);

  private menuSections: MenuSection[] = [
    {
      id: 'main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
            </svg>
          `),
          route: '/main/dashboard',
        },
        {
          id: 'transactions',
          label: 'Transactions',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"/>
            </svg>

          `),
          route: '/main/transactions',
        },
        {
          id: 'categories',
          label: 'Categories',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"/>
            </svg>

          `),
          route: '/main/categories',
        },
        // {
        //   id: 'reports',
        //   label: 'Reports',
        //   icon: this.sanitizer.bypassSecurityTrustHtml(`
        //     <svg aria-hidden="true" class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //       <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
        //       <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
        //     </svg>
        //   `),
        //   route: '/main/reports',
        // },
        // {
        //   id: 'pages',
        //   label: 'Pages',
        //   icon: this.sanitizer.bypassSecurityTrustHtml(`
        //     <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //       <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
        //     </svg>
        //   `),
        //   isCollapsible: true,
        //   children: [
        //     { id: 'settings', label: 'Settings', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/settings' },
        //     { id: 'kanban', label: 'Kanban', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/kanban' },
        //     { id: 'calendar', label: 'Calendar', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/calendar' }
        //   ]
        // },
        // {
        //   id: 'sales',
        //   label: 'Sales',
        //   icon: this.sanitizer.bypassSecurityTrustHtml(`
        //     <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //       <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
        //     </svg>
        //   `),
        //   isCollapsible: true,
        //   children: [
        //     { id: 'products', label: 'Products', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/products' },
        //     { id: 'billing', label: 'Billing', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/billing' },
        //     { id: 'invoice', label: 'Invoice', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/invoice' }
        //   ]
        // },
        // {
        //   id: 'messages',
        //   label: 'Messages',
        //   icon: this.sanitizer.bypassSecurityTrustHtml(`
        //     <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //       <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
        //       <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
        //     </svg>
        //   `),
        //   route: '/messages',
        //   badge: {
        //     text: '4',
        //     class: 'inline-flex justify-center items-center w-5 h-5 text-xs font-semibold rounded-full text-primary-800 bg-primary-100 dark:bg-primary-200 dark:text-primary-800'
        //   }
        // },
        // {
        //   id: 'authentication',
        //   label: 'Authentication',
        //   icon: this.sanitizer.bypassSecurityTrustHtml(`
        //     <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //       <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
        //     </svg>
        //   `),
        //   isCollapsible: true,
        //   children: [
        //     { id: 'signin', label: 'Sign In', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/auth/signin' },
        //     { id: 'signup', label: 'Sign Up', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/auth/signup' },
        //     { id: 'forgot-password', label: 'Forgot Password', icon: this.sanitizer.bypassSecurityTrustHtml(''), route: '/auth/forgot-password' }
        //   ]
        // }
      ],
    },
    {
      id: 'secondary',
      hasSeparator: true,
      items: [
        {
          id: 'logout',
          label: 'Log out',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
            </svg>
          `),
          route: '/auth/logout',
        },
        // {
        //   id: 'components',
        //   label: 'Components',
        //   icon: this.sanitizer.bypassSecurityTrustHtml(`
        //     <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //       <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
        //     </svg>
        //   `),
        //   route: '/components'
        // },
        // {
        //   id: 'help',
        //   label: 'Help',
        //   icon: this.sanitizer.bypassSecurityTrustHtml(`
        //     <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        //       <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd"></path>
        //     </svg>
        //   `),
        //   route: '/help'
        // }
      ],
    },
  ];

  getMenuSections(): MenuSection[] {
    return this.menuSections;
  }

  getMenuItemById(id: string): MenuItem | null {
    for (const section of this.menuSections) {
      for (const item of section.items) {
        if (item.id === id) return item;
        if (item.children) {
          const childItem = item.children.find((child) => child.id === id);
          if (childItem) return childItem;
        }
      }
    }
    return null;
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): void {
    const item = this.getMenuItemById(id);
    if (item) {
      Object.assign(item, updates);
    }
  }
}
