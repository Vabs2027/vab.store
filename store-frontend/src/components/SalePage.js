import './SalePage.css';
import { useState } from 'react';
/*это у нас страница АКЦИЙ*/

/*🔴 Акції

↓

NavLink

↓

/catalog/sale

↓

React Router находит:

<Route path="/catalog/sale" element={<SalePage />} /> из файла App

↓

показывает:
Акції*/


// SalePage получает товары через props.

//prev — это предыдущее значение selectedSizes.
//...prev — spread operator, то есть «разложить содержимое объекта сюда».
//[item.id] динамическое имя свойства объекта.pytho

// App хранит товары в state:
// const [products, setProducts] = useState([])

// При вызове компонента:
// <SalePage products={products} />
//
// Слева:
// products — имя prop.
//
// Справа:
// products — значение state из App.
//
// То есть:
// App передаёт значение state products
// в SalePage через prop с именем products.
//
// Внутри SalePage мы получаем этот prop:
// function SalePage({ products }) {
//
// Здесь products — уже значение prop,
// переданного из App.

//const [products, setProducts] = useState([])
//             │
//             │
//              ↓
//<SalePage products={products} />
//         │          │
//         │          └── state products из App
//         │
//         └── имя prop
//                    ↓
//          SalePage({ products })
//                    │
//                    ↓
//          получаем значение prop

//<button> - disabled={!selectedSizes[item.id]} означает: если размер НЕ выбран → кнопка заблокирована.
//Здесь {} — пустой объект, потому что пока ни для одного товара размер не выбран.

function SalePage({products, handleAddToCart } ) {
    console.log('SALE PRODUCTS:', products);

    const saleProducts = products.filter(
        item => item.is_on_sale === true
    );

    const [selectedSizes, setSelectedSizes] = useState({});

    return (

        <div className='sale-page'>

            <h1 className='sale-page-title'>
                Акції
            </h1>

            <p className="sale-page-text">
                Товари зі знижкою
            </p>

            <div className='sale-products'>

                {saleProducts.map((item) => (

                    <div className='sale-card' key={item.id}>

                         <img
                            src={item.image}
                            alt={item.name}
                            className="sale-card-image"
                         />

                    <div className='sale-sizes'>
                        <span className='sale-size-label'>
                            Розмір:
                        </span>

                         {!selectedSizes[item.id] && (
                                <p className="sale-size-hint">
                                    ⚠️Оберіть розмір
                                </p>
                            )}

                         {item.sizes.map((size) => (
                            <button
                                key={size.id}
                                type='button'

                                onClick={() =>
                                    setSelectedSizes(prev => ({
                                        ...prev,
                                        [item.id]:
                                            prev[item.id] === size.id
                                                ? null
                                                : size.id
                                    }))
                                }
                                className={
                                    selectedSizes[item.id] === size.id
                                         ? 'selectedSize sale-size-button'
                                         : 'sale-size-button'
                                }
                            >
                              {size.name}
                            </button>

                        ))}
                    </div>

                        <h3 className='sale-card-name'>
                            {item.name}
                        </h3>

                        <div className="sale-card-prices">

                            <span className='sale-old-price'>
                                {item.price} грн
                            </span>

                            <span className='sale-new-price'>
                                {item.sale_price} грн
                            </span>

                        </div>

                        <button
                            type='button'
                            className="sale-add-button"
                            disabled={!selectedSizes[item.id]}
                            onClick={() =>
                                handleAddToCart(
                                    item.id,
                                    selectedSizes[item.id]
                                )
                            }
                        >
                            Додати в кошик
                        </button>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default SalePage;

