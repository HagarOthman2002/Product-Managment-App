import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/Cards/ProductCard";
import AddEditeProduct from "./AddEditeProducts";
import { MdAdd } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import EmptyCard from "../../components/Cards/EmptyCard";
import addProduct from "../../assets/images/npProducts.webp";
import socket from "../../socket";

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (productDetails) => {
    setOpenAddEditModal({ isShown: true, data: productDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axiosInstance.get("/products", {
        params: searchQuery.trim() ? { search: searchQuery } : {},
      });

      if (response.data && response.data.products) {
        setAllProducts(response.data.products);
      }
    } catch (error) {
      console.log("an unexpected error occurred. please try again.");
    }
  };

  const deleteProduct = async (data) => {
    const productId = data?._id;
    try {
      const response = await axiosInstance.delete("/products/" + productId);
      if (response.data && !response.data.error) {
        showToastMessage("Product Deleted successfully", "delete");
        getAllProducts();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.message) {
        console.log("An unexpected error occurred. please try again");
      }
    }
  };

  useEffect(() => {
    getAllProducts();
    getUserInfo();

    socket.on("productAdded", (newProduct) => {
      setAllProducts((prev) => [...prev, newProduct]);
    });

    socket.on("productUpdated", (updatedProduct) => {
      setAllProducts((prev) =>
        prev.map((prod) =>
          prod._id === updatedProduct._id ? updatedProduct : prod
        )
      );
    });

    socket.on("productDeleted", ({ id }) => {
      setAllProducts((prev) => prev.filter((prod) => prod._id !== id));
    });

    return () => {
      socket.off("productAdded");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, [searchQuery]);

  const BASE_IMAGE_URL = "http://localhost:8000/uploads/";
  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={getAllProducts}
        onClearSearch={() => {
          setSearchQuery("");
          getAllProducts();
        }}
      />
      <div className="container mx-auto px-4">
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {allProducts.map((item) => (
              <ProductCard
                key={item._id}
                imageUrl={item.img ? `${BASE_IMAGE_URL}${item.img}` : null}
                name={item.name}
                description={item.description}
                price={item.price}
                category={item.category}
                inStock={item.inStock}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteProduct(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={addProduct}
            message="Start creating your first product listing!Click the ‘Add’ button to showcase your items — describe your product, set the price, and get ready to sell.Let’s get started and turn your ideas into sales!"
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-black hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
        <AddEditeProduct
          type={openAddEditModal.type}
          productData={openAddEditModal.data}
          getAllProducts={getAllProducts}
          showToastMessage={showToastMessage}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
        />
      </Modal>
      <ToastMessage
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
