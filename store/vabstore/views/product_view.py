from django.forms import model_to_dict
from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from vabstore.models import Product, Category
from vabstore.permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from vabstore.serializers import ProductSerializer, CategorySerializer



#product_view.py — это место, где Django решает, что делать с пришедшим запросом.
#View — обработчик HTTP-запроса.
#React отправляет запрос → URL Django направляет его в нужный View → View обращается к модели/сериализатору → возвращает ответ React.

# React
    # ↓
    # GET /api/v1/categories/
    # ↓
    # CategoryAPIList
    # ↓
    # Category.objects.all()
    # ↓
    # CategorySerializer
    # ↓
    # JSON

class VabstoreAPIList(generics.ListCreateAPIView): #Получает список всех товаров, каталог магазина
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )#ограничение доступа
    #React --- GET /api/v1/vabstore/
                    #↓
                #VabstoreAPIList
                    #↓
            #Product.objects.all()
                    #↓
                    #JSON

#Слово export позволяет использовать эту функцию в других файлах.
class BlackFridayAPIlist(generics.ListAPIView):#ListAPIView - для получения товаров
    queryset = Product.objects.filter(is_black_friday=True)#выбирает только товары, у которых стоит галочка Black Friday - по полю моедли Продукт
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )#сохраняет тот же режим доступа, что и у обычного каталога.


class VabstoreAPIUpdate(generics.RetrieveUpdateAPIView):#Изменяет один товар по id, работает чреез PATCH, PUT
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsOwnerOrReadOnly, )
    #PATCH/api/v1/vabstore/5/ как пример
    #Изменить цену
    #Изменить описание
    #Изменить количество
    #Изменить название


class VabstoreAPIDestroy(generics.RetrieveDestroyAPIView):#удаляет товар по id
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAdminOrReadOnly, )#IsAdminUser доступ только адмн сайта
    #DELETE/api/v1/vabstoredelete/5/


#обработчик (View), который будет принимать запрос React.
class CategoryAPIList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    #цепочка
    #React - getPrducts(), getCategory()....из файла products.js
        #↓
    #axiosInstance.get('/categories/') axiosInstance.get('/category/') — вот здесь Axios создаёт и отправляет GET-запрос
       # ↓
    #GET /api/v1/categories/
        #↓
    #urls.py
        #↓
    #CategoryAPIList
    #(product_view.py)
        #↓
    #Category.objects.all()
        #↓
    #CategorySerializer
        #↓
       #JSON
        #↓
       #React