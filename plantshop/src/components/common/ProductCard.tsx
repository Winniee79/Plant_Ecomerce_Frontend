import React from "react";

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <div className="border rounded shadow p-4 flex flex-col items-center gap-2 max-w-xs">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-32 object-cover rounded"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
            <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => onAddToCart?.(product)}
            >
                Add to Cart
            </button>
        </div>
    );
};
