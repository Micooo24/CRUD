import React, { useState } from 'react';
import "./adduser.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";

const AddUser = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [imageFiles, setImageFiles] = useState([]);  // State for storing multiple image files
  const navigate = useNavigate();

  // Handle input changes for text fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle image file selection
  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);  // Store the selected image files
  };

  // Submit form to the server
  const submitForm = async (e) => {
    e.preventDefault();

    // Create a FormData object to send both user data and image files
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('address', user.address);

    // Append each selected image to the FormData object
    imageFiles.forEach((file, index) => {
      formData.append('image', file);  // multer expects 'image' as the key for the array of images
    });

    try {
      const response = await axios.post("http://localhost:4000/api/users", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Required for file uploads
        },
      });

      toast.success(response.data.message, { position: "top-right" });
      navigate("/");
    } catch (error) {
      // Handle error response from the server
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage, { position: "top-right" });
      console.error('Error uploading data:', errorMessage);
    }
  };

  return (
    <div className="addUser">
      <h3>Add New User</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            onChange={inputHandler}
            name="name"
            autoComplete="off"
            placeholder="Enter your Name"
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            onChange={inputHandler}
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            onChange={inputHandler}
            name="address"
            autoComplete="off"
            placeholder="Enter your Address"
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="image">Images:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={imageHandler} 
            multiple  // Allow multiple file selection
            accept="image/*"  // Restrict file types to images only
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary mt-4 p-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
