import { api } from "./api";
import type {
    CartItemResponse,
    CartViewItem,
} from "../types/cart.type";
import type { Product } from "../types/product.type";
import type {CartResponse} from "../types/cart.type";
import { getCurrentUser, getSessionId } from "../utils/auth";

export const cartService = {
    // Lấy cart active của user / guest
    async getActiveCart() {
        const user = getCurrentUser();
        const sessionId = getSessionId();

        const params = user
            ? { user_id: user.id, status: "active" }
            : { session_id: sessionId, status: "active" };

        const res = await api.get<CartResponse>("/carts", { params });
        return res.data.carts[0] ?? null;
    },
    // Lấy cart items + join product
    async getCartItems(cartId: number): Promise<CartViewItem[]> {
        const [itemsRes, productRes] = await Promise.all([
            api.get<CartItemResponse>("/cart_items", {
                params: { cart_id: cartId },
            }),
            api.get<Product[]>("/products"),
        ]);

        return itemsRes.data.cart_items.map(item => {
            const product = productRes.data.find(
                p => p.id === item.product_id
            );

            return {
                id: item.id,
                productId: item.product_id,
                name: product?.name ?? "",
                image: product?.image ?? "",
                price: item.price,
                quantity: item.quantity,
            };
        });
    },

    // Cập nhật số lượng
    async updateQuantity(itemId: number, quantity: number) {
        await api.patch(`/cart_items/${itemId}`, { quantity });
    },

    // thêm sản phẩm vào giỏ hàng
    async addToCart(productId: number, price: number, stock?: number) {
        if (stock !== undefined && stock <= 0) {
            throw new Error("Sản phẩm đã hết hàng");
        }

        const user = getCurrentUser();
        const sessionId = getSessionId();

        let cart = await this.getActiveCart();

        if (!cart) {
            const res = await api.post("/carts", {
                user_id: user?.id ?? null,
                session_id: user ? null : sessionId,
                status: "active",
            });
            cart = res.data;
        }

        await api.post("/cart_items", {
            cart_id: cart.id,
            product_id: productId,
            price,
            quantity: 1,
        });
    },
};

