import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, RefreshCw, Truck, ArrowLeft } from 'lucide-react';
import { addToCart } from '../api/api';

const ProductDetailPage = ({ product, onBack }) => {
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);

  const handleCartAction = async () => {
    try {
      const token = localStorage.getItem("token");

      // Login check
      if (!token) {
        alert("Please login first to add products to your cart.");
        navigate("/login");
        return;
      }

      // Product ID check
      if (!product?._id) {
        alert("Product ID missing. Please check your product data.");
        return;
      }

      // Stock check
      const stock = Number(product.stock) || 0;

      if (stock <= 0) {
        alert("This product is out of stock.");
        return;
      }

      if (quantity > stock) {
        alert(`Only ${stock} items are available in stock.`);
        return;
      }

      setCartLoading(true);

      // Add product to database cart using api.js
      await addToCart({
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      });

      // Navigate after successful API call
      navigate("/cart");

    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };


  // Gallery images list matching the thumbnail preview
  const galleryImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : ["https://placehold.co/600x600/png?text=Product"];

  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : [];
  const colors = Array.isArray(product?.colors)
    ? product.colors
    : [];
  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? String(sizes[0]) : ""
  );
  const [selectedColor, setSelectedColor] = useState(() => {
    if (colors.length === 0) return "";

    const firstColor = colors[0];

    return typeof firstColor === "object"
      ? String(
        firstColor.name ||
        firstColor.value ||
        firstColor.color ||
        ""
      )
      : String(firstColor);
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="w-full bg-white min-h-screen py-8 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={18} /> Back to Products
        </button>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left: Thumbnail Column + Main Image Container */}
          <div className="md:col-span-6 flex gap-4">

            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-3">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border transition-all ${selectedImage === img
                    ? 'border-gray-900 ring-1 ring-gray-900'
                    : 'border-gray-200 opacity-80 hover:opacity-100'
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

            {/* Main Product Image Container - Increased Height (520px) & Full-width Image */}
            <div className="flex-1 h-[520px] rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={selectedImage}
                alt={product?.name || "Product Name"}
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              />
            </div>

          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="md:col-span-6 space-y-5">

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product?.name || "Product Name"}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {product?.rating || "4.5"} <span className="text-gray-400">({product?.reviews || "104"} reviews)</span>
              </span>
            </div>

            {/* Price & Discount */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-black text-gray-900">
                ₹{Number(product?.price || 0).toLocaleString("en-IN")}
              </span>

              {Number(product?.originalPrice || 0) >
                Number(product?.price || 0) && (
                  <>
                    <span className="text-sm font-semibold text-gray-400 line-through">
                      ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                    </span>

                    <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {product.discount != null
                        ? `${product.discount}% OFF`
                        : `${Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                          100
                        )}% OFF`}
                    </span>
                  </>
                )}
            </div>

            {/* Stock Indicator */}
            {(() => {
              const stock = Math.max(0, Number(product?.stock) || 0);

              if (stock === 0) {
                return (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    Out of Stock
                  </p>
                );
              }

              if (stock <= 10) {
                return (
                  <p className="text-xs font-bold text-orange-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                    Only {stock} left in stock
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



            {/* Size Options */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-gray-700 block">
                Size
              </label>

              {sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const sizeValue = String(size);

                    return (
                      <button
                        key={sizeValue}
                        type="button"
                        onClick={() => setSelectedSize(sizeValue)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${selectedSize === sizeValue
                          ? "border-gray-900 bg-white text-gray-900 shadow-sm ring-1 ring-gray-900"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                          }`}
                      >
                        {sizeValue}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No sizes available
                </p>
              )}
            </div>



            {/* Color Options */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-gray-700 block">
                Color
              </label>

              {colors.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  {colors.map((color) => {
                    const colorValue =
                      typeof color === "object"
                        ? String(color.name || color.value || color.color || "")
                        : String(color);

                    return (
                      <button
                        key={colorValue}
                        type="button"
                        title={colorValue}
                        aria-label={colorValue}
                        onClick={() => setSelectedColor(colorValue)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-all ${selectedColor === colorValue
                          ? "border-gray-900 ring-1 ring-gray-900"
                          : "border-gray-200 hover:border-gray-500"
                          }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: colorValue }}
                        />

                        <span className="text-xs font-medium text-gray-700">
                          {colorValue}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No colors available
                </p>
              )}
            </div>


            {/* Quantity Selector */}
            <div className="pt-1">
              <div className="flex items-center justify-between w-32 border border-gray-200 rounded-lg p-1 bg-gray-50/50">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-7 flex items-center justify-center font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors"
                >
                  -
                </button>
                <span className="text-xs font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-7 flex items-center justify-center font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors"
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
                disabled={cartLoading || Number(product?.stock ?? 0) <= 0}
                className="w-full bg-[#081225] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-xs tracking-wider transition-colors shadow-sm"
              >
                {cartLoading ? 'ADDING TO CART...' : 'Add to Cart'}
              </button>

              <button
                type="button"
                onClick={handleCartAction}
                disabled={cartLoading || Number(product?.stock ?? 0) <= 0}
                className="w-full bg-[#FBF7F0] hover:bg-[#f5eedf] disabled:opacity-50 disabled:cursor-not-allowed border border-[#E8DCC8] text-gray-900 font-bold py-3.5 rounded-xl text-xs tracking-wider transition-colors"
              >
                {cartLoading ? 'PLEASE WAIT...' : 'Buy Now'}
              </button>
            </div>

            {/* Unique Selling Features */}
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

        {/* Bottom Tabbed Content Area */}
        <div className="mt-16">
          <div className="flex gap-10 border-b border-gray-100 pb-3">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-bold pb-3 -mb-3 transition-all ${activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>


          <div className="mt-6 bg-[#FAF9F6] border border-gray-100 p-6 rounded-2xl">
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
                          item.name || `Specification ${index + 1}`,
                          item.value ?? ""
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
                          <span className="font-semibold text-gray-700">Brand</span>
                          <span className="text-gray-600 text-right">
                            {product.brand}
                          </span>
                        </div>
                      )}

                      {product?.sku && (
                        <div className="flex justify-between gap-4 border-b border-gray-200 py-3 text-xs sm:text-sm">
                          <span className="font-semibold text-gray-700">SKU</span>
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
                            {key.replace(/([A-Z])/g, " $1")}
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

            {activeTab === "reviews" && (
              <p className="text-xs sm:text-sm text-gray-600">
                Customer reviews and detailed ratings will appear here.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;