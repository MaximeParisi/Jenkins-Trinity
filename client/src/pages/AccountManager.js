import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useCallback, useEffect, useState } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import InvoiceList from "./Invoice";

const URL = process.env.REACT_APP_SERVER_URL
axios.defaults.withCredentials = true;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const AccountManager = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const handleSetRole = async (id, role) => {
    try {
      await axios.put(
        `${URL}/api/users/role/${id}`,
        { roles: role },
      );
      await getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = useCallback(async () => {
    try {

      const response = await axios.get(`${URL}/api/users`, {
        withCredentials: true // 👈 ça c’est la clé !
      });
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const roleDistributionData = {
    labels: ['User', 'Admin'],
    datasets: [
      {
        label: 'Role Distribution',
        data: [
          users?.filter((user) => user.roles.some((role) => role.name === 'user'))?.length || 0,
          users?.filter((user) => user.roles.some((role) => role.name === 'admin'))?.length || 0,
        ],
        backgroundColor: ['#4CAF50', '#FF5722'],
        hoverOffset: 4,
      },
    ],
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${URL}/api/users/${userId}`, {
      });
      await getAllUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesName = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "" || user.roles.some(role => role.name === filterRole);
    return matchesName && matchesRole;
  }) || [];

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-primary">Account Manager</h2>

      <div className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select me-2"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {filteredUsers.map((user) => (
        <div key={user._id} className="card mb-3 shadow-sm border-0">
          <div className="card-body row align-items-center">
            <div className="col-md-4">
              <h5 className="mb-1 text-secondary">
                {user.firstName} {user.lastName}
              </h5>
              <p className="mb-1">
                <strong>Phone:</strong> {user.phoneNumber}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            <div className="col-md-3">
              <p className="mb-1">
                <strong>Role:</strong> {user.roles.map((role) => role.name).join(", ")}
              </p>
            </div>
            <div className="col-md-5 text-end">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => handleSetRole(user._id, "user")}
              >
                Set to User
              </button>
              <button
                className="btn btn-outline-success me-2"
                onClick={() => handleSetRole(user._id, "admin")}
              >
                Set to Admin
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-5">
        <h4 className="text-primary">Analytics</h4>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body" style={{ maxHeight: '360px' }}>
                <h5 className="text-secondary">Role Distribution</h5>
                <Pie
                  style={{ maxHeight: '300px' }}
                  data={roleDistributionData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Role Distribution Overview',
                        font: {
                          size: 18
                        }
                      },
                      legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 14
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="text-secondary">Detailed Role Analysis</h5>
                <Bar
                  data={roleDistributionData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Detailed Role Analysis',
                        font: {
                          size: 18
                        }
                      },
                      legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 14
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Roles',
                          font: {
                            size: 14
                          }
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Users',
                          font: {
                            size: 14
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <InvoiceList />
    </div>
  );
};

export default AccountManager;
