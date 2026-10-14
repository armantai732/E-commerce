
import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  ChevronDown,
  Filter,
  Layers,
  Heart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductDetailPage from "./ProductDetailPage";
import {
  getCategorydata,
  getProductdata,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/api";

const priceRanges = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-1000", label: "Under ₹1,000", min: 0, max: 1000 },
  { id: "1000-2000", label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { id: "2000-5000", label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5000, max: Infinity },
];

const ShopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handledProductId = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.categoryName || "Men"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    location.state?.categoryId || ""
  );
  const [product, setProduct] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Database wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistUpdating, setWishlistUpdating] = useState({});

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.key]);

  // Get category name
  const getCategoryName = (value) => {
    if (!value) return "";

    if (typeof value === "object") {
      return value.name || value.title || "";
    }

    return String(value);
  };

  // Get category ID
  const getCategoryId = (value) => {
    if (!value) return "";

    if (typeof value === "object") {
      return String(value._id || value.id || "");
    }

    return String(value);
  };

  // Get product ID
  const getProductId = (item) =>
    String(item?._id || item?.id || item?.sku || "");

  // Load wishlist from database
  useEffect(() => {
    let active = true;

    const loadWishlist = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          if (active) setWishlist([]);
          return;
        }

        const response = await getWishlist();

        if (active) {
          setWishlist(
            Array.isArray(response?.products) ? response.products : []
          );
        }
      } catch (error) {
        console.error("Wishlist load failed:", error.message);
      } finally {
        if (active) setWishlistLoading(false);
      }
    };

    loadWishlist();

    return () => {
      active = false;
    };
  }, []);

  // Add/remove product from database wishlist
  const toggleWishlist = async (item) => {
    const productId = getProductId(item);

    if (!productId) {
      alert("Product ID nahi mili.");
      return;
    }

    if (!localStorage.getItem("token")) {
      alert("Wishlist use karne ke liye pehle login karo.");
      navigate("/login");
      return;
    }

    if (wishlistUpdating[productId]) return;

    const alreadyExists = wishlist.some(
      (wishlistItem) => getProductId(wishlistItem) === productId
    );

    setWishlistUpdating((previous) => ({
      ...previous,
      [productId]: true,
    }));

    try {
      const response = alreadyExists
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId);

      if (Array.isArray(response?.products)) {
        setWishlist(response.products);
      } else {
        // Fallback if API doesn't return products
        setWishlist((previous) =>
          alreadyExists
            ? previous.filter(
              (wishlistItem) => getProductId(wishlistItem) !== productId
            )
            : [...previous, item]
        );
      }

      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch (error) {
      console.error("Wishlist update failed:", error.message);
      alert(error.message || "Wishlist update nahi hui.");
    } finally {
      setWishlistUpdating((previous) => ({
        ...previous,
        [productId]: false,
      }));
    }
  };

  // Current selected category
  const currentCategoryObj = categoriesData.find(
    (category) => category.name === selectedCategory
  );

  // Change main category
  const handleCategoryChange = (categoryName) => {
    const category = categoriesData.find(
      (item) => item.name === categoryName
    );

    setSelectedCategory(categoryName);
    setSelectedCategoryId(String(category?._id || ""));
    setSelectedSubCategory("All");
  };

  // Fetch products and categories
  useEffect(() => {
    let active = true;

    const getData = async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes] = await Promise.all([
          getProductdata(),
          getCategorydata(),
        ]);

        const products =
          productRes?.data?.data || productRes?.data || [];
        const categories =
          categoryRes?.data?.data || categoryRes?.data || [];

        const safeProducts = Array.isArray(products) ? products : [];
        const safeCategories = Array.isArray(categories) ? categories : [];

        if (!active) return;

        setProduct(safeProducts);
        setAllCategories(safeCategories);

        const parentCategories = safeCategories
          .filter((category) => {
            const parentId = getCategoryId(category.parentCategory);

            return (
              !parentId ||
              parentId === "null" ||
              parentId === "undefined"
            );
          })
          .map((category) => ({
            ...category,
            subCategories: [
              "All",
              ...safeCategories
                .filter(
                  (subCategory) =>
                    getCategoryId(subCategory.parentCategory) ===
                    String(category._id)
                )
                .map((subCategory) => subCategory.name),
            ],
          }));

        setCategoriesData(parentCategories);

        const passedCategoryId = location.state?.categoryId;
        const passedCategoryName = location.state?.categoryName;

        const matchedCategory = parentCategories.find((category) => {
          const idMatches =
            passedCategoryId &&
            String(category._id) === String(passedCategoryId);

          const nameMatches =
            passedCategoryName &&
            category.name?.toLowerCase() ===
            passedCategoryName.toLowerCase();

          return idMatches || nameMatches;
        });

        const defaultCategory =
          matchedCategory ||
          parentCategories.find((category) => category.name === "Men") ||
          parentCategories[0];

        if (defaultCategory) {
          setSelectedCategory(defaultCategory.name);
          setSelectedCategoryId(String(defaultCategory._id));
          setSelectedSubCategory("All");
        }
      } catch (error) {
        console.error(
          "Shop data fetch failed:",
          error.response?.data || error.message
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    getData();

    return () => {
      active = false;
    };
  }, []);

  // Open a product passed from My Orders
  useEffect(() => {
    const requestedProductId = location.state?.productId;

    if (!requestedProductId || product.length === 0) return;

    if (handledProductId.current === String(requestedProductId)) return;

    const matchedProduct = product.find(
      (item) =>
        String(item._id || item.id) === String(requestedProductId)
    );

    if (!matchedProduct) {
      console.error(
        "Order wala product API mein nahi mila:",
        requestedProductId
      );
      return;
    }

    handledProductId.current = String(requestedProductId);
    setSelectedProduct(matchedProduct);

    navigate(location.pathname, {
      replace: true,
      state: {
        categoryName: location.state?.categoryName || "Men",
        categoryId: location.state?.categoryId || "",
      },
    });
  }, [product, location.state?.productId, location.pathname, navigate]);

  // Check whether product belongs to a parent category
  const belongsToParentCategory = (category, parentId) => {
    let currentCategory = category;
    const visited = new Set();

    while (currentCategory) {
      const currentId = getCategoryId(currentCategory);

      if (!currentId || visited.has(currentId)) break;

      visited.add(currentId);

      const foundCategory = allCategories.find(
        (item) => String(item._id) === currentId
      );

      if (!foundCategory) return false;

      const foundParentId = getCategoryId(foundCategory.parentCategory);

      if (foundParentId === String(parentId)) return true;
      if (!foundParentId) return false;

      currentCategory = foundParentId;
    }

    return false;
  };

  // Filter products
  const filteredProducts = product.filter((item) => {
    const categoryValue = item.category || item.categoryId;
    const categoryId = getCategoryId(categoryValue);

    const productCategory = allCategories.find(
      (category) => String(category._id) === categoryId
    );

    const productCategoryName =
      productCategory?.name || getCategoryName(categoryValue);

    const activeCategoryId = String(
      selectedCategoryId || currentCategoryObj?._id || ""
    );

    const isMainCategoryMatch =
      productCategoryName.toLowerCase() === selectedCategory.toLowerCase() ||
      (activeCategoryId !== "" &&
        belongsToParentCategory(categoryId, activeCategoryId));

    const isSubCategoryMatch =
      selectedSubCategory === "All" ||
      productCategoryName.toLowerCase() ===
      selectedSubCategory.toLowerCase();

    const activePriceRange = priceRanges.find(
      (range) => range.id === selectedPriceRange
    );

    const price = Number(item.price || 0);

    const isPriceMatch =
      activePriceRange &&
      price >= activePriceRange.min &&
      price <= activePriceRange.max;

    return isMainCategoryMatch && isSubCategoryMatch && isPriceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-high") {
      return Number(a.price || 0) - Number(b.price || 0);
    }

    if (sortBy === "high-low") {
      return Number(b.price || 0) - Number(a.price || 0);
    }

    return Number(b.reviews || 0) - Number(a.reviews || 0);
  });

  // Product detail page
  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen pb-16 font-sans">
      {/* Top Banner */}
      <div className="relative w-full h-44 sm:h-60 bg-stone-900 overflow-hidden flex items-center justify-center text-center px-4">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
          alt="Category Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto text-white space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {selectedCategory}
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm">
            Explore premium collection in {selectedCategory.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filters */}
          <aside className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-6">
            {/* Primary Category */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Filter size={15} />
                Primary Category
              </h3>

              <ul className="space-y-1">
                {categoriesData.map((cat) => {
                  const isActive = selectedCategory === cat.name;

                  return (
                    <li key={cat._id || cat.name}>
                      <button
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${isActive
                            ? "bg-[#FAF3EA] text-[#966F33] border border-[#EEDFCD] shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        <span>{cat.name}</span>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-[#966F33]" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Subcategories */}
            {currentCategoryObj && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <Layers size={15} />
                  Sub-Categories
                </h3>

                <div className="flex flex-wrap lg:flex-col gap-1.5">
                  {(currentCategoryObj.subCategories || ["All"]).map(
                    (subCat) => (
                      <button
                        key={subCat}
                        onClick={() => setSelectedSubCategory(subCat)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${selectedSubCategory === subCat
                            ? "bg-stone-900 text-amber-200 font-bold shadow-sm"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                      >
                        {subCat}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Price Range
              </h3>

              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 cursor-pointer hover:text-gray-900 font-medium"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === range.id}
                      onChange={() => setSelectedPriceRange(range.id)}
                      className="w-4 h-4 text-[#966F33] focus:ring-[#966F33] border-gray-300"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Products */}
          <main className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  {selectedCategory}
                  {selectedSubCategory !== "All" && (
                    <span className="text-[#966F33] font-bold">
                      {" "}• {selectedSubCategory}
                    </span>
                  )}
                </h2>

                <p className="text-xs text-gray-400 font-medium">
                  Showing {sortedProducts.length} items
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <span>Sort by:</span>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#FAF9F6] border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-gray-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="popular">Popularity</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-bold text-sm">
                  Loading products...
                </p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {sortedProducts.map((item) => {
                  const productCategoryId = getCategoryId(
                    item.category || item.categoryId
                  );

                  const categoryName =
                    allCategories.find(
                      (category) =>
                        String(category._id) === productCategoryId
                    )?.name ||
                    getCategoryName(item.category || item.categoryId);

                  const productImage = Array.isArray(item.images)
                    ? item.images[0]
                    : item.image;

                  const price = Number(item.price || 0);
                  const originalPrice = Number(item.originalPrice || 0);

                  const discount =
                    originalPrice > price && originalPrice > 0
                      ? Math.round(
                        ((originalPrice - price) / originalPrice) * 100
                      )
                      : 0;

                  const productId = getProductId(item);

                  const isWishlisted = wishlist.some(
                    (wishlistItem) =>
                      getProductId(wishlistItem) === productId
                  );

                  const isUpdating = Boolean(wishlistUpdating[productId]);

                  return (
                    <div
                      key={productId || item.name}
                      onClick={() => setSelectedProduct(item)}
                      className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                    >
                      {/* Image and Discount */}
                      <div className="relative w-full h-52 bg-[#FAF9F6] rounded-2xl overflow-hidden flex items-center justify-center p-3">
                        <img
                          src={
                            productImage ||
                            "https://placehold.co/600x600/png?text=Product"
                          }
                          alt={item.name || "Product"}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />

                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-1.5 rounded-lg shadow-sm">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="pt-3 pb-1 px-1 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          {categoryName}
                        </span>

                        {/* Name and Wishlist */}
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#966F33] transition-colors truncate flex-1">
                            {item.name}
                          </h3>

                          <button
                            type="button"
                            disabled={isUpdating || wishlistLoading}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(item);
                            }}
                            aria-label={
                              isWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                            title={
                              isWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                            className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${isWishlisted
                                ? "bg-red-50 border-red-200 text-red-500"
                                : "bg-white border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                              } ${isUpdating || wishlistLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                              }`}
                          >
                            <Heart
                              size={18}
                              fill={isWishlisted ? "currentColor" : "none"}
                            />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <p className="text-sm font-extrabold text-gray-900">
                            ₹{price.toLocaleString("en-IN")}
                          </p>

                          {discount > 0 && (
                            <p className="text-xs text-gray-400 line-through">
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 pt-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                size={12}
                                fill="currentColor"
                              />
                            ))}
                          </div>

                          <span className="text-[11px] font-semibold text-gray-400 ml-1">
                            {Number(item.rating || 0)} (
                            {Number(item.reviews || 0)})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-2">
                <p className="text-gray-500 font-bold text-sm">
                  Selected filter / sub-category me koi products nahi mile.
                </p>

                <button
                  onClick={() => {
                    setSelectedSubCategory("All");
                    setSelectedPriceRange("all");
                  }}
                  className="text-xs font-bold text-[#966F33] underline hover:text-black pt-2"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
