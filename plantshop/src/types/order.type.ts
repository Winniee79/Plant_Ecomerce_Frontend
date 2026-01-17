export type OrderStatus =
    | "pending"
    | "confirmed"
    | "packing"
    | "shipping"
    | "success"
    | "cancelled";

export type OrderItem = {
    id: number | string;
    order_id?: string;
    product_id: number;
    quantity: number;
    price: number;
    original_price?: number;
    name?: string;
    image?: string;
    created_at?: string;
    updated_at?: string;
};

export type Order = {
    id: string;
    user_id: number | null;
    recipient_name: string;
    recipient_phone: string;
    full_address: string;
    payment_method_id: number;
    payment_status: string;
    subtotal: number;
    shipping_fee: number;
    discount_amount: number;
    total_amount: number;
    status: OrderStatus;
    created_at: string;

    items?: OrderItem[];
    itemsDetail?: OrderItem[];

    note?: string;
    payment_method?: string;
};

export type OrderCreatePayload = {
    user_id: number | null;
    recipient_name: string;
    recipient_phone: string;
    full_address: string;
    payment_method_id: number;
    payment_status: string;
    subtotal: number;
    shipping_fee: number;
    discount_amount: number;
    total_amount: number;
};