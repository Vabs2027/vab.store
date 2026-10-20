
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.generics import RetrieveAPIView

from django.conf import settings
from django.conf.urls.static import static


from vabstore.views.product_view import VabstoreAPIList, VabstoreAPIUpdate, VabstoreAPIDestroy, CategoryAPIList, BlackFridayAPIlist
from vabstore.views.register_view import RegisterView

# router = routers.DefaultRouter()
# router.register(r'vabstore', VabstoreViewSet)
# print(router.urls)


urlpatterns = [
    path('admin/', admin.site.urls),

    #главная стр с подгрузкой React
    path('', TemplateView.as_view(template_name='index.html')),

    #получение заказа по номеру самого заказа
    # path("api/v1/orders/<int:pk>/", OrderDetailAPIView.as_view(), name="order-detail"),

    #заказы
    path('api/v1/orders/', include('vabstore.urls_orders')),

    #для Избраного
    path('api/v1/favorites/', include('vabstore.urls_favorites')),

    #категории
    path('api/v1/categories/', CategoryAPIList.as_view()),

    path('api/v1/auth/', include('rest_framework.urls')),

    # токен
    path('api/v1/auth/token/', obtain_auth_token, name='api_token_auth'),

    #регистарци пользователя
    path('api/v1/auth/register/', RegisterView.as_view(), name='register'),

    # path('api/v1/', include(router.urls))
    # path('api/v1/vabstorelist/', VabstoreViewSet.as_view({'get': 'list'})),
    # path('api/v1/vabstorelist/<int:pk>/', VabstoreViewSet.as_view({'put': 'update'})),

    path('api/v1/vabstore/', VabstoreAPIList.as_view()),
    path('api/v1/vabstore/black-friday/', BlackFridayAPIlist.as_view()),
    path('api/v1/vabstore/<int:pk>/', VabstoreAPIUpdate.as_view()),
    path('api/v1/vabstoredelete/<int:pk>/', VabstoreAPIDestroy.as_view())

]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)