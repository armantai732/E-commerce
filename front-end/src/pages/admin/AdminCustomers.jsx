import React, { useEffect, useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Search,
  RefreshCw,
} from "lucide-react";

import { getAdminCustomers } from "../../api/api";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCustomers();

      setCustomers(
        Array.isArray(data.customers) ? data.customers : []
      );
    } catch (err) {
      console.error("Customers fetch error:", err);
      setError(err.message || "Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      String(customer.name || "").toLowerCase().includes(query) ||
      String(customer.email || "").toLowerCase().includes(query) ||
      String(customer.phone || "").toLowerCase().includes(query)
    );
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Registered Customers
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 font-medium mt-1">
            View customer accounts, orders and lifetime spending.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-500">
              Total Customers
            </p>
            <Users size={20} className="text-stone-500" />
          </div>

          <h2 className="mt-3 text-3xl font-black text-stone-900">
            {customers.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-500">
              Total Paid Orders
            </p>
            <ShoppingBag size={20} className="text-stone-500" />
          </div>

          <h2 className="mt-3 text-3xl font-black text-stone-900">
            {customers.reduce(
              (total, customer) =>
                total + Number(customer.orders || 0),
              0
            )}
          </h2>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-500">
              Total Customer Spending
            </p>
            <span className="text-lg font-black text-[#966F33]">₹</span>
          </div>

          <h2 className="mt-3 text-2xl font-black text-[#966F33]">
            {formatCurrency(
              customers.reduce(
                (total, customer) =>
                  total + Number(customer.spent || 0),
                0
              )
            )}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
        />

        <input
          type="text"
          placeholder="Search by customer name, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-stone-400"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchCustomers}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Customers Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="font-extrabold text-stone-900">
            Customer List
          </h2>

          <p className="mt-1 text-xs text-stone-400">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-stone-100 bg-[#FAF9F6] text-stone-400 uppercase tracking-wider">
                <th className="p-4 sm:p-5 font-bold">Customer</th>
                <th className="p-4 sm:p-5 font-bold">Contact</th>
                <th className="p-4 sm:p-5 font-bold">Orders</th>
                <th className="p-4 sm:p-5 font-bold">Total Spent</th>
                <th className="p-4 sm:p-5 font-bold">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-stone-400"
                  >
                    <RefreshCw
                      size={22}
                      className="mx-auto mb-3 animate-spin"
                    />
                    Loading customers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-stone-400"
                  >
                    Customer data could not be loaded.
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-stone-400"
                  >
                    <Users size={28} className="mx-auto mb-3" />
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-[#FAF9F6]"
                  >
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-xs font-black uppercase text-amber-200">
                          {String(customer.name || "C")
                            .charAt(0)}
                        </div>

                        <div>
                          <p className="font-extrabold text-stone-900">
                            {customer.name || "Unknown Customer"}
                          </p>
                          <p className="mt-1 text-[10px] text-stone-400">
                            ID: {String(customer.id).slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="space-y-2 p-4 text-stone-600 sm:p-5">
                      <div className="flex items-center gap-2">
                        <Mail
                          size={13}
                          className="shrink-0 text-stone-400"
                        />
                        <span>{customer.email || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-400">
                        <Phone size={13} className="shrink-0" />
                        <span>{customer.phone || "N/A"}</span>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-stone-900 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-2.5 py-1.5">
                        <ShoppingBag size={13} />
                        {customer.orders} orders
                      </span>
                    </td>

                    <td className="p-4 font-black text-[#966F33] sm:p-5">
                      {formatCurrency(customer.spent)}
                    </td>

                    <td className="p-4 text-stone-500 sm:p-5">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {formatDate(customer.joined)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;