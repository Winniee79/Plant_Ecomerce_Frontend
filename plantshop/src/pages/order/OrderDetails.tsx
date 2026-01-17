import React, { useEffect, useState } from 'react';
import styles from './OrderDetails.module.css';
import type { Order, OrderStatus, OrderItem } from '../../types/order.type';
import { useParams, useNavigate } from "react-router-dom";

const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        const loadOrderData = () => {
            if (!id) return;
            setIsLoading(true);

            try {
                // Load dữ liệu từ LocalStorage
                const storedOrders = localStorage.getItem('orders');
                const storedItems = localStorage.getItem('order_items');

                if (storedOrders) {
                    const allOrders = JSON.parse(storedOrders) as Order[];
                    const foundOrder = allOrders.find((o) => String(o.id) === String(id));

                    if (foundOrder) {
                        const allItems = storedItems ? (JSON.parse(storedItems) as OrderItem[]) : [];
                        const relatedItems = allItems.filter(item => item.order_id === foundOrder.id);
                        setOrder({ ...foundOrder, itemsDetail: relatedItems });
                    }
                }
            } catch (error) {
                console.error("Lỗi load chi tiết đơn:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(loadOrderData, 300);
        return () => clearTimeout(timer);
    }, [id]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleConfirmCancel = () => {
        if (!order) return;
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            const allOrders = JSON.parse(storedOrders) as Order[];
            const updatedOrders = allOrders.map((o) => {
                if (String(o.id) === String(order.id)) {
                    return { ...o, status: 'cancelled' as OrderStatus };
                }
                return o;
            });
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            setOrder({ ...order, status: 'cancelled' as OrderStatus });
        }
        setShowCancelModal(false);
    };

    // Logic hiển thị Step trạng thái
    const getStepStatus = (stepName: string, currentStatus: string) => {
        const statusOrder = ['pending', 'confirmed', 'packing', 'shipping', 'success'];
        if (currentStatus === 'cancelled' || currentStatus === 'failed') return '';

        const stepIndex = statusOrder.indexOf(stepName);
        const currentIndex = statusOrder.indexOf(currentStatus);

        return (stepIndex !== -1 && currentIndex !== -1 && stepIndex <= currentIndex) ? styles.active : '';
    };

    const currentItemsDetail = order?.itemsDetail || [];
    const displayedItems = isExpanded ? currentItemsDetail : currentItemsDetail.slice(0, 5);
    const remainingCount = currentItemsDetail.length - 5;

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>;

    if (!order) return (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <p>Không tìm thấy đơn hàng!</p>
            <button onClick={() => navigate('/orders')} className={styles.btnCancel} style={{marginTop: 10}}>
                Quay lại danh sách
            </button>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Chi Tiết Đơn Hàng #{String(order.id).substring(0,8).toUpperCase()}</div>
                <div className={styles.subTitle}>
                    Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
                </div>
            </div>

            {/* STEPPER TRẠNG THÁI */}
            <div className={styles.stepper}>
                {order.status === 'cancelled' ? (
                    <>
                        <div className={`${styles.stepItem} ${styles.active}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đang xử lý</div>
                        </div>
                        <div className={`${styles.stepItem} ${styles.stepCancelled}`}>
                            <div className={styles.stepIcon}>✕</div>
                            <div className={styles.stepLabel}>Đã hủy</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={`${styles.stepItem} ${getStepStatus('pending', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đang xử lý</div>
                        </div>
                        <div className={`${styles.stepItem} ${getStepStatus('confirmed', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đã xác nhận</div>
                        </div>
                        <div className={`${styles.stepItem} ${getStepStatus('packing', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đang gói hàng</div>
                        </div>
                        <div className={`${styles.stepItem} ${getStepStatus('shipping', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đang giao hàng</div>
                        </div>
                        <div className={`${styles.stepItem} ${getStepStatus('success', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đã giao</div>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.contentGrid}>
                {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
                <div className={styles.sectionBox}>
                    <div className={styles.boxTitle}>Danh sách sản phẩm ({currentItemsDetail.length})</div>
                    <div className={styles.productList}>
                        {displayedItems.map((item, index) => (
                            <div key={index} className={styles.productItem}>
                                <img
                                    src={item.image || 'https://via.placeholder.com/70'}
                                    alt={item.name}
                                    className={styles.productImg}
                                />
                                <div className={styles.productInfo}>
                                    <div className={styles.prodName}>
                                        {item.name || "Sản phẩm"}
                                    </div>
                                    <div className={styles.prodQty}>Số lượng: x{item.quantity}</div>
                                </div>
                                <div className={styles.prodPrice}>{formatCurrency(item.price)}</div>
                            </div>
                        ))}
                    </div>

                    {currentItemsDetail.length > 5 && (
                        !isExpanded ? (
                            <button className={styles.expandBtn} onClick={() => setIsExpanded(true)}>
                                + {remainingCount} sản phẩm khác
                            </button>
                        ) : (
                            <button className={styles.collapseBtn} onClick={() => setIsExpanded(false)}>
                                Thu gọn danh sách
                            </button>
                        )
                    )}
                </div>

                {/* CỘT PHẢI: THÔNG TIN GIAO HÀNG & THANH TOÁN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className={styles.sectionBox}>
                        <div className={styles.boxTitle}>Thông tin giao hàng</div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel} style={{fontWeight: 'bold', display: 'block'}}>
                                {order.recipient_name}
                            </span>
                            {order.recipient_phone}
                        </div>
                        <div className={styles.infoRow}>
                            {order.full_address}
                        </div>
                    </div>

                    <div className={styles.sectionBox}>
                        <div className={styles.boxTitle}>Thanh toán</div>
                        <div className={styles.paymentRow}>
                            <span>Tổng tiền hàng:</span>
                            <span>{formatCurrency(order.subtotal || order.total_amount)}</span>
                        </div>
                        <div className={styles.paymentRow}>
                            <span>Phí vận chuyển:</span>
                            <span>{formatCurrency(order.shipping_fee)}</span>
                        </div>
                        <div className={styles.paymentRow}>
                            <span>Giảm giá:</span>
                            <span>- {formatCurrency(order.discount_amount || 0)}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Tổng thanh toán:</span>
                            <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                    <div className={styles.actionBar}>
                        {['pending', 'confirmed', 'packing', 'unpaid', 'processing'].includes(order.status) && (
                            <button className={styles.btnCancel} onClick={() => setShowCancelModal(true)}>
                                Hủy đơn hàng
                            </button>
                        )}
                    </div>

                    {/* MODAL XÁC NHẬN HỦY */}
                    {showCancelModal && (
                        <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
                            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <h3 className={styles.modalTitle}>Xác nhận hủy đơn</h3>
                                <p className={styles.modalDesc}>
                                    Bạn có chắc chắn muốn hủy đơn hàng này không?
                                    <br />
                                    Hành động này không thể hoàn tác.
                                </p>
                                <div className={styles.modalActions}>
                                    <button className={styles.btnCloseModal} onClick={() => setShowCancelModal(false)}>
                                        Đóng
                                    </button>
                                    <button className={styles.btnConfirm} onClick={handleConfirmCancel}>
                                        Xác nhận hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;