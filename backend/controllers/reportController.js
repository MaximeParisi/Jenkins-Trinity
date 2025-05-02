const Report = require("../models/Report");
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

exports.generateReport = async (req, res) => {
  try {
    const { types, userId } = req.params;
    let reportData;

    if (types === "sales") {
      reportData = await generateSalesReport();
    } else if (types === "performance") {
      reportData = await generatePerformanceReport();
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }

    const newReport = new Report({
      type: types,
      data: reportData,
      generatedBy: userId,
    });

    await newReport.save();

    res.status(200).json(newReport);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};

async function generateSalesReport() {
  const today = new Date();
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );

  const salesData = await Invoice.aggregate([
    { $match: { date: { $gte: lastMonth } } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        numberOfInvoices: { $sum: 1 },
        averageOrderValue: { $avg: "$totalAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalSales: 1,
        numberOfInvoices: 1,
        averageOrderValue: 1,
      },
    },
  ]);

  const topSellingProducts = await Invoice.aggregate([
    { $match: { date: { $gte: lastMonth } } },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.name",
        totalQuantity: { $sum: "$products.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 },
  ]);

  return {
    period: `${lastMonth.toISOString()} to ${today.toISOString()}`,
    salesSummary: salesData[0],
    topSellingProducts,
  };
}

async function generatePerformanceReport() {
  const lowStockThreshold = 10; // Définissez votre seuil de stock bas

  const lowStockProducts = await Product.find({
    availableQuantity: { $lte: lowStockThreshold },
  })
    .select("name availableQuantity")
    .sort("availableQuantity");

  const productPerformance = await Invoice.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.name",
        totalSold: { $sum: "$products.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 },
  ]);

  const categorySales = await Invoice.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.name",
        foreignField: "name",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$productInfo.category",
        totalSales: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
      },
    },
    { $sort: { totalSales: -1 } },
  ]);

  return {
    lowStockProducts,
    topPerformingProducts: productPerformance,
    categorySalesBreakdown: categorySales,
  };
}
