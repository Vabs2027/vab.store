import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getOrder } from "../services/orders";

import './OrderDetails.css';

//История заказа → OrderDetails файл


//Почему useState — мы уже знаем: const [order, setOrder] = useState(null);
//А useEffect нужен потому, что: как только страница OrderDetails загрузилась, нужно выполнить запрос к Django.
        //то есть «Когда компонент загрузится/изменится нужное значение — выполни вот этот код».

//React Router положит значение :orderId в параметры маршрута. Чтобы получить его внутри OrderDetails.js, используем хук useParams.

//function OrderDetails() - создаем новый реакт компанент

//const {orderId} = useParams(); - «Возьми параметр orderId из URL и положи его в переменную orderId.»

//Открыли /profile/order/42/
//        ↓
//OrderDetails загрузился
//       ↓
//useEffect срабатывает
//        ↓
//async-функция
//        ↓
//await getOrder(orderId)
//        ↓
//получили заказ №42
//        ↓
//setOrder(orderData)
//        ↓
//React перерисовал страницу
//        ↓
//показываем данные заказа

//}, [orderId]); Это зависимости, То есть эффект будет выполняться, когда orderId изменится.


//useEffect
//   │
//   │ компонент загрузился
//   ↓
//loadOrder()
//   │
//   │ запускаем async-функцию
//   ↓
//getOrder(orderId)
//   │
//   │ ждём ответ
//   ↓
//orderData
//   │
//   │ сохраняем
//   ↓
//setOrder(orderData)
//   │
//   ↓
//order получает данные
//   │
//   ↓
//React перерисовывает страницу

//orderId — это ID заказа, который передали в OrderDetail.
//1.[orderId] говорит React: «запусти этот эффект, когда orderId изменится».
//2.loadOrder — функция, которая делает запрос.
//3.getOrder(orderId) → идёт на Django API и получает данные конкретного заказа.
//4.orderData → это ответ от сервера.
//5.setOrder(orderData) → кладёт полученные данные в состояние order.
//6.После setOrder React перерисует OrderDetail уже с новыми данными заказа.

function OrderDetails() {

    const {orderId} = useParams();

    const [order, setOrder] = useState(null);

    console.log("ID замовлення:", orderId);

    useEffect(() => {
        const loadOrder = async() => {
            const orderData = await getOrder(orderId);

            console.log("Дані замовлення:", orderData);

            setOrder(orderData);
        };

        loadOrder();

    }, [orderId]);

      // Если заказ ещё не загрузился
    if (!order) {
        return <div>Завантаження замовлення...</div>;
    }

    return (
        <div className="order-details">

            <h1 className="order-details-title">
                Деталі замовлення
            </h1>

           <h2 className="order-details-number">
                Замовлення № {order.id}
            </h2>

            {order.items && order.items.map((item) => (
                <div key={item.id} className='order-item'>

                    <img
                        src={item.product_image}
                        alt={item.product_name}
                    />

                    <div className='order-item-info'>

                        <h3 className="order-item-title">
                            {item.product_name}
                        </h3>

                        <p>Розмір: {item.size_name}</p>

                        <p>Ціна: {item.price} грн</p>

                        <p>Кількість: {item.quantity}</p>

                        <p>
                            Разом: {(Number(item.price) * item.quantity).toFixed(2)} грн
                        </p>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default OrderDetails;