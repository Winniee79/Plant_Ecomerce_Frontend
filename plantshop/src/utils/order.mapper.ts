import type { Order } from "../types/order.type";

export type OrderUI = {
    id: string;
    date: string;
    total: number;
    paymentMethod: string;
    status: Order["status"];
};

export const mapOrderToUI = (order: Order): OrderUI => {
    return {
        id: `ORD-${order.id.toString().padStart(9, "0")}`,
        date: new Date(order.created_at).toLocaleDateString("vi-VN"),
        total: order.total_amount,
        paymentMethod:
            order.payment_method_id === 1
                ? "Thanh toán Online"
                : "COD",
        status: order.status,
    };
};
