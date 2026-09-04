import { useState, useEffect, useMemo} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faHourglass, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useProducts } from "../Context/ProductContext";
import type { ClothesData } from "./Products";
import axios from "axios";

function SingleProduct() {
  
  const { id } = useParams<{ id: string }>();
  const { cart, addToCart, isSidebarOpen } = useCart();
  const { products } = useProducts();
  const [currentProduct, setCurrentProduct] = useState<ClothesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const apiUrlBase = "http://localhost:5003";


  const recommendedProducts = useMemo(() => {
  return products
    .filter((prod) => prod._id !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
}, [products, id]);


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

const isSelectedSizeSoldOut = currentProduct?.sizesStock
    ? currentProduct.sizesStock[selectedSize as keyof typeof currentProduct.sizesStock] === 0
    : false;

  useEffect(() => {

    setSelectedSize(""); 
    setCurrentImage(""); 

    const fetchSingleProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrlBase}/api/products/${id}`);
        setCurrentProduct(response.data);
        setCurrentImage(response.data.img);

        if (response.data.sizesStock) {
          const stock = response.data.sizesStock as Record<string, number>;
          const allSizes = ["XS", "S", "M", "L", "XL", "Onesize"];
          const isAllZero = allSizes.every(size => Number(stock[size] || 0) === 0);

          if (isAllZero) {
            setSelectedSize("");
          } else if (stock.Onesize > 0) {
            setSelectedSize("Onesize");
          } else {
            const firstAvailable = allSizes.find(size => Number(stock[size] || 0) > 0);
            setSelectedSize(firstAvailable || "");
          }
        } else {
          setSelectedSize("");
        }
      } catch (error) {
        console.error("Error fetching single apparel product:", error);
      } finally {
        setLoading(false);
      }
    }; 

    if (id) {
      fetchSingleProduct();
    }
  }, [id, apiUrlBase]); 



  if (loading) {
    return (
      <div className="loading">
        <FontAwesomeIcon icon={faHourglass} spin />
      </div>
    );
  }

  if (!currentProduct) {
    return <div className="not-found">PRODUCT SPECIFICATION NOT FOUND...</div>;
  }

  const handleAddToCart = () => {

  if (!selectedSize || isSelectedSizeSoldOut) return;

  const existingCartItem = cart.find(
    (item: any) => item._id === currentProduct._id && item.size === selectedSize
  );

  const currentQtyInCart = existingCartItem ? existingCartItem.quantity : 0;

  const maxAvailableStock = currentProduct.sizesStock 
    ? (currentProduct.sizesStock[selectedSize as keyof typeof currentProduct.sizesStock] || 0) 
    : 0;

    if (currentQtyInCart >= maxAvailableStock) {
    alert(`Cannot add more. Only ${maxAvailableStock} items left in stock for size ${selectedSize}!`);
    return;
  }

    addToCart({
      _id: currentProduct._id,
      title: currentProduct.title,
      price: currentProduct.price,
      img: currentProduct.img,
      size: selectedSize,
    });
  };

  return (
    <section className={`product-showcase-section ${isSidebarOpen ? "blur" : ""}`}>
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      
      <div className="apparel-container">
        

        <div className="gallery-column">
          <div
            className="main-view-zoom-box"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              src={currentImage}
              alt={currentProduct.title}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZoomed ? "scale(1.8)" : "scale(1)",
              }}
            />
          </div>
          <div className="mini-photos-strip">
            <img
              src={currentProduct.img}
              onClick={() => setCurrentImage(currentProduct.img)}
              className={currentImage === currentProduct.img ? "active-thumb" : ""}
              alt="Main angle"
            />
            {currentProduct.images && currentProduct.images.map((url: string, index: number) => (
              <img
              key={index}
              src={url}
              onClick={() => setCurrentImage(url)}
              className={currentImage === url ? "active-thumb" : ""}
              alt={`Gallery angle ${index + 1}`}
              />
              ))}
          </div>
        </div>

        <div className="apparel-details-column">
          <div className="header-meta">
            <h1>{currentProduct.title}</h1>
            <span className="price-tag">EUR {currentProduct.price.toFixed(2)}</span>
          </div>

          <p className="description-text">{currentProduct.description}</p>

          <div className="technical-specs-list">
            <div className="spec-row">
              <span>MATERIAL</span>
              <p>{currentProduct.material}</p>
            </div>
            <div className="spec-row">
              <span>COLORWAY</span>
              <p>{currentProduct.color}</p>
            </div>
            <div className="spec-row">
              <span>FABRIC WEIGHT</span>
              <p>{currentProduct.weight} GSM</p>
            </div>
            <div className="spec-row">
              <span>FIT PROFILE</span>
              <p>{currentProduct.fit}</p>
            </div>
            <div className="spec-row">
              <span>LOGISTICS</span>
              <p>DELIVERY: 7-14 WORKING DAYS.</p>
            </div>
          </div>

          <div className="purchase-action-panel">
            <span className="panel-label">SELECT SIZE</span>
            
            <div className="custom-dropdown-container">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                onFocus={() => setIsSizeOpen(true)}
                onBlur={() => setIsSizeOpen(false)}
                disabled={
                  !currentProduct.sizesStock ||
                  (currentProduct.sizesStock.Onesize === 0 &&
                    currentProduct.sizesStock.XS === 0 &&
                    currentProduct.sizesStock.S === 0 &&
                    currentProduct.sizesStock.M === 0 &&
                    currentProduct.sizesStock.L === 0 &&
                    currentProduct.sizesStock.XL === 0)
                }
              >
                {(selectedSize === "" || isSelectedSizeSoldOut) && (
                  <option value="" disabled>-</option>
                )}
                {currentProduct.sizesStock && (
                  Number(currentProduct.sizesStock.Onesize) > 0 ? 
                  (
                    <option value="Onesize">
                        ONESIZE {currentProduct.sizesStock.Onesize === 0 ? " — SOLD OUT" : ""}
                    </option>
                  ) 
                    :
                  (
                  <>
                    <option value="XS" disabled={currentProduct.sizesStock.XS === 0}>
                      XS {currentProduct.sizesStock.XS === 0 ? " — SOLD OUT" : ""}
                    </option>
                    <option value="S" disabled={currentProduct.sizesStock.S === 0}>
                      S {currentProduct.sizesStock.S === 0 ? " — SOLD OUT" : ""}
                    </option>
                    <option value="M" disabled={currentProduct.sizesStock.M === 0}>
                      M {currentProduct.sizesStock.M === 0 ? " — SOLD OUT" : ""}
                    </option>
                    <option value="L" disabled={currentProduct.sizesStock.L === 0}>
                      L {currentProduct.sizesStock.L === 0 ? " — SOLD OUT" : ""}
                    </option>
                    <option value="XL" disabled={currentProduct.sizesStock.XL === 0}>
                      XL {currentProduct.sizesStock.XL === 0 ? " — SOLD OUT" : ""}
                    </option>
                  </>
                  )
                )}
              </select>
              <FontAwesomeIcon icon={isSizeOpen ? faAngleDown : faAngleUp} />
            </div>

            <div className="cta-buttons-stack">
              <button
                onClick={handleAddToCart}
                disabled={isSelectedSizeSoldOut || selectedSize === ""}
                className={isSelectedSizeSoldOut || selectedSize === "" ? "sold-out-button-style" : "add-to-cart-button-style"}
              >
                {isSelectedSizeSoldOut || selectedSize === "" ? "OUT OF STOCK" : "ADD TO CART"}
              </button>

              <Link to="/" className="keep-shopping-link">
                <button className="back-store-btn">BACK TO CATALOGUE</button>
              </Link>
            </div>
          </div>
        </div>

        {recommendedProducts.length > 0 && (
          <div className="recommendations-wrapper">
            <h3>YOU MAY ALSO LIKE</h3>
            <div className="recommendations-grid">
              {recommendedProducts.map((prod) => (
                <div key={prod._id} className="rec-card">
                  <Link to={`/product/${prod._id}`}>
                    <div className="rec-img-container">
                      <img src={prod.img} alt={prod.title} />
                    </div>
                    <div className="rec-meta">
                      <h4>{prod.title.toUpperCase()}</h4>
                      <span>€{prod.price.toFixed(2)}</span> 
                    </div>
                  </Link> 
                </div> 
              ))} 
            </div> 
          </div>
        )}
      </div>
    </section>
    )
    }
    

export default SingleProduct;
