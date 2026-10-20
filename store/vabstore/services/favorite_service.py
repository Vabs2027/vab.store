from vabstore.models import Product, Favorite


class FavoriteService:

    #добавл в Избраное
    #POST / favorites /
    #↓
    #FavoriteViewSet.create()
    #↓
    #FavoriteService.add()
    #↓
    #Favorite
    #↓
    #База
    #данных

    def add(self, user, product_id):
        product = Product.objects.get(id=product_id)#находим товар Какой товар пользователь хочет добавить

        #Есть ли у этого пользователя уже этот товар в избранном? то есть проверяем
                            #Тоесть Если нет:
                                #Favorite создаётся
                                #created = True
        #появляется пользователь
        favorite, created = Favorite.objects.get_or_create(
            user=user,
            product=product
        )

        return favorite

    #delete из Избраного
    #DELETE / favorites / 3 /
    #↓
    #FavoriteViewSet.destroy()
    #↓
    #product_id = 3
    #↓
    #FavoriteService.remove()
    #↓
    #База
    #данных

    def remove(self, user, product_id):
        try:
            favorite = Favorite.objects.get(
                user=user,
                product_id=product_id
            )

            favorite.delete()
            return True

        except Favorite.DoesNotExist:
            return False