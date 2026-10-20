from django.db import transaction
from ..models import Order, OrderItem #.. подняться на один уровень выше относительно текущего файла

#order_service говорит: Что сделать, когда Django получил этот запрос из OrderViewSet
#то есть мы описываем методы - которые решают что делать когда ДЖанго получил запрос
#файл OrderService - (вся бизнес-логика)
class OrderService:

    def get_order(self, pk, user):
        try:
            return Order.objects.get(id=pk, user=user)
        except Order.DoesNotExist:
            return None