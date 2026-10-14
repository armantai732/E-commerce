import React, { useEffect, useState } from 'react';
import {
    Plus,
    Edit3,
    Trash2,
    X,
    Upload,
    Image as ImageIcon,
} from 'lucide-react';
import { addCategory, deleteCategorydata, getCategorydata, getParentCategorydata, updateCategorydata } from '../../api/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form, setform] = useState({
        name: '',
        image: null,
    });

    const [preview, setPreview] = useState('');

    const fetchCategory = async () => {
        try {
            const res = await getParentCategorydata();
            setCategories(res.data);
        } catch (error) {
            console.log('Error:', error.message);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setform((prev) => ({
                ...prev,
                image: file,
            }));

            setPreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Please enter category name");
            return;
        }

        // New category ke liye image required hai
        if (!editingCategory && !form.image) {
            alert("Please upload category image");
            return;
        }

        try {
            let res;

            if (editingCategory) {
                // Update existing category
                res = await updateCategorydata(editingCategory._id, form);
            } else {
                // Create new category
                res = await addCategory(form);
            }

            if (res.status) {
                alert(res.message);

                closeForm();
                fetchCategory();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.log(error.message);
            alert("Something went wrong");
        }
    };


    const closeForm = () => {
        setShowForm(false);

        setEditingCategory(null);

        setform({
            name: '',
            image: null,
        });

        setPreview('');
    };

    const handleEdit = (cat) => {
        setEditingCategory(cat);

        setform({
            name: cat.name,
            image: null,
        });

        setPreview(cat.image || '');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            const isConfirmed = window.confirm("Are you sure you want to delete this category?");

            if (!isConfirmed) return;

            const res = await deleteCategorydata(id);

            if (res.status) {
                alert(res.message);
                fetchCategory(); // Category list refresh karo
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.log(error.message);
            alert("Failed to delete category");
        }
    };


    return (
        <div className="space-y-6 font-sans">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                        Categories Management
                    </h1>

                    <p className="text-xs sm:text-sm text-stone-400 font-medium mt-0.5">
                        Organize main product categories and sub-categories.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="bg-stone-900 hover:bg-black text-amber-200 text-xs font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md uppercase tracking-wider transition-all self-start sm:self-auto"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {/* Add Category Form */}
            {showForm && (
                <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-black text-stone-900">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h2>
                            <p className="text-sm text-stone-400 mt-1">
                                Enter category details below.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closeForm}
                            className="p-2 rounded-xl text-stone-500 hover:bg-stone-100"
                            aria-label="Close form"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">
                                Category Name
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Men, Women, Electronics"
                                value={form.name}
                                onChange={(e) =>
                                    setform((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="w-full border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-100"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">
                                Category Image
                            </label>

                            <label className="flex flex-col items-center justify-center w-full min-h-44 border-2 border-dashed border-stone-300 rounded-2xl cursor-pointer hover:border-stone-500 hover:bg-stone-50 transition p-5">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Category preview"
                                        className="w-40 h-32 object-cover rounded-xl"
                                    />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3">
                                            <Upload size={22} className="text-stone-600" />
                                        </div>

                                        <span className="text-sm font-bold text-stone-700">
                                            Click to upload image
                                        </span>

                                        <span className="text-xs text-stone-400 mt-1">
                                            PNG, JPG or WEBP
                                        </span>
                                    </>
                                )}

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {form.image && (
                                <p className="text-xs text-stone-500 mt-2">
                                    Selected: {form.image.name}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl bg-stone-900 text-amber-200 font-bold hover:bg-black flex items-center justify-center gap-2"
                            >
                                {editingCategory ? (
                                    <Edit3 size={16} />
                                ) : (
                                    <Plus size={16} />
                                )}

                                {editingCategory ? "Update Category" : "Create Category"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Parent Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] space-y-4 relative overflow-hidden group"
                    >
                        <div className="w-full h-36 bg-[#FAF9F6] rounded-2xl overflow-hidden border border-stone-100 flex items-center justify-center p-2">
                            {cat.image ? (
                                <img
                                    src={cat.image}
                                    alt={cat.name || 'Category'}
                                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <ImageIcon size={36} className="text-stone-300" />
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-stone-900">
                                {cat.name}
                            </h3>

                            <p className="text-xs text-stone-400 font-medium">
                                {cat.subCount ?? 0} Sub-categories • {cat.itemCount ?? 0} Items
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-bold text-stone-500">
                            <button
                                type="button"
                                onClick={() => handleEdit(cat)}
                                className="hover:text-[#966F33] transition-colors flex items-center gap-1"
                            >
                                <Edit3 size={14} /> Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(cat._id)}
                                className="hover:text-rose-600 transition-colors flex items-center gap-1"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AdminCategories;