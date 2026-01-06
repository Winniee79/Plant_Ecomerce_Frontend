import { useMemo } from "react";
import type { CheckoutCartItem } from "../types/checkout.type";

type Zone = "Z1" | "Z2" | "Z3" | "Z4";

const SHIPPING_TABLE = {
    Z1: { under2: 25000, under5: 40000, over5: 6000 },
    Z2: { under2: 30000, under5: 50000, over5: 7000 },
    Z3: { under2: 40000, under5: 65000, over5: 9000 },
};

const PROVINCE_ZONE_MAP: Record<number, Zone> = {
    1: "Z1",
    2: "Z2",
    3: "Z3",
    4: "Z4",
};

export function useShippingFee(
    provinceId: number | "",
    cartItems: CheckoutCartItem[]
) {
    return useMemo(() => {
        if (!provinceId || cartItems.length === 0) {
            return {
                shippingFee: 0,
                totalWeight: 0,
                zone: null as Zone | null,
                needContact: false,
                isTruck: false,
            };
        }

        const totalWeight = cartItems.reduce(
            (sum, item) => sum + item.weightKg * item.quantity,
            0
        );

        const zone = PROVINCE_ZONE_MAP[provinceId];

        if (zone === "Z4") {
            return {
                shippingFee: 0,
                totalWeight,
                zone,
                needContact: true,
                isTruck: totalWeight > 4,
            };
        }

        const price = SHIPPING_TABLE[zone];
        let shippingFee = 0;

        if (totalWeight <= 2) {
            shippingFee = price.under2;
        } else if (totalWeight <= 5) {
            shippingFee = price.under5;
        } else {
            const extraKg = Math.ceil(totalWeight - 5);
            shippingFee = price.under5 + extraKg * price.over5;
        }

        return {
            shippingFee,
            totalWeight,
            zone,
            needContact: false,
            isTruck: totalWeight > 4,
        };
    }, [provinceId, cartItems]);
}
