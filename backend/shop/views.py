from django.db import connection
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product, CartItem
from .serializers import ProductSerializer, CartItemSerializer, AddToCartSerializer


class ProductListView(generics.ListAPIView):
    """GET /products/ - список всех товаров"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    """GET /products/:id - один товар"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@api_view(['GET', 'DELETE'])
def manage_cart(request, user_id):
    if request.method == 'GET':
        return get_cart(user_id)
    elif request.method == 'DELETE':
        return clear_cart(user_id)


def clear_cart(user_id):
    with connection.cursor() as cursor:
        cursor.execute("""
DELETE FROM shop_cartitem WHERE user_id = %s
        """, [user_id])
    return JsonResponse({
        'ok': True
    })


def get_cart(user_id):
    with connection.cursor() as cursor:
        # Raw SQL запрос для получения корзины с товарами
        cursor.execute("""
                SELECT 
                    ci.id as cart_item_id,
                    ci.quantity,
                    p.id as product_id,
                    p.name,
                    p.description,
                    p.image_url,
                    p.price,
                    p.discount_applicable
                FROM shop_cartitem ci
                JOIN shop_product p ON ci.product_id = p.id
                WHERE ci.user_id = %s
                ORDER BY ci.created_at DESC
            """, [user_id])

        rows = cursor.fetchall()

        # Формируем ответ
        items = []
        total = 0

        for row in rows:
            cart_item_id, quantity, product_id, name, description, image_url, price, discount_applicable = row
            item_total = float(price) * quantity
            total += item_total

            items.append({
                'id': cart_item_id,
                'quantity': quantity,
                'product': {
                    'id': product_id,
                    'name': name,
                    'description': description,
                    'image_url': image_url,
                    'price': float(price),
                    'discount_applicable': discount_applicable
                }
            })

        return JsonResponse({
            'items': items,
            'total': round(total, 2)
        })


@api_view(['POST'])
def add_to_cart(request):
    """POST /cart/add/ - добавление товара в корзину"""
    serializer = AddToCartSerializer(data=request.data)
    if serializer.is_valid():
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        replace = serializer.validated_data['replace']
        user_id = 1  # Упрощено: один пользователь

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Добавляем или обновляем количество в корзине
        cart_item, created = CartItem.objects.get_or_create(
            user_id=user_id,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            if replace:
                cart_item.quantity = quantity
            else:
                cart_item.quantity += quantity
            cart_item.save()

        return Response({
            'message': 'Product added to cart',
            'item_id': cart_item.id,
            'quantity': cart_item.quantity
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def remove_from_cart(request, product_id):
    """DELETE /cart/remove/:product_id - удаление товара из корзины"""
    user_id = 1  # Упрощено: один пользователь

    try:
        cart_item = CartItem.objects.get(user_id=user_id, product_id=product_id)
        cart_item.delete()
        return Response({'message': 'Product removed from cart'}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Product not found in cart'},
            status=status.HTTP_404_NOT_FOUND
        )
