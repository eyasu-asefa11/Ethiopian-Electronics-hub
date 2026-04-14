// src/pages/Products.js
import React, { useEffect, useState } from "react";
import API from "../api"; // your axios instance
<button onClick={() => window.location = `/edit-product/${product.id}`}>
Edit
</button>
function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        console.log(res.data); // debug: make sure data is received
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{p.name}</h3>
              <p>Brand: {p.brand}</p>
              <p>Price: {p.price} ETB</p>
              <p>{p.description}</p>
              <p>Status: {p.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;