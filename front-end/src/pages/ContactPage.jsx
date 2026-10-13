import React, { useState } from 'react';
import { MapPin, Mail, Phone, Sparkles, Send, CheckCircle2, Clock } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setIsSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => {
      setIsSent(false);
    }, 6000);
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen pb-20 font-sans">
      
      {/* 1. Top Hero Banner */}
      <div className="relative w-full h-56 sm:h-72 bg-stone-900 overflow-hidden flex items-center justify-center text-center px-4">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
          alt="Contact Header Background"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-stone-900/80" />

        <div className="relative z-10 max-w-xl mx-auto text-white space-y-2.5">
          <span className="bg-[#FAF3EA]/20 border border-[#FAF3EA]/30 text-amber-200 text-[10px] sm:text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles size={12} /> Always Here For You
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Get In Touch
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
            Have a question or looking for bespoke assistance? Reach out to our concierge team.
          </p>
        </div>
      </div>

      {/* 2. Main Contact Grid Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-stone-200/80 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Contact Information */}
          <div className="md:col-span-5 space-y-8 md:pr-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#966F33]">
                Customer Concierge
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1">
                Reach Out Directly
              </h2>
              <p className="text-xs text-stone-400 font-medium mt-1">
                We aim to respond to all inquiries within 24 business hours.
              </p>
            </div>

            <div className="space-y-5">
              {/* Our Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33] shrink-0 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                    Boutique Address
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 font-bold leading-relaxed">
                    123, Green Park, Ahmedabad<br />
                    Gujarat, India - 382350
                  </p>
                </div>
              </div>

              {/* Email Us */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33] shrink-0 shadow-sm">
                  <Mail size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                    Email Support
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 font-bold">
                    support@shopnest.com
                  </p>
                </div>
              </div>

              {/* Call Us */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33] shrink-0 shadow-sm">
                  <Phone size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                    Phone Concierge
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 font-bold">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF3EA] border border-[#EEDFCD] flex items-center justify-center text-[#966F33] shrink-0 shadow-sm">
                  <Clock size={20} />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                    Working Hours
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 font-bold">
                    Mon - Sat: 9:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="#facebook"
                  className="w-9 h-9 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center hover:bg-black transition-all text-xs shadow-sm hover:scale-105"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#instagram"
                  className="w-9 h-9 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center hover:bg-black transition-all text-xs shadow-sm hover:scale-105"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#twitter"
                  className="w-9 h-9 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center hover:bg-black transition-all text-xs shadow-sm hover:scale-105"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#linkedin"
                  className="w-9 h-9 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center hover:bg-black transition-all text-xs shadow-sm hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="md:col-span-7 space-y-5 md:border-l md:border-stone-100 md:pl-10">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs text-stone-400 font-medium">
                Fill out the details below and we will get back to you promptly.
              </p>
            </div>

            {isSent && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold p-4 rounded-2xl flex items-center gap-2.5 shadow-sm">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Thank you! Your inquiry has been transmitted successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white transition-colors"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="How can we assist you?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white resize-none transition-colors"
                />
              </div>

              {/* Send Message Button */}
              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-4 rounded-2xl text-xs sm:text-sm tracking-widest uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                <span>Send Message</span>
                <Send size={15} />
              </button>
            </form>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ContactPage;