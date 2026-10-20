from django.forms import model_to_dict
from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet

from .models import Product, Category
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly
from .serializers import ProductSerializer


from .models import Order
from .serializers import OrderSerializer
from rest_framework.generics import RetrieveAPIView


class VabstoreAPIList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )#ограничение доступа


class VabstoreAPIUpdate(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsOwnerOrReadOnly, )


class VabstoreAPIDestroy(generics.RetrieveDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsAdminOrReadOnly, )#IsAdminUser доступ только адмн сайта





