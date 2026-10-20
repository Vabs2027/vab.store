import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

import BackIcon from './icons/BackIcon';


//() => { ... } Нет аргументов → выполняем код внутри фигурных скобок
//size => size.name Есть аргумент size → возвращаем size.name

//Знак ! переворачивает логическое значение.
//- !true → false;
//- !false → true.

//   || означает логическое «ИЛИ». В JavaScript его также часто используют для выбора запасного значения.
//   && означает логическое «И». В React его часто используют, чтобы показать элемент только при выполнении условия.
//   ? Это называется тернарный оператор. Он представляет собой короткую запись условия.
            //Общая схема:
            //условие ? значение_если_да : значение_если_нет
// => — отделяет аргументы от кода, который будет выполнять функция., в {дейсвия самой функции}
     // то есть: функция имя() => { ... } читаем так: «Создай функцию, которая при вызове выполнит код внутри фигурных скобок».

//selectedSize === size.id
        //? 'product-details-size selected'
        //: 'product-details-size'
            //Это значит:
            //- если selectedSize совпадает с size.id, добавляется класс selected;
            //- если не совпадает — используется обычный класс.

function ProductDetails({
    products,
    addItem,
    addingProductId
}) {

     // id товара из адреса, как прмиер -  /product/13.
     const {productId} = useParams();

     //нужно для кнопки возврата в каталог
     const navigate = useNavigate();

     // Храним выбранный пользователем размер.
    const [selectedSize, setSelectedSize] = useState(null);

    // Показываем предупреждение, если размер не выбран.
    const [sizeError, setSizeError] = useState(false);

    // Находим в списке products именно тот товар, который открыт у пользователя
    const item = products.find(
        product => String(product.id) === productId
    );

    //если товар не найден или товар еще загруж
    if (!item) {
        return (
            <div className='product-details'>
                <button
                    className="details-back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Назад
                </button>

                <p>Товар не найден или ещё загружается...</p>
            </div>
        );
    }

    //получаем размер тов
    const sizes = item.sizes || [];

    //проверка надо ли выбирать размер перед покупкой
    const needsSize = sizes.length > 0;

    // Определяем, выполняется ли добавление именно этого товара.
    const isAdding = addingProductId === item.id;

    // Добавляем товар в корзину с выбранным размером.
    const handleBuy = () => {

        addItem(item.id, selectedSize)
    };

    // Получаем изображение товара.
    const image = item.image || item.product_image;

    return (
        <div className="product-details">

            {/* Кнопка возвращения на предыдущую страницу. */}
            <button
                className="details-back-btn"
                onClick={() => navigate(-1)}
            >
                <BackIcon />
                Назад
            </button>

            <div className="product-details-content">

                {/* Левая часть — фотография товара. */}
                <div className="product-details-image-wrapper">
                    {image ? (
                        <img
                            className="product-details-image"
                            src={image}
                            alt={item.name}
                        />
                    ) : (
                        <div className="product-details-no-image">
                            Фото відсутнє
                        </div>
                    )}
                </div>

                {/* Правая часть — информация о товаре. */}
                <div className="product-details-info">

                    <h1>{item.name}</h1>

                    <p className="product-details-price">
                        {item.price} грн
                    </p>

                    {/* Полное описание товара. */}
                    <div className="product-details-description">
                        <h2>Деталі товару</h2>
                        <p>
                            {item.description || 'Опис товару відсутній.'}
                        </p>
                    </div>

                    {/* Размеры, доступные для выбора. */}
                    {needsSize && (
                        <div className="product-details-sizes">
                            {sizeError && !selectedSize && (
                                <p className="size-error">
                                    ⚠️ Будь ласка, оберіть розмір
                                </p>
                            )}

                            <div className="product-details-size-list">
                                {sizes.map(size => (
                                    <button
                                        key={size.id}
                                        type="button"
                                        className={
                                            selectedSize === size.id
                                                ? 'product-details-size selected'
                                                : 'product-details-size'
                                        }
                                        onClick={() => {
                                             // Если размер уже выбран — отменяем выбор.
                                             if (selectedSize === size.id) {
                                                setSelectedSize(null);
                                             }else {
                                                // Иначе выбираем нажатый размер.
                                                setSelectedSize(size.id);
                                             }
                                        }}
                                    >
                                        {size.name}
                                    </button>
                                ))}

                            </div>
                        </div>
                    )}

                    {/* Кнопка покупки на отдельной странице товара. */}
                    {/*!selectedSize — размер не выбран
                        setSizeError(true) — показываем предупреждение.
                        return — останавливаем покупку, пока размер не выбран.
                        setSizeError(false) — скрываем предупреждение после выбора размера и повторного нажатия.*/}
                    <button
                        className="product-details-buy-btn"
                        onClick={() => {
                            if (needsSize && !selectedSize) {
                                setSizeError(true);
                                return;
                            }
                            setSizeError(false);
                            handleBuy();
                        }}
                        disabled={isAdding}
                    >
                        {isAdding ? 'Додаємо...' : 'Купити 🛒'}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
