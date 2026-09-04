import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";

interface Product {
  _id: string;
  title: string;
  price: number;
  img: string;
}

function NewProduct() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    img: "",
    imagesString: "",
    material: "",
    color: "",
    weight: "",
    fit: "",
    stockXS: "",
    stockS: "",
    stockM: "",
    stockL: "",
    stockXL: "",
    stockOnesize: "",
  });

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const apiUrlBase = "http://localhost:5003";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrlBase}/api/products`);
      setProductsList(response.data);
    } catch (error) {
      console.error("Error retrieving product list for admin:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized access or missing authentication token!");
      setIsError(true);
      return;
    }

    try {

      const { stockXS, stockS, stockM, stockL, stockXL, stockOnesize, imagesString, ...restOfData } = formData;
      const galleryArray = imagesString
        ? imagesString.split(",").map(url => url.trim()).filter(url => url !== "")
        : [];

      const response = await axios.post(
        `${apiUrlBase}/api/products/add`,
        {
          ...restOfData,
          price: Number(formData.price),
          weight: Number(formData.weight),
          images: galleryArray,

          sizesStock: {
            XS: Number(stockXS),
            S: Number(stockS),
            M: Number(stockM),
            L: Number(stockL),
            XL: Number(stockXL),
            Onesize: Number(stockOnesize)
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`SUCCESS: ${response.data.message}`);
     
      setFormData({ title: "", price: "", description: "", img: "", imagesString: "", material: "100% Cotton", color: "", weight: "240", fit: "Oversized",
        stockXS: "0", stockS: "0", stockM: "0", stockL: "0", stockXL: "0", stockOnesize: "0"
      });

      fetchProducts();
    } catch (error: any) {
      
      setIsError(true);
      setMessage(error.response?.data?.message || "Error during loading.");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete the product ${product.title}?`)) return;

    const token = localStorage.getItem("token")
    if (!token) {
    setMessage("You are not logged in or the token is missing!");
    setIsError(true);
    return;
    }

    try {
        const response = await axios.delete(`${apiUrlBase}/api/products/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
    
    setProductsList(productsList.filter(prod => prod._id !== product._id));
    setMessage(`Deleted product: ${response.data.product.title}`);
    setIsError(false);
    }

    catch (error: any) {
    setIsError(true)
    setMessage(error.response?.data?.message || "Failed to delete the product.");
    }
  };

  const handleLockSite = () => {
  localStorage.removeItem("site_unlocked"); 
  window.location.reload(); 
};

  return (
    <div className="admin-dashboard-container">
      <h2>ADMIN</h2>
      <div className="admin-layout">
        
        {/* COLONNA SINISTRA: Modulo di caricamento */}
        <div className="admin-column-form">
          <h3>ADD NEW PRODUCT</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <input type="text" name="title" placeholder="Product title" value={formData.title} onChange={handleChange} required />
            <input type="number" name="price" placeholder="Product €" value={formData.price} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required rows={2} />
            <input type="text" name="img" placeholder="Product Image ex: /xxx.jpg" value={formData.img} onChange={handleChange} required />
            <input type="text" name="imagesString" placeholder="Gallery Images (separated by commas) ex: /img2.jpg, /img3.jpg" value={formData.imagesString} onChange={handleChange} />
            <input type="text" name="material" placeholder="Material" value={formData.material} onChange={handleChange} required />
            <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} required />
            <input type="number" name="weight" placeholder="GSM" value={formData.weight} onChange={handleChange} required />
            

            
            <input type="number" name="stockXS" placeholder="XS" value={formData.stockXS} onChange={handleChange} min="0" />
            <input type="number" name="stockS" placeholder="S" value={formData.stockS} onChange={handleChange} min="0" />
            <input type="number" name="stockM" placeholder="M" value={formData.stockM} onChange={handleChange} min="0" />
            <input type="number" name="stockL" placeholder="L" value={formData.stockL} onChange={handleChange} min="0" />
            <input type="number" name="stockXL" placeholder="XL" value={formData.stockXL} onChange={handleChange} min="0" />
            <input type="number" name="stockOnesize" placeholder="Onesize" value={formData.stockOnesize} onChange={handleChange} min="0" />

            <div className="admin-select">
            <select name="fit" value={formData.fit} onChange={handleChange} onFocus={() => setIsSizeOpen(true)}
            onBlur={() => setIsSizeOpen(false)}>
              <option value="Oversized">Oversized</option>
              <option value="Regular">Regular</option>
              <option value="Slim">Slim</option>
            </select>
            <FontAwesomeIcon icon={isSizeOpen? faAngleDown : faAngleUp}/>
            </div>

            <button type="submit" className="admin-submit-btn">
              UPLOAD PRODUCT TO MONGODB
            </button>
          </form>

          {message && (
            <p className={isError ? "admin-message error" : "admin-message success"}>
              {message}
            </p>
          )}
        </div>

        {/* COLONNA DESTRA: Lista dei prodotti correnti */}
        <div className="admin-column-list">
          <h3>CURRENT PRODUCTS | {productsList.length}</h3>
          <div className="admin-products-list">
            {productsList.map((product) => (
              <div key={product._id} className="admin-product-item">
                <img src={product.img} alt={product.title} className="admin-product-img" />
                <div className="admin-product-details">
                  <h4>{product.title}</h4>
                  <p>€{product.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => handleDeleteProduct(product)}
                  className="admin-delete-btn"
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="home-lockdown">
         <Link to="/" className="home-link">HOME</Link>
      <button onClick={handleLockSite} className="lockdown">
         LOCKDOWN STORE
      </button>
      </div>
    </div>
  );
}

export default NewProduct;
