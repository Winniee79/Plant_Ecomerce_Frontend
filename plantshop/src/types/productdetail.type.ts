import type { ProductType } from "./product.type";

export interface ProductImage {
    id: number;
    url: string;
    order: number;
}
export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Attribute {
    id: number;
    name: string;
    slug: string;
    group: string;
}

export interface WholesalePrice {
    min: number;
    max: number | null;
    price: number;
}

export interface PlantDetail {
    commonName: string;
    scientificName: string;
    difficulty: 'easy' | 'medium' | 'hard';
    light: string;
    water: string;
}

export interface ProductDimensions {
    weight: string;
    potWidth: string;
    potHeight: string;
    totalHeight: string;
    canopyWidth: string;
}

export interface ProductInfor {
    content: string;
    features: string;
    careGuide: string;
}

// Kế thừa Product list, thêm tất cả field detail
export interface ProductDetail {
    id: number;
    slug: string;
    name: string;
    description: string;
    image: string;
    price: number;
    salePrice?: number | null;

    stock: number;
    status: "active" | "inactive";
    type: ProductType;

    category: Category;
    attributes: Attribute[];
    images: ProductImage[];
    dimensions?: ProductDimensions;
    plantDetail?: PlantDetail;
    wholesalePrices?: WholesalePrice[];
    infor?: ProductInfor;
}