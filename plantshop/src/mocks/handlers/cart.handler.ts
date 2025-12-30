import data from "../data/carts.json";
import { http, HttpResponse } from "msw";

export const cartHandlers = [
    http.get("/plant/carts", () => {
        return HttpResponse.json({carts:data.carts});
    })
];
