import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //useNavigate — это React Router, который позволяет программно переходить на другой адрес.

import './ProductCard.css';

import FavoritesIcon from './icons/FavoritesIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

//!!! ProductCard js - как выглядить ОДНА КАРТОЧКА ТОВАРУ

//То есть item.id и productId — это одно и то же значение, просто:

        //item.id — как оно называется в ProductCard;
        //productId — как мы называем это значение в функции addItem, - export async function addItem(orderId, productId, sizeId) {

//App.js
//handleAddToCart
//      ↓
//Catalog
//addItem={handleAddToCart}
//      ↓
//ProductCard
//addItem
//      ↓
//addItem(item.id, selectedSize)

//&& - логическое И

//FavoritesIcon — наша SVG-иконка из отдельного файла.
//active={favorites.includes(item.id)} — проверяем, находится ли товар в избранном.
//handleToggleFavorite(item.id) — существующая функция переключения избранного. Мы её не меняем.
//size={22} — задаём размер сердечка.

//navigate(`/product/${item.id}`); - тут использ надо именно `` обратные кавычки
//const navigate = useNavigate(); -
                //navigate — navigate — переменная, в которой хранится возвращённая им функция
                //const navigate = ...
                //Сохраняем эту функцию в переменную navigate

//ВАЖНО onClick={() => addItem(item.id, selectedSize)} - в кнопку при вызове addItem передаем два параметра
                                                //так как у нас const handleAddToCart = async (productId, sizeId) => {

//общая карточка товара!
function ProductCard({
    item,
    addItem,
    addingProductId,
    handleToggleFavorite,
    favorites,
}) {

    const navigate = useNavigate();

    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);

    const [showDescription, setShowDescription] = useState(false);
    const [showAddedMessage, setShowAddedMessage] = useState(false);//показывать ли сообщение об успешном добавлении товара.

    return (
        <div className='catalog-item'>

            {showAddedMessage && (
                <div className="product-added-message">
                    <span className='product-added-cheсk'>✓</span>

                    <div>
                        <strong>Товар додано до кошика</strong>
                        <p>{item.name}</p>
                    </div>

                    <button
                        onClick={() => setShowAddedMessage(false)}
                        aria-label="Закрити повідомлення"
                    >
                        ×
                    </button>
                </div>
            )}

            {item.image ? (
                <img
                    className='catalog-image'
                    src={item.image}
                    alt={item.name}
                />
            ) : (
                <div className='catalog-image'>
                       Немає фото
                </div>
            )}

            <h3>{item.name}</h3>

            <div className='product-sizes'>
                <span>Розмір:</span>

            {/*То есть null у нас означает: «Размер сейчас не выбран».*/}
                {item.sizes.map((size) => (
                    <button
                        key={size.id}
                        onClick={() => {
                            setSelectedSize(
                                selectedSize === size.id
                                    ? null
                                    : size.id
                            );

                            setSizeError(false);
                        }}
                        className={selectedSize === size.id ? 'selectedSize' : ''}
                    >
                        {size.name}
                    </button>
                ))}
            </div>

            <p className='catalog-price'>
                {item.price}грн
            </p>

            {sizeError && (
                <p className="size-error">
                    ⚠️ Будь ласка, оберіть розмір
                </p>
            )}

         {showDescription && (
                <div className="product-description">

                    <h4>Деталі товару</h4>

                    <p>{item.description}</p>

                </div>
         )}

        <div className='product-actions'>



            <button
                className='catalog-btn'
                onClick={async() => {
                    if(!selectedSize) {
                       setSizeError(true);
                       return;
                    }
                    setSizeError(false);

                    const result = await addItem(item.id, selectedSize);

                    if(result === true) {
                        setShowAddedMessage(true);
                    }
                }}

                disabled={addingProductId === item.id}
            >
                {addingProductId === item.id ? (
                    'Додаємо'
                ) : (
                    <>
                        Купити <span className="buy-cart-icon">🛒</span>
                    </>
                )}
            </button>


            <button
                className="details-icon-btn"
                onClick={() => {
                    // Если экран мобильный — открываем страницу товара.
                    if (window.matchMedia("(max-width: 600px)").matches) {
                        navigate(`/product/${item.id}`);
                    }else {
                    // На компьютере оставляем прежнее раскрытие описания.
                        setShowDescription(!showDescription)
                    }
                }}
                aria-label={showDescription ? "Сховати деталі" : "Показати деталі"}
                title={showDescription ? "Сховати деталі" : "Показати деталі"}
            >
                <ArrowDownIcon
                    className={showDescription ? "details-arrow details-arrow-open" : "details-arrow"}
                    size={22}
                />
            </button>


            <button
                className="favorite-btn"
                onClick={() => handleToggleFavorite(item.id)}
                aria-label={
                    favorites.includes(item.id)
                        ? "Видалити з обраного"
                        : "Додати в обране"
                }
                title={
                    favorites.includes(item.id)
                        ? "Видалити з обраного"
                        : "Додати в обране"
                }
            >
                <FavoritesIcon
                    active={favorites.includes(item.id)}
                    size={20}
                />
            </button>

        </div>
        </div>
    );
}


export default ProductCard;