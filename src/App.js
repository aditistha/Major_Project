import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainDash from './pages/Admin/MainDash/MainDash';
import Dashboard from './pages/Admin/AdminDashboard/Dashboard';
import Employees from './pages/Admin/Employees/Employees';
import AdminRegister from './pages/Admin/AdminRegister/AdminRegister';
import AdminMenu from './pages/Admin/AdminMenu/AdminMenu';
import Category from './pages/Admin/Category/Category';
import Orders from './pages/Admin/Orders/Orders';
import Inventory from './pages/Admin/Inventory/Inventory';
import Feedback from './pages/Admin/Feedback/Feedback';
import Payment from './pages/Admin/Payment/Payment';
import Suppliers_payment from './pages/Admin/Suppliers_payment/Suppliers_payment';
import Admin_profile from './pages/Admin/Admin_profile/Admin_profile';
import Suppliers from './pages/Admin/Suppliers/Suppliers';
import Permission from './pages/Admin/Permission/Permission';
import AdminRole from './pages/Admin/AdminRole/AdminRole';
import AdminLogin from './pages/Admin/AdminLogin/AdminLogin';

// kitchen route
import KitchenDash from './pages/Kitchen/KitchenDash/KitchenDash';
import KitchenDashboard from './pages/Kitchen/KitchenDashboard/KitchenDashboard';
import KitchenLogin from './pages/Admin/AdminLogin/AdminLogin';
import Kitchen_profile from './pages/Kitchen/Kitchen_profile/Kitchen_profile';
import KitchenOrder from './pages/Kitchen/KitchenOrder/KitchenOrder';


import CashierDash from './pages/Cashier/CashierDash/CashierDash';
import CashierDashboard from './pages/Cashier/CashierDashboard/CashierDashboard';
import CashierLogin from './pages/Cashier/CashierLogin/CashierLogin';
import Cashier_profile from './pages/Cashier/Cashier_profile/Cashier_profile';
import CashierOrder from './pages/Cashier/CashierOrder/CashierOrder';

import Menu from './pages/User/Menu/Menu';
import useToken from './components/Token/useToken';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
  const { token, setToken } = useToken();
  // const [token, setToken] = useState(false);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Menu />} />
          {!getToken() && <Route path="/admin/Maindash" element={<AdminLogin/>} />}
          {getToken() && (
            <Route path="/admin" element={<Dashboard />}>
              <Route path="Maindash" element={<MainDash />} />
              <Route path="Employees" element={<Employees />} />
              <Route path="AdminRegister" element={<AdminRegister />} />
              <Route path="AdminMenu" element={<AdminMenu />} />
              <Route path="Orders" element={<Orders />} />
              <Route path="Inventory" element={<Inventory />} />
              <Route path="Feedback" element={<Feedback />} />
              <Route path="Payment" element={<Payment />} />
              <Route path="Suppliers_payment" element={<Suppliers_payment />} />
              <Route path="Admin_profile" element={<Admin_profile />} />
              <Route path="Suppliers" element={<Suppliers />} />
              <Route path="Category" element={<Category />} />
              <Route path="Permission" element={<Permission />} />
              <Route path="AdminRole" element={<AdminRole />} />
            </Route>
           )} 
          
          {/* )} */}
          

          {/* kitchen route */}

         {!getToken() && <Route path="/Kitchen/Kitchendash" element={<KitchenLogin/>} />}
          {getToken() && (
            <Route path="/Kitchen" element={<KitchenDashboard/>}>
              <Route path="kitchendash" element={<KitchenDash />} />
              <Route path="Kitchen_profile" element={<Kitchen_profile />} />
              <Route path="KitchenOrder" element={<KitchenOrder />} />
            </Route>
          )}

               {/* Cashier route */}
          {!getToken() && <Route path="/Cashier/Cashierdash" element={<CashierLogin />} />}
          {getToken() && (
            <Route path="/Cashier" element={<CashierDashboard />}>
              <Route path="Cashierdash" element={<CashierDash />} />
              <Route path="Cashier_profile" element={<Cashier_profile />} />
              <Route path="CashierOrder" element={<CashierOrder />} />
            </Route>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;



