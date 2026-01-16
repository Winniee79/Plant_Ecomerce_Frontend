import type {ProductApi} from "../types/product-api.type";

export function getFinalPrice(product: ProductApi, quantity: number) {

    // Lấy danh sách rule giá sỉ của sản phẩm
    const rules = product.wholesale_prices;

    // Nếu sản phẩm chưa đạt điều kiện tính giá sỉ
    if (!rules?.length) {
        return {
            // Ưu tiên giá sale nếu có, không thì dùng giá gốc
            price: product.sale_price ?? product.price,
            isWholesale: false,// Không phải giá sỉ
            wholesaleMin: undefined,// Không cần hiển thị số lượng tối thiểu
        };
    }


    // Tìm xem số lượng hiện tại có rơi vào mức giá sỉ nào không
    const rule = rules.find(
        w => quantity >= w.min && (w.max === null || quantity <= w.max)
    );

    if (rule) {
        // Nếu đã đạt giá sỉ
        return {
            price: rule.price,// Áp dụng giá sỉ
            isWholesale: true,// Đánh dấu là đang dùng giá sỉ
            wholesaleMin: undefined, // Không cần hiển thị min nữa vì đã đạt
        };
    }

    // Nếu chưa đủ số lượng để được giá sỉ, tìm mức sỉ thấp nhất
    const minRule = rules.reduce((a, b) => (a.min < b.min ? a : b));

    // Tạm dùng giá sale hoặc giá gốc
    return {
        price: product.sale_price ?? product.price,
        isWholesale: false,// Chưa phải giá sỉ
        wholesaleMin: minRule.min,// Còn thiếu bao nhiêu để được giá sỉ
    };
}
