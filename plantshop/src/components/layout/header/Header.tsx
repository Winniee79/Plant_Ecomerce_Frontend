import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import menuplant1 from "../../../assets/images/plantmenu1.png";
import logo from "../../../assets/images/Logo.png";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openUser, setOpenUser] = useState(false);

    // ref bao cả menu trigger + mega menu
    const menuRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                userRef.current &&
                !userRef.current.contains(e.target as Node)
            ) {
                setOpenMenu(false);
                setOpenUser(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.content}>
                    {/* 1. LOGO */}
                    <div className={styles.logo}>
                        <img src={logo} alt="Logo" />
                    </div>

                    {/* 2. MENU */}
                    <div className={styles.menu} ref={menuRef}>
                        <div
                            className={`${styles.menuItem} ${
                                openMenu ? styles.active : ""
                            }`}
                            onClick={() => setOpenMenu(prev => !prev)}
                        >
                            <span>Cây trong nhà</span>
                            <i
                                className={`fa-solid ${
                                    openMenu
                                        ? "fa-angle-up"
                                        : "fa-angle-down"
                                }`}
                            />
                        </div>

                        <div className={styles.menuItem}>
                            <span>Cây ngoài trời</span>
                        </div>

                        <div className={styles.menuItem}>
                            <span>Chậu cây</span>
                            <i className="fa-solid fa-angle-down" />
                        </div>

                        <div className={styles.menuItem}>
                            <span>Phụ kiện</span>
                            <i className="fa-solid fa-angle-down" />
                        </div>

                        <div className={styles.menuItem}>
                            <span>Hướng dẫn</span>
                            <i className="fa-solid fa-angle-down" />
                        </div>
                    </div>

                    {/* 3. ACTION */}
                    <div className={styles.action}>
                        <i className="fa-solid fa-magnifying-glass" />
                        <i className="fa-solid fa-cart-shopping" />
                        <div
                            className={styles.userWrapper}
                            ref={userRef}
                            onClick={() => setOpenUser(prev => !prev)}
                        >
                        <i className="fa-solid fa-user" />
                            {openUser && (
                                <div className={styles.userDropdown}>
                                    <div className={styles.dropdownItem}>
                                        <i className="fa-solid fa-user-circle" />
                                        <span>Tài khoản</span>
                                    </div>

                                    <div className={styles.dropdownItem}>
                                        <i className="fa-solid fa-box" />
                                        <span>Đơn mua</span>
                                    </div>

                                    <div className={styles.divider} />

                                    <div className={`${styles.dropdownItem} ${styles.logout}`}>
                                        <i className="fa-solid fa-right-from-bracket" />
                                        <span>Đăng xuất</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* 2.1 MEGA MENU */}
            {openMenu && (
                <div className={styles.megaMenu}>
                    <div className={styles.megaContent}>
                        <div className={styles.column}>
                            <h4>Theo kiểu dáng</h4>
                            <a>Cây Cao & Lớn</a>
                            <a>Cây Mini</a>
                            <a>Cây Treo</a>
                            <a>Cây Nhiệt Đới</a>
                        </div>

                        <div className={styles.column}>
                            <h4>Theo vị trí</h4>
                            <a>Cây Để Bàn</a>
                            <a>Cây Văn Phòng</a>
                            <a>Cây Nhà Tắm</a>
                            <a>Cây Ban Công</a>
                        </div>

                        <div className={styles.column}>
                            <h4>Theo chức năng</h4>
                            <a>Lọc Không Khí</a>
                            <a>Dễ Trồng</a>
                            <a>Ít Ánh Sáng</a>
                            <a>Phong Thủy</a>
                        </div>

                        <div className={styles.image}>
                            <img src={menuplant1} alt="plant" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
