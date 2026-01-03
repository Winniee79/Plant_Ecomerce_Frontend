import data from "../data/cart_items.json";
import { http, HttpResponse } from "msw";

export const cartItemHandlers = [
    // GET
    http.get("/plant/cart_items", ({ request }) => {
        const url = new URL(request.url);
        const cartId = url.searchParams.get("cart_id");

        const items = data.cart_items.filter(
            i => i.cart_id === Number(cartId)
        );

        return HttpResponse.json({ cart_items: items });
    }),

    // PATCH quantity
    http.patch("/plant/cart_items/:id", async ({ params, request }) => {
        const { id } = params;
        const body = (await request.json()) as { quantity: number };

        const item = data.cart_items.find(i => i.id === Number(id));
        if (!item) return new HttpResponse(null, { status: 404 });

        item.quantity = body.quantity;
        return HttpResponse.json(item);
    }),

    // ADD TO CART
    http.post("/plant/cart_items", async ({ request }) => {
        const body = await request.json() as {
            cart_id: number;
            product_id: number;
            price: number;
            quantity: number;
        };

        const existed = data.cart_items.find(
            i =>
                i.cart_id === body.cart_id &&
                i.product_id === body.product_id
        );

        if (existed) {
            existed.quantity += body.quantity;
            return HttpResponse.json(existed);
        }

        const newItem = {
            id: Date.now(),
            ...body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        data.cart_items.push(newItem);
        return HttpResponse.json(newItem, { status: 201 });
    }),
];
