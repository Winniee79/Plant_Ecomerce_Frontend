import { http, HttpResponse } from "msw";

import carts from "../data/carts.json";
import cartItems from "../data/cart_items.json";

export const cartHandlers = [
    // GET /cart
    http.get("plants/cart", () => {
        return HttpResponse.json(carts);
    }),

    // GET /cart_items
    http.get("plants/cart_items", () => {
        return HttpResponse.json(cartItems);
    }),
];
