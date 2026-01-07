import data from "../data/home.json";
import datapro from "../data/products.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW

export const productHandlers = [
    //GET API
    http.get("/api/products", () => {
        return HttpResponse.json(data.products); //Trả về response dạng JSON
    }),
    // GET /plant/new_products      => trả mảng sp moi
    http.get("/api/new_products", () => {
        return HttpResponse.json(data.new_products);
    }),
    //GET /plant/trending_products  => trả mảng sp trend
    http.get("/api/trending_products", () => {
        return HttpResponse.json(data.trending_products);
    }),
    // GET /plant/sale_products      => trả mảng sp khuyến mãi
    http.get("/api/sale_products", () => {
        return HttpResponse.json(data.sale_products);
    }),
    //GET /plant/wholesale_products  => trả mảng sp giá sĩ
    http.get("/api/wholesale_products", () => {
        return HttpResponse.json(data.wholesale_products);
    }),
    //GET /plant/supplies_products  => trả mảng sp vật tư
    http.get("/api/supplies_products", () => {
        return HttpResponse.json(data.supplies_products);
    }),
    //GET /plant/supplies_products  => trả mảng sp combo
    http.get("/api/combo_products", () => {
        return HttpResponse.json(data.combo_products);
    }),
    http.get("/api/products/:id", (req) => {
        const id = Number(req.params.id);
        const product = datapro.products.find(p => p.id === id);
        if (!product) {
            return HttpResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }
        return HttpResponse.json(product);
    })
];
