import type {Product} from "../types/product.type.ts";
import {api} from "./api.ts";

export const AuthService = {
    getAll(): Promise<Product[]> {
        return api.get("/products").then(res => res.data);
    }
};
