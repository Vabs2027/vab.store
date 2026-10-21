import { NavLink } from 'react-router-dom';

import SaleIcon from './icons/SaleIcon';
import DeliveryTruck from './icons/DeliveryTruck';

import './Home.css';
import './BlackFriday.css';

import ProductCard from './ProductCard';

//products={products} — передаём массив товаров из App.js.
//{ products } в параметре функции — достаём этот массив из пропсов.
//Теперь внутри Home можно обращаться к товарам через products.

//<>...</> — общий контейнер, который не создаёт дополнительный HTML-блок.

function Home({ products, addItem, addingProductId, handleToggleFavorite, favorites }) {
    return (
        <>
            <div className='delivery-banner'>
                <div className='delivery-truck'>
                    <DeliveryTruck />
                    <span>Безкоштовна доставка від 2 речей</span>
                </div>
            </div>

            <main className="home-page">

                <section
                    className="home-hero"
                    style={{
                        '--hero-image': `url("${process.env.PUBLIC_URL}/images/home-hero.jpg")`
                    }}
                    >
                    <h1>Твій стиль. Твій вибір.</h1>

                    <p>
                        Знаходь одяг для свого стилю
                    </p>

                    <NavLink
                         to="/catalog"
                          className="home-catalog-btn"
                          >
                            Перейти до каталогу
                    </NavLink>
                </section>

                <section className="home-black-friday"
                    style={{
                        '--black-friday-image': `url("${process.env.PUBLIC_URL}/images/BLACK FRIDAY.jpg")`
                    }}
                    >
                    <div className='home-black-friday-text'>
                        <span>LIMITED OFFER</span>
                        <h2>BLACK FRIDAY</h2>

                        <p>Спеціальні пропозиції на обрані товари</p>
                    </div>

                    <NavLink
                        className='home-black-friday-btn'
                        to='/black-friday'
                    >
                        Переглянути товари
                    </NavLink>
                </section>

                <section className="home-recommend">
                    <h2>Рекомендуємо</h2>

                    <p>
                        Обирай товари, які ми рекомендуємо саме тобі.
                    </p>

                    {/*карточки товаров*/}
                    {/*products.slice(0, 4) — берём первые четыре товара из массива. key={item.id} — React получает уникальный идентификатор каждой карточки.*/}
                    <div className='home-recommend-products'>
                        {products.slice(0,4).map((item) => (
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

                    <NavLink
                        to="/catalog"
                        className="home-recommend-btn"
                    >
                        Переглянути каталог
                    </NavLink>
                </section>


                <section
                    className="home-sale"
                        style={{
                            '--sale-image': `url("${process.env.PUBLIC_URL}/images/sale.jpg")`
                        }}
                    >
                    <SaleIcon />

                    <h2>Акції та пропозиції</h2>

                    <p>
                        Переглядай товари зі спеціальними пропозиціями.
                    </p>

                    <NavLink
                        to="/catalog/sale"
                        className="home-sale-btn"
                    >
                        Переглянути акції
                    </NavLink>
                </section>

            </main>
        </>
    );
}

export default Home;