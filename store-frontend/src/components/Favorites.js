import ProductCard from './ProductCard';

import './Favorites.css'

//страница Избраного! те ТОВАРЫ которые пользователь добавил в ИЗБРАНОЕ!

//принимаем даные в функции, те что мы передали в Route </favorites

////favorites — список ID избранных товаров;
//products — все товары каталога;
//handleToggleFavorite — функция, которая добавляет/убирает товар из избранного.
//const favoriteProducts = products.filter(item => favorites.includes(item.id)); -  получить из всех products только те товары, ID которых находятся в favorites.

//products
   //↓
//все товары

//favorites
  // ↓
//[3, 7, 12]     ← ID избранных товаров

//products.filter(...)
  // ↓
//favoriteProducts
  // ↓
//только товары 3, 7 и 12

function Favorites({ favorites, products, handleToggleFavorite, addItem, addingProductId}) {

    const favoriteProducts = products.filter(item => favorites.includes(item.id));

    return (
        <div className="favorites">
            <h1>Избранное</h1>

        <div className="favorites-products">

            {favoriteProducts.map((item) => (

                <ProductCard
                    key={item.id}
                    item={item}
                    addItem={addItem}
                    handleToggleFavorite={handleToggleFavorite}
                    addingProductId={addingProductId}
                    favorites={favorites}
                />
            ))}
        </div>
        </div>
    );
}


export default Favorites;