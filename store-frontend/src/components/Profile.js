
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import './Profile.css';

import OrderHistoryIcon from './icons/OrderHistoryIcon';
import LogoutIcon from './icons/LogoutIcon';


//Profile получит проп orders и внутри компонента это значение будет называться orders
//orders.map((order) => ( Мы говорим: «Пройдись по каждому заказу внутри массива orders и создай для него блок».

//key={order.id} - нужен React, чтобы понимать, какой элемент списка является каким заказом.

// onClick={() => handleViewOrder(order.id)} - order.id — ID именно того заказа, на карточке которого нажали кнопку.

//const handleViewOrder - Функция для просмотра конкретного замовлення.
    // Получает ID замовлення, на которое нажал пользователь.

//async Мы говорим JavaScript: «Внутри handleViewOrder может быть операция, которую нужно дождаться».
//await - «Вызови getOrder(orderId), дождись результата и положи полученный результат в orderData.»

//selectedOrder то есть: какой именно заказ пользователь открыл кнопкой «Переглянути замовлення».

//Кнопка «Переглянути замовлення»
//        ↓
//order.id
//        ↓
//handleViewOrder(orderId)
//        ↓
//getOrder(orderId)
//        ↓
//Django возвращает заказ
//        ↓
//setSelectedOrder(orderData) setSelectedOrder(...) — функция, которая меняет эти данные.
//        ↓
//selectedOrder - данные о заказе
//        ↓
//показываем заказ №42

//{showOrders && ( — начинаем условный показ.
//orders.length === 0 ? (...) : (...) — выбираем, что показать.
//orders.map(...) — создаём карточки заказов.
//)} — закрываем условие showOrders.

//Что означает !showOrders? Это логическое отрицание — оно меняет значение на противоположное:
    //- было false → станет true;
    //- было true → станет false.

function Profile({orders, setIsAuthenticated }) {

    const Status = {
    new: "Нове",
    paid: "Оплачено",
    processing: "Готується",
    shipped: "В дорозі / Відправлено",
    delivered: "Доставлено",
    cancelled: "Відказ покупцем"
    };

    const navigate = useNavigate();
    const [showOrders, setShowOrders] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };


    const handleViewOrder = (orderId) => {
        console.log("Выбрано замовлення:", orderId);

        navigate(`/profile/order/${orderId}`);
    }

    return (
        <div className="profile">

            <h1>Мій профіль</h1>

            <div className='profile-actions'>

                <button
                    className='profile-history-btn'
                    onClick={() => setShowOrders(!showOrders)}
                >
                    <OrderHistoryIcon />
                    Історія замовлень
                </button>

                {showOrders && (
                    orders.length === 0 ? (
                        <p>Замовлень поки немає.</p>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className='profile-order'
                            >
                                <h3>Замовлення №{order.id}</h3>

                                Дата: {new Date(order.created_at).toLocaleString('uk-UA')}

                                <p>Статус: {Status[order.status] || order.status}</p>

                                <p className='profile-order-total'>
                                    Сума: {order.total_price} грн
                                </p>

                                <button
                                    className='profile-order-btn'
                                    onClick={() => handleViewOrder(order.id)}
                                >
                                    Деталі замовлення
                                </button>

                            </div>
                        ))
                    )
                )}

                <button
                    className='profile-logout-btn'
                    onClick={handleLogout}
                >
                    <LogoutIcon />
                    Вихід
                </button>
            </div>
        </div>
    );
}

export default Profile;