import axiosInstance from "./axiosInstance";



/*создаём функции React, которые обращаются к уже готовому API Django.*/
/*React
  ↓
services/favorites.js
  ↓
HTTP-запрос
  ↓
Django FavoriteViewSet
  ↓
FavoriteService
  ↓
Favorite
  ↓
База данных*/


/*getFavorites() → GET → получает избранные товары пользователя.*/
export async function getFavorites() {
    const res = await axiosInstance.get('/favorites/')

    return res.data;
}

/*addFavorite(productId) → POST → добавляет товар в избранное.*/
export async function addFavorites(productId) {
    const res = await axiosInstance.post('/favorites/', {
        product_id: productId
    });

    return res.data;
}

/*removeFavorite(productId) → DELETE → удаляет товар из избранного.*/
export async function removeFavorites(productId) {
    const res = await axiosInstance.delete(`/favorites/${productId}/`);

    return res.data;
}