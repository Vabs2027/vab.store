import axiosInstance from "./axiosInstance";

//#services — это место, где мы описываем, какой HTTP-запрос отправить Django

//файл orders.js - (HTTP-запрос Axios)
//orders.js — это слой запросов между React и Django.
//То есть orders.js отправляет запрос с React на Django и получает ответ обратно.

// Axios — это библиотека для отправки HTTP-запросов из React.
//React
// ↓
//axios
// ↓
//HTTP GET /orders/28/
 //↓
//Django DRF
// ↓
//OrderViewSet
// ↓
//JSON
// ↓
//React


//запрос на джанго отправляется вот сдесь axiosInstance.post(...)
//А return res.data означает: «Возьми ответ Django и
                            //верни его той функции React, которая вызвала createActiveOrder()».
                            //например сюда const data = await createActiveOrder();

//createActiveOrder()
  //    ↓
//axios POST
 //     ↓
//Django
 //     ↓
//создал Order №31
 //     ↓
//res.data
 //     ↓
//return res.data
 //     ↓
//const data
 //     ↓
//React

export async function getOrder(orderId) {//то есть тут происходит запрос GET /api/v1/orders/25/
  const res = await axiosInstance.get(`/orders/${orderId}/`);

  return res.data;
}


//запрос на джанго отправляется вот сдесь axiosInstance.post(...)
//А return res.data означает: «Возьми ответ Django и
                            //верни его той функции React, которая вызвала createActiveOrder()».
                            //например сюда const data = await createActiveOrder();
                            //В res попадает весь ответ Axios от Django.
                            //await → ждём, пока Django ответит;
                            //data → получаем res.data, который вернула наша функция.

export async function createActiveOrder() {
    const res = await axiosInstance.post(
        "/orders/create-active/"
    );
    return res.data
}


export async function incrementItem(orderId, itemId) {
  const res = await axiosInstance.patch(`/orders/${orderId}/increment-item/`, { item_id: itemId });

  return res.data;
}


export async function decrementItem(orderId, itemId) {
  const res = await axiosInstance.patch(`/orders/${orderId}/decrement-item/`, { item_id: itemId });

  return res.data;
}


export async function removeItem(orderId, itemId) {
  console.log('REMOVE ITEM', orderId, itemId)

  const res = await axiosInstance.delete(
    `/orders/${orderId}/remove-item/`,
    {
      data: {
        item_id: itemId
      }
    }
  );
  console.log('REMOVE RESPONSE', res.status)

  return res.data;//возвращаем обовленый заказ
}


export async function payOrder(orderId) {
  const res = await axiosInstance.post(`/orders/${orderId}/pay/`);

  return res.data;
}


export async function cancelOrder(orderId) {
    const res = await axiosInstance.post(`/orders/${orderId}/cancel/`);

    return res.data;
}


export async function getHistory() {//Создаем новую функцию, которую потом сможем импортировать в App.js.
    const res = await axiosInstance.get('/orders/history/')//axios отправляет запрос - GET /api/v1/orders/history/

    return  res.data;//возвращаем массив заказов
}


//sizeId в - export async function addItem(orderId, productId, sizeId) — это не состояние selectedSize.
//Это новая локальная переменная-параметр, которая получит значение, переданное третьим аргументом.
export async function addItem(orderId, productId, sizeId) {
    const res = await axiosInstance.post(
        `/orders/${orderId}/add-item/`,
        {
            product_id:productId,
            size_id: sizeId
        }
    );

    return res.data
}