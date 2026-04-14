// src/pages/EditProduct.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In Stock");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {

    try {

      const res = await API.get(`/products/${id}`);

      const product = res.data;

      setName(product.name);
      setBrand(product.brand);
      setPrice(product.price);
      setCategory(product.category);
      setDescription(product.description);
      setStatus(product.status);

    } catch (err) {

      console.error(err);
      alert("Error loading product");

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("status", status);

    if (image) {
      formData.append("image", image);
    }

    try {

      const token = localStorage.getItem("token");

      await API.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Product updated successfully");

      navigate("/products");

    } catch (err) {

      console.error(err);
      alert("Error updating product");

    }

  };

  return (

    <div>

      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >

          <option>In Stock</option>
          <option>Out of Stock</option>
          <option>Coming Soon</option>

        </select>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">
          Update Product
        </button>

      </form>

    </div>

  );

}

export default EditProduct;