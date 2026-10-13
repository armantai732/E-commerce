import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { getCategorydata } from "../api/api";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // Fetch parent categories
  const getdata = async () => {
    try {
      const res = await getCategorydata();

      const categories = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : [];

      // Sirf parent categories filter hongi
      const parentCategories = categories.filter((cat) => !cat.parentCategory);
      setData(parentCategories);
    } catch (error) {
      console.error("Categories fetch failed:", error.message);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const hasMore = visibleCount < data.length;

  // View More
  const handleLoadMore = () => {
    setIsCollapsing(false);
    setVisibleCount((prevCount) => Math.min(prevCount + 5, data.length));
  };

  // Show Less with smooth scroll
  const handleShowLess = () => {
    setIsCollapsing(true);

    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      setVisibleCount(5);
      setIsCollapsing(false);
    }, 350);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAF9F6] py-16 px-6 md:px-12 font-sans scroll-mt-6"
    >
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200/80 pb-6 gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#966F33] flex items-center gap-1.5">
              <Sparkles size={13} /> Curated Collections
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">
              Explore our wide variety of premium handpicked categories
            </p>
          </div>

          <span className="bg-[#FAF3EA] border border-[#EEDFCD] text-[#966F33] text-xs font-bold px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-sm">
            {Math.min(visibleCount, data.length)} / {data.length} Categories
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6">
          {data.slice(0, visibleCount).map((cat, index) => {
            const isRowEnd = (index + 1) % 5 === 0;

            return (
              <div
                key={cat._id}
                onClick={() =>
                  navigate("/product", {
                    state: {
                      categoryId: cat._id,
                      categoryName: cat.name,
                    },
                  })
                }
                style={{
                  animation: "categoryFadeIn 450ms ease both",
                  animationDelay: `${(index % 5) * 60}ms`,
                }}
                className={`flex flex-col items-center text-center px-3 py-4 rounded-3xl bg-white border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group cursor-pointer ${
                  !isRowEnd ? "lg:border-r lg:border-stone-200/80" : ""
                }`}
              >
                {/* Circular Image Container with Golden Ring Glow */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-[#FAF9F6] mb-4 flex items-center justify-center border-2 border-stone-100 group-hover:border-[#966F33] transition-all duration-300 shadow-sm relative p-2 group-hover:scale-105">
                  <img
                    src={cat.image || "https://placehold.co/400x400/png?text=Category"}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center rounded-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Category Name */}
                <h3 className="text-sm md:text-base font-extrabold text-stone-900 group-hover:text-[#966F33] transition-colors truncate w-full px-2">
                  {cat.name}
                </h3>

                {/* Shop Now Action */}
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#966F33] mt-2 group-hover:text-stone-900 transition-colors">
                  <span>Explore</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* View More / Show Less Action Buttons */}
        <div className="pt-6 text-center border-t border-stone-200/80">
          {hasMore ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isCollapsing}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-amber-200 font-extrabold px-8 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95 disabled:opacity-60"
            >
              <span>View More Categories</span>
              <ChevronDown size={18} />
            </button>
          ) : (
            data.length > 5 && (
              <button
                type="button"
                onClick={handleShowLess}
                disabled={isCollapsing}
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 font-extrabold px-8 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-60"
              >
                <span>
                  {isCollapsing ? "Please wait..." : "Show Less"}
                </span>
                <ChevronUp size={18} />
              </button>
            )
          )}
        </div>

      </div>
    </section>
  );
};

export default Categories;