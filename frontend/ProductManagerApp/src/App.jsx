import "./App.css";
import { BrowserRouter ,createBrowserRouter,RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";

const router = createBrowserRouter([
  {path : "/dashboard" , element :<Home/>},
  {path : "/" , element :<SignUp/>},
  {path : "/login" , element :<Login/>},
])


function App() {
  return (
    <RouterProvider router={router}>
     
    </RouterProvider>
  );
}

export default App;
