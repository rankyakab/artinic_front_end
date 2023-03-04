import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// auth

// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';



//
import {
  Page404,
  Dashboard,
  Staff,

  LoginPage,
 
} from './elements';
import NewStaff from '../pages/dash/Staff/NewStaff';
import CreateMemo from '../pages/dash/memo/CreateMemo';
import Role from '../pages/dash/Roles/Roles';
import Process from '../pages/dash/Processes/Process';
import Action from '../pages/dash/Action/Action';
import Privileges from '../pages/dash/Privilege/Privileges';
import EditStaff from '../pages/dash/Staff/EditStaff';


// ----------------------------------------------------------------------

export default function Router() {
  const userRole = JSON.parse(localStorage.getItem('user'))?.user?.role;

  // const roles = JSON.parse(localStorage.getItem('roles'));\

  const { roles } = useSelector((state) => state.role);

  console.log(roles);

  const filterRoles = roles.filter((role) => userRole === role?._id);
  //  path : '/', element:<RequireAuth />,

  console.log(filterRoles);
  return useRoutes([
    {
      path : '/', element: <DashboardLayout /> ,
      children: [
        {  path: '/',element: <Dashboard /> , index: true},
         {  path: '/dashboard',element: <Dashboard /> },
          
                      { path: '/staff', element: <Staff /> },
                      { path: '/new-staff', element: <NewStaff /> },
                      { path: '/edit-staff/:id', element: <EditStaff /> },
                      { path: '/create-memo', element: <CreateMemo /> },
       
                      { path: '/roles', element: <Role /> },
                      { path: '/process', element: <Process /> },
                      { path: '/action', element: <Action /> },
                      { path: '/privileges', element: <Privileges /> },
                  
          
      ],
    },
    { path: 'login', element: <LoginPage/> },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
   
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
