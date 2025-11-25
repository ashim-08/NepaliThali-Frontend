import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            My <span className="gradient-text">Orders</span>
          </h1>
          <p className="text-lg text-gray-600">
            Track your order history and current deliveries
          </p>
        </div>

        {message && (
          <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{message}</span>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Orders Yet
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start ordering some delicious Nepali food!
            </p>
            <a
              href="/menu"
              className="inline-flex items-center gradient-primary text-white px-8 py-3 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300"
            >
              Browse Menu
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-lg font-bold gradient-text">
                        रू {order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items List */}
                    <div className="lg:col-span-2">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4"
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

                    {/* Delivery Info */}
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
                        <p className="font-medium">
                          📞 {order.deliveryAddress.phone}
                        </p>
                      </div>

                      {order.notes && (
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold text-gray-900 mb-1">
                            Special Instructions
                          </h5>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium text-gray-900">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Timeline */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      Order Status
                    </h4>
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {[
                        "Pending",
                        "Confirmed",
                        "Preparing",
                        "Out for Delivery",
                        "Delivered",
                      ].map((status, index) => {
                        const isCompleted =
                          [
                            "Pending",
                            "Confirmed",
                            "Preparing",
                            "Out for Delivery",
                            "Delivered",
                          ].indexOf(order.status) >= index;
                        const isCurrent = order.status === status;

                        return (
                          <div
                            key={status}
                            className="flex items-center space-x-2 min-w-max"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? isCurrent
                                    ? "bg-orange-500 text-white"
                                    : "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {isCompleted && !isCurrent ? (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <span className="text-xs font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isCompleted
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {status}
                            </span>
                            {index < 4 && (
                              <div
                                className={`w-8 h-0.5 ${
                                  [
                                    "Pending",
                                    "Confirmed",
                                    "Preparing",
                                    "Out for Delivery",
                                    "Delivered",
                                  ].indexOf(order.status) > index
                                    ? "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
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

export default Orders;
