import styles from "./Orders.module.css";
import { Link } from "react-router-dom";
import { mapOrderToUI } from "../../utils/order.mapper";
import type { OrderStatus } from "../../types/order.type";
import { useState } from "react";
import type {OrderUI} from "../../utils/order.mapper";

const STATUS_LABEL: Record<OrderStatus, string> = {
    pending: "Đã đặt hàng",
    confirmed: "Đã xác nhận",
    packing: "Đang đóng gói",
    shipping: "Đang giao hàng",
    done: "Hoàn tất",
    paid: "Đã thanh toán",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
    pending: "#999",
    confirmed: "#3B823E",
    packing: "#1E88E5",
    shipping: "#FB8C00",
    done: "#2ecc71",
    paid: "#2ecc71",
};

const Orders = () => {
    const [ordersUI] = useState<OrderUI[]>(() => {
        const stored = JSON.parse(
            localStorage.getItem("orders") || "[]"
        );

        return stored.map(mapOrderToUI);
    });

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>ĐƠN HÀNG CỦA TÔI</h1>

            {ordersUI.length === 0 ? (
                <p className={styles.empty}>Bạn chưa có đơn hàng nào</p>
            ) : (
                <div className={styles.list}>
                    {ordersUI.map(order => (
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
                                <p><b>Ngày đặt:</b> {order.date}</p>
                                <p><b>Thanh toán:</b> {order.paymentMethod}</p>
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
