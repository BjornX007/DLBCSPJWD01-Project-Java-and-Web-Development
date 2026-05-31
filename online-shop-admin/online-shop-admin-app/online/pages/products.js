import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/get-products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen  text-gray-900 p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Products</h1>
          <Link
            href="/products/new"
            className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition"
          >
            + Add New Product
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-700">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg p-4 shadow-lg flex flex-col"
              >
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-40 w-full object-contain rounded mb-3 bg-white"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {product.description}
                </p>
                <p className="text-blue-600 font-bold mb-2">€{product.price}</p>

                <div className="mt-auto flex gap-2">
                 <Link
  href={`/products/edit/${product._id}`}
  className="flex-1 bg-yellow-500 text-white text-sm text-center p-2 rounded hover:bg-yellow-600 flex items-center justify-center gap-1"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
  Edit
</Link>
                 <button
  onClick={async () => {
    const confirmed = confirm("Are you sure you want to delete this?");
    if (confirmed) {
      try {
        await axios.delete(`/api/delete-product?id=${product._id}`);
        setProducts((prev) =>
          prev.filter((item) => item._id !== product._id)
        );
      } catch (err) {
        console.error("❌ Failed to delete product:", err);
      }
    }
  }}
  className="flex-1 bg-red-500 text-white text-sm p-2 rounded hover:bg-red-600 flex items-center justify-center"
  aria-label="Delete product"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg> 
   Delete
</button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
