import { http, HttpResponse } from "msw";
import data from "../data/wishlist.json";

export const wishlistHandlers = [
    // GET wishlist
    http.get("/plant/wishlist", () => {
        return HttpResponse.json({
            wishlist: data.wishlist
        });
    }),

    // DELETE wishlist item
    http.delete("/plant/wishlist/:productId", ({ params }) => {
        const { productId } = params;
        return HttpResponse.json({
            message: `Removed product ${productId} from wishlist`
        });
    })
];
