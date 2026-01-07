import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../../../services/product.service";
import type { ProductDetail, ProductImage } from "../../../types/productdetail.type";
import styles from "./ProductDetail.module.css";
import { formatPrice } from "../../../utils/formatPrice";
import ReactMarkdown from "react-markdown";

const Productdetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [mainImage, setMainImage] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
    //const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (id) {
            productService.getProductDetail(Number(id)).then(p => {
                setProduct(p);
                setMainImage(p.images?.[0].url ?? "");
            });
        }
    }, [id]);

    const changeMainImage = (img: ProductImage) => {
        setMainImage(img.url);
    };

    const toggleAccordion = (index: number) => {
        setActiveAccordion(prev => (prev === index ? null : index));
    };

    if (!product) return <div>Loading...</div>;

    const categoryTags = [
        product.category?.name,
        ...(product.attributes?.map(attr => attr.name) ?? [])
    ].filter(Boolean);

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                {/* Gallery */}
                <div className={styles.gallery}>
                    <img className={styles.mainImage} src={mainImage} alt={product.name}/>
                    <div className={styles.thumbnailList}>
                        {product.images?.map(img => (
                            <img
                                key={img.id}
                                src={img.url}
                                className={img.url === mainImage ? "active" : ""}
                                onClick={() => changeMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="product-tabs">
                    <div className={styles.info}>
                        <h1 className={styles.title}>{product.name}</h1>
                        <div className={styles.titleLine}></div>
                        <div className={styles.price}>
                            {formatPrice(product.price)}
                            {/*{product.salePrice ?? product.price}đ*/}
                        </div>
                        <p className={styles.desc}>{product.description}</p>
                        {/*<div className={styles.category}>*/}
                        {/*    <p><strong>Danh mục: </strong>{product.category.name}</p>*/}
                        {/*</div>*/}
                        <div className={styles.category}>
                            <p>
                                <strong>Danh mục: </strong>
                                {categoryTags.join(", ")}
                            </p>
                        </div>
                        <div className={styles.buyRow}>
                            <div className={styles.quantityBox}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <input type="text" readOnly value={quantity}/>
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                            <button className={styles.btnCart}>THÊM GIỎ HÀNG</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* TAB GIỚI THIỆU */}
            <div className={styles.productTabs}>
                <div className={styles.tabContent}>
                    <div className={styles.titleTab}>
                        <h3 className={styles.productTitle}>Giới thiệu</h3>
                    </div>

                    <div className={styles.productSpecs}>
                        {/* BẢNG 1 – THÔNG TIN CÂY */}
                        <div className={styles.specTable}>
                            <div className={styles.specRow}>
                                <span><strong>Tên thường gọi</strong></span>
                                <span>{product.plantDetail?.commonName}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Tên Khoa học</strong></span>
                                <span>{product.plantDetail?.scientificName}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Độ khó chăm sóc</strong></span>
                                <span>{product.plantDetail?.difficulty}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Nhu cầu ánh sáng</strong></span>
                                <span>{product.plantDetail?.light}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Nhu cầu nước</strong></span>
                                <span>{product.plantDetail?.water}</span>
                            </div>
                        </div>

                        {/* BẢNG 2 – QUY CÁCH */}
                        <div className={styles.specTable}>
                            <div className={styles.specRow}>
                                <span><strong>Trọng lượng</strong></span>
                                <span>{product.dimensions?.weight}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span><strong>Chiều cao</strong></span>
                                <span>{product.dimensions?.totalHeight}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Độ rộng tán cây</strong></span>
                                <span>{product.dimensions?.canopyWidth}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span><strong>Đường kính chậu</strong></span>
                                <span>{product.dimensions?.potWidth}</span>
                            </div>

                            <div className={styles.specRow}>
                                <span><strong>Chiều cao chậu</strong></span>
                                <span>{product.dimensions?.potHeight}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* TAB BẢNG GIAS SĨ */}
            <div className={styles.priceTabs}>
                {product.wholesalePrices && product.wholesalePrices.length > 0 && (
                    <div className={styles.priceTabs}>
                        <div className={styles.tabContentPrice}>
                            <div className={styles.titleTab}>
                                <h3 className={styles.productTitle}>Ưu đãi giá sỉ</h3>
                            </div>

                            <div className={styles.productSpecs}>
                                <div className={styles.specTablePrice}>
                                    {product.wholesalePrices.map((item, index) => (
                                        <div className={styles.specRow} key={index}>
                            <span>
                                {item.max
                                    ? `Từ ${item.min} – ${item.max} sản phẩm`
                                    : `Từ hơn ${item.min} sản phẩm`}
                            </span>
                                            <span>{formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/*TAB*/}
            <div className={styles.productAccordion}>
            {/*    MÔ TẢ*/}
            <div className={`${styles.accordionItem} ${
                    activeAccordion === 0 ? styles.active : ""}`}>
                <button className={styles.accordionHeader}
                    onClick={() => toggleAccordion(0)}>
                    <span className={styles.accordionTitle}>Mô tả</span>
                    <span className={styles.accordionIcon}></span>
                </button>

                <div className={styles.accordionContent}>
                    <div className={styles.accordionInner}>
                        <div className={styles.markdown}>
                            <ReactMarkdown
                                components={{
                                    img: ({ ...props }) => (
                                        <img{...props}
                                            className={styles.markdownImage}/>),
                                    p: ({ children }) => (
                                        <p className={styles.markdownParagraph}>{children}</p>),}}>
                                {product.infor?.content ?? ""}
                            </ReactMarkdown>
                </div>
                    </div>
                </div>
            </div>

            {/* ĐẶC ĐIỂM */}
            <div className={`${styles.accordionItem} ${
                    activeAccordion === 1 ? styles.active : ""}`}>
                <button className={styles.accordionHeader}
                    onClick={() => toggleAccordion(1)}>
                    <span className={styles.accordionTitle}>Đặc điểm</span>
                    <span className={styles.accordionIcon}></span>
                </button>

                <div className={styles.accordionContent}>
                    <div className={styles.accordionInner}>
                        <div className={styles.markdown}>
                            <ReactMarkdown
                                components={{
                                    img: ({ ...props }) => (
                                        <img{...props}
                                            className={styles.markdownImage}/>),
                                    p: ({ children }) => (
                                        <p className={styles.markdownParagraph}>{children}</p>),}}>
                                {product.infor?.features ?? ""}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHĂM SÓC */}
            <div className={`${styles.accordionItem} ${
                    activeAccordion === 2 ? styles.active : ""}`}>
                <button className={styles.accordionHeader}
                    onClick={() => toggleAccordion(2)}>
                <span className={styles.accordionTitle}>Chăm sóc / Trồng cây</span>
                    <span className={styles.accordionIcon}></span>
                </button>
                <div className={styles.accordionContent}>
                    <div className={styles.accordionInner}>
                        <div className={styles.markdown}>
                            <ReactMarkdown
                                components={{
                                    img: ({ ...props }) => (
                                        <img{...props}
                                            className={styles.markdownImage}/>),
                                    p: ({ children }) => (
                                        <p className={styles.markdownParagraph}>{children}</p>),}}>
                                {product.infor?.careGuide ?? ""}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Productdetail;
