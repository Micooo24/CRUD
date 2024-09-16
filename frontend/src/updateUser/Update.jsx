import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Update = () => {
  const users = {
    name: "",
    email: "",
    address: "",
    image: [], // Single 'image' field for multiple images
  };

  const { slug } = useParams();
  const [user, setUser] = useState(users);
  const [newImages, setNewImages] = useState([]); // Store selected images
  const navigate = useNavigate();

  // Handle input change for form fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle multiple image file selection
  const imageHandler = (e) => {
    setNewImages([...e.target.files]); // Store all selected images in an array
  };

  useEffect(() => {
    // Fetch the user data including the images by slug
    axios
      .get(`http://localhost:4000/api/users/${slug}`)
      .then((response) => {
        setUser(response.data.user); // Set user data including the images
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("address", user.address);

    // Append each selected image to the formData
    newImages.forEach((file) => {
      formData.append("image", file); // Use 'image' key for multiple files
    });

    await axios
      .put(`http://localhost:4000/api/users/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("User updated successfully", { position: "top-right" });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="addUser">
      <Link to="/" type="button" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Update User</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            value={user.name}
            onChange={inputHandler}
            id="name"
            name="name"
            autoComplete="off"
            placeholder="Enter your Name"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={inputHandler}
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            value={user.address}
            onChange={inputHandler}
            id="address"
            name="address"
            autoComplete="off"
            placeholder="Enter your Address"
          />
        </div>

        <div className="inputGroup">
          <label>Current Images:</label>
          {user.image && user.image.length > 0 ? (
            user.image.map((image, index) => (
              <img
                key={index}
                src={image} // Display each current image
                alt="user"
                style={{ width: "100px", height: "100px", margin: "10px" }}
              />
            ))
          ) : (
            <p>No images uploaded</p>
          )}
        </div>

        <div className="inputGroup">
          <label htmlFor="images">Upload New Images:</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={imageHandler}
            multiple // Allow multiple file selection
            accept="image/*" // Accept only image files
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

export default Update;
