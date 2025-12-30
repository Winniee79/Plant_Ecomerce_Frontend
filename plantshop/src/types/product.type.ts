// export interface Product {
//     id: number;
//     name: string;
//     price: number;
//     image: string;
//     category: string;
// }
/* =========================
   PRODUCT BASE
========================= */

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
    price: number;
    salePrice?: number | null;
    image: string;
    type: ProductType;
    categoryId: number;
    attributeIds: number[];
}