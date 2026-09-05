import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import type { ClothesData } from "../Components/Products";

interface ProductContextType {
  products: ClothesData[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const apiUrlBase = import.meta.env.VITE_API_URL || "http://localhost:5003";

console.log("API URL:", apiUrlBase);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ClothesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
  try {
        setLoading(true);
        const response = await axios.get<ClothesData[]>(`${apiUrlBase}/api/products`);
        console.log("DATA RECEIVED FROM DATABASE:", response.data)
        setProducts(response.data);
      } 
  catch (err) {
        setError("Unable to load products from the server.");
        console.error(err);
      } 
  finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
}


