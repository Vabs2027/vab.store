import { useEffect, useState } from "react";
import {getOrder, getHistory, incrementItem, decrementItem, removeItem, payOrder, cancelOrder, createActiveOrder} from "./services/orders";

import {BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate} from 'react-router-dom'; //импортируем роутер

import BlackFriday from './components/BlackFriday';

//BrowserRouter — включает маршрутизацию во всём приложении.
//Routes — контейнер для маршрутов.
//Route — описывает конкретный адрес, например /cart.
//Link — потом сделаем из него кнопки меню.
//NavLink — это почти тот же Link, только он умеет понимать: «Я сейчас нахожусь на этой странице».
//useLocation позволит узнать, на какой странице мы находимся.
//useNavigate позволит перейти в каталог программно, после нажатия на кнопку.

import {
    CartIcon,
    FavoritesIcon,
    LoginIcon,
    ProfileIcon,
    SearchIcon,
    ClothingIcon,
    CategoriesIcon,
    FilterIcon
} from './components/icons';

import {getProducts, getCategories} from "./services/products";
import {addItem} from "./services/orders";

import {getFavorites, addFavorites, removeFavorites} from "./services/favorites"
import Favorites from "./components/Favorites";

import Cart from "./components/Cart";//подключаем корзину
import Catalog from "./components/Catalog";
import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/Search";
import Profile from "./components/Profile";
import OrderDetails from './components/OrderDetails';
import SalePage from './components/SalePage';
import ProductDetails from './components/ProductDetails';

import ProtectedRoute from "./components/ProtectedRoute";

import './components/MainMenu.css'
import './App.css'

import Home from './components/Home';


//App.js → хранит/создаёт функцию → передаёт её через prop → Catalog.js получает её → событие onClick вызывает эту функцию.pyt
//Именно App решает:

//какой заказ передать;
//какие кнопки работают;
//какие функции вызвать.

//А Cart только рисует интерфейс. - внизу рендерим чреез Cart

//файл App.js - (обработчик кнопки), Это главный (корневой) компонент приложения.
// внутри файла App подключается корзина

 // подключил компонент (компонент это функция Cart - имя с большой буквы!!! - это компонент значит) корзины в корневое приложение React.
                                        //передаем корзине данные извне, 22 тестовый заказ
                                        //<Cart orderId={orderId} /> тут мы вызываем функцию Cart и передаем как prope аргументы функции app
                                        //App.js: orderId = 22
                                        // ↓ передаём через prop
                                        //Cart.js: получает orderId = 22 и рендер
                                        //Cart не знает orderId сам по себе
                                        //App решает, что передать в Cart
                                        //props = данные, которые родитель даёт ребёнку, это аргум функции js
                                        //результ рендирится в div

                                        //App — контейнер, логика, API, state
                                        // orderId — это номер заказа, который мы хотим получить.

//order — состояние (state), которое будет хранить данные заказа.
//setOrder — функция для изменения state., то есть способ для изменения состояния order
//setOrder(data) - обновляет React state

//как данные текут:
//App.js → orders.js → axiosInstance → backend → DRF → response → App.js → Cart.js
//useState — это место, где React хранит данные компонента.
//useState → цепляешься за состояние, setState = обновление данных + перерисовка интерфейса
//useEffect → цепляешься за жизненный цикл - когда что то изменилось, сделай какой то действие, только при загрузки, и изменении дан
//useContext → цепляешься за глобальные данные

//выводим через return ИНТЕРФЕЙС ПРИЛОЖЕНИЯ
 ////<ДочернийКомпонент prop={значение} /> App.js говрит Реакт - отобрази вот такой компонент Catalog, то есть реакт идет в функц function Catalog, и возвращает ретурн
function App() {
  console.log('APP START')

  const [orderId, setOrderId] = useState(null);//setOrderId(...) ← функция, которая может изменить orderId
  //const orderId = 5;

    //то есть тут мы пишем СОСТОЯНИЕ в const [] = useState
    //Создай переменную order и функцию setOrder, которая умеет изменять ее значение
  const [order, setOrder] = useState(null);//useState — это место, где React хранит данные компонента.
                                            //order — текущее значение заказа;
                                            //setOrder — функция для изменения этого значения.
  const [orders, setOrders] = useState([]);//новое состояние на историю заказов, то есть тут уже не Null, а МАССИВ
     //const [orders, setOrders] = useState([]) то есть -> [текущее значение orders, функция setOrders для изменения значения]

  const [search, setSearch] = useState("");//search - значение, setSearch функция изминения
  const [showSearch, setShowSearch] = useState(false);//showSearch - хранит состояние false-поиск скрыт
                                                                                //true-поиск показан
  //App.js → решает, открыто меню категорий или закрыто (showCategories)
  const [showCategories, setShowCategories] = useState(false);

  const [products, setProducts] = useState([]);//товары каталога
  const [categories, setCategories] = useState([]);//категории, А когда мы получим данные от Django, сделаем: setCategories(data);
                                                    // categories — текущее значение
                                                    //setCategories — функция, которая изменяет это значение
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(false);//состояние загрузки с изначал состояние true - данные еще загружается
                                               //false - то есть После успешного входа isAuthenticated станет true, и уже запустится loadOrder().
                                               //setloading - функц кот может изменить состояние
  const [loadingItemId, setLoadingItemId] = useState(null);//акой товар сейчас изменяется, null - ни один товар сейчас не изменяется
  const [loadingProducts, setLoadingProducts] = useState(true);//загрузка каталога
  const [addingProductId, setAddingProductId] = useState(null);//какой товар сейчас добавляется

  //авторизация пользователя, Он перерисовывает нужную часть интерфейса из-за изменения state.
  //isAuthenticated — это обычная переменная состояния типа boolean:
                                                //false = пользователь не авторизован
                                                //true  = пользователь авторизован
                                                //useState(false) Потому что когда React только запустился, мы ещё не знаем, авторизован пользователь или нет.
  //setIsAuthenticated - функция для изменения значения isAuthenticated
  //State живёт у компонента, а prop приходит в компонент от родителя.
  //prop — это не сама переменная из App.js.
  //prop — это имя свойства, через которое родитель передаёт значение дочернему компоненту.

  //const [isAuthenticated, setIsAuthenticated] = useState(false);

    //isAuthenticated — state App.js.

    //А в ProtectedRoute:

    //function ProtectedRoute({ isAuthenticated }) { - в App в Cart

    //isAuthenticated — prop ProtectedRoute.

    //setShowCategories(!showCategories); Знак ! означает «НЕ», то есть противоположное значение от const [showCategories, setShowCategories] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //useEffect, который проверит токен в localStorage:
  useEffect(() => {
      const token = localStorage.getItem('token');

      if (token) {
        setIsAuthenticated(true);
      }
  }, []);


    //data.map(item => item.product_id) - превращает [3] как пример, то есть product_id = 3
    //и записывает его в setFavorites(favoriteIds);
  useEffect(() => {
    if (!isAuthenticated) {
        return;
    }

    getFavorites()
        .then((data) => {

            const favoriteIds = data.map(item => item.product_id);
            setFavorites(favoriteIds);

        })
        .catch((error) => {
            console.error('Не вдалося завантажити обране:', error);
        });
}, [isAuthenticated]);


  useEffect(() => {//внтури обязательно указывается зависимости
    //useEffect
       //↓
    //создали loadOrder
       //↓
    //запустили loadOrder()
       //↓
    //try/catch
       //↓
    //getOrder()

    //loadOrder() — получает конкретный заказ по orderId.
    const loadOrder = async() => {//Выполняй этот код, когда orderId изменился, асинхроная функция
        try {
            const data = await getOrder(orderId);//Подожди, пока getOrder() закончит запрос, и положи результат в data.

            console.log("ORDER DETAIL:", data);

            setOrder(data);

            setLoading(false);//ошибка тоже заканчивает загрузку

        } catch (error) {

            setErrorMessage('Не вдалося завантажити замовлення:');
            setLoading(false);//ошибка тоже заканчивает загрузку

            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
    };


//loading = true
//→ ещё ждём ответ сервера

//loading = false + order есть
//→ всё успешно

//loading = false + order нет
//→ произошла ошибка

    //проверка isAuthenticated - авторизованый ли пользователь
  if (isAuthenticated && orderId) {
        loadOrder();
  }
  }, [orderId, isAuthenticated]);


    //// Загружаем все заказы текущего пользователя
  useEffect(() => {
      if (!isAuthenticated) {
          return;
      }

        const loadOrders = async () => {
            try {
                const data = await getHistory();

                console.log('ORDERS FROM SERVER', data);

                setOrders(data);

                const currentOrder = data.find(
                    item => item.status === "new"
                );

                if (currentOrder) {
                    setOrderId(currentOrder.id);
                }

            }catch (error) {
                console.log("ПОМИЛКА ПРИ ЗАВАНТАЖЕННІ ЗАМОВЛЕННЯ:", error);
            }
        };

        loadOrders();
    }, [isAuthenticated]);


    //на поиск товаров всех
            //categories — текущее значение
            //setCategories — функция, которая изменяет это значение
  useEffect(() => {
    const loadProducts = async() => {
        try {
            const data = await getProducts();
            setProducts(data);

            const categories = await getCategories();
            setCategories(categories);

            console.log("CATEGORIES:", categories);

        } catch (error) {
            console.error(
                'Помилка при завантажені каталогу товарів',
                error
            );

            setErrorMessage(
                'Невдалося завантажити каталог товарів'
            );

            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }finally{
            setLoadingProducts(false);
        }
    };
    loadProducts();
  }, []);


// кнопки +-
  const handleIncrement = async (itemId) => {
    try {
        setLoadingItemId(itemId);// мы запоминаем что Вот этот конкретный товар сейчас изменяется
                                //loadingItemId — значение, сейчас null или ID товара.
                                //setLoadingItemId — функция, которая это значение изменяет.

        await incrementItem (orderId, itemId);
        const freshOrder = await getOrder(orderId);

        setOrder(freshOrder);
    } catch(error) {

        setErrorMessage('Невдалося змінити кількість товару');

        setTimeout(() => {
            setErrorMessage('');

        }, 5000);
    } finally {
        setLoadingItemId(null)//setLoadingItemId — функция, которая это значение изменяет, то есть из loadingItemId
    }
  };


  const handleDecrement = async (itemId) => {
    try {
        setLoadingItemId(itemId);

        await decrementItem(orderId, itemId);
        const freshOrder = await getOrder(orderId);

        setOrder(freshOrder);
    } catch(error)  {

        setErrorMessage('Невдалося змінити кількість товару');

        setTimeout(() => {
            setErrorMessage('')

        }, 5000);
    }finally{
        setLoadingItemId(null);
    }
  };


//кнопка на удаление товара из ЗАКАЗА
    const handleRemove = async (itemId) => {
        try {
          setLoadingItemId(itemId);

          await removeItem(orderId, itemId);
          const freshOrder = await getOrder(orderId);

          setOrder(freshOrder);
        }catch(error) {

            setErrorMessage('Невдалося видалити товар');

            setTimeout(() => {
                setErrorMessage('')

            }, 5000);
        }finally{
            setLoadingItemId(null);
        }
   };

//добавлять товар в избранное и убирать его оттуда, то есть это функция которая работает с состоянием
//Мы добавили async, потому что теперь функция должна обращаться к серверу - например await addFavorite(productId);
//favorites — это наш React state (то есть const [favorites, setFavorites] = useState([]);)
//await removeFavorite(productId); - если товар уже есть в Избр - удаляем его на сервере, то есть функция берется из await removeFavorite(productId);
//После успешного удаления обновляем React
    //setFavorites((prevFavorites) =>
    //    prevFavorites.filter((id) => id !== productId)
    //);

//preFavorites - взять все старые элементы массива.

const handleToggleFavorite = async (productId) => {

    try {
        if (favorites.includes(productId)) {

            await removeFavorites(productId);

            setFavorites((prevFavorites) =>
                prevFavorites.filter((id) => id !== productId)
            );

            return;
        }

        await addFavorites(productId);

        setFavorites((prevFavorites) => [
            ...prevFavorites,
            productId
        ]);

    }catch(error) {
        console.log('Не вдалося змінити обране:', error)
    }
};


const handlePay = async() => {
    try {
      await payOrder(orderId);
      const freshOrder = await getOrder(orderId);//getOrder - получаем обновленый закза

    setOrder(freshOrder);//обновляем состояние заказа
    } catch(error) {
        console.error('Помилка при оплаті товару:', error);
        setErrorMessage('Невдалося оплатити товар');

        setTimeout(() => {
            setErrorMessage('')
        }, 5000);
   } finally {
        setActionLoading(false); //finally - выполняется и при успехе, и при ошибке
   }
};

//отмена заказа
//нажали "Скасувати"
  //      ↓
//handleCancel()
    //    ↓
//cancelOrder(orderId)
  //      ↓
//Django меняет status → cancelled
  //      ↓
//getOrder(orderId)
  //      ↓
//получаем свежий заказ
  //      ↓
//setOrder(freshOrder)
   //     ↓
//React перерисовывает страницу


//отмена заказа
const handleCancel = async() => {
    try {
        await cancelOrder(orderId);

        setOrderId(null);//«Измени состояние orderId на null». то есть функцц взяли для изменения состояние ;
                        //setOrderId - функция для измения состояния orderId отсюда const [orderId, setOrderId] = useState(null)
                        //setOrderId не берётся из состояния. Она была создана React одновременно с orderId
        setOrder(null);

    } catch (error) {
        console.error(
            'Помилка при скасуванні замовлення:',
            error
        );

        setErrorMessage(
            'Не вдалося скасувати замовлення',
        );

        setTimeout(() => {
            setErrorMessage('');
        }, 5000);
    } finally {
        setActionLoading(false);
    }
};

//setOrderId(...) запрашивает изменение состояния
//currentOrderId — временная переменная для текущего выполнения функции.
//setOrderId — изменение состояния React, чтобы приложение запомнило новый заказ и перерисовалось.
//newOrder — весь новый заказ;
//newOrder.id — номер этого заказа;
//currentOrderId — временная переменная с номером заказа, который прямо сейчас используем в запросе;
//setOrder(...) — сохраняет сам заказ в React state.
const handleAddToCart = async(productId, sizeId) => {//То есть productId — это параметр функции, а не отдельная переменная.
    try {
       if (!isAuthenticated) {
            return false;
       }

       let currentOrderId = orderId;//currentOrderId нужен нам именно для того, чтобы addItem() сразу получил правильный ID, не дожидаясь обновления React state.
       setAddingProductId(productId);//сразу включает состояние загрузки кнопки.

       if (!currentOrderId) {
            const newOrder = await createActiveOrder();//вызываем функцию в orders.js, результат ложим в newOrder(res.data)

            currentOrderId = newOrder.id; //берём из обьекта res.data из newOrder -  только id (id: 31 пример)
                                          //сразу меняем временную переменную, чтобы использовать новый ID в addItem.
                                          //то есть получаем новый заказ
            setOrderId(newOrder.id);//обновляем состояние React, чтобы приложение запомнило новый активный заказ.
       }

       await addItem(currentOrderId, productId, sizeId);//вызываем сам сервис из orders.js, и передаем те параметры что и там в ф в файле
                                                        //То есть addItem всегда получает конкретный ID заказа и ID товара.
       const updateOrder = await getOrder(currentOrderId);

       setOrder(updateOrder);//setOrder уже получает свежий заказ через getOrder()

       return true;

    } catch (error) {
        console.error('Помилка при добавленні товару:', error)
        setErrorMessage('Не вийшло добавити товар до замовлення')

        setTimeout(() => {
            setErrorMessage('');

        }, 5000);

        return false;
    }finally{
        setAddingProductId(null);
    }
};

const [errorMessage, setErrorMessage] = useState ('')//хранит текст ошибки
const [actionLoading, setActionLoading] = useState(false);//блокировка кнопок
                                                          //false → действие не выполняется → кнопки активны
                                                          //true → запрос выполняется → кнопки блокируем

const handleSelectOrder = async (selectedOrderId) => {//selectedOrderId — ID заказа, по которому кликнули.
    const selectedOrder = await getOrder(selectedOrderId);//getOrder(selectedOrderId) — получаем этот заказ с Django.

    setOrderId(selectedOrderId);//setOrderId(selectedOrderId) — запоминаем, какой заказ сейчас выбран.
    setOrder(selectedOrder);//setOrder(selectedOrder) — показываем его в основной части корзины.
}


  if (loading) {//то есть тут Пока заказа нет — пусть будет null из useState(Null)

    return <div>Загрузка сторінки...</div>;
  }
  //if (!order) {
    //return <div>Не вдалося завантажити замовлення</div>;
  //}

  console.log("ORDER BEFORE ROUTES:", order);
  console.log("RENDER APP");

  //основное рендер приложения.
  return (//то что передаем в файл Cart.js в функцию Cart


        //<Cart /> — это компонент,то есть это отдельная часть приложения App.js
        //onAddToCart — это prop (свойство компонента).
        //handleAddToCart — это функция, которая лежит в App.js.
        //Слева (onAddToCart) — имя prop, под которым функция будет известна в дочернем компоненте.
        //Справа (handleAddToCart) — реальная функция, которая находится в родительском компоненте.

        //компонент (Cart, Catalog) как отдельный строительный блок интерфейса.
        //Каждый компонент может иметь свой JSX, состояние, функции и т.д., но всё это вместе работает как одно React-приложение.

    //<ДочернийКомпонент prop={значение} /> - <Cart - дочерний компонент, order - prop, {order} - значение
    //props — это способ передать данные или функции от родительского компонента к дочернему (order={order}....)

//BrowserRouter — включает маршрутизацию во всём приложении.
//Routes — контейнер для маршрутов, Routes разделяет их отображение по URL.
//Route — описывает конкретный адрес, например /cart, то есть это конкретное правило
//Link — потом сделаем из него кнопки меню.
//<Catalog, Cart> - компоненты

//setIsAuthenticated={setIsAuthenticated} означает: «Login, держи мою функцию setIsAuthenticated, она находится в App».


//внутри <Catalog тут внизу файла  - там props, то есть вот там схема
//App.js
//│
//├── favorites ──────────────→ Catalog
//│                              │
//│                              └── favorites.includes(item.id)
//│
//└── handleToggleFavorite ───→ Catalog
//                               │
//                               └── onClick={...}

//Структура App.js выглядит вот так:
//store-logo
//     ↓
//main-menu
//   ↓
//Search.jsx  ← показывается только при showSearch === true
//     ↓
//Routes

  <BrowserRouter>
    <div className='mobile-header'>
        <div className="store-logo">
            <NavLink to="/">
                <div className="store-logo-title">
                    <ClothingIcon />
                    <div>vab.store</div>
                </div>
            </NavLink>

            <span>Одяг для всіх</span>
        </div>

        <nav className="main-menu">


        {isAuthenticated ? (
        <>
            <button
                className="search-btn"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Пошук"
            >
                <SearchIcon />
            </button>

            <NavLink to="/cart"
                className={({isActive}) => isActive ? 'active-link' : ''}
                >
                    <span className="cart-icon-wrapper">
                        <CartIcon />

                        {order?.items?.length > 0 && (
                            <span className='cart-count'>
                                {order.items.reduce(
                                    (total, item) => total + item.quantity,
                                    0
                                )}
                            </span>
                        )}
                    </span>

            </NavLink>

            <NavLink
                to="/favorites"
                className={({isActive}) => isActive ? 'active-link' : ''}
            >
            <FavoritesIcon />
            </NavLink>

            <NavLink
                to="/profile"
                className="profile-btn"
                aria-label="Мій профіль"
            >
                <ProfileIcon />
            </NavLink>

        </>

      ):(
        <>

         <NavLink
            to='/login'
            className={({isActive}) => isActive ? 'active-link' : ''}
        >
            <LoginIcon />
        </NavLink>

          <NavLink to='/register'
               className={({isActive}) => isActive ? 'active-link' : ''}
                >
               Зареєструватися
          </NavLink>
        </>
      )}
      </nav>
    </div>

        <CatalogToolbar
            showCategories={showCategories}
            setShowCategories={setShowCategories}
            setShowSearch={setShowSearch}
        />

      {showSearch && (
        <Search
            search={search}
            setSearch={setSearch}
        />
      )}
                {/*products справа — состояние в App.js, в котором находятся товары, полученные с сервера.
                    products слева — имя prop, под которым компонент Home получит эти данные.*/}
      <Routes>

        <Route
            path='/'
            element={
                <Home
                    products={products}
                    addItem={handleAddToCart}
                    addingProductId={addingProductId}
                    handleToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                />
            }
        />

        <Route
            path='/catalog'
            element={
                <Catalog

                    search={search}
                    setSearch={setSearch}
                    products={products}

                    categories={categories}

                    loadingProducts={loadingProducts}
                    addItem={handleAddToCart}
                    addingProductId={addingProductId}

                    handleToggleFavorite={handleToggleFavorite}

                    favorites={favorites}

                    showSearch={showSearch}

                    showCategories={showCategories}

                />
            }
        />

        <Route
            path='/black-friday'
            element={
                <BlackFriday
                    addItem={handleAddToCart}
                    addingProductId={addingProductId}
                    handleToggleFavorite={handleToggleFavorite}
                    favorites={favorites}
                />
            }
        />

            {/*То есть App не передаёт товары напрямую из Django в SalePage.
                    Он передаёт уже существующий React state {products} через prop products=
                    то есть {products} - это значени state из app, а prop это products=
                    «Компоненту SalePage передаем prop с именем products, а значением этого prop возьми state products из App.»
                    */}
        <Route
            path='/catalog/sale'
            element={
                <SalePage
                    products={products}
                    handleAddToCart={handleAddToCart}
                />
            }
        />

        <Route
            path='/product/:productId'
            element={
                <ProductDetails
                    products={products}
                    addItem={handleAddToCart}
                    addingProductId={addingProductId}
                />
            }
        />

        <Route
            path='/favorites'
            element={
                <Favorites
                    favorites={favorites}
                    products={products}
                    handleToggleFavorite={handleToggleFavorite}
                    addItem={handleAddToCart}
                    addingProductId={addingProductId}
                />
            }
        />

        {/*Берём состояние orders из App.js и передаём его в компонент Profile.*/}
        <Route
            path='/profile'
            element={
                <Profile
                    orders={orders}
                    setIsAuthenticated={setIsAuthenticated}
                />
            }
        />

        <Route
            path='/profile/order/:orderId'
            element={
                <OrderDetails />
            }
        />

        {/*Левая isAuthenticated — имя prop. prop — это не сама переменная из App.js.*/}
        {/*prop — это имя свойства, через которое родитель передаёт значение дочернему компоненту.*/}
        {/*Правая isAuthenticated — переменная из App.js.*/}
        {/*Слева: categories — имя prop, которое получит Catalog.*/}
        {/*Справа: categories — наша переменная из App.js.*/}
        <Route
            path='/cart'
            element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Cart

                        order={order}
                        orders={orders}
                        products={products}

                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        onRemove={handleRemove}
                        onPay={handlePay}
                        onCancel={handleCancel}

                        actionLoading={actionLoading}
                        loadingItemId={loadingItemId}

                        onSelectOrder={handleSelectOrder}
                        errorMessage={errorMessage}
                    />
                </ProtectedRoute>
            }
        />

        {/*login → показать компонент Login*/}
         <Route path='/login'
            element={<Login setIsAuthenticated={setIsAuthenticated}/>}
         />

        {/*register → показать компонент register.*/}
         <Route path='/register'
         element={<Register />}
         />

      </Routes>
  </BrowserRouter>
  );
}


function CatalogToolbar({
    showCategories,
    setShowCategories,
    setShowSearch
}) {
    const location = useLocation();
    const navigate = useNavigate();

    //Проврея открыта ли глав стр сейчас или каталог
    const isCatalog = location.pathname === '/catalog';
    const isHome = location.pathname === '/';

    //Обрабатываем нажатие на кнопку "Категории"
    const handleCategoriesClick = () => {
        setShowSearch(false);

        if (isHome ) {
            // С главной переходим в каталог и открываем категории
            setShowCategories(true);
            navigate('./catalog');
        }else {
            // В каталоге просто открываем или закрываем категории
            setShowCategories(prev => !prev);
        }
    };

     //useLocation() получает текущий адрес страницы.
     //location.pathname === '/' проверяет, находимся ли мы на главной.
     //navigate('/catalog') переводит пользователя в каталог.
     //setShowCategories(true) открывает категории.
     //setShowCategories(prev => !prev) меняет состояние на противоположное: закрытые категории откроются, открытые — закроются
     //return null означает: на других страницах панель не отображается.
     //showSearch = false — поиск скрыт.
     //showSearch = true — поиск отображается.


     // На остальных страницах панель не показываем, то есть если true состояние !isHome !isCatalog
    if (!isHome && !isCatalog) {
        return null;
    }

    return (
        <div className='catalog-toolbar'>
            <button
                type='button'
                className='catalog-toolbar-btn'
                onClick={handleCategoriesClick}
            >
                <CategoriesIcon />
                <span>Категорії</span>
            </button>

            {isCatalog && (
                <button
                    type='button'
                    className='catalog-toolbar-btn'
                    onClick={() => setShowSearch(false)}
                >
                    <FilterIcon />
                    <span>Фільтр</span>
                </button>
            )}
        </div>
    );
}

export default App;