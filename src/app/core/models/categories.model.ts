export interface CategoryTranslation {
    name: string;
}

export interface Category {
    id: string;
    parent: string | null;
    subcategories: Category[];
    translations: {
        en: CategoryTranslation;
        es: CategoryTranslation;
    };
}