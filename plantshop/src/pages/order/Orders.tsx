import React, { useState } from 'react';
import styles from './Orders.module.css';

// Kiểu dữ liệu cho trạng thái đơn hàng
type OrderStatus = 'processing' | 'shipping' | 'completed' | 'cancelled';

// Kiểu dữ liệu cho 1 sản phẩm trong đơn
interface ProductItem {
    name: string;
    img: string;
    qty: number;
}

// Kiểu dữ liệu cho 1 đơn hàng
interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    totalPrice: string;
    items: ProductItem[];
}

// DỮ LIỆU MẪU
const mockOrders: Order[] = [
    {
        id: '#ORD10231',
        date: '12/09/2024',
        status: 'processing',
        totalPrice: '1.050.000',
        items: [
            {
                name: 'Ficus Benjamina',
                img: 'https://bizweb.dktcdn.net/100/344/686/products/oi-ruby-ruot-do-nhieu-trai-1.jpg',
                qty: 1
            },
            {
                name: 'Jade Terrarium',
                img: 'https://im.binhthuan.gov.vn/kbnnbinhthuan/dulieu/News/2021/6/15/saurieng_1562021.jpg',
                qty: 1
            }
        ]
    },
    {
        id: '#ORD10230',
        date: '10/09/2024',
        status: 'processing',
        totalPrice: '350.000',
        items: [
            {
                name: 'Jade Terrarium',
                img: 'https://im.binhthuan.gov.vn/kbnnbinhthuan/dulieu/News/2021/6/15/saurieng_1562021.jpg',
                qty: 1
            }
        ]
    },
    {
        id: '#ORD10229',
        date: '08/09/2024',
        status: 'shipping',
        totalPrice: '560.000',
        items: [
            {
                name: 'Cỏ Lan Chi',
                img: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chlorophytum_comosum_Ampel.jpg',
                qty: 2
            }
        ]
    },
    {
        id: '#ORD10225',
        date: '01/09/2024',
        status: 'completed',
        totalPrice: '1.200.000',
        items: [
            {
                name: 'Cây Lưỡi Hổ',
                img: 'https://bizweb.dktcdn.net/100/344/686/products/oi-ruby-ruot-do-nhieu-trai-1.jpg',
                qty: 3
            }
        ]
    },
    {
        id: '#ORD10220',
        date: '25/08/2024',
        status: 'cancelled',
        totalPrice: '150.000',
        items: [
            {
                name: 'Sen Đá Nâu',
                img: 'https://im.binhthuan.gov.vn/kbnnbinhthuan/dulieu/News/2021/6/15/saurieng_1562021.jpg',
                qty: 1
            }
        ]
    },
];

const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<OrderStatus>('processing');

    // Hàm lọc đơn hàng trả về mảng các Order
    const getFilteredOrders = (): Order[] => {
        return mockOrders.filter((order) => order.status === activeTab);
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className={styles.container}>

            {/* Tiêu đề */}
            <h1 className={styles.pageTitle}>Đơn Hàng Của Tôi</h1>

            {/* Tabs Navigation */}
            <div className={styles.tabsContainer}>
                <div
                    className={`${styles.tabItem} ${activeTab === 'processing' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('processing')}
                >
                    Đang xử lý
                </div>
                <div
                    className={`${styles.tabItem} ${activeTab === 'shipping' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('shipping')}
                >
                    Đang giao
                </div>
                <div
                    className={`${styles.tabItem} ${activeTab === 'completed' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Đã hoàn thành
                </div>
                <div
                    className={`${styles.tabItem} ${activeTab === 'cancelled' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('cancelled')}
                >
                    Đã hủy
                </div>
            </div>

            {/* Danh sách đơn hàng (Card Layout) */}
            <div className={styles.ordersList}>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order.id} className={styles.orderCard}>

                            {/* Header: ID, Date, Button */}
                            <div className={styles.cardHeader}>
                                <div className={styles.orderIdDate}>
                                    <span className={styles.orderCode}>Đơn hàng {order.id}</span>
                                    <span className={styles.orderDate}>{order.date}</span>
                                </div>
                                <button className={styles.btnDetail}>Xem Chi Tiết</button>
                            </div>

                            {/* Body: Danh sách sản phẩm */}
                            <div className={styles.cardBody}>
                                {order.items.map((item, index) => (
                                    <div key={index} className={styles.productItem}>
                                        <img src={item.img} alt={item.name} className={styles.productImg} />
                                        <div className={styles.productInfo}>
                                            <div className={styles.prodName}>{item.name}</div>
                                            <div className={styles.prodQty}>x{item.qty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer: Tổng tiền */}
                            <div className={styles.cardFooter}>
                                {/* Logic hiển thị thêm "sản phẩm khác" nếu > 1 item */}
                                {order.items.length > 1 && (
                                    <div className={styles.moreItemsTag}>
                                        + {order.items.length - 1} sản phẩm khác
                                    </div>
                                )}

                                <div className={styles.totalPriceWrapper}>
                                    Tổng cộng:
                                    <span className={styles.totalPriceValue}>đ {order.totalPrice}</span>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <div style={{textAlign: 'center', color: '#888', padding: '40px'}}>
                        Chưa có đơn hàng nào trong mục này.
                    </div>
                )}
            </div>

            {/* Phân trang */}
            <div className={styles.pagination}>
                <button className={styles.pageBtn}>&lt;</button>
                <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={`${styles.pageBtn} ${styles.nextBtn}`}>Tiếp</button>
            </div>

        </div>
    );
};

export default OrdersPage;