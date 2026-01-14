import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { productService } from "../../../services/product.service";
import { categoryService } from "../../../services/category.service";
import type { Product, ProductType } from "../../../types/product.type";
import type { Category } from "../../../types/category.type";
import FilterSidebar from "./components/FilterSidebar";
import ProductCard from "../../../components/common/product/single/ProductCard";
import ProductCardCombo from "../../../components/common/product/combo/ProductCardCombo";
import styles from "./ProductList.module.css";
import banner from "../../../assets/images/banner_shop.png";

const MAX_PRICE = 3_000_000;

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // filter state (client-side)
    const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>({});
    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
    const [selectedType, setSelectedType] = useState<ProductType | "bulk">();

    // URL params
    const { slug: categorySlug } = useParams<{ slug?: string }>();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("search") || "";
    //const categorySlug = searchParams.get("category");

    // load data theo URL
    useEffect(() => {
        if (categorySlug) {
            productService
                .getByCategorySlug(categorySlug)
                .then(setProducts);
        } else if (keyword) {
            productService
                .getSearchProducts(keyword)
                .then(setProducts);
        } else {
            productService.getAll().then(setProducts);
        }

        categoryService.getAll().then(setCategories);
    }, [categorySlug, keyword]);

    // chọn attribute (1 group = 1 value)
    const handleAttributeChange = (groupId: number, attrId: number) => {
        setSelectedAttributes(prev => {
            const next = { ...prev };
            if (attrId === 0) {
                delete next[groupId];
            } else {
                next[groupId] = attrId;
            }
            return next;
        });
    };

    // filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // price
            const price = product.salePrice ?? product.price;
            if (price < priceRange[0] || price > priceRange[1]) {
                return false;
            }

            // type
            if (selectedType) {
                if (selectedType === "bulk") {
                    if (!product.hasBulkPrice) return false;
                } else {
                    if (product.type !== selectedType) return false;
                }
            }

            // attribute
            const selectedAttrIds = Object.values(selectedAttributes);
            if (selectedAttrIds.length > 0) {
                const productAttrIds = product.attributeIds ?? [];
                if (!selectedAttrIds.every(id => productAttrIds.includes(id))) {
                    return false;
                }
            }

            return true;
        });
    }, [products, selectedAttributes, priceRange, selectedType]);

    return (
        <div className={styles.container}>
            {/* BANNER */}
            <div className={styles.banner}>
                <img src={banner} alt="Shop banner" className={styles.imgbanner} />
            </div>

            <div className={styles.wrapper}>
                {/* SIDEBAR */}
                <FilterSidebar
                    categories={categories}
                    selectedAttributes={selectedAttributes}
                    onAttributeChange={handleAttributeChange}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                />

                {/* PRODUCT LIST */}
                <div className={styles.content}>
                    <h2 className={styles.productListTitle}>
                        {keyword
                            ? <>Kết quả tìm kiếm: <b>{keyword}</b></>
                            : "Danh sách sản phẩm"}
                    </h2>

                    {filteredProducts.length === 0 ? (
                        <p className={styles.empty}>
                            Không tìm thấy sản phẩm phù hợp
                        </p>
                    ) : (
                        <div className={styles.grid}>
                            {filteredProducts.map(product =>
                                product.type === "combo" ? (
                                    <div key={product.id} className={styles.comboItem}>
                                        <ProductCardCombo product={product} />
                                    </div>
                                ) : (
                                    <ProductCard key={product.id} product={product} />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
