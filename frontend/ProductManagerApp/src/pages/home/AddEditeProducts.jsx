import React, { useState } from "react";
import ImageInput from "../../components/input/ImageInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditeProduct = ({
  productData,
  type,
  getAllProducts,
  onClose,
  showToastMessage,
}) => {
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [inStock, setInStock] = useState(productData?.inStock ?? true);
  const [img, setImg] = useState(productData?.img || []);
  const [error, setError] = useState(null);
  


const addNewProduct = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("inStock", inStock);
    if (img) {
      formData.append("image", img);
    }

    const response = await axiosInstance.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.product) {
      showToastMessage("Product added successfully");
      getAllProducts();
      onClose();
    }
  } catch (error) {
    console.error("Add error:", error);
    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError("An unexpected error occurred.");
    }
  }
};


  // Edit Product
  const editeProduct = async () => {
    const productId = productData?._id;
    if (!productId) {
      setError("Product ID is missing.");
      return;
    }

    try {
      const response = await axiosInstance.put("/products/" + productId, {
        name,
        description,
        price,
        category,
        inStock,
   
      });

      if (response.data && response.data.product) {
        showToastMessage("Product updated successfully");
        getAllProducts();
        onClose();
      }
    } catch (error) {
      console.error("Error editing product:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleAddProduct = () => {
    if (!name) return setError("Please enter the product name");
    if (!description) return setError("Please enter the product description");
    if (!price) return setError("Please enter the product price");

    setError("");
    if (type === "edit") {
      editeProduct();
    } else {
      addNewProduct();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      {/* Product Name */}
      <div className="flex flex-col gap-2">
        <label className="input-label">Product Name</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Classic Cotton T-Shirt"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Description</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Describe the product, its material, features, etc."
          rows={5}
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
      </div>

      {/* Price */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Price (EGP)</label>
        <input
          type="number"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="e.g. 299.99"
          value={price}
          onChange={({ target }) => setPrice(target.value)}
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Category</label>
        <input
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="e.g. Men's Clothing"
          value={category}
          onChange={({ target }) => setCategory(target.value)}
        />
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="inStock"
          checked={inStock}
          onChange={e => setInStock(e.target.checked)}
        />
        <label htmlFor="inStock" className="text-sm">
          In Stock
        </label>
      </div>

      {/* Tags */}
      <div className="mt-4">

        <ImageInput image={img} setImage={setImg} />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      {/* Submit Button */}
      <button
        className="w-full bg-blue-600 text-white cursor-pointer font-medium mt-5 p-3 hover:bg-blue-700"
        onClick={handleAddProduct}
      >
        {type === "edit" ? "Update Product" : "Add Product"}
      </button>
    </div>
  );
};

export default AddEditeProduct;
