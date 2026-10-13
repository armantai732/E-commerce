
import React, { useState, useEffect } from "react";
import {
  Star,
  Heart,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  getWishlist,
  removeFromWishlist,
} from "../api/api";

const WishlistPage = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});

  // Product ID
  const getProductId = (product) =>
    String(product?._id || product?.id || product?.sku || "");

  // Product image
  const getProductImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      return typeof firstImage === "string"
        ? firstImage
        : firstImage?.url || "";
    }

    if (typeof product?.image === "string") {
      return product.image;
    }

    return product?.image?.url || "";
  };

  // Load wishlist from database
  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setWishlist([]);
        return;
      }

      const response = await getWishlist();

      setWishlist(
        Array.isArray(response?.products)
          ? response.products
          : []
      );
    } catch (error) {
      console.error("Wishlist fetch failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove product from database wishlist
  const handleRemoveFromWishlist = async (product) => {
    const productId = getProductId(product);

    if (!productId || removing[productId]) return;

    setRemoving((previous) => ({
      ...previous,
      [productId]: true,
    }));

    try {
      const response = await removeFromWishlist(productId);

      if (Array.isArray(response?.products)) {
        setWishlist(response.products);
      } else {
        setWishlist((previous) =>
          previous.filter(
            (item) => getProductId(item) !== productId
          )
        );
      }
    } catch (error) {
      console.error("Wishlist remove failed:", error.message);
      alert(error.message || "Product remove nahi hua.");
    } finally {
      setRemoving((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
  };

  // Open product details
  const handleProductClick = (product) => {
    const productId = getProductId(product);

    navigate("/product", {
      state: {
        productId,
        categoryName:
          typeof product.category === "object"
            ? product.category?.name || "Men"
            : "Men",
        categoryId:
          typeof product.category === "object"
            ? product.category?._id || ""
            : "",
      },
    });
  };

  // Add to cart placeholder
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    const productId = String(product?._id || product?.id || "");

    if (!token) {
      alert("Cart mein product add karne ke liye pehle login karo.");
      navigate("/auth");
      return;
    }

    if (!productId) {
      alert("Product ID nahi mili.");
      return;
    }

    try {
      // Product ko database cart mein add karo
      await addToCart({
        productId,
        quantity: 1,
      });

      // Cart page par redirect
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert(error.message || "Product cart mein add nahi hua.");
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-6 px-2 sm:px-4 lg:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100/80 pb-4">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Saved Items
            </h1>

            <p className="text-xs text-gray-400 font-medium">
              Your curated list of favorite products
            </p>
          </div>

          <span className="bg-[#FAF3EA] border border-[#EEDFCD] text-[#966F33] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles size={12} />
            {wishlist.length} Items
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-bold text-sm">
              Loading wishlist...
            </p>
          </div>
        ) : wishlist.length > 0 ? (

          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const productId = getProductId(product);
              const image = getProductImage(product);
              const price = Number(product.price || 0);
              const rating = Number(product.rating || 0);

              return (
                <div
                  key={productId}
                  className="group bg-white rounded-3xl p-3.5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => handleProductClick(product)}
                    className="relative w-full h-52 bg-[#FAF9F6] rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-gray-50 cursor-pointer"
                  >
                    <img
                      src={
                        image ||
                        "https://placehold.co/600x600/png?text=Product"
                      }
                      alt={product.name || "Product"}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Remove Heart */}
                    <button
                      type="button"
                      disabled={Boolean(removing[productId])}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveFromWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-gray-100 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={15} fill="currentColor" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="pt-3.5 pb-1 px-1 space-y-2">
                    <h3
                      onClick={() => handleProductClick(product)}
                      className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#966F33] transition-colors truncate cursor-pointer"
                    >
                      {product.name || "Unnamed Product"}
                    </h3>

                    <div className="flex items-center justify-between">
                      <p className="text-sm sm:text-base font-extrabold text-gray-900">
                        ₹{price.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-amber-400 fill-amber-400"
                        />
                        <span className="text-[11px] font-bold text-gray-600">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="w-full mt-2 bg-[#FAF3EA] hover:bg-[#081225] text-[#966F33] hover:text-white border border-[#EEDFCD] hover:border-[#081225] font-bold py-2.5 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF3EA] text-[#966F33] flex items-center justify-center mx-auto border border-[#EEDFCD]">
              <Heart size={22} />
            </div>

            <h4 className="text-base font-bold text-gray-900">
              Your Wishlist is Empty
            </h4>

            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Save items you love by clicking the heart icon while browsing our store.
            </p>

            <button
              type="button"
              onClick={() => navigate("/product")}
              className="mt-3 bg-[#081225] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#966F33] transition-colors"
            >
              Explore Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;