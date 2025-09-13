import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandableTableComponent, ExpandableTableColumn, ExpandableTableData } from '@components/expandable-table/expandable-table.component';
import { CategoriesService } from '@services/categories/categories.service';
import { Category } from '@models/categories.model';
import { CATEGORY_ICONS } from '../../../core/services/categories/categories-icons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [CommonModule, ExpandableTableComponent],
    templateUrl: './categories-list.component.html',
    styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
    private categoriesService = inject(CategoriesService);
    private sanitizer = inject(DomSanitizer);
    
    loading = false;
    
    headers: ExpandableTableColumn[] = [
        { key: 'id', label: 'ID', sortable: true, width: '80px', align: 'center' },
        { key: 'name', label: 'Category Name', sortable: true },
        { key: 'icon', label: 'Icon', sortable: false, isHtml: true },
        { key: 'parent', label: 'Parent', sortable: true, width: '120px' },
        { key: 'subcategoryCount', label: 'Subcategories', sortable: true, align: 'center', width: '120px' },
        { key: 'actions', label: 'Actions', align: 'right', width: '150px' }
    ];
    
    data: ExpandableTableData[] = [];
    
    ngOnInit(): void {
        this.loadCategories();
    }
    
    private loadCategories(): void {
        this.loading = true;
        this.categoriesService.getCategories().subscribe((response: any) => {
            this.data = this.mapCategoriesToTableData(response);
            this.loading = false;
        });
    }
    
    private mapCategoriesToTableData(categories: Category[]): ExpandableTableData[] {
        return categories.map((category: Category) => {
            const name = category.name;
            const tableRow: ExpandableTableData = {
                id: category.id,
                name: name,
                icon: category.icon,
                parent: category.parent || 'Root',
                subcategoryCount: category.subcategories?.length || 0,
                actions: 'Edit | Delete'
            };
            
            // Add subcategories as children if they exist
            if (category.subcategories && category.subcategories.length > 0) {
                tableRow.children = category.subcategories.map((sub: Category) => ({
                    id: sub.id,
                    name: sub.name,
                    parent: sub.parent || category.id,
                    subcategoryCount: sub.subcategories?.length || 0
                }));
                
                tableRow.childrenColumns = [
                    { key: 'id', label: 'ID', width: '80px', align: 'center' },
                    { key: 'name', label: 'Subcategory Name' },
                    { key: 'subcategoryCount', label: 'Sub-subcategories', align: 'center', width: '140px' }
                ];
            }
            
            return tableRow;
        });
    }
    
    // Helper method to get translation in preferred language
    private getTranslation(translations: any, key: string, preferredLang: string = 'en'): string {
        if (!translations) return '';
        
        // Try preferred language first
        if (translations[preferredLang] && translations[preferredLang][key]) {
            return translations[preferredLang][key];
        }
        
        // Fallback to any available language
        for (const lang in translations) {
            if (translations[lang] && translations[lang][key]) {
                return translations[lang][key];
            }
        }
        
        return '';
    }
}