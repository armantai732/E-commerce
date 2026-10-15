
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  RefreshCw,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { addProductReview, addToCart, getProductReviews } from "../api/api";


const ProductDetailPage = ({ product, onBack }) => {
  const navigate = useNavigate();

  const [cartLoading, setCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Authentication
  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  const handleAuthRedirect = () => {
    if (!isLoggedIn()) {
      alert("Please login first to continue.");
      navigate("/login");
      return false;
    }

    return true;
  };

  // Product images
  const galleryImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : ["https://placehold.co/600x600/png?text=Product"];

  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  // Get colour name
  const getColourName = (colour) => {
    if (typeof colour === "string") return colour;

    return (
      colour?.name ||
      colour?.colour ||
      colour?.color ||
      colour?.value ||
      ""
    );
  };

  // Get colour code
  const getColourCode = (colour) => {
    if (typeof colour === "object" && colour !== null) {
      return (
        colour.code ||
        colour.hex ||
        colour.value ||
        colour.name ||
        "#e5e7eb"
      );
    }

    const colourCodes = {
      black: "#000000",
      white: "#ffffff",
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      yellow: "#eab308",
      pink: "#ec4899",
      purple: "#a855f7",
      grey: "#9ca3af",
      gray: "#9ca3af",
      brown: "#92400e",
      orange: "#f97316",
      beige: "#d6c3a3",
      navy: "#1e3a8a",
    };

    return (
      colourCodes[String(colour || "").toLowerCase()] || "#e5e7eb"
    );
  };

  // Read sizes from database
  const sizes = (() => {
    if (Array.isArray(product?.sizeStock) && product.sizeStock.length > 0) {
      return [
        ...new Set(
          product.sizeStock
            .map((entry) => String(entry?.size || "").trim())
            .filter(Boolean)
        ),
      ];
    }

    return Array.isArray(product?.sizes)
      ? [
          ...new Set(
            product.sizes
              .map((size) => String(size).trim())
              .filter(Boolean)
          ),
        ]
      : [];
  })();

  // Read colours from database
  const colors = (() => {
    if (Array.isArray(product?.sizeStock) && product.sizeStock.length > 0) {
      return [
        ...new Set(
          product.sizeStock.flatMap((sizeEntry) =>
            (Array.isArray(sizeEntry?.colourStock)
              ? sizeEntry.colourStock
              : []
            )
              .map((entry) => getColourName(entry?.colour))
              .filter(Boolean)
          )
        ),
      ];
    }

    if (Array.isArray(product?.colors)) {
      return [
        ...new Set(product.colors.map(getColourName).filter(Boolean)),
      ];
    }

    return [];
  })();

  // Get available colours for selected size
  const getColoursForSize = (size) => {
    const sizeEntry = product?.sizeStock?.find(
      (entry) => String(entry.size) === String(size)
    );

    if (sizeEntry && Array.isArray(sizeEntry.colourStock)) {
      return sizeEntry.colourStock
        .filter((entry) => getColourName(entry.colour))
        .map((entry) => ({
          name: getColourName(entry.colour),
          quantity: Math.max(0, Number(entry.quantity) || 0),
          code: getColourCode(entry.colour),
        }));
    }

    return colors.map((colour) => ({
      name: colour,
      quantity: Math.max(0, Number(product?.stock) || 0),
      code: getColourCode(colour),
    }));
  };

  // Selected size and colour
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState("");

  // Reset selections when another product opens
  useEffect(() => {
    setSelectedImage(galleryImages[0]);
    setSelectedSize(sizes[0] || "");
    setSelectedColor("");
    setQuantity(1);
  }, [product?._id]);

  // Available colours for selected size
  const availableColors = getColoursForSize(selectedSize);

  // Automatically select an available colour
  useEffect(() => {
    if (availableColors.length === 0) {
      setSelectedColor("");
      return;
    }

    const selectedStillExists = availableColors.some(
      (colour) => colour.name === selectedColor
    );

    if (!selectedStillExists) {
      const inStockColour = availableColors.find(
        (colour) => colour.quantity > 0
      );

      setSelectedColor(
        (inStockColour || availableColors[0]).name
      );
    }
  }, [selectedSize, product?._id]);

  // Selected variant stock
  const selectedColourStock = availableColors.find(
    (colour) => colour.name === selectedColor
  );

  const hasSizeStock =
    Array.isArray(product?.sizeStock) &&
    product.sizeStock.length > 0;

  const availableStock = hasSizeStock
    ? Math.max(0, Number(selectedColourStock?.quantity) || 0)
    : Math.max(0, Number(product?.stock) || 0);

  const stockToDisplay =
    sizes.length > 0 && colors.length > 0
      ? availableStock
      : Math.max(0, Number(product?.stock) || 0);

  // Fetch reviews for this product ID
  const fetchReviews = useCallback(async () => {
    if (!product?._id) return;

    try {
      setReviewsLoading(true);
      setReviewError("");

      const response = await getProductReviews(product._id);
      const data = response?.data ?? response;

      setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      setAverageRating(Number(data?.averageRating) || 0);
      setTotalReviews(Number(data?.totalReviews) || 0);
    } catch (error) {
      console.error("Fetch reviews error:", error);
      setReviewError(
        error.response?.data?.message || "Unable to load reviews."
      );
    } finally {
      setReviewsLoading(false);
    }
  }, [product?._id]);

  // Fetch reviews when Reviews tab opens or product changes
  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab, fetchReviews]);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!handleAuthRedirect()) return;

    if (!product?._id) {
      setReviewError("Product not found.");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Please select a star rating.");
      return;
    }

    if (!reviewDescription.trim()) {
      setReviewError("Please write your review.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");

      await addProductReview(product._id, {
        rating: reviewRating,
        description: reviewDescription.trim(),
      });

      setReviewRating(0);
      setReviewDescription("");

      await fetchReviews();

      alert("Your review has been submitted successfully!");
    } catch (error) {
      console.error("Submit review error:", error);

      setReviewError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Unable to submit your review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Add product to cart
  const handleCartAction = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first to add products to your cart.");
        navigate("/login");
        return;
      }

      if (!product?._id) {
        alert("Product ID missing. Please check your product data.");
        return;
      }

      if (sizes.length > 0 && !selectedSize) {
        alert("Please select a size.");
        return;
      }

      if (colors.length > 0 && !selectedColor) {
        alert("Please select a colour.");
        return;
      }

      if (stockToDisplay <= 0) {
        alert("Selected size and colour are out of stock.");
        return;
      }

      if (quantity > stockToDisplay) {
        alert(`Only ${stockToDisplay} items are available for this selection.`);
        return;
      }

      setCartLoading(true);

      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setCartLoading(false);
    }
  };

  const price = Number(product?.price || 0);
  const originalPrice = Number(product?.originalPrice || 0);

  const discount =
    originalPrice > price && originalPrice > 0
      ? product?.discount != null
        ? Number(product.discount)
        : Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className="w-full bg-white min-h-screen py-8 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Images */}
          <div className="md:col-span-6 flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {galleryImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border transition-all ${
                    selectedImage === img
                      ? "border-gray-900 ring-1 ring-gray-900"
                      : "border-gray-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 h-[520px] rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={selectedImage}
                alt={product?.name || "Product Name"}
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="md:col-span-6 space-y-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product?.name || "Product Name"}
            </h1>

            {/* Rating */}
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className="flex items-center gap-2"
              aria-label="View product reviews"
            >
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill={
                      star <= Math.round(averageRating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-gray-500">
                {averageRating.toFixed(1)}{" "}
                <span className="text-gray-400">
                  ({totalReviews} reviews)
                </span>
              </span>
            </button>

            {/* Price & Discount */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-black text-gray-900">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {originalPrice > price && (
                <>
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>

                  <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Indicator */}
            {(() => {
              if (stockToDisplay === 0) {
                return (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    Out of Stock
                  </p>
                );
              }

              if (stockToDisplay <= 10) {
                return (
                  <p className="text-xs font-bold text-orange-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                    Only {stockToDisplay} left in stock
                  </p>
                );
              }

              return (
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Available In Stock
                </p>
              );
            })()}

            {/* Sizes */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-gray-700 block">
                Size
              </label>

              {sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const sizeValue = String(size);
                    const sizeEntry = product?.sizeStock?.find(
                      (entry) => String(entry.size) === sizeValue
                    );

                    const sizeQuantity =
                      sizeEntry && Array.isArray(sizeEntry.colourStock)
                        ? sizeEntry.colourStock.reduce(
                            (total, entry) =>
                              total + Math.max(0, Number(entry.quantity) || 0),
                            0
                          )
                        : Number(product?.stock) || 0;

                    return (
                      <button
                        key={sizeValue}
                        type="button"
                        disabled={hasSizeStock && sizeQuantity <= 0}
                        onClick={() => {
                          setSelectedSize(sizeValue);
                          setQuantity(1);
                        }}
                        title={
                          hasSizeStock
                            ? `${sizeValue} — ${sizeQuantity} available`
                            : sizeValue
                        }
                        className={`min-w-10 h-10 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedSize === sizeValue
                            ? "border-gray-900 bg-white text-gray-900 shadow-sm ring-1 ring-gray-900"
                            : "border-gray-200 text-gray-600 hover:border-gray-400"
                        } ${
                          hasSizeStock && sizeQuantity <= 0
                            ? "opacity-40 cursor-not-allowed line-through"
                            : ""
                        }`}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No sizes available</p>
              )}
            </div>

            {/* Colours */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-gray-700 block">
                Colour
                {selectedColor && (
                  <span className="ml-2 text-gray-400 font-medium">
                    — {selectedColor}
                  </span>
                )}
              </label>

              {availableColors.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  {availableColors.map((colour, index) => {
                    const isSelected = selectedColor === colour.name;

                    return (
                      <button
                        key={`${colour.name}-${index}`}
                        type="button"
                        title={`${colour.name}${
                          hasSizeStock
                            ? ` — ${colour.quantity} available`
                            : ""
                        }`}
                        aria-label={colour.name}
                        disabled={hasSizeStock && colour.quantity <= 0}
                        onClick={() => {
                          setSelectedColor(colour.name);
                          setQuantity(1);
                        }}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-all ${
                          isSelected
                            ? "border-gray-900 ring-1 ring-gray-900"
                            : "border-gray-200 hover:border-gray-500"
                        } ${
                          hasSizeStock && colour.quantity <= 0
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: colour.code }}
                        />

                        <span className="text-xs font-medium text-gray-700">
                          {colour.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No colours available for this size
                </p>
              )}
            </div>

            {/* Variant Stock */}
            {hasSizeStock && selectedSize && selectedColor && (
              <p className="text-xs text-gray-500">
                Stock for {selectedSize} / {selectedColor}:{" "}
                <span className="font-bold text-gray-800">
                  {availableStock}
                </span>
              </p>
            )}

            {/* Quantity Selector */}
            <div className="pt-1">
              <div className="flex items-center justify-between w-32 border border-gray-200 rounded-lg p-1 bg-gray-50/50">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((prev) => Math.max(1, prev - 1))
                  }
                  className="w-8 h-7 flex items-center justify-center font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-40"
                >
                  -
                </button>

                <span className="text-xs font-bold text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={stockToDisplay <= 0 || quantity >= stockToDisplay}
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.min(stockToDisplay, prev + 1)
                    )
                  }
                  className="w-8 h-7 flex items-center justify-center font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2 max-w-md">
              <button
                type="button"
                onClick={handleCartAction}
                disabled={
                  cartLoading ||
                  stockToDisplay <= 0 ||
                  (sizes.length > 0 && !selectedSize) ||
                  (colors.length > 0 && !selectedColor)
                }
                className="w-full bg-[#081225] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-xs tracking-wider transition-colors shadow-sm"
              >
                {cartLoading ? "ADDING TO CART..." : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={handleCartAction}
                disabled={
                  cartLoading ||
                  stockToDisplay <= 0 ||
                  (sizes.length > 0 && !selectedSize) ||
                  (colors.length > 0 && !selectedColor)
                }
                className="w-full bg-[#FBF7F0] hover:bg-[#f5eedf] disabled:opacity-50 disabled:cursor-not-allowed border border-[#E8DCC8] text-gray-900 font-bold py-3.5 rounded-xl text-xs tracking-wider transition-colors"
              >
                {cartLoading ? "PLEASE WAIT..." : "Buy Now"}
              </button>
            </div>

            {/* Features */}
            <div className="pt-4 space-y-2.5 text-xs font-bold text-gray-700">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-gray-800" />
                <span>100% Original Product</span>
              </div>

              <div className="flex items-center gap-3">
                <RefreshCw size={16} className="text-gray-800" />
                <span>7 Days Return Policy</span>
              </div>

              <div className="flex items-center gap-3">
                <Truck size={16} className="text-gray-800" />
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabbed Content */}
        <div className="mt-16">
          <div className="flex gap-6 sm:gap-10 border-b border-gray-100 pb-3 overflow-x-auto">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === "reviews" && !handleAuthRedirect()) {
                    return;
                  }

                  setActiveTab(tab.id);
                }}
                className={`whitespace-nowrap text-sm font-bold pb-3 -mb-3 transition-all ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-[#FAF9F6] border border-gray-100 p-6 rounded-2xl">
            {/* Description */}
            {activeTab === "description" && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Product Description
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product?.description?.trim()
                    ? product.description
                    : "No description available."}
                </p>
              </div>
            )}

            {/* Specifications */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Product Specifications
                </h3>

                {(() => {
                  const specs = product?.specifications;

                  const entries =
                    specs instanceof Map
                      ? Array.from(specs.entries())
                      : Array.isArray(specs)
                        ? specs.map((item, index) => [
                            item.key ||
                              item.name ||
                              `Specification ${index + 1}`,
                            item.value ?? "",
                          ])
                        : specs && typeof specs === "object"
                          ? Object.entries(specs)
                          : [];

                  const filteredEntries = entries.filter(
                    ([, value]) =>
                      value !== null &&
                      value !== undefined &&
                      String(value).trim() !== ""
                  );

                  return (
                    <>
                      {product?.brand && (
                        <div className="flex justify-between gap-4 border-b border-gray-200 py-3 text-xs sm:text-sm">
                          <span className="font-semibold text-gray-700">
                            Brand
                          </span>
                          <span className="text-gray-600 text-right">
                            {product.brand}
                          </span>
                        </div>
                      )}

                      {product?.sku && (
                        <div className="flex justify-between gap-4 border-b border-gray-200 py-3 text-xs sm:text-sm">
                          <span className="font-semibold text-gray-700">
                            SKU
                          </span>
                          <span className="text-gray-600 text-right">
                            {product.sku}
                          </span>
                        </div>
                      )}

                      {filteredEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between gap-4 border-b border-gray-200 py-3 text-xs sm:text-sm"
                        >
                          <span className="font-semibold text-gray-700 capitalize">
                            {String(key).replace(/([A-Z])/g, " $1")}
                          </span>

                          <span className="text-gray-600 text-right">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                          </span>
                        </div>
                      ))}

                      {!product?.brand &&
                        !product?.sku &&
                        filteredEntries.length === 0 && (
                          <p className="text-xs sm:text-sm text-gray-500">
                            No specifications available.
                          </p>
                        )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Review Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Customer Reviews
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Feedback for {product?.name || "this product"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-black text-gray-900">
                      {averageRating.toFixed(1)}
                    </div>

                    <div>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={17}
                            fill={
                              star <= Math.round(averageRating)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {totalReviews}{" "}
                        {totalReviews === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Write Review Form */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5"
                >
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      Write a Review
                    </h4>

                    <p className="text-xs text-gray-500 mt-1">
                      Share your experience with this product.
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Rating
                    </label>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          aria-label={`Rate ${star} out of 5 stars`}
                          aria-pressed={reviewRating === star}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={
                              star <= reviewRating
                                ? "text-amber-500"
                                : "text-gray-300"
                            }
                            fill={
                              star <= reviewRating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      ))}

                      <span className="text-xs text-gray-500 ml-2">
                        {reviewRating > 0
                          ? `${reviewRating}/5`
                          : "Select stars"}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label
                      htmlFor="product-review"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Your Review
                    </label>

                    <textarea
                      id="product-review"
                      value={reviewDescription}
                      onChange={(e) => setReviewDescription(e.target.value)}
                      placeholder="What did you think about this product?"
                      rows={4}
                      maxLength={1000}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white resize-y"
                    />

                    <p className="text-right text-xs text-gray-400 mt-1">
                      {reviewDescription.length}/1000
                    </p>
                  </div>

                  {reviewError && (
                    <p
                      role="alert"
                      className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3"
                    >
                      {reviewError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="bg-[#081225] hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>

                {/* Review List */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-gray-900">
                    Customer Feedback ({totalReviews})
                  </h4>

                  {reviewsLoading ? (
                    <p className="text-sm text-gray-500 py-6 text-center">
                      Loading reviews...
                    </p>
                  ) : reviews.length === 0 ? (
                    <div className="text-center bg-white border border-gray-200 rounded-2xl p-8">
                      <Star
                        size={32}
                        className="mx-auto text-gray-300 mb-3"
                      />

                      <h5 className="font-bold text-gray-800">
                        No reviews yet
                      </h5>

                      <p className="text-sm text-gray-500 mt-1">
                        Be the first to review this product.
                      </p>
                    </div>
                  ) : (
                    reviews.map((review, index) => (
                      <div
                        key={review._id || `${review.user}-${index}`}
                        className="bg-white border border-gray-200 rounded-2xl p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h5 className="font-bold text-gray-900 break-words">
                              {review.name ||
                                review.user?.name ||
                                "Customer"}
                            </h5>

                            <p className="text-xs text-gray-500 mt-1 break-all">
                              {review.email || review.user?.email || ""}
                            </p>
                          </div>

                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {review.createdAt
                              ? new Date(
                                  review.createdAt
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </span>
                        </div>

                        <div className="flex gap-1 text-amber-500 mt-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={15}
                              fill={
                                star <= Number(review.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed mt-3 whitespace-pre-line break-words">
                          {review.comment || review.description || ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
