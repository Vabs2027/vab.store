import React from 'react';
import { useState, useEffect } from 'react';

import ProductCard from './ProductCard';
import './BlackFriday.css'

//Поскольку Black Friday использует тот же компонент ProductCard,
//карточки автоматически используют те же стили, включая мобильные настройки @media (max-width: 600px).

import { getBlackFridayProducts } from '../services/products';//подключаем функцию самого запроса

//useState([]) — вначале массив пустой, потому что данные с сервера ещё не получены.

//.then(data => { ... }) — когда запрос успешно завершится, полученные данные попадут в переменную data.
//setBlackFridayProducts(data) — сохраняем полученный массив в состояние React. После изменения состояния React повторно отобразит компонент.
//[] — эффект запускается при монтировании компонента, то есть при открытии страницы Black Friday. В режиме разработки с StrictMode запрос может выполняться дважды.
      //Здесь [] — это массив зависимостей. Он сообщает React, когда нужно повторно запускать эффект.
        //Как запомнить?
            //- [ ] — [] управляет запуском эффекта.
            //- [orderId] — эффект зависит от orderId.
            //- Без массива — эффект выполняется после каждого рендера.

            //синтаксис useEffect:
                //useEffect(
                //        () => {
        // Код, который нужно выполнить
        //                     },
        //            [] // Массив зависимостей - [ ] — массив, который определяет, от каких значений зависит повторный запуск эффекта.
        //        );
        //Монтирование = появление компонента на странице.
        //[] означает: эффект зависит от отсутствия изменяющихся значений и при обычной работе запускается после монтирования компонента.
//Первый рендер
//blackFridayProducts пока равен [].

//Запускается эффект
//Вызывается getBlackFridayProducts(), и React ждёт, пока запрос завершится.

//Сервер возвращает товары
//Полученные данные сохраняются через setBlackFridayProducts(data).

//Следующий рендер
//React отображает компонент уже с полученными товарами.

//<BlackFriday addItem={handleAddToCart} /> //Тогда BlackFriday всё равно принял бы её под именем addItem, но мы передали именно ерез addItem
//Главное запомнить: слева от = — имя пропса, справа — значение, которое передаём. Значением может быть функция, число, строка, объект или другое значение.

function BlackFriday({
    addItem,
    addingProductId,
    handleToggleFavorite,
    favorites,
}) {

    const [blackFridayProducts, setBlackFridayProducts] = useState([]);

    useEffect(() => {
        getBlackFridayProducts()
            .then(data => {setBlackFridayProducts(data);

            console.log('Black Frida products:', data)
        });
    }, []);

    return (

        <div className='black-friday'>

            <h1 className='black-friday-title'>
                BlackFriday
            </h1>

            <p>Товари зі спеціальними пропозиціями</p>

        <div className='black-friday-products'>
            {blackFridayProducts.map((item) => (
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



        </div>
    );
}

export default BlackFriday;
