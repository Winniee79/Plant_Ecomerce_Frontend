import {Routes, Route} from "react-router-dom";
import MainLayout from "../components/layout/main/MainLayout";
import Home from "../pages/home/Home";
import Cart from "../pages/cart/Cart";
import Wishlist from "../pages/wishlist/Wishlist";
import Checkout from "../pages/checkout/Checkout";
import PrivacyPolicy from "../pages/privacy/PrivacyPolicy";
import OrderSuccess from "../pages/order/OrderSuccess";
import Orders from "../pages/order/Orders";
const AppRoutes = () => (
    <Routes>
        <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/carts" element={<Cart/>}/>
            <Route path="/wishlist" element={<Wishlist/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/order_success" element={< OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
        </Route>
    </Routes>
);

export default AppRoutes;
