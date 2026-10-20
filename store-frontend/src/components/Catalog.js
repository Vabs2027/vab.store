
import {useState} from 'react';

import ProductCard from './ProductCard';

import CategoriesMenu from './CategoriesMenu';


import './Catalog.css';


//<Catalog /> — это компонент,то есть это отдельная часть приложения App.js
//props — это способ передать данные или функции от родительского компонента к дочернему.
//App передаёт компоненту Catalog функцию addItem (как пример), и уже Catalog решает когда ее вызвать

// const [selectedCategory, setSelectedCategory] = useState([null]); - выбранная категория для фильтрации товаров
                                                    //null - показывает все товары



function Catalog({search, setSearch, products, categories, loadingProducts, addItem, addingProductId, handleToggleFavorite, favorites, showSearch, showCategories}) {

    const [selectedCategory, setSelectedCategory] = useState(null);

    //логика поиска, /*фильтр поиска, filteredProducts — новая обычная переменная, содержащая только найденные товары.*/
    const filteredProducts = products.filter((item) => {
        const matchesSearch = item.name
            .toLowerCase()
            .includes(search.trim().toLowerCase());

        const matchesCategory =
            selectedCategory === null ||
            item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
    //То есть JSX внутри return — это интерфейс компонента.
    //{loadingProducts} - карточки товаров

    //Catalog
   //│
   //├── categories ──────────────→ CategoriesMenu
   //│
   //├── selectedCategory ────────→ CategoriesMenu
   //│
   //└── setSelectedCategory ─────→ CategoriesMenu

    //Catalog.js → хранит, какая категория выбрана (selectedCategory)

    //{!showSearch && (означает: показывай заголовок каталога и категории только тогда, когда поиск НЕ открыт.


return (
    <div className='catalog-layout'>

        {!showSearch && (
            <h2 className='catalog-title'>
                Каталог товарів
            </h2>
        )}

        {/* Левая часть каталога */}
        {showCategories && (
            <aside className='catalog-sidebar'>

                <CategoriesMenu
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

            </aside>
        )}

        {/* Правая часть каталога */}
        <main className='catalog-content'>

            {loadingProducts ? (

                <p>Завантаження товарів...</p>

            ) : filteredProducts.length === 0 && search.trim() !== "" ? (

                <p>🔍 За вашим запитом товарів не знайдено.</p>

            ) : (

                <div className='catalog-products'>

                    {filteredProducts.map((item) => (

                        <ProductCard
                            key={item.id}
                            item={item}
                            addItem={addItem}
                            addingProductId={addingProductId}
                            handleToggleFavorite={handleToggleFavorite}
                            favorites={favorites}
                        />

                    ))}

                </div>
            )}

        </main>

    </div>
);
}

export default Catalog;