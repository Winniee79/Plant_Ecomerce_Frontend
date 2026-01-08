export type ProductType =
    | 'plant'
    | 'pot'
    | 'supplies'
    | 'seed'
    | 'combo'

   // PRODUCT
export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    image?: string;
    images?: string[];
    type: ProductType;
    categoryId: number;
    attributeIds: number[];
    hasBulkPrice?: boolean;
        // sp combo
    comboItems?: {
        productId: number;
        quantity: number;
        name?: string;      // optional muốn hiển thị tên sp trong combo
        image?: string;     // optional để hiển thị hình trong card combo
    }[];
}