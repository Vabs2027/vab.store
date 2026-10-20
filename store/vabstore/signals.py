from django.db.models import Sum, F
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from vabstore.models import OrderItem

#для подсчета сразу количетсва при + - товара в корзине
@receiver([post_save, post_delete], sender=OrderItem)#post_save и post_delete – это сигналы Django, которые срабатывают после сохранения или удаления записи в базе.
def update_order_total(sender, instance, **kwargs):
    order = instance.order#instance.order – связь ForeignKey с Order., instance - конкретный об ORderItem
    total = order.items.aggregate(total=Sum(F('quantity') * F('price'))) ['total'] or 0

    order.total_price = total
    order.save()

#receiver – декоратор, который говорит Django «выполняй эту функцию, когда срабатывает сигнал»
#sender → модель, которая сгенерировала сигнал (OrderItem).
