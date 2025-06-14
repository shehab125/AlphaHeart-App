import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useDataCall from '../../../../hooks/useDataCall';
import Loading from '../../../../pages/loading/Loading';
import './aManagement.css';

const AManagement = () => {
  const { getData, delData, putData } = useDataCall();
  const { admins } = useSelector((state) => state.data);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isActive: true
  });

  useEffect(() => {
    getData("admins");
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      await delData("admins", id);
      getData("admins");
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      isActive: admin.isActive
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await putData("admins", editingAdmin.id, formData);
    setEditingAdmin(null);
    getData("admins");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="a-management-container">
      <h2 className="text-2xl font-bold mb-6">Admin Management</h2>
      
      {editingAdmin && (
        <div className="edit-form mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Edit Admin</h3>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        {admins ? (
          <div className="grid gap-4">
            {admins.data?.map((admin) => (
              <div key={admin.id} className="admin-card bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {admin.firstName} {admin.lastName}
                    </h3>
                    <p className="text-gray-600">{admin.email}</p>
                    <p className="text-sm">
                      Status: {admin.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default AManagement; 