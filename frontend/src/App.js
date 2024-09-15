import User from "./getUser/User";
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AddUser from "./addUser/AddUser";
import Update from "./updateUser/Update";

function App() {
  const route = createBrowserRouter([
    {
      path:"/",
      element:<User />,
    },
    {
      path:"/add",
      element:<AddUser />,
    },
    {
      path: "/update/:slug",
      element: <Update />,
    },    
  ]);
  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
