import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useCallback, useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const URL = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const fetchInvoices = useCallback(async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.minAmount) params.minAmount = filters.minAmount;
      if (filters.maxAmount) params.maxAmount = filters.maxAmount;

      const response = await axios.get(`${URL}/api/invoices`, { params });
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    fetchInvoices();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // const deleteInvoices = async (id) => {
  //   try {
  //     await axios.delete(`${URL}/api/invoices/${id}`);
  //   } catch (error) {
  //     console.error("Error deleting invoice:", error);
  //   }
  // };

  const totalOrders = invoices.length;
  const totalItems = invoices.reduce(
    (acc, invoice) => acc + invoice.itemsCount,
    0
  );
  const averageItemsPerOrder = totalOrders
    ? (totalItems / totalOrders).toFixed(2)
    : 0;

  const monthlyTurnover = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.date);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    acc[month] = (acc[month] || 0) + invoice.totalAmount;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyTurnover).sort();
  const turnoverValues = sortedMonths.map((month) => monthlyTurnover[month]);

  const pieData = {
    labels: ["Total Orders", "Average Items per Order"],
    datasets: [
      {
        data: [totalOrders, averageItemsPerOrder],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const lineData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Turnover per Month ($)",
        data: turnoverValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const averageBasket = () => {
    if (invoices.length !== 0) {
      let total = 0;
      let basketNumber = 0;
      for (let invoice in invoices) {
        console.log("invoice", invoice);
        total += Number(invoices[invoice].totalAmount);
        basketNumber++;
      }
      total = total / basketNumber;
      return (
        <div>
          <h2>Average basket</h2>
          <p>{total} $</p>
        </div>
      );
    }
  };

  const totalTurnover = () => {
    if (invoices.length !== 0) {
      let total = 0;
      for (let invoice in invoices) {
        console.log("invoice", invoice);
        total += Number(invoices[invoice].totalAmount);
      }
      return (
        <div>
          <h2>Total turnover</h2>
          <p>{total} $</p>
        </div>
      );
    }
  };
  const categoryCounts = invoices.reduce((acc, invoice) => {
    invoice.products.forEach((product) => {
      const category = product.category || "Unknown";
      acc[category] = (acc[category] || 0) + product.quantity;
    });
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoryCounts);
  const categoryValues = Object.values(categoryCounts);

  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Products Ordered by Category",
        data: categoryValues,
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-4">📅 Filtres avancés</h4>
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                placeholder="Date de début"
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                placeholder="Date de fin"
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="Montant minimum"
                min="0"
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="Montant maximum"
                min="0"
              />
            </div>
            <div className="col-md-12 text-end">
              <button className="btn btn-primary me-2" onClick={fetchInvoices}>
                🔍 Appliquer
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={resetFilters}
              >
                🗑️ Effacer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3>Orders & Items</h3>
              <Pie data={pieData} style={{ maxHeight: "300px" }} />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3>Turnover by Month</h3>
              <Line data={lineData} style={{ maxHeight: "300px" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h3>Most Ordered Product Categories</h3>
            <Bar
              data={barData}
              options={barOptions}
              style={{ maxHeight: "300px" }}
            />
          </div>
        </div>
      </div>

      {totalTurnover()}
      {averageBasket()}
    </div>
  );
};

export default InvoiceList;
