import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  addCategory,
  deleteCategorydata,
  getCategorydata,
  getParentCategorydata,
  updateCategorydata,
} from "../../api/api";

const AdminCategories = () => {
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryType, setCategoryType] = useState("parent");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    name: "",
    image: null,
    parentCategory: "",
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const [categoryResponse, parentResponse] = await Promise.all([
        getCategorydata(),
        getParentCategorydata(),
      ]);

      const categoryList = Array.isArray(categoryResponse)
        ? categoryResponse
        : categoryResponse?.categories ||
          categoryResponse?.data ||
          [];

      const parentList = Array.isArray(parentResponse)
        ? parentResponse
        : parentResponse?.categories ||
          parentResponse?.data ||
          [];

      setCategories(categoryList);
      setParentCategories(parentList);
    } catch (error) {
      console.error("Fetch categories error:", error);
      setMessage({
        type: "error",
        text: "Categories load nahi ho paayi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      image: null,
      parentCategory: "",
    });

    setPreview("");
    setEditingCategory(null);
    setCategoryType("parent");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please JPG, PNG ya WEBP image select karo.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image ka size 5 MB se kam hona chahiye.",
      });

      event.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
    setMessage({ type: "", text: "" });
  };

  const handleRemoveImage = () => {
    setForm((previous) => ({
      ...previous,
      image: null,
    }));

    setPreview(editingCategory?.image || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      image: null,
      parentCategory:
        typeof category.parentCategory === "object"
          ? category.parentCategory?._id || ""
          : category.parentCategory || "",
    });

    setCategoryType(category.parentCategory ? "child" : "parent");
    setPreview(category.image || "");
    setShowModal(true);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Category name enter karo.",
      });
      return;
    }

    if (categoryType === "child" && !form.parentCategory) {
      setMessage({
        type: "error",
        text: "Parent category select karo.",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const submissionData = {
        name: form.name.trim(),
        image: form.image,
        parentCategory:
          categoryType === "child" ? form.parentCategory : null,
      };

      if (editingCategory) {
        await updateCategorydata(editingCategory._id, submissionData);
      } else {
        await addCategory(submissionData);
      }

      setMessage({
        type: "success",
        text: editingCategory
          ? "Category successfully update ho gayi."
          : "Category successfully add ho gayi.",
      });

      closeModal();
      await fetchCategories();
    } catch (error) {
      console.error("Save category error:", error);

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Category save nahi ho paayi.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Kya tum sach mein is category ko delete karna chahte ho?"
    );

    if (!confirmed) return;

    try {
      await deleteCategorydata(categoryId);

      setMessage({
        type: "success",
        text: "Category delete ho gayi.",
      });

      await fetchCategories();
    } catch (error) {
      console.error("Delete category error:", error);

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Category delete nahi ho paayi.",
      });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getParentName = (category) => {
    if (!category.parentCategory) return "Main Category";

    if (typeof category.parentCategory === "object") {
      return category.parentCategory.name || "Subcategory";
    }

    const parent = categories.find(
      (item) => item._id === category.parentCategory
    );

    return parent?.name || "Subcategory";
  };

  const isChildCategory = (category) => Boolean(category.parentCategory);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <FolderOpen size={17} />
              Store Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your store categories and their images.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            <Plus size={19} />
            Add Category
          </button>
        </div>

        {/* Notification */}
        {message.text && (
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
            )}
            <span>{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              className="ml-auto"
              aria-label="Close message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Categories</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {categories.length}
                </p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FolderOpen size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Main Categories</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {categories.filter((item) => !item.parentCategory).length}
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <ImageIcon size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Subcategories</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {categories.filter((item) => item.parentCategory).length}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <LayersIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Search and refresh */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <button
            type="button"
            onClick={fetchCategories}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Category Cards */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-indigo-600"
              />
              <p className="mt-3 text-sm text-slate-500">
                Loading categories...
              </p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <FolderOpen size={40} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No categories found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Add a category or try another search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60"
              >
                {/* Image frame */}
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name || "Category"}
                      loading="lazy"
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <ImageIcon size={48} strokeWidth={1.3} />
                      <span className="text-xs font-medium">
                        No image available
                      </span>
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
                    {isChildCategory(category)
                      ? "Subcategory"
                      : "Main Category"}
                  </span>

                  <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-indigo-600 hover:text-white"
                      aria-label="Edit category"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      className="rounded-lg border border-slate-200 bg-white p-2.5 text-rose-500 shadow-sm transition hover:bg-rose-500 hover:text-white"
                      aria-label="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card details */}
                <div className="p-5">
                  <h3 className="truncate text-lg font-bold text-slate-900">
                    {category.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="truncate text-sm text-slate-500">
                      {getParentName(category)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-400">
                      Category ID
                    </span>
                    <span className="max-w-32 truncate rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-slate-500">
                      {category._id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !saving) {
                closeModal();
              }
            }}
          >
            <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingCategory ? "Edit Category" : "Create Category"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add category details and upload an image.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close modal"
                >
                  <X size={21} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 md:grid-cols-2">
                  {/* Left: Image preview */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-800">
                        Category Image
                      </label>
                      <span className="text-xs text-slate-400">
                        Optional
                      </span>
                    </div>

                    <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4">
                      {preview ? (
                        <>
                          <img
                            src={preview}
                            alt="Category preview"
                            className="h-full w-full object-contain"
                          />

                          <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                            Image Preview
                          </span>

                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute right-3 top-3 rounded-full bg-white p-2 text-rose-500 shadow-md transition hover:bg-rose-50"
                            aria-label="Remove selected image"
                          >
                            <X size={17} />
                          </button>
                        </>
                      ) : (
                        <div className="px-4 text-center">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm ring-1 ring-slate-100">
                            <ImageIcon size={31} strokeWidth={1.5} />
                          </div>

                          <p className="mt-4 text-sm font-semibold text-slate-700">
                            Image preview
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Your selected image will appear here
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Tip: Product/category images with a clean background
                      usually look better. Use a clear JPG, PNG or WEBP file.
                    </p>
                  </div>

                  {/* Right: Form */}
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Category Name
                      </label>

                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            name: event.target.value,
                          }))
                        }
                        placeholder="e.g. Men, Women, Sneakers"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Category Type
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryType("parent");
                            setForm((previous) => ({
                              ...previous,
                              parentCategory: "",
                            }));
                          }}
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            categoryType === "parent"
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Main Category
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategoryType("child")}
                          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                            categoryType === "child"
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          Subcategory
                        </button>
                      </div>
                    </div>

                    {categoryType === "child" && (
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Parent Category
                        </label>

                        <select
                          value={form.parentCategory}
                          onChange={(event) =>
                            setForm((previous) => ({
                              ...previous,
                              parentCategory: event.target.value,
                            }))
                          }
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        >
                          <option value="">Select parent category</option>

                          {parentCategories
                            .filter(
                              (item) =>
                                !item.parentCategory &&
                                item._id !== editingCategory?._id
                            )
                            .map((parent) => (
                              <option key={parent._id} value={parent._id}>
                                {parent.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Upload Image
                      </label>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm transition group-hover:scale-105">
                          <Upload size={22} />
                        </span>

                        <span className="mt-3 text-sm font-semibold text-slate-700">
                          Choose an image
                        </span>

                        <span className="mt-1 text-xs text-slate-400">
                          JPG, PNG or WEBP · Max 5 MB
                        </span>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      {form.image && (
                        <div className="mt-3 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
                            <ImageIcon size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-700">
                              {form.image.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(form.image.size / 1024).toFixed(1)} KB
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-rose-500"
                            aria-label="Remove image"
                          >
                            <X size={17} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        {editingCategory ? "Update Category" : "Save Category"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LayersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </svg>
);

export default AdminCategories;