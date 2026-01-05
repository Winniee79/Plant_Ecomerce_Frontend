import styles from "./OrderSuccess.module.css";
import { Link, useLocation, Navigate } from "react-router-dom";

const ORDER_STEPS = [
    "Đã đặt hàng",
    "Đã xác nhận",
    "Đang đóng gói",
    "Đang giao hàng",
    "Hoàn tất",
];

type OrderState = {
    orderId: string;
    total: number;
    paymentMethod: string;
    address: string;
    currentStep?: number;
};

const OrderSuccess = () => {
    const location = useLocation();
    const state = location.state as OrderState | null;

    // User gõ URL trực tiếp
    if (!state) {
        return <Navigate to="/" replace />;
    }

    const {
        orderId,
        total,
        paymentMethod,
        address,
        currentStep = 0,
    } = state;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.icon}>✔️</div>

                <h1>Đặt hàng thành công!</h1>
                <p className={styles.sub}>
                    Cảm ơn bạn đã mua sắm tại cửa hàng
                </p>

                <div className={styles.info}>
                    <p><b>Mã đơn hàng:</b> {orderId}</p>
                    <p><b>Tổng tiền:</b> {total.toLocaleString()} ₫</p>
                    <p><b>Thanh toán:</b> {paymentMethod}</p>
                    <p><b>Địa chỉ:</b> {address}</p>
                </div>

                <div className={styles.timeline}>
                    {ORDER_STEPS.map((step, index) => (
                        <div
                            key={step}
                            className={`${styles.step} ${
                                index <= currentStep ? styles.active : ""
                            }`}
                        >
                            <div className={styles.dot} />
                            <span>{step}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <Link to="/" className={styles.btnOutline}>
                        Về trang chủ
                    </Link>
                    <Link to="/orders" className={styles.btn}>
                        Xem đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
