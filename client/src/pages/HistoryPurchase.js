import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';

const PurchaseHistory = () => {
  const [search, setSearch] = useState('');

  const mockHistory = [
    {
      id: 1,
      date: '2025-01-01',
      total: 45.75,
      items: [
        { name: 'Organic Apple', quantity: 3, price: 1.5 },
        { name: 'Whole Milk', quantity: 2, price: 0.99 },
        { name: 'Brown Bread', quantity: 1, price: 2.5 }
      ],
      status: 'Paid'
    },
    {
      id: 2,
      date: '2025-01-05',
      total: 25.99,
      items: [
        { name: 'Cheddar Cheese', quantity: 1, price: 3.99 },
        { name: 'Tomato Sauce', quantity: 2, price: 2.5 },
        { name: 'Granola Bar', quantity: 4, price: 1.99 }
      ],
      status: 'Pending'
    }
  ];

  const handleDownloadReceipt = (transaction) => {
    const receipt = `Receipt\n\nTransaction ID: ${transaction.id}\nDate: ${transaction.date}\nTotal: $${transaction.total}\nStatus: ${transaction.status}\n\nItems:\n${transaction.items
      .map(
        (item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n')}\n\nThank you for your purchase!`;

    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `receipt_${transaction.id}.txt`);
  };

  const filteredHistory = mockHistory.filter(
    (transaction) =>
      transaction.date.includes(search) ||
      transaction.total.toString().includes(search) ||
      transaction.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2>Purchase History</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by date, total, or status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxLength="50"

        />
      </div>

      {filteredHistory.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Details</th>
                <th>Download Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>${transaction.total.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${transaction.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
                        }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <ul>
                      {transaction.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x{item.quantity} - ${item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDownloadReceipt(transaction)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
