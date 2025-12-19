import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline";
}

const Button = ({
                    children,
                    variant = "primary",
                    ...props
                }: ButtonProps) => {
    const baseStyle =
        "px-4 py-2 rounded font-medium transition cursor-pointer";

    const variants = {
        primary: "bg-green-600 text-white hover:bg-green-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline: "border border-green-600 text-green-600 hover:bg-green-50"
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
