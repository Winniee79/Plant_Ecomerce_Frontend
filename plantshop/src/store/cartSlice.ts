import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CartViewItem} from "../types/cart.type";
import {getFinalPrice} from "../utils/getFinalPrice";
import products from "../mocks/data/products.json";
import type {ProductApi} from "../types/product-api.type";

// Ép kiểu danh sách product từ file mock JSON
const productList = products.products as ProductApi[];

// Kiểu dữ liệu cho state của cart
interface CartState {
    items: CartViewItem[];
}

// State ban đầu của cart
const initialState: CartState = {
    items: [],
};

// Tạo slice cho cart bằng Redux Toolkit
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Gán toàn bộ danh sách cart
        setCartItems: (state, action: PayloadAction<CartViewItem[]>) => {
            state.items = action.payload.map(item => {

                // Tìm product tương ứng với item trong cart
                const product = productList.find(p => p.id === item.productId);
                if (!product) return item;

                // Tính lại giá theo số lượng (có thể là giá sỉ)
                const result = getFinalPrice(product, item.quantity);

                // Trả về item mới đã được cập nhật giá
                return {
                    ...item,
                    price: result.price,
                    original_price: product.price,
                    isWholesale: result.isWholesale,
                    wholesaleMin: result.wholesaleMin,
                };
            });

            // Lưu cart vào localStorage theo user hiện tại
            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        // Thêm sản phẩm vào cart
        addToCart: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            // Tìm product theo id được truyền vào
            const product = productList.find(p => p.id === action.payload.productId);
            if (!product) return;

            // Kiểm tra sản phẩm đã tồn tại trong cart chưa
            const existing = state.items.find(i => i.productId === product.id);

            if (existing) {
                // Nếu đã có, cộng thêm số lượng
                existing.quantity += action.payload.quantity;

                // Tính lại giá sau khi đổi số lượng(giá sỉ)
                const result = getFinalPrice(product, existing.quantity);
                existing.price = result.price;
                existing.isWholesale = result.isWholesale;
                existing.wholesaleMin = result.wholesaleMin;
            } else {
                // Nếu chưa có, tạo item mới
                const result = getFinalPrice(product, action.payload.quantity);

                state.items.push({
                    id: Date.now(),
                    productId: product.id,
                    name: product.name,
                    image: product.images?.[0]?.url ?? "",
                    price: result.price,
                    original_price: product.price,
                    quantity: action.payload.quantity,
                    isWholesale: result.isWholesale,
                    wholesaleMin: result.wholesaleMin,
                });
            }

            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        // Xóa sản phẩm khỏi cart theo productId
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                item => item.productId !== action.payload
            );
            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        // Cập nhật số lượng của 1 sản phẩm trong cart
        updateQuantity: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            // Tìm item trong cart
            const item = state.items.find(i => i.productId === action.payload.productId);
            if (!item) return;

            // Gán lại số lượng
            item.quantity = action.payload.quantity;

            // Tìm product tương ứng để tính lại giá
            const product = productList.find(p => p.id === item.productId);
            if (product) {
                const result = getFinalPrice(product, item.quantity);
                item.price = result.price;
                item.isWholesale = result.isWholesale;
                item.wholesaleMin = result.wholesaleMin;
            }

            // Lưu lại cart
            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        // Xóa toàn bộ cart
        clearCart: state => {
            state.items = [];
            localStorage.setItem(getCartStorageKey(), JSON.stringify([]));
        },
    },
});

// Hàm lấy key localStorage theo user hiện tại
function getCartStorageKey() {
    const stored = localStorage.getItem("user");
    if (!stored) return "cart_guest";

    try {
        const {user} = JSON.parse(stored);
        // Nếu có user, lưu cart theo userId
        return user?.id ? `cart_user_${user.id}` : "cart_guest";
    } catch {
        return "cart_guest";
    }
}

export const {
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
