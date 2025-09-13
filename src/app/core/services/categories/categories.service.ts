import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Category, CategoryResponse } from '@models/categories.model';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';
import { CATEGORY_ICONS } from './categories-icons';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private readonly apiUrl = `${environment.apiUrl}/expenses`;

  getCategories(): Observable<Category[]> {
    const language = navigator.language;
    const preferredLang = language.startsWith('es') ? 'es' : 'en';

    return this.http
      .get<CategoryResponse[]>(`${this.apiUrl}/categories/`)
      .pipe(
        map((response: CategoryResponse[]) =>
          response.map((categoryResponse: CategoryResponse) =>
            this.mapCategoryResponseToCategory(categoryResponse, preferredLang)
          )
        )
      );
  }

  private mapCategoryResponseToCategory(
    categoryResponse: CategoryResponse,
    preferredLang: string = 'en'
  ): Category {
    // Get the name from translations (preferring user's language, fallback to English)
    const name =
      categoryResponse.translations?.[
        preferredLang as keyof typeof categoryResponse.translations
      ]?.name ||
      categoryResponse.translations?.en?.name ||
      categoryResponse.translations?.es?.name ||
      'Unnamed Category';

    // Get sanitized icon HTML
    const iconHtml =
      CATEGORY_ICONS.get(categoryResponse.translations?.en?.name || '') ||
      CATEGORY_ICONS.get(name) ||
      this.getDefaultIcon();

    return {
      id: categoryResponse.id,
      parent: categoryResponse.parent,
      name: name,
      icon: this.sanitizer.bypassSecurityTrustHtml(iconHtml),
      subcategories:
        categoryResponse.subcategories?.map((sub) =>
          this.mapCategoryResponseToCategory(sub, preferredLang)
        ) || [],
    };
  }

  private getDefaultIcon(): string {
    return `
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
        `;
  }
}
