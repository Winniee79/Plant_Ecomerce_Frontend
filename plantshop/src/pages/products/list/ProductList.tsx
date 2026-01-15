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

    // Attribute filter (1 group chỉ chọn 1 attribute)
    const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>({});
    // Filter theo mức price
    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
    // const [selectedType, setSelectedType] = useState<ProductType | "bulk">();


    // URL params
    const { slug: categorySlug } = useParams<{ slug?: string }>();
    const [searchParams] = useSearchParams();

    // search keyword (?search=abc)
    const keyword = searchParams.get("search") || "";

    // attribute id từ URL (?attrId=3)
    const attrIdParam = searchParams.get("attrId");
    const attrId = attrIdParam ? Number(attrIdParam) : null;

    // type từ Home  (?type=single | combo | bulk)
    const type = searchParams.get("type");

    // selectedType là derived state
    const selectedType = type as ProductType | "bulk" | undefined;

    // load data theo URL
    useEffect(() => {
        if (categorySlug) {  //catelogy
            productService.getByCategorySlug(categorySlug).then(setProducts);
        } else if (keyword) { //search
            productService
                .getSearchProducts(keyword)
                .then(setProducts);
        } else {
            productService.getAll().then(setProducts); // all
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
            //attributeId từ url
            if (attrId) {
                const attrIds =
                    product.attributes?.map((a) => a.id) ?? [];
                if (!attrIds.includes(attrId)) {
                    return false;
                }
            }
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
                const productAttrIds =
                    product.attributes?.map((a) => a.id) ?? [];
                if (!selectedAttrIds.every(id => productAttrIds.includes(id))) {
                    return false;
                }
            }

            return true;
        });
    }, [products, attrId, selectedAttributes, priceRange, selectedType]);

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
                    // onTypeChange={setSelectedType}
                    onTypeChange={() => {}}  // type lấy từ url
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
