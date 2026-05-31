// Products Page (Admin Panel)
// ---------------------------------------------------------------------
// This page retrieves all products from the backend, groups them
// by category, and displays them in a responsive product grid.
// Admin users can:
//  • Create new products
//  • Edit existing products
//  • Delete products (with confirmation modal)
//  • View real-time sale price activation
//
// The UI is designed for efficient product management and
// automatic visual feedback when sales are active.
// ---------------------------------------------------------------------

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import axios from "axios";
import ConfirmModal from "@/components/ConfirmModal";

export default function Products() {
  // Stores all products retrieved from database
  const [products, setProducts] = useState([]);

  // Indicates whether data is still loading
  const [loading, setLoading] = useState(true);

  // Controls delete confirmation modal visibility
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Holds product currently selected for deletion
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ---------------------------------------------------------------------
  // Fetch products once on component mount.
  // useEffect prevents repeated requests and improves performance.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/get-products");
        setProducts(res.data.products || []); // Safe fallback
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ---------------------------------------------------------------------
  // Helper function:
  // Groups products by category to create visually structured sections.
  // Also supports legacy category field formats.
  // ---------------------------------------------------------------------
  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      const category = item.category?.name || item.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  };

  const grouped = groupByCategory(products);

  // ---------------------------------------------------------------------
  // Determines whether a product is currently in an active sale period.
  // This allows automatic price switching without backend recalculation.
  // ---------------------------------------------------------------------
  const isOnSale = (product) => {
    const now = new Date();
    return (
      product.salePrice &&
      product.saleStart &&
      product.saleEnd &&
      new Date(product.saleStart) <= now &&
      now <= new Date(product.saleEnd)
    );
  };

  return (
    <Layout>
      <div className="min-h-screen text-gray-900 p-4 sm:p-6">

        {/* Page title + add-product button */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Products
          </h1>

          {/* Navigation to new-product creation form */}
          <Link
            href="/products/new"
            className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm sm:text-base hover:bg-blue-700 transition whitespace-nowrap"
          >
            + Add New Product
          </Link>
        </div>

        {/* Loading + Empty State Conditions */}
        {loading ? (
          <p className="text-gray-700">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (

          // -----------------------------------------------------------------
          // Render each category as a grouped section
          // Improves product organization and admin usability
          // -----------------------------------------------------------------
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-10">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-blue-800">
                {category}
              </h2>

              {/* Responsive product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {items.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg p-4 shadow-lg flex flex-col"
                  >

                    {/* Product Image with fallback placeholder */}
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title || "Product Image"}
                        className="h-40 w-full object-contain rounded mb-3 bg-white"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/fallback.png";
                        }}
                      />
                    ) : (
                      <div className="h-40 w-full bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                    {/* Product basic info */}
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                      {product.title}
                    </h2>

                    {/* Truncated preview description */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {product.description}
                    </p>

                    {/* Dynamic pricing display */}
                    <p className="font-bold mb-2">
                      {isOnSale(product) ? (
                        <>
                          {/* Sale price visually emphasized */}
                          <span className="text-red-600">
                            €{parseFloat(product.salePrice).toFixed(2)}
                          </span>

                          {/* Original price visually faded */}
                          <span className="line-through text-gray-500 text-sm ml-2">
                            €{parseFloat(product.price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-blue-600">
                          €{parseFloat(product.price).toFixed(2)}
                        </span>
                      )}
                    </p>

                    {/* Action Buttons (Edit + Delete) */}
                    <div className="mt-auto flex flex-col sm:flex-row gap-2">

                      {/* Navigate to product editing page */}
                      <Link
                        href={`/products/edit/${product._id}`}
                        className="flex-1 bg-yellow-500 text-white text-sm text-center p-2 rounded hover:bg-yellow-600 flex items-center justify-center gap-1"
                      >
                        Edit
                      </Link>

                      {/* Delete button opens confirmation modal */}
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setConfirmOpen(true);
                        }}
                        className="flex-1 bg-red-500 text-white text-sm p-2 rounded hover:bg-red-600 flex items-center justify-center gap-1"
                        aria-label="Delete product"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* -----------------------------------------------------------------
          Delete Confirmation Modal
          Prevents accidental data removal
         ----------------------------------------------------------------- */}
      <ConfirmModal
        show={confirmOpen}
        message={`Are you sure you want to delete "${selectedProduct?.title}"?`}
        onConfirm={async () => {
          try {
            await axios.delete(`/api/delete-product?id=${selectedProduct._id}`);

            // Remove deleted product instantly from UI
            setProducts((prev) =>
              prev.filter(
                (item) => String(item._id) !== String(selectedProduct._id)
              )
            );

            setConfirmOpen(false);
            setSelectedProduct(null);
          } catch (err) {
            console.error("❌ Failed to delete product:", err);
          }
        }}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedProduct(null);
        }}
      />
    </Layout>
  );
}
