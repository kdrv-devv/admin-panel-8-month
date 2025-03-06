import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Orders from "../pages/dashboard/orders";
import Movies from "../pages/dashboard/movies";
import UsersData from "../pages/dashboard/users-data";


export const route = createBrowserRouter([
    {
        path:"/",
        element:<Dashboard/>,
        children:[
            {
                path:"/",
                element:<Orders/>
            },{
                path:"/movies",
                element:<Movies/>
            },
            {
                path:"/users",
                element:<UsersData/>
            }

        ]
    }
])