from django.urls import path
from .views import ProductListView, ProductDetailView, get_cart, add_to_cart, remove_from_cart

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('cart/<int:user_id>/', get_cart, name='get-cart'),
    path('cart/add/', add_to_cart, name='add-to-cart'),
    path('cart/remove/<int:product_id>/', remove_from_cart, name='remove-from-cart'),
]
