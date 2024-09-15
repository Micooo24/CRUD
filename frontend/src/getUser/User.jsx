import React, { useEffect, useState } from "react";
import "./user.css";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const User = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:4000/api/users/all");
            setUsers(response.data.users);
          } catch (error) {
            console.log("Error while fetching data", error);
          }
        };
        fetchData();
      }, []);

    const deleteUser = async (userSlug) => {
    await axios
        .delete(`http://localhost:4000/api/users/${userSlug}`) 
        .then((response) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.slug !== userSlug)); 
        toast.success(response.data.message, { position: "top-right" });
        })
        .catch((error) => {
        console.log(error);
        });
    };

    return (
        <div className="userTable">
            <Link to="/add" type="button" className="btn btn-primary">
                Add User
            </Link>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">S.No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Actions</th>
                        <th scope="col">Images</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index)=>{
                        return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.address}</td>
                              <td className="actionButtons">
                                <Link to={`/update/`+user.slug} type="button" class="btn btn-info">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </Link>
                                <button onClick={() => deleteUser(user.slug)} type="button"className="btn btn-danger">
                                <i className="fa-solid fa-trash"></i>
                                </button>
                              </td>
                              <td>
                                  {Array.isArray(user.image) ? (
                                    user.image.map((image, index) => (
                                      <img
                                        key={index}
                                        src={image}  // Use the Cloudinary URL directly
                                        alt={`User ${index + 1}`}  // Alt text for accessibility
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }} // Styling for the image
                                      />
                                    ))
                                  ) : (
                                    // If user has only one image, display it
                                    <img
                                      src={user.image}
                                      alt="User"
                                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                  )}
                                </td>

                            </tr>
                          );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default User;

