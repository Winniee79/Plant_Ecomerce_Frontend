import products from "../data/products.json";
import { http, HttpResponse } from "msw";

export const productHandlers = [
    http.get("/api/products", () => {
        return HttpResponse.json(products);
    })
];
