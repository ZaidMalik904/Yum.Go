import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [restaurant_list, setRestaurantList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [menu, setMenu] = useState("home");
    const [selectedRestaurant, setSelectedRestaurant] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [discount, setDiscount] = useState(0);

    const url = "https://yum-go.onrender.com";

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const currentCart = prev || {};
            if (!currentCart[itemId]) {
                return { ...currentCart, [itemId]: 1 };
            } else {
                return { ...currentCart, [itemId]: currentCart[itemId] + 1 };
            }
        });
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const currentCart = prev || {};
            const newQuantity = (currentCart[itemId] || 0) - 1;
            if (newQuantity <= 0) {
                const newCart = { ...currentCart };
                delete newCart[itemId];
                return newCart;
            }
            return { ...currentCart, [itemId]: newQuantity };
        });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        if (!cartItems || typeof cartItems !== "object") return 0;
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount - discount;
    };

    const applyPromoCode = (code) => {
        if (code === "SAVE20") {
            setDiscount(20);
            return true;
        } else if (code === "SAVE50") {
            setDiscount(50);
            return true;
        }
        return false;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.foods);
    };

    const fetchRestaurantList = async () => {
        const response = await axios.get(url + "/api/restaurant/list");
        setRestaurantList(response.data.data);
    };

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData || {});
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            await fetchRestaurantList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    // Load cart data whenever token changes (e.g. login/logout/startup)
    useEffect(() => {
        if (token) {
            loadCartData(token);
        }
    }, [token]);

    // Load local cart if no token (guest mode) on mount
    useEffect(() => {
        if (!token) {
            const storedCart = localStorage.getItem("cartItems");
            if (storedCart) {
                try {
                    const parsedCart = JSON.parse(storedCart);
                    // Ensure parsedCart is an object and not null
                    if (parsedCart && typeof parsedCart === 'object') {
                        setCartItems(parsedCart);
                    }
                } catch (error) {
                    console.error("Failed to parse cart items form local storage", error);
                    localStorage.removeItem("cartItems");
                }
            }
        }
    }, [token]);

    useEffect(() => {
        // Only update local storage if not logged in (guest cart persistence) or if switching behavior is desired. 
        // For now, let's keep it simple: always sync cartItems to local storage so it's fresh on reload if not loading from API.
        // But importantly, check if cartItems exists to avoid the "Cannot convert undefined or null to object" error.
        if (cartItems && typeof cartItems === "object") {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        menu,
        setMenu,
        restaurant_list,
        selectedRestaurant,
        setSelectedRestaurant,
        searchQuery,
        setSearchQuery,
        discount,
        setDiscount,
        applyPromoCode
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
