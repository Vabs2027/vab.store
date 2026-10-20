import io
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from decimal import Decimal
from .models import Product, OrderItem, Order, Category, Favorite, Size


#API использует Serializer, чтобы решить:
            #Какие данные модели показать пользователю и в каком виде

#Serializer сам по себе не обязательно "возвращает JSON". Он преобразует объект Django в данные Python (dict/список),
#а уже DRF Response + renderer превращают эти данные в JSON для HTTP-ответа.

#Model
#  ↓
#Serializer        ← уже сделали (как пример)
#  ↓
#Service           ← сейчас     (как пример)
#  ↓
#ViewSet
#  ↓
#URL
#  ↓
#React

#сериализатор Размера
class SizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Size
        fields = ['id', 'name']


#source='size' - «Для нового поля sizes возьми данные из существующего поля size модели Product.»
class ProductSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    sizes = SizeSerializer(source='size', many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"  # какие именно поля будут возвращены клиенту


    #показыв назв тов, колич, цену на момент заказа
class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.CharField(source='product.id', read_only=True)#read_only=True означает «это поле можно только читать через этот сериализатор».
    product_name = serializers.CharField(source='product.name', read_only=True)#source = путь до поля или метода, откуда сериализатор возьмёт значение.
    product_image = serializers.ImageField(source='product.image', read_only=True)#для картинки уже в самом заказе - товаров
    #У OrderItem возьми связанный product, а у него возьми image - то есть в source
    size_name = serializers.CharField(source='size.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'product_image', 'quantity', 'price', 'size_name']
        #это 'ID' самого OrderItem, то есть строки товара внутри заказа.


    #показ общая сум, дата, сп товар(вложенный)
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'total_price', 'created_at', 'items']


 #для авторизации пользователя
class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    #проверка на количество символов пароля
    def validate_password(self, value):
        if len(value) <8:
            raise serializers.ValidationError(
                'Пароль повинен бути не меньше 8 символів'
            )

        return value

    #create_user() правильно создаёт пользователя с хешированным паролем.
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )

        return user


#сериализатор для модели Категория
class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


#сериализатор на Избраное
class FavoriteSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'product_id', 'product_name']#user здесь специально не отдаём — пользователя будем определять на сервере по авторизации.




