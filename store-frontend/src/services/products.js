import axiosInstance from "./axiosInstance";

// Axios — это библиотека для отправки HTTP-запросов из React!!!!



//для товаров всех что в магазине - для поиска
//await axiosInstance.get('/vabstore/'); - «Отправь GET-запрос на адрес /vabstore/ через настроенный Axios.»
//axiosInstance — это твой настроенный Axios, где, скорее всего, находится базовый адрес API и токен.

//Поэтому тебе не нужно каждый раз писать полный адрес: http://127.0.0.1:8000/api/v1/vabstore/ Ты пишешь: axiosInstance.get('/vabstore/') а axiosInstance уже знает базовый адрес.

//для ТОВАРОВ! цепочка
    //getProducts() - в файле products.js
      //  ↓
    //axiosInstance.get('/vabstore/') - '/vabstore/' — путь, куда отправляем запрос
      //  ↓
    //GET /api/v1/vabstore/ GET /api/v1/vabstore/ — это уже HTTP-запрос, который приходит в Django
                //«Клиент хочет получить список товаров по адресу /api/v1/vabstore/ методом GET».
      //  ↓
    //Django
      //  ↓
    //urls.py
      //  ↓
    //VabstoreAPIList, либо CategoryAPIList
      //  ↓
    //Product.objects.all()
      //  ↓
    //ProductSerializer
      //  ↓
    //Response
      //  ↓
    //JSON
      //  ↓
    //React


//getProducts. Её задача: «Когда React попросит меня получить товары — я отправлю запрос на сервер и верну полученные данные».
//axiosInstance.get('/vabstore/') — вот здесь Axios создаёт и отправляет GET-запрос
export async function getProducts() {
    const res = await axiosInstance.get('/vabstore/');

    return res.data;
}


export async function getCategories() {
    const res = await axiosInstance.get('/categories/');

    return res.data;
}


// Получаем товары Black Friday
//axiosInstance.get(...) — отправляет GET-запрос на Django.
// '/vabstore/black-friday/' — путь к нашему новому обработчику.
export async function getBlackFridayProducts() {
    const res = await axiosInstance.get('/vabstore/black-friday/');

    return res.data;
}