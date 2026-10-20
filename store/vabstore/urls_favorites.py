from django.urls import path, include
from rest_framework.routers import DefaultRouter

from vabstore.views.favorite_view import FavoriteViewSet


#GET /api/v1/favorites/
#          ↓
#urls_favorites.py
#          ↓
#FavoriteViewSet.list()
#          ↓
#Favorite.objects.filter(user=request.user)
#          ↓
#FavoriteSerializer
#          ↓
#JSON


router = DefaultRouter()
#r'' означает: «Внутри уже подключённого /api/v1/favorites/ дополнительных слов в URL не добавляй».

#basename='favorite'
        #↓
#имя маршрута внутри DRF

#То есть Django/DRF смотрит на зарегистрированный router и видит:
#«Для этого маршрута используй FavoriteViewSet».
#А basename='favorite' просто даёт этому набору маршрутов имя - favorite-list

router.register(r'', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls))
]