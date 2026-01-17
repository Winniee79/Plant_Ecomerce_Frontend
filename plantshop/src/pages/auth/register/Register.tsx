import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthService from "../../../services/auth.service";
import styles from "./Register.module.css";

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const sideImage = "https://png.pngtree.com/thumb_back/fw800/background/20251023/pngtree-closeup-of-hands-planting-a-young-tree-on-green-grass-field-image_19967947.webp";

    // State bật tắt Modal thông báo
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // State form
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    // VALIDATION
    const validateForm = () => {
        const { username, email, password, confirmPassword } = formData;

        // Username
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return "Username phải từ 3-20 ký tự, chỉ chứa chữ và số.";
        }

        // Email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return "Email không hợp lệ.";
        }

        // Password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return "Mật khẩu phải có ít nhất 6 ký tự, bao gồm cả chữ và số.";
        }

        // Confirm Password
        if (password !== confirmPassword) {
            return "Mật khẩu nhập lại không khớp.";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = formData;
            await AuthService.register(registerData);
            setShowSuccessModal(true);

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const msg = error.response?.data?.message || "Đăng ký thất bại";
            setError(msg);
        }
    };

    // Hàm xử lý khi bấm nút "Ở lại"
    const handleStay = () => {
        setShowSuccessModal(false); // Tắt modal
        // Tùy chọn: Reset form để nhập mới nếu muốn
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    };

    // Hàm xử lý khi bấm nút "Đến trang đăng nhập"
    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerForm}>
                <div className={styles.imageWrapper}>
                    <img src={sideImage} alt="Register side" className={styles.sideImage} />
                </div>

                <div className={styles.registerWrapper}>
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <h2 className={styles.title}>Đăng ký</h2>

                        <div className={styles.field}>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Nhập username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</p>}

                        <button type="submit" className={styles.button}>
                            Đăng ký
                        </button>
                    </form>

                    {showSuccessModal && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <div className={styles.iconContainer}>
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 className={styles.modalTitle}>Đăng ký thành công!</h3>

                                <div className={styles.modalActions}>
                                    {/* Nút bên trái: Ở lại */}
                                    <button type="button" className={styles.btnStay} onClick={handleStay}>
                                        Ở lại
                                    </button>

                                    {/* Nút bên phải: Đến trang Login */}
                                    <button
                                        type="button"
                                        className={styles.btnLogin}
                                        onClick={handleGoToLogin}
                                    >
                                        Đến trang đăng nhập
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

export default Register;