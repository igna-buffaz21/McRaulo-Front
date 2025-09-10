export interface Category {
    id: number;
    name: string;
    icon: string;
}

export interface CategoryTabsProps {
    categories: Category[];
    activeCategory: number;
    onCategoryChange: (categoryId: number) => void;
  }