import type { CartViewItem } from "../types/cart.type";
import type { CheckoutCartItem } from "../types/checkout.type";
import productsData from "../mocks/data/products.json";

function parseWeightKg(raw?: string): number {
    if (!raw) return 1;
    const match = raw.match(/([\d.]+)/);
    return match ? Number(match[1]) : 1;
}

export function mapToCheckoutCart(
    cartItems: CartViewItem[]
): CheckoutCartItem[] {
    return cartItems.map((item) => {
        const product = productsData.products.find(
            (p) => p.id === item.productId
        );

        return {
            ...item,
            weightKg: parseWeightKg(product?.dimensions?.weight),
        };
    });
}
