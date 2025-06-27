// EditProfileModalContent.jsx (formerly EditProfile.jsx)
import React, { useState, useEffect, useContext } from 'react';
import { AppContent } from '../context/AppContext'; // Ensure this path is correct
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion'; // For button animations

// Add button hover/tap variants for consistency
const buttonHoverTap = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

// Receive onClose and onUpdateSuccess as props
const EditProfileModalContent = ({ onClose, onUpdateSuccess }) => {
  const { userData, setUserData } = useContext(AppContent); // Also get setUserData to update local context
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    gender: '',
    dob: '',
    location: '',
    // profilePic will store the File object if selected, or the URL string if not changed
    profilePic: '',
    previewPic: '', // For displaying local image preview
    social: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    bankAccount: {
      account_name: '',
      account_number: '',
      bank_code: '',
    },
  });

  // Populate form with existing user data when userData changes
  useEffect(() => {
    if (userData) {
      setForm((prev) => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        gender: userData.gender || '',
        // Ensure dob is formatted correctly for input type="date"
        dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
        location: userData.location || '',
        profilePic: userData.image || '', // Assuming 'image' is the URL from backend
        previewPic: userData.image || '', // Set preview to current image initially
        social: userData.social || { facebook: '', twitter: '', instagram: '', linkedin: '' },
        bankAccount: userData.bankAccount || { account_name: '', account_number: '', bank_code: '' },
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      social: { ...prev.social, [name]: value },
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      bankAccount: { ...prev.bankAccount, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, previewPic: reader.result })); // For displaying preview
      };
      reader.readAsDataURL(file);
      setForm((prev) => ({ ...prev, profilePic: file })); // Store the File object
    } else {
      // If no file is selected, revert to original profile pic or clear preview
      setForm((prev) => ({
        ...prev,
        profilePic: userData.image || '', // Revert to original URL if no new file
        previewPic: userData.image || '',
      }));
    }
  };

  const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); // base64 string
    reader.onerror = (error) => reject(error);
  });


const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password && form.password !== form.confirmPassword) {
    return toast.error("Passwords do not match!");
  }

  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("email", form.email);
  if (form.password) formData.append("password", form.password);
  formData.append("bio", form.bio);
  formData.append("role", form.role || "");
  // Append nested social fields
  Object.entries(form.social).forEach(([key, val]) => formData.append(`social[${key}]`, val));
  // Append nested bankAccount fields
  Object.entries(form.bankAccount).forEach(([key, val]) => formData.append(`bankAccount[${key}]`, val));

  if (form.profilePic instanceof File) {
    formData.append("imageUrl", form.profilePic);
  }

  try {
    const response = await axios.put(
      `http://localhost:5000/Event-Easy/users/update-user/${userData._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success("Profile updated successfully!");
    setUserData(response.data.user);
    onUpdateSuccess();
    onClose();
  } catch (err) {
    console.error("Profile update failed:", err);
    toast.error(err.response?.data?.message || "Update failed!");
  }
};


  return (
    // Removed the outer div with styling, as the modal will provide it
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800 dark:text-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input fields with consistent styling */}
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password (leave blank to keep current)"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm New Password"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input type="text" name="gender" value={form.gender} onChange={handleChange} placeholder="Gender"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input type="date" name="dob" value={form.dob} onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Location"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio/About Me"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out col-span-1 md:col-span-2 min-h-[80px]" />
      </div>

      {/* Profile Picture Upload */}
      <div>
        <label htmlFor="profilePicUpload" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
        <input id="profilePicUpload" type="file" accept="image/*" onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100 cursor-pointer" />
        {form.previewPic && (
          <img src={form.previewPic} alt="Preview" className="w-24 h-24 mt-4 rounded-full object-cover shadow-lg border border-gray-200 dark:border-gray-700" />
        )}
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 col-span-full">Social Links</label>
        <input name="facebook" value={form.social.facebook} onChange={handleSocialChange} placeholder="Facebook URL"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input name="twitter" value={form.social.twitter} onChange={handleSocialChange} placeholder="Twitter URL"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input name="instagram" value={form.social.instagram} onChange={handleSocialChange} placeholder="Instagram URL"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input name="linkedin" value={form.social.linkedin} onChange={handleSocialChange} placeholder="LinkedIn URL"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
      </div>

      {/* Bank Account */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 col-span-full">Bank Account Details</label>
        <input name="account_name" value={form.bankAccount.account_name} onChange={handleBankChange} placeholder="Account Name"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input name="account_number" value={form.bankAccount.account_number} onChange={handleBankChange} placeholder="Account Number"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
        <input name="bank_code" value={form.bankAccount.bank_code} onChange={handleBankChange} placeholder="Bank Code"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out" />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <motion.button type="button" {...buttonHoverTap} onClick={onClose}
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
          Cancel
        </motion.button>
        <motion.button type="submit" {...buttonHoverTap}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">
          Save Changes
        </motion.button>
      </div>
    </form>
  );
};

export default EditProfileModalContent; // Changed the export name