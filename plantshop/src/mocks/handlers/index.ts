import { productHandlers } from "./product.handler";
import {categoryHandlers} from "./category.handler";
import { wishlistHandlers } from "./wishlist.handler";
import { cartHandlers } from "./cart.handler";
export const handlers = [
    ...cartHandlers,
    ...productHandlers,
    ...categoryHandlers,
    ...wishlistHandlers
];
