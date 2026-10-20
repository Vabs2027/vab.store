from rest_framework.routers import DefaultRouter

from vabstore.views import OrderViewSet

router = DefaultRouter()

#заказы
router.register(r'', OrderViewSet, basename='orders')
#r'' Prefix в router → формирует URL от точки include.
#Если include уже содержит сегмент ресурса → префикс в router можно оставить пустым ("").

urlpatterns = router.urls#получаем сп url-oв