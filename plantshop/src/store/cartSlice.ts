import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
    },
});
export default cartSlice.reducer;
