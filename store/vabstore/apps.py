from django.apps import AppConfig


class VabstoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vabstore'

    #подключаем сигналы
    def ready(self):
        import vabstore.signals