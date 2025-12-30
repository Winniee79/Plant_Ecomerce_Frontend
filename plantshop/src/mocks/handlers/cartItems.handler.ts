import data from "../data/cart_items.json";
import { http, HttpResponse } from "msw";

export const cartItemHandlers = [
    http.get("/plant/cart_items", () => {
        return HttpResponse.json({
            cart_items: data.cart_items
        });
    })
];
