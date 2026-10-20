from vabstore.models import Size


def reset_size():
    Size.objects.all().delete()

    sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

    for size in sizes:
        Size.objects.get_or_create(code=size,
                                   defaults={'name':size, 'category': 'clothes'})

    print('Нові розміри создані')

    shoes_size = [
        ('40', '25.5'),
        ('41', '26'),
        ('41.5', '26.5'),
        ('42', '27'),
        ('43', '27.5'),
        ('44', '28')
    ]

    for code, cm in shoes_size:
        Size.objects.get_or_create(code=code,
                                   defaults={'name': f'{code}-{cm} см', 'category': 'shoes'})

    print('Таблиця розміру взуття создана')