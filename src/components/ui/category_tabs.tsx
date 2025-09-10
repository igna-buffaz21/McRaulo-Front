import type { CategoryTabsProps } from "@/interfaces/categoria.interface";

export default function CategoryTabs({ 
    categories, 
    activeCategory, 
    onCategoryChange 
  }: CategoryTabsProps) {
    return (
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-1 min-w-0 p-4 text-center font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-red-600 text-white border-b-2 border-red-600'
                  : 'bg-white text-gray-700 hover:bg-red-50'
              }`}
            >
              <img className='w-6 h-6 mb-1 mx-auto' src={category.icon} alt="" />
              <div className="text-sm font-semibold">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }