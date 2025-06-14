import React from 'react';
import CreateAdminForm from '../../components/adminForms/CreateAdminForm';

const CreateAdminPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Admin Account</h1>
      <CreateAdminForm />
    </div>
  );
};

export default CreateAdminPage; 