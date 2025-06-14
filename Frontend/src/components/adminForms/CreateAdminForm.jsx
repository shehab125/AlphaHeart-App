import React from 'react';
import { object, string } from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useAuthCall from '../../hooks/useAuthCall'; // Import the hook

export const createAdminSchema = object().shape({
  username: string()
    .required("Username is required"),
  email: string().email().required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .max(20, "Maximum 20 characters")
    .matches(/\d+/, "Minimum 1 digit")
    .matches(/[a-z]/, "Minimum 1 lowercase letter")
    .matches(/[A-Z]/, "Minimum 1 uppercase letter")
    .matches(/[!,?{}><%&$#£+-.]+/, "Minimum 1 special character"),
});

const CreateAdminForm = () => {
  const { createAdmin } = useAuthCall(); // Get the createAdmin function from the hook

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createAdminSchema),
  });

  const onSubmit = (data) => {
    console.log("Admin data to be sent:", data);
    createAdmin(data); // Call createAdmin with form data
  };

  return (
    <div className='create-admin-form'>
      <h2>Create New Admin Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username:</label>
          <input type="text" {...register('username')} />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register('password')} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdminForm; 