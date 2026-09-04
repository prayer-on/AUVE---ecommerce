import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useProducts } from "../Context/ProductContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass } from "@fortawesome/free-solid-svg-icons";


export interface ClothesData {
  _id: string;
  title: string;
  description: string;
  img: string;
  images?: string[];
  price: number;
  weight: number;
  color: string;
  fit: string;
  material: string;
  
   sizesStock?: {
    XS: number;
    S: number;
    M: number;
    L: number;
    XL: number;
    Onesize: number;
  };
}

function Product () {

const { products, loading } = useProducts();
const {isSidebarOpen, searchTerm } = useCart();

  if (loading) {
    return (
  <div className="loading">
    <FontAwesomeIcon icon={faHourglass} spin/>
  </div>
  );
  }

  const filteredProducts = products.filter((product) => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
       <article className={isSidebarOpen ? "blur" : "" }>
        {filteredProducts.length > 0 ? (
            <ul>{filteredProducts.map((product) => {

              let isFullySoldOut = false;
              if (product.sizesStock) {
              const stock = product.sizesStock as Record<string, number>;
              const totalStock =
                Number(stock.XS || 0) +
                Number(stock.S || 0) +
                Number(stock.M || 0) +
                Number(stock.L || 0) +
                Number(stock.XL || 0) +
                Number(stock.Onesize || 0);

              isFullySoldOut = totalStock === 0;
            }
            return (
                <li key={product._id} className="products">
                <Link to={`/product/${product._id}`}>

                <div className="product-image-wrapper">
                    <img src={product.img} alt={product.title}/>
                    {isFullySoldOut && (
                      <div className="home-sold-out-badge">
                        <span>SOLD OUT</span>
                      </div>
                    )}
                </div>


                <div className="product-description">
                    <div className="product-title">{product.title}</div>
                    <div className="product-price">€{product.price.toFixed(2)}</div>
                </div>
                </Link>
                 </li>
               );
              })}
            </ul>
        ) : (<div className="no-products-message">
          <p>NO PRODUCTS FOUND</p>
        </div>
      )}
        </article>
);
  }
export default Product