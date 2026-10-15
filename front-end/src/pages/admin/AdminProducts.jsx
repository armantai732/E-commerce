
import React, { useEffect, useRef, useState } from "react";
import { Plus, Edit3, Trash2, X, UploadCloud } from "lucide-react";
import Select from "react-select";
import {
  getProductdata,
  getParentCategorydata,
  getCategorydata,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/api";

const sizeOptions = [
  "S", "M", "L", "XL", "XXL", "XXXL",
  "28", "30", "32", "34", "36", "38", "40",
].map((size) => ({ value: size, label: size }));

const colourOptions = [
  "Black", "White", "Blue", "Navy Blue", "Sky Blue",
  "Grey", "Charcoal", "Red", "Maroon", "Pink", "Green",
  "Yellow", "Beige", "Purple", "Brown",
].map((colour) => ({ value: colour, label: colour }));

const initialForm = {
  name: "",
  brand: "",
  price: "",
  old: "",
  costPrice: "",
  parentCategory: "",
  category: "",
  description: "",
  sizes: [],
  sizeColourStock: {},
};

const inputClass =
  "w-full rounded-2xl border border-stone-200 p-3.5 text-xs font-semibold bg-[#FAF9F6] outline-none transition focus:border-stone-900";

const labelClass =
  "mb-1.5 block text-xs font-extrabold text-stone-700";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [parents, setParents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const fileRef = useRef(null);

  // Extract data from API responses
  const extractArray = (response) => {
    const data =
      response?.data?.data ??
      response?.data ??
      response?.products ??
      response;

    return Array.isArray(data) ? data : [];
  };

  // Fetch products and categories
  const fetchData = async () => {
    try {
      const [productRes, parentRes, categoryRes] = await Promise.all([
        getProductdata(),
        getParentCategorydata(),
        getCategorydata(),
      ]);

      setProducts(extractArray(productRes));
      setParents(extractArray(parentRes));
      setCategories(extractArray(categoryRes));
    } catch (error) {
      console.error("Fetch data error:", error);
      alert(error.message || "Failed to load products or categories");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search products
  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query)
    );
  });

  // Handle normal input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle parent category
  const handleParentChange = (e) => {
    setForm((prev) => ({
      ...prev,
      parentCategory: e.target.value,
      category: "",
    }));
  };

  // Filter child categories by selected parent
  const childCategories = categories.filter((category) => {
    const parentId =
      category.parentCategory?._id ||
      category.parentCategory?.id ||
      category.parentCategory;

    return String(parentId || "") === String(form.parentCategory || "");
  });

  // Handle size selection
  const handleSizeChange = (selected) => {
    const sizes = selected ? selected.map((item) => item.value) : [];

    setForm((prev) => {
      const stock = {};

      sizes.forEach((size) => {
        stock[size] = prev.sizeColourStock[size] || {
          colours: [],
          quantities: {},
        };
      });

      return {
        ...prev,
        sizes,
        sizeColourStock: stock,
      };
    });
  };

  // Handle colour selection
  const handleColourChange = (size, selected) => {
    const colours = selected ? selected.map((item) => item.value) : [];

    setForm((prev) => {
      const oldData = prev.sizeColourStock[size] || {
        colours: [],
        quantities: {},
      };

      const quantities = {};

      colours.forEach((colour) => {
        quantities[colour] = oldData.quantities?.[colour] ?? "";
      });

      return {
        ...prev,
        sizeColourStock: {
          ...prev.sizeColourStock,
          [size]: {
            colours,
            quantities,
          },
        },
      };
    });
  };

  // Handle quantity change
  const handleQuantityChange = (size, colour, quantity) => {
    setForm((prev) => ({
      ...prev,
      sizeColourStock: {
        ...prev.sizeColourStock,
        [size]: {
          ...prev.sizeColourStock[size],
          quantities: {
            ...prev.sizeColourStock[size]?.quantities,
            [colour]: quantity,
          },
        },
      },
    }));
  };

  // Select new product images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== files.length) {
      alert("Please select image files only.");
    }

    const availableSlots = Math.max(0, 5 - images.length);
    const selectedFiles = validFiles.slice(0, availableSlots);

    if (selectedFiles.length < validFiles.length) {
      alert("You can select up to 5 new images.");
    }

    setImages((prev) => [...prev, ...selectedFiles]);
    setPreview((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };

  // Remove newly selected image
  const removeImage = (index) => {
    const url = preview[index];

    if (url) URL.revokeObjectURL(url);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset form and release preview URLs
  const resetForm = () => {
    preview.forEach((url) => URL.revokeObjectURL(url));

    setForm({ ...initialForm });
    setImages([]);
    setPreview([]);
    setExistingImages([]);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // Open Add Product modal
  const openAddModal = () => {
    if (loading) return;

    resetForm();
    setEditingId(null);
    setModal(true);
  };

  // Edit Product: populate all saved data

  const handleEdit = async (product) => {
    if (loading) return;

    try {
      // If the list response has no sizeStock, fetch the full product.
      let fullProduct = product;

      const hasStockData =
        Array.isArray(product.sizeStock) &&
        product.sizeStock.length > 0;

      if (!hasStockData) {
        console.warn(
          "sizeStock missing in product list response:",
          product._id
        );

        // Check whether getProductById/getSingleProduct exists in your API.
        // If available, fetch the full product here.
        // Example:
        // const response = await getSingleProduct(product._id);
        // fullProduct = response?.data?.data ?? response?.data ?? response;
      }

      const categoryId =
        fullProduct.category?._id ||
        fullProduct.category?.id ||
        fullProduct.category ||
        "";

      const selectedCategory = categories.find(
        (category) =>
          String(category._id || category.id) === String(categoryId)
      );

      const parentId =
        selectedCategory?.parentCategory?._id ||
        selectedCategory?.parentCategory?.id ||
        selectedCategory?.parentCategory ||
        "";

      // Existing images
      const productImages = Array.isArray(fullProduct.images)
        ? fullProduct.images
        : Array.isArray(fullProduct.image)
          ? fullProduct.image
          : fullProduct.image
            ? [fullProduct.image]
            : [];

      setExistingImages(productImages);

      // Existing size, colour and quantity data
      const stockData = Array.isArray(fullProduct.sizeStock)
        ? fullProduct.sizeStock
        : [];

      const sizes = [];
      const sizeColourStock = {};

      stockData.forEach((sizeItem) => {
        if (!sizeItem?.size) return;

        const size = String(sizeItem.size);
        sizes.push(size);

        const colourStock = Array.isArray(sizeItem.colourStock)
          ? sizeItem.colourStock
          : [];

        const colours = [];
        const quantities = {};

        colourStock.forEach((item) => {
          if (!item?.colour) return;

          const colour = String(item.colour);
          colours.push(colour);
          quantities[colour] = item.quantity ?? 0;
        });

        sizeColourStock[size] = {
          colours,
          quantities,
        };
      });

      console.log("Product being edited:", fullProduct);
      console.log("Loaded sizes:", sizes);
      console.log("Loaded size/colour stock:", sizeColourStock);

      setForm({
        name: fullProduct.name || "",
        brand: fullProduct.brand || "",
        price: fullProduct.price ?? "",
        old: fullProduct.originalPrice ?? fullProduct.old ?? "",
        costPrice: fullProduct.costPrice ?? "",
        parentCategory: parentId,
        category: categoryId,
        description: fullProduct.description || "",
        sizes,
        sizeColourStock,
      });

      setImages([]);
      setPreview([]);
      setEditingId(fullProduct._id);
      setModal(true);
    } catch (error) {
      console.error("Failed to load product for editing:", error);
      alert("Product details load nahi ho paaye.");
    }
  };


  // Delete product
  const handleDelete = async (id) => {
    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error.message || "Failed to delete product");
    }
  };

  // Close modal
  const closeModal = () => {
    if (loading) return;

    setModal(false);
    setEditingId(null);
    resetForm();
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.brand.trim()) {
      alert("Please enter product name and brand.");
      return;
    }

    if (!form.category) {
      alert("Please select a sub-category.");
      return;
    }

    if (!form.sizes.length) {
      alert("Please select at least one size.");
      return;
    }

    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      alert("Please enter a valid selling price.");
      return;
    }

    for (const size of form.sizes) {
      const sizeData = form.sizeColourStock[size];

      if (!sizeData?.colours?.length) {
        alert(`Please select a colour for size ${size}.`);
        return;
      }

      for (const colour of sizeData.colours) {
        const quantity = sizeData.quantities?.[colour];

        if (
          quantity === "" ||
          quantity === undefined ||
          quantity === null ||
          !Number.isFinite(Number(quantity)) ||
          Number(quantity) < 0
        ) {
          alert(`Please enter a valid quantity for ${size} / ${colour}.`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", form.name.trim());
      data.append("brand", form.brand.trim());
      data.append("price", form.price);
      data.append("old", form.old || "");
      data.append("costPrice", form.costPrice || 0);
      data.append("category", form.category);
      data.append("description", form.description);

      const sizeStock = form.sizes.map((size) => ({
        size,
        colourStock: form.sizeColourStock[size].colours.map((colour) => ({
          colour,
          quantity: Number(form.sizeColourStock[size].quantities[colour]),
        })),
      }));

      data.append("sizeStock", JSON.stringify(sizeStock));

      images.forEach((image) => {
        data.append("image", image);
      });

      const response = editingId
        ? await updateProduct(editingId, data)
        : await addProduct(data);

      // API functions may return {status, data} or a direct result
      const result = response?.data ?? response;

      if (result?.status === false) {
        throw new Error(result.message || "Failed to save product.");
      }

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      setModal(false);
      setEditingId(null);
      resetForm();

      await fetchData();
    } catch (error) {
      console.error("Save product error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Stock badge
  const getStockBadge = (stock) => {
    if (stock > 10) {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          In Stock
        </span>
      );
    }

    if (stock > 0) {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Low Stock
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        Out of Stock
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Products Catalog
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 font-medium mt-1">
            Manage inventory, sizes, colours and pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-stone-900 hover:bg-black text-amber-200 text-xs font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md uppercase tracking-wider"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search product or brand..."
        className={inputClass}
      />

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider bg-[#FAF9F6]">
                <th className="p-5">Product</th>
                <th className="p-5">Brand</th>
                <th className="p-5">Category</th>
                <th className="p-5">Price</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-50">
              {filteredProducts.map((product) => {
                const image = Array.isArray(product.images)
                  ? product.images[0]
                  : Array.isArray(product.image)
                    ? product.image[0]
                    : product.image;

                return (
                  <tr key={product._id} className="hover:bg-[#FAF9F6]">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-stone-100 overflow-hidden p-1 shrink-0">
                          <img
                            src={image || "https://placehold.co/200x200/png?text=Item"}
                            alt={product.name || "Product"}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <span className="font-extrabold text-stone-900">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 text-stone-700">
                      {product.brand || "—"}
                    </td>

                    <td className="p-5 text-stone-600">
                      {product.category?.name || "General"}
                    </td>

                    <td className="p-5 font-extrabold text-stone-900">
                      ₹ {Number(product.price || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-5">
                      {getStockBadge(Number(product.stock) || 0)}
                    </td>

                    <td className="p-5">
                      <div className="flex justify-end gap-2 text-stone-400">
                        <button
                          type="button"
                          title="Edit product"
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:text-[#966F33] hover:bg-[#FAF3EA] rounded-xl"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete product"
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-stone-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#FAF9F6]">
              <div>
                <h3 className="text-lg font-black text-stone-900">
                  {editingId ? "Update Product" : "Add New Product"}
                </h3>

                <p className="text-xs text-stone-400 mt-1">
                  Edit product details, images, sizes and stock.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              {/* Product name */}
              <div>
                <label className={labelClass}>Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Classic Cotton Shirt"
                  required
                  className={inputClass}
                />
              </div>

              {/* Brand */}
              <div>
                <label className={labelClass}>Brand Name *</label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. ShopNest Luxe"
                  required
                  className={inputClass}
                />
              </div>

              {/* Parent category */}
              <div>
                <label className={labelClass}>Parent Category *</label>
                <select
                  name="parentCategory"
                  value={form.parentCategory}
                  onChange={handleParentChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select Parent Category</option>

                  {parents.map((parent) => (
                    <option
                      key={parent._id || parent.id}
                      value={parent._id || parent.id}
                    >
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Child category */}
              <div>
                <label className={labelClass}>Sub-Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  disabled={!form.parentCategory}
                  className={inputClass}
                >
                  <option value="">
                    {form.parentCategory
                      ? "Select Sub-Category"
                      : "Select Parent Category First"}
                  </option>

                  {childCategories.map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={labelClass}>Original Price</label>
                  <input
                    type="number"
                    name="old"
                    value={form.old}
                    onChange={handleChange}
                    min="0"
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={labelClass}>Cost Price</label>
                  <input
                    type="number"
                    name="costPrice"
                    value={form.costPrice}
                    onChange={handleChange}
                    min="0"
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className={labelClass}>Product Images</label>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-200 p-5 bg-[#FAF9F6]"
                >
                  <UploadCloud className="h-6 w-6 text-stone-400" />
                  <span className="text-xs font-bold text-stone-500">
                    Click to browse images
                  </span>
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {editingId && (
                  <p className="text-[11px] text-stone-400 mt-2">
                    Existing images are kept if you don't select new images.
                    Selecting new images replaces the existing images if your
                    backend update controller is configured that way.
                  </p>
                )}
              </div>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div>
                  <p className={labelClass}>Current Images</p>
                  <div className="flex flex-wrap gap-3">
                    {existingImages.map((image, index) => (
                      <div key={`${image}-${index}`}>
                        <img
                          src={image}
                          alt={`Current product ${index + 1}`}
                          className="h-16 w-16 rounded-xl border object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New image previews */}
              {preview.length > 0 && (
                <div>
                  <p className={labelClass}>New Images</p>
                  <div className="flex flex-wrap gap-3">
                    {preview.map((image, index) => (
                      <div key={image} className="relative">
                        <img
                          src={image}
                          alt={`New preview ${index + 1}`}
                          className="h-16 w-16 rounded-xl border object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-rose-600 text-white flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div>
                <label className={labelClass}>Available Sizes *</label>
                <Select
                  isMulti
                  options={sizeOptions}
                  value={sizeOptions.filter((item) =>
                    form.sizes.includes(item.value)
                  )}
                  onChange={handleSizeChange}
                  placeholder="Select Sizes..."
                />
              </div>

              {/* Colours and quantities */}
              {form.sizes.map((size) => {
                const stock = form.sizeColourStock[size] || {
                  colours: [],
                  quantities: {},
                };

                return (
                  <div
                    key={size}
                    className="rounded-2xl border border-stone-200 p-4 bg-[#FAF9F6] space-y-3"
                  >
                    <p className="text-xs font-black text-stone-900">
                      Size Variant:{" "}
                      <span className="text-[#966F33]">{size}</span>
                    </p>

                    <Select
                      isMulti
                      options={colourOptions}
                      value={colourOptions.filter((item) =>
                        stock.colours.includes(item.value)
                      )}
                      onChange={(selected) =>
                        handleColourChange(size, selected)
                      }
                      placeholder={`Select colours for ${size}`}
                    />

                    {stock.colours.map((colour) => (
                      <div
                        key={colour}
                        className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200"
                      >
                        <span className="flex-1 text-xs font-bold text-stone-800">
                          {colour}
                        </span>

                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Qty"
                          value={stock.quantities[colour] ?? ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              size,
                              colour,
                              e.target.value
                            )
                          }
                          className="w-24 rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-bold bg-[#FAF9F6]"
                        />
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Description */}
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-stone-900 hover:bg-black disabled:opacity-60 text-amber-200 text-xs font-extrabold px-6 py-3 rounded-xl shadow-md uppercase tracking-wider"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
