from django.contrib import admin
from .models import Product, CartItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'product', 'quantity', 'created_at']
    list_filter = ['user_id', 'created_at']
    search_fields = ['product__name']
