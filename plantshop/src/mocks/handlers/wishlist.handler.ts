import { http, HttpResponse } from "msw";
import data from "../data/wishlist.json";

export const wishlistHandlers = [
    // Lấy danh sách wishlist
    http.get("/plant/wishlist", () => {
        // Trả về toàn bộ wishlist
        return HttpResponse.json({
            wishlist: data.wishlist
        });
    }),

    // Xóa sản phẩm khỏi wishlist
    http.delete("/plant/wishlist/:productId", ({ params }) => {
        const { productId } = params;// id sản phẩm cần xóa
        // Mock API xóa
        return HttpResponse.json({
            message: `Removed product ${productId} from wishlist`
        });
    })
];
