export interface WholesalePriceRule {
    min: number;
    max: number | null;
    price: number;
}

export interface ProductApi {
    id: number;
    slug: string;
    name: string;
    sku: string;
    type: string;
    price: number;
    sale_price?: number | null;
    stock: number;
    status: string;
    images?: {
        id: number;
        url: string;
        is_main: boolean;
        order: number;
    }[];
    wholesale_prices?: WholesalePriceRule[]; // Danh sách mức giá sỉ theo số lượng
}
