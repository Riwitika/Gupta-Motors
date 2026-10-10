import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Bikes } from './pages/public/Bikes';
import { Offers } from './pages/public/Offers';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { ServiceBooking } from './pages/public/ServiceBooking';
import { SparePartsEnquiry } from './pages/public/SparePartsEnquiry';

// Auth Page
import { EmployeeLogin } from './pages/auth/EmployeeLogin';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { SalesCRM } from './pages/admin/SalesCRM';
import { ServiceCentre } from './pages/admin/ServiceCentre';
import { Inventory } from './pages/admin/Inventory';
import { POSBilling } from './pages/admin/POSBilling';
import { Reports } from './pages/admin/Reports';
import { EmployeeManagement } from './pages/admin/EmployeeManagement';

// 404
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/bikes" element={<Bikes />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service-booking" element={<ServiceBooking />} />
        <Route path="/spare-parts" element={<SparePartsEnquiry />} />
        <Route path="/login" element={<EmployeeLogin />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Internal ERP & Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="sales-crm" element={<SalesCRM />} />
        <Route path="service-centre" element={<ServiceCentre />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="pos-billing" element={<POSBilling />} />
        <Route path="reports" element={<Reports />} />
        <Route path="employees" element={<EmployeeManagement />} />
      </Route>
    </Routes>
  );
};

export default App;
