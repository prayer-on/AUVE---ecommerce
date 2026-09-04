import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  img: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  clearCart: () => Promise<void>;
  removeFromCart: (_id: string, size: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateQuantityUp: (productId: string, size: string) => void;
  updateQuantityDown: (productId: string, size: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_API_URL = `${"http://localhost:5003"}/api/cart`;

export function CartProvider({ children }: { children: ReactNode }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const getToken = () => localStorage.getItem("token");


  
 useEffect(() => {
 const fetchCartFromServer = async () => {
 const token = getToken();
 if (!token) {
  const localData = localStorage.getItem("cart");
 if (localData) setCart(JSON.parse(localData));
 return;
 }

try {
        const response = await axios.get(CART_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
        });
        
        const formattedItems = response.data.items.map((item: any) => ({
          _id: item.productId,
          title: item.title,
          price: item.price,
          img: item.img,
          size: item.size,
          quantity: item.quantity
        }));
        
        setCart(formattedItems);
      } catch (error) {
        console.error("Error retrieving cart from server:", error);
      }
    };

    fetchCartFromServer();
  }, []);




  const addToCart = async (newItem: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item._id === newItem._id && item.size === newItem.size
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
      }
      else {
        updatedCart = [...prevCart, { ...newItem, quantity: 1 }];
      }
      
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    setIsSidebarOpen(true);


  const token = getToken();
    if (token) {
      try {
           await axios.post(`${CART_API_URL}/add`,
          {
            productId: newItem._id, 
            title: newItem.title,
            price: newItem.price,
            img: newItem.img,
            size: newItem.size,
            quantity: 1
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } 
      
      catch (error) {
        console.error("Failed to send product to the database:", error);
      }
    }
  };

const updateQuantityUp = async (productId: string, size: string) => {

  const currentItem = cart.find(item => item._id === productId && item.size === size);
  if (!currentItem) return;

try {
    const token = localStorage.getItem("token");
    
     await axios.put(`${CART_API_URL}/update`, 
      { productId, size, action: "increment" },
      { headers: { Authorization: `Bearer ${token}` } }
    );


  setCart(prevCart =>
    prevCart.map(item =>
      item._id === productId && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );

    } catch (error: any) {
    console.error("Error synchronizing increment to DB:", error);
    alert(error.response?.data?.message || "Maximum stock limit reached for this item!");
  }
};


const updateQuantityDown = async (productId: string, size: string) => {
  setCart(prevCart =>
    prevCart
      .map(item =>
        item._id === productId && item.size === size
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0) 
  );

try {
      const token = localStorage.getItem("token");
      await axios.put(`${CART_API_URL}/update`, 
        { productId, size, action: "decrement" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to sync decrement with database:", error);
    }
  };

 const removeFromCart = async (id: string, size: string) => {
    setCart((prevCart) => {
    const existingItem = prevCart.find((item) => (item._id === id && item.size === size));

    let updatedCart;

    if (existingItem && existingItem.quantity > 1) {
        updatedCart = prevCart.map((item) =>
          item._id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        updatedCart = prevCart.filter((item) => !(item._id === id && item.size === size));
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    });

    const token = getToken();
    if (token) {

      try {
        await axios.delete(`${CART_API_URL}/remove/${id}/${size}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } 
      
      catch (error) {
        console.error("Failed to remove product from the database:", error);
      }
    }
  };


  const clearCart = async () => {
  
  setCart([]);
  
  localStorage.setItem("cart", JSON.stringify([]));

  const token = getToken();
  if (token) {
    try {
      await axios.delete(`${CART_API_URL}/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error clearing the cart:", error);
    }
  }
};


  return (
    <CartContext.Provider value={{ cart, updateQuantityUp, updateQuantityDown, searchTerm, setSearchTerm, addToCart, removeFromCart, clearCart, isSidebarOpen, setIsSidebarOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
