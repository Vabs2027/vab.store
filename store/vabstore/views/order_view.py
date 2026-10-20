from rest_framework import viewsets
from rest_framework import status as http_status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Order, Product, OrderItem, Size
from ..serializers import OrderSerializer

from ..services.order_service import OrderService

from ..services.orderitem_service import OrderItemService


#Теперь про саму работу этого файла.

#OrderViewSet - - Это контроллер заказов, то есть входная дверь для API

#Он отвечает за:

#создать заказ
#получить заказ
#историю заказов
#оплатить заказ
#отменить заказ
#изменить количество товаров

# React / Postman
#        ↓
# OrderViewSet
#        ↓
# OrderService / OrderItemService
#        ↓
# Models (Order, OrderItem)
#        ↓
# Database
#
# OrderViewSet принимает HTTP-запросы, проверяет данные,
# вызывает сервисы с бизнес-логикой и возвращает Response.
#
# Примеры:
#
# POST   /orders/create/
#        ↓
# create_order()
#        ↓
# OrderService.checkout()
#
# GET    /orders/26/
#        ↓
# retrieve() (стандартный метод ModelViewSet)
#
# PATCH  /orders/26/increment-item/
#        ↓
# increment_item()
#        ↓
# OrderItemService.increment()
#
# PATCH  /orders/26/decrement-item/
#        ↓
# decrement_item()
#        ↓
# OrderItemService.decrement()

#viewsets.ViewSet — базовый класс DRF для создания «ViewSet».
#Он позволяет объединять несколько действий (create, list, retrieve и кастомные) в один класс и подключать их через роутер.

#логика по пунктам как писать сами кастом методов
# React / Postman
#        ↓
# URL
#        ↓
# ViewSet (@action)
#        ↓
# Проверка данных
#        ↓
# Service (бизнес-логика)
#        ↓
# Models
#        ↓
# Database
#        ↓
# Serializer
#        ↓
# Response

#как именно писать новые методы
# 1. Получаем объект (заказ, корзину и т.д.)
#
# 2. Проверяем что объект существует
#
# 3. Получаем данные из request.data
#
# 4. Валидируем данные
#
# 5. Вызываем сервис или работаем с моделью
#
# 6. Сериализуем результат
#
# 7. Возвращаем Response

#OrderViewSet (принимает запрос) уже из файла orders.js из getOrder
class OrderViewSet(ModelViewSet):#В ViewSet обычно создают действия (actions), которые можно вызывать через отдельные маршруты (@action), например pay, cancel, ship.
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    service = OrderService()
    orderitem_service = OrderItemService()#orderitem_service - это объект, внутри которого лежат все методы класса.

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


    @action(detail=False, methods=['post'], url_path='create-active')
    def create_active_order(self, request):
        order = Order.objects.create(
            user=request.user,
            status=Order.Status.NEW
        )

        return Response(OrderSerializer(order).data, status=http_status.HTTP_201_CREATED)


    #статус заказа и оплата
    @action(detail=True, methods=['post'], url_path='pay')#detail=True - раб с одним об
    def pay(self, request, pk=None):
        order = self.service.get_order(pk, request.user)#получаем заказ
        #related_name="items" означает → из Order можно вызвать order.items
        # 1. заказ должен существовать
        if not order:
            return Response({'detail': 'Замовлення не знайдено.'}, status=http_status.HTTP_404_NOT_FOUND)

        # 2. заказ должен быть новым, то есть if order.status != Order.Status.NEW: оплатить только можно NEW заказ
        if order.status != Order.Status.NEW:#Status это сам класс TextChoises
            return Response({'detail': 'Неможливо оплатити замовлення.'}, status=http_status.HTTP_400_BAD_REQUEST)

        # 3. в заказе должны быть товары, Проверяем, что в заказе есть товары!
        if order.items.count() == 0:#Нельзя оплатить заказ, в котором нет ни одного OrderItem, count() считает количество таких записей в БД
            return Response({'detail': 'Неможливо оплатити — замовлення порожнє.'}, status=http_status.HTTP_400_BAD_REQUEST)

        #4.подсчет общей сумы всех товаров в заказе
        total = 0

        for item in order.items.all():
            total+=item.quantity*item.price

        order.total_price = total
        order.status = Order.Status.PAID
        order.save()

        return Response(OrderSerializer(order).data)#возвращаем обновленый заказ


    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        order = self.service.get_order(pk, request.user)

        if not order:
            return Response({'detail': 'Замовлення не знайдено.'}, status=http_status.HTTP_404_NOT_FOUND)

        if order.status in [Order.Status.DELIVERED, Order.Status.CANCELLED]:#Status это кл из модели
            return Response({'detail': 'Замовлення не може бути відміненно'}, status=http_status.HTTP_400_BAD_REQUEST)

        order.status = Order.Status.CANCELLED
        order.save()

        return Response(OrderSerializer(order).data)

    #история заказов показывать
    @action(detail=False, methods=['get'], url_path='history')
    def history(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)#many=True будет раб с колекцией об а не с одной записью

        return Response(serializer.data, status=http_status.HTTP_200_OK)


    @action(detail=True, methods=['patch'], url_path='increment-item')
    def increment_item(self, request, pk=None):
        #1 получаем заказ
        order = self.service.get_order(pk, request.user)#вызыввем логику
        if not order:
            return Response({'detail': 'Замовлення не знайденно'}, status=http_status.HTTP_404_NOT_FOUND)

        #2 проверяем статус замовл
        if order.status != Order.Status.NEW:
            return Response({'detail': 'Cannot modify a non-new order'}, status=http_status.HTTP_400_BAD_REQUEST)


        #3 item_id из БОДИ
        item_id = request.data.get('item_id')
        if not item_id:
            return Response({"detail": "item_id required"}, status=http_status.HTTP_400_BAD_REQUEST)

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
            {"detail": "item_id must be a number"},
            status=http_status.HTTP_400_BAD_REQUEST
        )
        # проверяем, что item принадлежит этому заказу
        #«Найди OrderItem с таким item_id, который принадлежит именно этому заказу».
        #Если товар есть в этом заказе → только тогда вызывается: бизнес логика и только тогда +
        item = OrderItem.objects.filter(
            id=item_id,
            order=order
        ).first()

        if not item:
            return Response(
                {"detail": "Item not found in this order"},
                status=http_status.HTTP_404_NOT_FOUND
            )

        #4 увеличиваем колич +1
        item = self.orderitem_service.increment(item_id)

        serializer = OrderSerializer(order)

        return Response(serializer.data)

    #@action — это декоратор Django REST Framework для ViewSet. Он говорит DRF:
    #«Эта функция является специальным API-действием и должна стать отдельным endpoint'ом».
    #url_path='decrement-item' - как будет называеся endpoint в URL
    @action(detail=True, methods=['patch'], url_path='decrement-item')#detail=True Говорит, что действие относится к конкретному объекту - /orders/35/increment-item/
    def decrement_item(self, request, pk=None):#pk получает значение из URL. - pk == 35 номер самого заказа
        order = self.service.get_order(pk, request.user)#«Получи заказ №35, но только если он принадлежит текущему пользователю».
        #проверка есть ли заказ
        if not order:
            return Response(
                {"detail": "Замовлення не знайденно"},
                status=http_status.HTTP_404_NOT_FOUND
            )
        #проверка статуса заказа
        if order.status != Order.Status.NEW:
            return Response(
                {"detail": "Cannot modify a non-new order"},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        item_id = request.data.get('item_id')

        if not item_id:
            return Response({"detail": "item_id required"}, status=400)

        try:
            item_id = int(item_id)
        except ValueError:
            return Response({"detail": "item_id must be a number"}, status=400)

        # проверяем, что item принадлежит этому заказу
        #«Найди OrderItem с таким item_id, который принадлежит именно этому заказу».
        ##Если товар есть в этом заказе → только тогда вызывается: бизнес логика и только тогда -
        item = OrderItem.objects.filter(
            id=item_id,
            order=order,
        ).first()

        if not item:
            return Response(
                {"detail": "Item not found in this order"},
                status=http_status.HTTP_404_NOT_FOUND
            )

        order = self.orderitem_service.decrement(item_id)#вызываем логику
        if not order:
            return Response({"detail": "Item deleted"}, status=200)


        serializer = OrderSerializer(order)

        return Response(serializer.data)


#Добавление в УЖЕ созданый ЗАКАЗ - ТОВАРОВ еще
    @action(detail=True, methods=['post'], url_path='add-item')#эта стр создает новый url, detail=True - раб с конкр ЗАКАЗОМ
    def add_item(self, request, pk=None):
        #получаем заказ
        order = self.service.get_order(pk, request.user)
        #проверяем если заказа нет
        if not order:
            return Response({'detail': 'Order not found'},
                            status=http_status.HTTP_404_NOT_FOUND
                            )
        # 2 проверяем статус замовл
        if order.status != Order.Status.NEW:
            return Response({'detail': 'Cannot modify a non-new order'},
                            status=http_status.HTTP_400_BAD_REQUEST
                            )

        product_id = request.data.get('product_id')#достаёт ID товара из тела запроса и записывает его в переменную product_id

        size_id = request.data.get('size_id')#получаем ID выбраного размера

        #поиск размера
        try:
            size = Size.objects.get(id=size_id)
        except Size.DoesNotExist:
            return Response(
                {'detail': 'Розмір не знайдено'},
                status=http_status.HTTP_404_NOT_FOUND
            )

        if not product_id:
            return Response({'detail': 'product_id required'},
                            status=http_status.HTTP_400_BAD_REQUEST
                            )

        #если все ок, получаем количество
        try:
            ##получаем количество
            quantity = int(request.data.get('quantity', 1))#то есть если поле отсутствует то количество = 1
        except ValueError:
            return Response(
                {'detail': 'quantity must be a number'},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        #ищем товар
        try:
            product = Product.objects.get(id=product_id)#ищем товар по айди
        except Product.DoesNotExist:#если товара нет, выдаем ошибку
            return Response({'detail': 'Product not found'},
                            status=http_status.HTTP_404_NOT_FOUND
                            )

        #ищем, есть ли уже такой товар в заказе
        item = OrderItem.objects.filter(#filter(...) — найти записи, которые подходят под условие, filter() возвращает QuerySet (список объектов).
            order=order,         #ищем внутри заказа
            product=product,      #ищем товар
            size=size             #ищем сам размер товара
        ).first()                #берет первый товар

        #если есть уже товар в заказе то добавялем + 1 к количеству
        if item:
            item.quantity += quantity #то добавяляем +1 к уже товару, изменяем только в памяти
            item.save()               #save() - для сохранение уже в самой БД
        else:
            ## Определяем цену товара для заказа:
            # если товар на акции — берём sale_price,
            # иначе используем обычную цену product.price.
            item_price = (
                product.sale_price
                if product.is_on_sale and product.sale_price#Товар на акции И у него есть рассчитанная цена акции?
                else product.price
            )

            #добавление товара в заказ происходит здесь:
            item = OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=item_price,
                size=size #мы передаём size, а не size_id, потому что Django уже получил объект Size и сам сохранит его ID в поле size_id.
            )

        #возвращаем обновленный заказ, Мы берем уже обновленный заказ и превращаем его в JSON.
        serializer = OrderSerializer(order)

        return Response(serializer.data)    #отправляем в Реакт

    #Етапы удаления
    #Order существует?
     #      ↓
    #Status = NEW?
    #       ↓
    #Получили item_id?
    #       ↓
    #item_id число?
    #       ↓
    #OrderItem принадлежит этому Order?
    #       ↓
    #remove()
    #       ↓
    #готово ✅
    @action(detail=True, methods=['delete'], url_path='remove-item')
    def remove_item(self, request, pk=None):
        # получаем заказ
        order = self.service.get_order(pk, request.user)
        # проверяем если заказа нет
        if not order:
            return Response({'detail': 'Order not found'},
                            status=http_status.HTTP_404_NOT_FOUND
                            )

        # проверка статуса заказа
        if order.status != Order.Status.NEW:
            return Response(
                {'detail': 'Cannot modify a non-new order'},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        #!!! Главное правило здесь: Сначала все проверки → потом удаление!!!

        # получаем item_id как пример "item_id": 15
        item_id = request.data.get('item_id')
        if not item_id:
            return Response(
                {'detail': 'item_id required'},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        # приводим к числу, это защита - то есть "15" → 15 из стр в число
        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {'detail': 'item_id must be a number'},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        #проверка существования OrderItem и его принадлежности заказу. - Существует ли OrderItem №15 как пример именно внутри заказа №31?»
        item = OrderItem.objects.filter(
            id=item_id,
            order=order
        ).first()

        #если не существует OrderItem 15 внутри заказа 31, удаление НЕ ВЫПОЛНЯТСЯ
        if not item:
            return Response(
                {"detail": "Item not found in this order"},
                status=http_status.HTTP_404_NOT_FOUND
            )

        # удаляем через сервис, возвращает результат работы сервиса.
        #То есть:
        #удаление успешно → return order
        #OrderItem не найден → return None
        result = self.orderitem_service.remove(item_id)

        #проверяем результа
        if not result:
            return Response(
                {'detail': 'Item not found'},
                status=http_status.HTTP_404_NOT_FOUND
            )

        # возвращаем обновленый заказ
        serializer = OrderSerializer(order)

        return Response(serializer.data)




