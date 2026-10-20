// тут { orderId } значение параметра пришло из функции app
//App.js: orderId = 22
      // ↓ передаём через prop
//Cart.js: получает orderId = 22 и рендер как пример
//Cart — презентационный компонент, только JSX

//файл - Cart.js - (только интерфейс)
////onClick={() => onSelectOrder(item.id)} - дает возможность переходить по заказам 5,1,7...

import "./Cart.css"; //. точка означает "ищи файл в той папке"
import statusMap from "../utils/statusMap";//.. две точки "поднимись на уровень выше"

function Cart({ order, orders, onIncrement, onDecrement, onRemove, onPay, onSelectOrder, errorMessage, onCancel, actionLoading, loadingItemId}) { //order - обьект заказа из App.js

   console.log('ORDERS', orders);
   console.log("CART ITEMS:", order?.items);

   return (
        <div className='Cart'>
            <h1>Корзина</h1>
            {/* ? → if, : → else */}
            {/* <> </> — React Fragment, объединяет несколько JSX-элементов без лишнего HTML-тега */}
            {!order ?(
                 <p>У вас поки що немає активного замовлення.</p>
            ) : (
                <>
                  <p>Номер заказа: {order.id}</p>
                  <p>Статус замовлення: {statusMap[order.status]}</p>
                  <p>Дата створення:{new Date(order.created_at).toLocaleString("uk-UA")}</p>

            {order.items.map(item => (//map - "Возьми каждый объект из массива order.items и назови его item" item - один товар
                                    //order.items - корзина

        <div className='cart-item' key={item.id}>

        {item.product_image ? (//если фото нету, это тернарный оператор, то есть короткая запись if / else.
            <img
                  className='cart-image'
                  src={item.product_image}
                  alt={item.product_name}
            />
        ) : (
            <div className='cart-image'>
                Немає фото
            </div>
        )}

            <h2>{item.product_name}</h2>

            <p className='item-size'>
                Розмір: {item.size_name}
            </p>

            <p className='price-item'>
                Ціна:{item.price}
            </p>

            <p className='price-inside'>
                Разом: {(Number(item.price) * item.quantity).toFixed(2)} грн
            </p>

            {order.status === "new" && (
            <div className="button-group">

                <button
                    className="action-btn"
                    onClick={() => onIncrement(item.id)}
                    disabled={loadingItemId === item.id}
                >
                    {loadingItemId === item.id ? '⏳' : '+'}
                </button>

                <span className='quantity'>
                    {item.quantity}
                </span>

                <button
                    className="action-btn"
                    onClick={() => onDecrement(item.id)}
                    disabled={loadingItemId === item.id}
                >
                    {loadingItemId === item.id ? '⏳' : '-'}
                </button>

                <button
                    className="delete-btn"
                    onClick={() => onRemove(item.id)}
                    disabled={loadingItemId === item.id}
                >
                   {loadingItemId === item.id ? 'Видаляємо...' : '🗑'}
                </button>

            </div>
        )}
    </div>
  ))}

  <div className='cart-total'>
        <h2>
            <span>Итого:</span> {order.total_price} грн
        </h2>

        {order.status === "new" &&(
           <>
            <button className="pay-btn"
             onClick={onPay}
             disabled={actionLoading}>

            {actionLoading ? 'Оплачуємо...' : 'Оплатити замовлення'}
            </button>

            <button
                className="cancel-btn"
                onClick={onCancel}
                disabled={actionLoading}>

                {actionLoading ? 'Скасовуємо...' : 'Скасувати замовлення'}
            </button>
           </>
        )}

        {order.status === "paid" &&(
           <p className="success-message">
            ✅ Замовлення оплачено
           </p>
        )}

        {order.status === "cancelled" &&(
            <p className="cancel-message">
            ❌ Замовлення скасовано
            </p>
        )}

        {order.status === "delivered" &&(
            <p className="delivery-message">
            📦 Замовлення доставлено
            </p>
        )}

      </div>

      {errorMessage && ( //если errorMessage не пустой — показать блок.
        <div className='error-massage'>
            ❌ {errorMessage}
        </div>
      )}
  </>
)}

    <h2>Історія замовлень</h2>

    <div className='order-history'>

      {orders.map((item) => ( //каждый item - это один заказ (так как два массива) из массива, Возьми каждый объект из массива order.items и назови его item
                                // orders - Каждый элемент массива — один заказ.
        <div className={
            item.id === order?.id //ID этого заказа из истории (item.id) равен ID заказа, который сейчас открыт (order.id)?
                                //order?.id означает: «Если order существует — возьми id. Если его нет — просто получи undefined и не падай».
                                // поэтому этот блок будет рабоатть даже когда активного заказа нет
                ? 'history-item selected-order'
                : 'history-item'
            }
            key={item.id} onClick={() => onSelectOrder(item.id)}>

            <p><strong>Замовлення №{item.id}</strong></p>
            <p>Статус:{statusMap[item.status]}</p>
            <p>Дата створення:{new Date(item.created_at).toLocaleString("uk-UA")}</p>
            <p>Сумма:{item.total_price}</p>

        </div>
      ))}
    </div>

 </div>
 );
 }

export default Cart;
