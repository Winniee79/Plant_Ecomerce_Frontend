import { useEffect, useState } from "react";
import { productService } from "../../services/product.service";
import type { Product } from "../../types/product.type";
// import Button from "../../components/common/Button";
import styles from "./Home.module.css";
import banner from "../../assets/images/banner.png"
import ProductCard from "../../components/common/product/ProductCard";
import CayTrongImg from "../../assets/images/CayTrauBaDeVuong.jpg";
import ChauCayImg from "../../assets/images/ChauCayDatNung.jpg";
import ComboImg from "../../assets/images/CayPhuQuy.jpg";
import HatGiongImg from "../../assets/images/HatGiong.jpg";
import GiaSiImg from "../../assets/images/CayGiongGiaSi.png";

//Function component Home (khai báo, tạo)
const Home = () => {
    //Khai báo state
    // một biến để lưu danh sách sản phẩm, và khi nó thay đổi thì hàm setProducts sẽ làm giao diện phải cập nhật lại
    // products: danh sách sản phẩm
    // setProducts: hàm cập nhật danh sách
    // Product[]: mảng các sản phẩm
    // Giá trị ban đầu: [] (mảng rỗng)
    const [products, setProducts] = useState<Product[]>([]);
    // loading: trạng thái đang tải dữ liệu
    // Ban đầu là true → đang load
    const [loading, setLoading] = useState(true);

    //useEffect – gọi API khi component được render lần đầu
    useEffect(() => {
        productService.getAll()  // gọi hàm trong service để gọi api
            .then(data => setProducts(data)) // API trả về json sẽ lưu ds spham vào state products đã khai báo trước đó
            .finally(() => setLoading(false));  // dù api thành công hay thất bại thì quá trình load phải = false
    }, []);  // kết thúc quá trình loading

    if (loading) return <p>Loading products...</p>;  //Xử lý khi đang loading

    //Trả về JSX - giao diện
    return (
        <div className={styles.container}>    {/*styles.container là class CSS module*/}
            {/*1.BANNER*/}
            <div className={styles.banner}>
                <img src={banner} alt={banner} className={styles.imgbanner}/>
            </div>
            {/*2.CONTENT*/}
            <div className={styles.content}>
            {/*    2.1 CHOICE*/}
                <section className={styles.choiceSection}>
                    <div className={styles.choiceList}>
                        <div className={styles.choiceItem}>
                            <img src={CayTrongImg} alt="CayTrong" />
                            <span>Cây trồng</span>
                        </div>

                        <div className={styles.choiceItem}>
                            <img src={ChauCayImg} alt="ChauCay" />
                            <span>Chậu cây</span>
                        </div>

                        <div className={styles.choiceItem}>
                            <img src={ComboImg} alt="Combo" />
                            <span>Combo</span>
                        </div>

                        <div className={styles.choiceItem}>
                            <img src={HatGiongImg} alt="HatGiong" />
                            <span>Hạt gống</span>
                        </div>

                        <div className={styles.choiceItem}>
                            <img src={GiaSiImg} alt="UuDaiSi" />
                            <span>Ưu đãi sĩ</span>
                        </div>
                    </div>
                </section>
                    {/*2.2 SẢN PHẨM MỚI*/}
                <section className={styles.productSection}>
                    <h2 className={styles.title}>🌱 Sản phẩm mới nhất</h2>
                    <div className={styles.divider}></div>
                    <div className={styles.productList}>

                        {/*Duyệt qua từng sản phẩm trong products
                            map → render nhiều card*/}
                        {products.map(product => (
                            // Mỗi sp là 1 card
                            // <div key={product.id} className={styles.card}>
                            //     <img
                            //         src={product.image}
                            //         alt={product.name}
                            //         className={styles.image}
                            //     />
                            //     <h3 className={styles.name}>{product.name}</h3>
                            //     <p className={styles.price}>
                            //         {formatPrice(product.price)}
                            //     </p>
                            // </div>
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
                {/*2.3 SẢN PHẨM TRENDING*/}
                <section className={styles.productSection}>

                </section>
                {/*2.4 SẢN PHẨM GIẢM GIÁ*/}
                <section className={styles.productSection}>

                </section>
                {/*2.5 GIỚI THIỆU*/}
                <section>

                </section>
                {/*<Button onClick={() => alert("Clicked!")}>*/}
                {/*    Thêm vào giỏ hàng*/}
                {/*</Button>*/}

                {/*<Button variant="outline">*/}
                {/*    Xem chi tiết*/}
                {/*</Button>*/}
            </div>
        </div>
    );
};

// Export component
export default Home;
