import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import type { Product } from "../../types/product.type";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/common/Button";
import styles from "./Home.module.css";

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService.getAll()
            .then(data => setProducts(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading products...</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>🌱 Sản phẩm nổi bật</h1>

            <div className={styles.productList}>
                {products.map(product => (
                    <div key={product.id} className={styles.card}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.image}
                        />
                        <h3 className={styles.name}>{product.name}</h3>
                        <p className={styles.price}>
                            {formatPrice(product.price)}
                        </p>
                    </div>
                ))}
            </div>
            <Button onClick={() => alert("Clicked!")}>
                Thêm vào giỏ hàng
            </Button>

            <Button variant="outline">
                Xem chi tiết
            </Button>
        </div>
    );
};

export default Home;
