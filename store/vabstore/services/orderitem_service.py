from django.core.exceptions import ObjectDoesNotExist

from vabstore.models import OrderItem

#OrderItemService / OrderService (вся бизнес-логика)
#OrderItemService занимается не HTTP-запросами, а непосредственной работой с OrderItem:
#ViewSet
#   ↓
#OrderItemService
#   ↓
#получить / изменить / удалить OrderItem
#   ↓
#БД

#тут выполняется методы работы с БД
#аналог CartService.increment/decrement, только для уже созданных позиций заказа.

#Работа с OrderItem
#↓
#изменить quantity
#↓
#удалить запись
#↓
#сохранить в БД

#это бизнес логика
class OrderItemService:
    def increment(self, order_item_id):#+1 на товар
        try:
            item = OrderItem.objects.get(id=order_item_id)

            item.quantity += 1
            item.save() #тут срабатывает автоматически сигнал update_order_total

            return item

        except ObjectDoesNotExist:
            return None


    def decrement(self, order_item_id):# -1 на товар
        try:
            item = OrderItem.objects.get(id=order_item_id)

            if item.quantity <= 1:
                order = item.order
                item.delete()

                return order

            item.quantity -= 1
            item.save() # сигнал тоже сработает

            return item.order

        except ObjectDoesNotExist:
            return None

    #удаление товара прям из заказа который уже создан
    #найти конкретный OrderItem → удалить его из заказа → вернуть заказ.
    def remove(self, order_item_id):
        try:
            #получаем товар из заказа
            item = OrderItem.objects.get(id=order_item_id)
            #запоминаем заказ, потмоу что после удал обьекта уже не будет
            order = item.order

            item.delete()

            return order#возвращаем заказ, чтобы ViewSet смог его сериализовать и вернуть React.

        except ObjectDoesNotExist:
            return None
