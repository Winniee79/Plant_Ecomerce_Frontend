import { productHandlers } from "./product.handler";
import {categoryHandlers} from "./category.handler";
import { wishlistHandlers } from "./wishlist.handler";
import { cartHandlers } from "./cart.handler";
import { cartItemHandlers } from "./cartItems.handler";
export const handlers = [
    ...cartHandlers,
    ...cartItemHandlers,
    ...productHandlers,
    ...categoryHandlers,
    ...wishlistHandlers
];
