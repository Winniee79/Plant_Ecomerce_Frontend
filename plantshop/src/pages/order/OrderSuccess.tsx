import styles from "./OrderSuccess.module.css";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useEffect,useRef } from "react";
import { saveOrder } from "../../utils/orderStorage";

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

    const hasSaved = useRef(false);
    useEffect(() => {
        if (!state || hasSaved.current) return;

        hasSaved.current = true; // chặn StrictMode

        saveOrder({
            user_id: null,
            recipient_name: "Khách hàng",
            recipient_phone: "0000000000",
            full_address: state.address,
            payment_method_id:
                state.paymentMethod === "Thanh toán Online" ? 1 : 2,
            payment_status: "paid",
            subtotal: state.total,
            shipping_fee: 0,
            discount_amount: 0,
            total_amount: state.total,
            status: "pending",
            created_at: new Date().toISOString(),
        });
    }, [state]);


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
