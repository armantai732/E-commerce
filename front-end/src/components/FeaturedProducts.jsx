import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Sparkles, ShoppingBag, Heart } from 'lucide-react';

const allProducts = [
  // Slot 1 (Initial 4 Products)
  {
    id: 1,
    name: 'Nike Air Force 1 "Special Edition"',
    price: '₹ 6,099',
    rating: 4.8,
    reviews: '120',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Casio Edifice Vintage Watch',
    price: '₹ 4,999',
    rating: 4.6,
    reviews: '85',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Minimalist Urban Backpack',
    price: '₹ 2,499',
    rating: 4.7,
    reviews: '98',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Sony Wireless Headphones',
    price: '₹ 3,999',
    rating: 4.9,
    reviews: '210',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
  },

  // Slot 2
  {
    id: 5,
    name: 'Adidas Ultraboost Sneakers',
    price: '₹ 8,999',
    rating: 4.7,
    reviews: '150',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Fossil Chronograph Watch',
    price: '₹ 9,499',
    rating: 4.8,
    reviews: '112',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'Leather Travel Duffle Bag',
    price: '₹ 3,299',
    rating: 4.5,
    reviews: '76',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'Pro Noise Cancelling Earbuds',
    price: '₹ 2,999',
    rating: 4.6,
    reviews: '180',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
  },

  // Slot 3
  {
    id: 9,
    name: 'Classic Aviator Sunglasses',
    price: '₹ 1,899',
    rating: 4.4,
    reviews: '64',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 10,
    name: 'Genuine Leather Belt',
    price: '₹ 1,299',
    rating: 4.5,
    reviews: '92',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop',
  },
];

const FeaturedProducts = () => {
  const [visibleCount, setVisibleCount] = useState(4);

  const hasMore = visibleCount < allProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prevCount) =>
      Math.min(prevCount + 4, allProducts.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(4);
  };

  return (
    <section className="w-full bg-[#FAF9F6] py-16 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200/80 pb-6 gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#966F33] flex items-center gap-1.5">
              <Sparkles size={13} /> Trending Now
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-medium">
              Handpicked bestsellers chosen for their quality and timeless design
            </p>
          </div>

          <span className="bg-[#FAF3EA] border border-[#EEDFCD] text-[#966F33] text-xs font-bold px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-sm">
            {Math.min(visibleCount, allProducts.length)} / {allProducts.length} Products
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.slice(0, visibleCount).map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl p-4 border border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="relative w-full h-64 bg-[#FAF9F6] rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-stone-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />

                {/* Quick Wishlist Button Overlay */}
                <button
                  type="button"
                  aria-label="Wishlist"
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                >
                  <Heart size={16} />
                </button>
              </div>

              {/* Product Details */}
              <div className="pt-4 pb-1 px-1 space-y-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-[#966F33] transition-colors truncate">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-base font-black text-stone-900">
                    {product.price}
                  </p>

                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-[11px] font-bold text-stone-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  className="w-full mt-2 bg-[#FAF3EA] hover:bg-stone-900 text-[#966F33] hover:text-amber-200 border border-[#EEDFCD] hover:border-stone-900 font-extrabold py-3 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag size={14} /> Quick View
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* View More / Show Less Button */}
        <div className="pt-6 text-center border-t border-stone-200/80">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-amber-200 font-extrabold px-8 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95"
            >
              <span>View More Products</span>
              <ChevronDown size={18} />
            </button>
          ) : (
            allProducts.length > 4 && (
              <button
                onClick={handleShowLess}
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 font-extrabold px-8 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-sm active:scale-95"
              >
                <span>Show Less</span>
                <ChevronUp size={18} />
              </button>
            )
          )}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;