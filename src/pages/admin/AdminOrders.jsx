import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminOrders = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Preparing":
        return "bg-purple-100 text-purple-800";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Manage <span className="gradient-text">Orders</span>
          </h1>
          <p className="text-lg text-gray-600">
            View and manage customer orders
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                filter === "all"
                  ? "gradient-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Orders ({orders.length})
            </button>
            {statusOptions.map((status) => {
              const count = orders.filter(
                (order) => order.status === status
              ).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                    filter === status
                      ? "gradient-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No orders found for the selected filter.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-2 lg:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)} •{" "}
                        {order.user?.name || "Unknown User"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-orange-500 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <span className="text-lg font-bold gradient-text">
                        रू {order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl"
                          >
                            <img
                              src={
                                item.product?.image ||
                                "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                              }
                              alt={item.product?.name || "Product"}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {item.product?.name || "Product"}
                              </h5>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × रू {item.price}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              रू {(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Delivery Info */}
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Customer Info
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Name:</strong>{" "}
                            {order.user?.name || "Unknown"}
                          </p>
                          <p>
                            <strong>Email:</strong> {order.user?.email || "N/A"}
                          </p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {order.user?.phone || order.deliveryAddress.phone}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Delivery Address
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.deliveryAddress.street}</p>
                          <p>
                            {order.deliveryAddress.city},{" "}
                            {order.deliveryAddress.state}
                          </p>
                          <p>{order.deliveryAddress.zipCode}</p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {order.deliveryAddress.phone}
                          </p>
                        </div>
                      </div>

                      {/* Special Instructions */}
                      {order.notes && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3">
                            Special Instructions
                          </h4>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}

                      {/* Payment Info */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                          Payment
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>
                            <strong>Method:</strong> {order.paymentMethod}
                          </p>
                          <p>
                            <strong>Total:</strong> रू{" "}
                            {order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
