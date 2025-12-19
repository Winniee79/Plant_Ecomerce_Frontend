import { api } from "./api";
import type { Product } from "../types/product.type";

export const productService = {
    getAll(): Promise<Product[]> {
        return api.get("/products").then(res => res.data);
    }
};
