import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Products";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { 
          _id: "$products.productId", 
          totalSold: { $sum: "$products.quantity" } 
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $project: { _id: 0, name: "$product.title", totalSold: 1 } }
    ]);

    res.status(200).json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get top products" });
  }
}
