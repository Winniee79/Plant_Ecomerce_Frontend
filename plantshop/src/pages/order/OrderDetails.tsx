import React, { useEffect, useState } from 'react';
import styles from './OrderDetails.module.css';
import type {Order, OrderItem, OrderStatus} from '../../types/order.type';
import type {Product} from '../../types/product.type';
import {useParams} from "react-router-dom";

interface OrderDetailFull extends Order {
    itemsDetail: Array<OrderItem & { productInfo?: Product }>;
}

const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<OrderDetailFull | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Dùng setTimeout để gọi bất đồng bộ
    useEffect(() => {
        const timer = setTimeout(() => {
            const rawOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
            const rawItems: OrderItem[] = JSON.parse(localStorage.getItem('order_items') || '[]');
            const rawProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');

            const foundOrder = rawOrders.find((o) => String(o.id) === String(id));

            if (foundOrder) {
                const currentItems = rawItems.filter((item) => String(item.order_id) === String(foundOrder.id));
                const itemsWithProduct = currentItems.map((item) => {
                    const product = rawProducts.find((p) => p.id === item.product_id);
                    return { ...item, productInfo: product };
                });

                setOrder({ ...foundOrder, itemsDetail: itemsWithProduct });
            }
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [id]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleConfirmCancel = () => {
        if (!order) return;

        const rawOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = rawOrders.map((o) => {
            if (String(o.id) === String(order.id)) {
                return { ...o, status: 'cancelled' as OrderStatus };
            }
            return o;
        });

        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        // Cập nhật state nội bộ
        setOrder({ ...order, status: 'cancelled' as OrderStatus });
        setShowCancelModal(false);
    };

    const displayedItems = order
        ? (isExpanded ? order.itemsDetail : order.itemsDetail.slice(0, 5))
        : [];

    const remainingCount = order ? order.itemsDetail.length - 5 : 0;

    const getStepStatus = (stepName: string, currentStatus: string) => {
        const statusOrder = ['pending', 'processing', 'shipping', 'completed'];
        let normalizedStatus = currentStatus;
        if (['paid', 'done', 'success'].includes(currentStatus)) normalizedStatus = 'completed';
        if (['pending', 'confirmed', 'packing', 'unpaid'].includes(currentStatus)) normalizedStatus = 'processing';

        if (currentStatus === 'cancelled' || currentStatus === 'failed') return '';

        const stepIndex = statusOrder.indexOf(stepName);
        const currentIndex = statusOrder.indexOf(normalizedStatus);

        return stepIndex <= currentIndex ? styles.active : '';
    };

    if (isLoading) return <div style={{padding: 40, textAlign:'center'}}>Đang tải...</div>;
    if (!order) return <div style={{padding: 40, textAlign:'center'}}>Không tìm thấy đơn hàng!</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Chi Tiết Đơn Hàng #{order.id}</div>
                <div className={styles.subTitle}>
                    Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}
                </div>
            </div>

            {/* Stepper Status */}
            <div className={styles.stepper}>

                {/* TRƯỜNG HỢP 1: ĐƠN HÀNG ĐÃ HỦY */}
                {order.status === 'cancelled' ? (
                    <>
                        {/* Bước 1: Đang xử lý: Active màu xanh */}
                        <div className={`${styles.stepItem} ${styles.active}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đang xử lý</div>
                        </div>

                        {/* Bước 2: Đã hủy: Style đỏ, dấu X */}
                        <div className={`${styles.stepItem} ${styles.stepCancelled}`}>
                            <div className={styles.stepIcon}>✕</div>
                            <div className={styles.stepLabel}>Đã hủy</div>
                        </div>
                    </>
                ) : (

                    /* TRƯỜNG HỢP 2: ĐƠN HÀNG BÌNH THƯỜNG */
                    <>
                        <div className={`${styles.stepItem} ${getStepStatus('processing', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đang xử lý</div>
                        </div>
                        <div className={`${styles.stepItem} ${getStepStatus('shipping', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Đang giao</div>
                        </div>
                        <div className={`${styles.stepItem} ${getStepStatus('completed', order.status)}`}>
                            <div className={styles.stepIcon}>✓</div>
                            <div className={styles.stepLabel}>Hoàn thành</div>
                        </div>
                    </>
                )}

            </div>

            <div className={styles.contentGrid}>
                <div className={styles.sectionBox}>
                    <div className={styles.boxTitle}>Danh sách sản phẩm ({order.itemsDetail.length})</div>

                    <div className={styles.productList}>
                        {displayedItems.map((item, index) => (
                            <div key={index} className={styles.productItem}>
                                <img
                                    src={item.productInfo?.imageUrl || 'https://via.placeholder.com/70'}
                                    alt={item.productInfo?.name}
                                    className={styles.productImg}
                                />
                                <div className={styles.productInfo}>
                                    <div className={styles.prodName}>{item.productInfo?.name || `Sản phẩm #${item.product_id}`}</div>
                                    <div className={styles.prodQty}>Số lượng: x{item.quantity}</div>
                                </div>
                                <div className={styles.prodPrice}>{formatCurrency(item.price)}</div>
                            </div>
                        ))}
                    </div>

                    {order.itemsDetail.length > 5 && (
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

                <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                    <div className={styles.sectionBox}>
                        <div className={styles.boxTitle}>Thông tin giao hàng</div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>{order.recipient_name}</span>
                            {order.recipient_phone}
                        </div>
                        <div className={styles.infoRow}>
                            {order.full_address}
                        </div>
                    </div>

                    <div className={styles.sectionBox}>
                        <div className={styles.boxTitle}>Thanh toán</div>
                        <div className={styles.paymentRow}>
                            <span>Tạm tính:</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className={styles.paymentRow}>
                            <span>Phí vận chuyển:</span>
                            <span>{formatCurrency(order.shipping_fee)}</span>
                        </div>
                        <div className={styles.paymentRow}>
                            <span>Giảm giá:</span>
                            <span>- {formatCurrency(order.discount_amount)}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.actionBar}>
                {['pending', 'confirmed', 'packing', 'unpaid', 'processing'].includes(order.status) && (
                    <button className={styles.btnCancel} onClick={() => setShowCancelModal(true)}>
                        Hủy đơn hàng
                    </button>
                )}
            </div>

            {showCancelModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{marginBottom: 10}}>Xác nhận hủy đơn</h3>
                        <p style={{color: '#666', marginBottom: 20}}>
                            Bạn có chắc chắn muốn hủy đơn hàng này không? <br/> Hành động này không thể hoàn tác.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnCloseModal} onClick={() => setShowCancelModal(false)}>Đóng</button>
                            <button className={styles.btnConfirm} onClick={handleConfirmCancel}>Xác nhận hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsPage;