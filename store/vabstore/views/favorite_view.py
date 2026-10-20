from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from vabstore.models import Favorite
from vabstore.serializers import FavoriteSerializer
from vabstore.services.favorite_service import FavoriteService


    #Model
    #  ↓
    #Serializer
    #  ↓
    #FavoriteService
    #  ↓
    #FavoriteViewSet


class FavoriteViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]#Только авторизованный пользователь может работать с избранным.

    service = FavoriteService()

    def list(self, request):
        favorites = Favorite.objects.filter(user=request.user)#Возьми только избранное текущего пользователя.

        serializer = FavoriteSerializer(
            favorites,
            many=True
        )

        return Response(serializer.data)

    #POST / api / v1 / favorites /
    #↓
    #create()
    #↓
    #product_id
    #из
    #request.data
    #↓
    #FavoriteService.add()
    #↓
    #Favorite.objects.get_or_create()
    #↓
    #Database

    def create(self, request):
        product_id = request.data.get('product_id')

        print("FAVORITE CREATE:", request.user, product_id, type(product_id))

        favorite = self.service.add(
            request.user,
            product_id
        )

        serializer = FavoriteSerializer(favorite)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    #удаление из Избраного
    #DELETE /favorites/3/
         # ↓
    #FavoriteViewSet.destroy()
        #  ↓
    #product_id = 3
        #  ↓
    #FavoriteService.remove()
        #  ↓
    #База данных

    def destroy(self, request, pk=None):#Здесь pk — это ID записи Favorite, а не product_id.
        product_id = pk#то есть мы пишем в ПОСТМЕН для удаление из Избраного по product_id

        result = self.service.remove(
            request.user,
            product_id
        )

        if not result:
            return Response(
                {'detail': 'Избране не знайдено'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )