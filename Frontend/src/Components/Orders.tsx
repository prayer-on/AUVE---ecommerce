import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  size: string;
  quantity: number;
}

interface OrderData {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

function Orders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrlBase = import.meta.env.VITE_API_URL || "http://localhost:5003";


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrlBase}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error retrieving order history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiUrlBase]);

  if (loading) {
    return (
      <div className="loading">
        <FontAwesomeIcon icon={faHourglass} spin />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="checkout-container-empty">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
        <h2>YOU HAVEN'T PLACED ANY ORDER YET</h2>
        <Link to="/"><button>Start Shopping!</button></Link>
      </div>
    );
  }

  return (
    <div className="orders-container">

      <h2>YOUR ORDERS</h2>
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <p className="order-id">ORDER ID:<span>{order._id}</span></p>
                <p>DATE: <span>{new Date(order.createdAt).toLocaleDateString()}</span></p>
              </div>
              <div>
                <p>STATUS: <span style={{ 
                  color: order.status === "Delivered" ? "#00ff00" : order.status === "Shipped" ? "#0088ff" : "#ffaa00",
                  fontWeight: "bold",
                  textTransform: "uppercase"
                }}>{order.status}</span></p>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.size}`}>
                  <p><strong>{item.title}</strong> (Size: {item.size}) x{item.quantity}</p>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span>TOTAL PAID:</span>
              <strong>€{order.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
