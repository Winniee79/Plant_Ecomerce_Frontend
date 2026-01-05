import styles from "./Orders.module.css";
import { Link } from "react-router-dom";

type OrderStatus =
    | "pending"
    | "confirmed"
    | "packing"
    | "shipping"
    | "done";

type Order = {
    id: string;
    date: string;
    total: number;
    paymentMethod: string;
    status: OrderStatus;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
    pending: "Đã đặt hàng",
    confirmed: "Đã xác nhận",
    packing: "Đang đóng gói",
    shipping: "Đang giao hàng",
    done: "Hoàn tất",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
    pending: "#999",
    confirmed: "#3B823E",
    packing: "#1E88E5",
    shipping: "#FB8C00",
    done: "#2ecc71",
};

// MOCK DATA (sau này thay bằng API)
const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-170000001",
        date: "10/01/2026",
        total: 825000,
        paymentMethod: "Thanh toán Online",
        status: "shipping",
    },
    {
        id: "ORD-169999888",
        date: "05/01/2026",
        total: 540000,
        paymentMethod: "COD",
        status: "done",
    },
];

const Orders = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>ĐƠN HÀNG CỦA TÔI</h1>

            {MOCK_ORDERS.length === 0 ? (
                <p className={styles.empty}>Bạn chưa có đơn hàng nào</p>
            ) : (
                <div className={styles.list}>
                    {MOCK_ORDERS.map(order => (
                        <div key={order.id} className={styles.card}>
                            <div className={styles.header}>
                                <div>
                                    <b>Mã đơn:</b> {order.id}
                                </div>
                                <span
                                    className={styles.status}
                                    style={{ color: STATUS_COLOR[order.status] }}
                                >
                                    {STATUS_LABEL[order.status]}
                                </span>
                            </div>

                            <div className={styles.body}>
                                <p>
                                    <b>Ngày đặt:</b> {order.date}
                                </p>
                                <p>
                                    <b>Thanh toán:</b> {order.paymentMethod}
                                </p>
                                <p>
                                    <b>Tổng tiền:</b>{" "}
                                    {order.total.toLocaleString()}₫
                                </p>
                            </div>

                            <div className={styles.actions}>
                                <Link
                                    to={`/orders/${order.id}`}
                                    className={styles.btnOutline}
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
