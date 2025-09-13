import { SafeHtml } from "@angular/platform-browser";

export interface CategoryTranslation {
    name: string;
}

export interface CategoryResponse {
    id: string;
    parent: string | null;
    icon: string;
    subcategories: CategoryResponse[];
    translations: {
        en: CategoryTranslation;
        es: CategoryTranslation;
    };
}

export interface Category {
    id: string;
    parent: string | null;
    name: string;
    icon: SafeHtml;
    subcategories: Category[];
}