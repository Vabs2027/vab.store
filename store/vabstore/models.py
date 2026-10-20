from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    season = models.ManyToManyField('Season', blank=True)
    size = models.ManyToManyField('Size', )
    user = models.ForeignKey(User, verbose_name='Користувач', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', blank=True, null=True)#upload_to="products/" — фотографии будут храниться в папке media/products/.
                                                    #blank=True — в админке можно не загружать фото.
                                                    #null=True — в базе поле может быть пустым.
    is_on_sale = models.BooleanField(default=False, verbose_name='Товар на АКЦІЇ')#True - товар показываем в «Акції».
                                                                                  #False - → обычный товар.
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Ціна по АКЦІЇ')#DecimalField хранит денежную сумму.
    discount_percent = models.PositiveIntegerField(null=True, blank=True, verbose_name='Знижка у відсотках')#null=True — в базе может быть пусто, blank=True — в Django Admin можно оставить поле пустым.
    is_black_friday = models.BooleanField(default=False, verbose_name='Black Friday')#BooleanField — отвечает на вопрос «Да или нет?»


    def calculate_sale_price(self):#self - конкретный товар

        discount_amount = self.price * self.discount_percent / 100

        sale_price = self.price - discount_amount

        return sale_price


    def save(self, *args, **kwargs):
        if self.is_on_sale and self.discount_percent:#Считай скидку только тогда, когда товар действительно находится на акции и указана скидка.
            self.sale_price = self.calculate_sale_price()#Запусти нашу функцию и результат запиши в поле sale_price.

        super().save(*args, **kwargs)#сохранение объекта в базе данных.

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='subcategories',
                                blank=True, null=True)#self ссылка на саму модель, саму на себя
    season = models.ManyToManyField('Season', blank=True, related_name='categories')

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Season(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Size(models.Model):
    CATEGORY_CHOISES = [
        ('clothes', 'Одяг'),
        ('shoes', 'Взуття')
    ]

    code = models.CharField(max_length=55, help_text='Оберіть розмір')
    name = models.CharField(max_length=55)
    category = models.CharField(max_length=55, choices=CATEGORY_CHOISES, default='clothes')

    class Meta:
        unique_together = ('code', 'category')
        verbose_name = 'Розмір'
        verbose_name_plural = 'Розміри'

    def __str__(self):
        return f'{self.name}'


#молель Избраное
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'product')#Один пользователь не сможет добавить один и тот же товар два раза.

    def __str__(self):
        return f'{self.user} - {self.product}'


#модель заказа
class Order(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Новий"  # Заказ создан
        PAID = "paid", "Оплачено"  # Оплачено
        PROCESSING = "processing", "Готується"  # (доп) сборка/обработка
        SHIPPED = "shipped", "В дорозі / Відправлено"  # Товар отправлен
        DELIVERED = "delivered", "Доставлено"  # Доставлено покупцю
        CANCELLED = "cancelled", "Відказ покупцем"  # Отменено

    user = models.ForeignKey(User, on_delete=models.CASCADE)#Это значит, что каждый Order обязательно принадлежит конкретному пользователю.
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.NEW)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f'Order {self.id} [{self.status}]'

#мод сп товаров в самом заказе
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')#related_name="items" означает → из Order можно вызвать order.items
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=20, decimal_places=2)
    size = models.ForeignKey(Size, on_delete=models.PROTECT)#PROTECT - нельзя случайно удалить размер из базы, если он уже использовался в заказе.
                                                            #ForeignKey - Один OrderItem связан с одним конкретным объектом Size.