import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "./StoreContext";

const StoreContextProvider = (props) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([]);
    const [restaurant_list, setRestaurantList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [menu, setMenu] = useState("home");
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [discount, setDiscount] = useState(0);

    const url = "https://yum-go.onrender.com";

    // Fetch user profile from backend
    const fetchUserProfile = async (authToken) => {
        const tkn = authToken || token;
        if (!tkn) {
            setUserData(null);
            return;
        }
        try {
            const response = await axios.get(url + "/api/user/profile", { headers: { token: tkn } });
            if (response.data.success) {
                setUserData(response.data.user);
                localStorage.setItem("userData", JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
        }
    };

    // Initial Data Load
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const [foodRes, restRes] = await Promise.all([
                    axios.get(url + "/api/food/list"),
                    axios.get(url + "/api/restaurant/list")
                ]);

                if (isMounted) {
                    setFoodList(foodRes.data.foods || []);
                    setRestaurantList(restRes.data.data || []);
                }

                // Fetch profile if token exists on mount
                if (token && isMounted) {
                    fetchUserProfile(token);
                }
            } catch (error) {
                console.error("Initial load error:", error);
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, [url, token]);

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const currentCart = prev || {};
            const newCount = (currentCart[itemId] || 0) + 1;
            return { ...currentCart, [itemId]: newCount };
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

    const getTotalCartAmount = useCallback(() => {
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
        return Math.max(0, totalAmount - discount);
    }, [cartItems, food_list, discount]);

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

    // Token change handling
    useEffect(() => {
        let isMounted = true;

        async function syncCart() {
            if (token) {
                try {
                    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
                    if (isMounted) {
                        setCartItems(response.data.cartData || {});
                    }
                } catch (error) {
                    console.error("Sync cart error:", error);
                }
                // Fetch user profile when token is available
                fetchUserProfile(token);
            } else {
                setUserData(null);
                // Load local cart if no token (guest mode)
                const storedCart = localStorage.getItem("cartItems");
                if (storedCart) {
                    try {
                        const parsedCart = JSON.parse(storedCart);
                        if (isMounted && parsedCart && typeof parsedCart === 'object') {
                            setCartItems(parsedCart);
                        }
                    } catch {
                        localStorage.removeItem("cartItems");
                    }
                }
            }
        }

        syncCart();

        return () => {
            isMounted = false;
        };
    }, [token, url]);

    // Persist Guest Cart
    useEffect(() => {
        if (!token && cartItems && typeof cartItems === "object") {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems, token]);

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

        searchQuery,
        setSearchQuery,
        discount,
        setDiscount,
        applyPromoCode,

        userData,
        setUserData,
        fetchUserProfile
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
