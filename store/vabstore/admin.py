from django.contrib import admin

from .models import Product, Category

admin.site.register(Product)#Django автоматически покажет в админке все поля модели Product, включая новые
admin.site.register(Category)