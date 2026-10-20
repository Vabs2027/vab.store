from vabstore.models import Category

def run():
    Category.objects.all().delete()
    #ГОЛОВНІ КАТЕГОРІЇ

    clothes, _ = Category.objects.get_or_create(name='Одяг')
    shoes, _ = Category.objects.get_or_create(name='Взуття')
    accessories, _ = Category.objects.get_or_create(name='Аксесуари')
    caps, _ = Category.objects.get_or_create(name='Головні убори')

    #ОДЯГ
    outerwear = Category.objects.create(name='Верхній одяг', parent=clothes)
    mens_jackets = Category.objects.create(name='Чоловічі куртки', parent=outerwear)
    demi_jackets = Category.objects.create(name='Демісезонні куртки', parent=mens_jackets)
    winter_jackets = Category.objects.create(name="Зимові куртки", parent=mens_jackets)
    summer_jackets = Category.objects.create(name="Легкі куртки", parent=mens_jackets)

    sweaters = Category.objects.create(name="Светри", parent=clothes)
    hoodies = Category.objects.create(name="Кофти та худі", parent=clothes)

    #ВЗУТТЯ
    sneakers = Category.objects.create(name='Чоловіче взуття', parent=shoes)
    winter_shoes = Category.objects.create(name="Ботинки", parent=sneakers)
    summer_sneakers = Category.objects.create(name="Кросівки літні", parent=sneakers)
    demi_shoes = Category.objects.create(name="Демісезонне взуття", parent=sneakers)

    #ГОЛОВНІ УБОРИ
    сap = Category.objects.create(name='Шапки та кепки', parent=caps)

    #АКСЕСУАРИ
    bags = Category.objects.create(name="Сумки", parent=accessories)
    belts = Category.objects.create(name="Ремені", parent=accessories)
    gloves = Category.objects.create(name="Рукавички", parent=accessories)

    return Category.objects.count()
    print('Усі категорії створені успішно!')





