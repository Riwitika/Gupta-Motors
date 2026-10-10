/**
 * Gupta Motors — Core Business Information & Dealership Profile
 */

export const DEALERSHIP_INFO = {
  name: 'Gupta Motors',
  owner: 'Vishal Gupta',
  tagline: 'Authorized Motorcycle Sales, Genuine Spares & Master Service Centre',
  address: {
    line1: 'G.T. Road, Kurawali',
    city: 'Mainpuri',
    state: 'Uttar Pradesh',
    pincode: '205265',
    full: 'G.T. Road, Kurawali, Mainpuri, Uttar Pradesh',
  },
  contact: {
    phone: '9410043111',
    displayPhone: '+91 94100 43111',
    phoneHref: 'tel:9410043111',
  },
  operatingHours: {
    days: 'Monday to Sunday',
    timing: '9:00 AM – 7:30 PM',
  },
  establishedYear: '2008',
} as const;

export const PUBLIC_NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Motorcycles', path: '/bikes' },
  { name: 'Special Offers', path: '/offers' },
  { name: 'Book Service', path: '/service-booking' },
  { name: 'Spare Parts', path: '/spare-parts' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
] as const;

export const ADMIN_NAV_LINKS = [
  { name: 'Executive Overview', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { name: 'Sales CRM & Leads', path: '/admin/sales-crm', icon: 'Users' },
  { name: 'Service Centre', path: '/admin/service-centre', icon: 'Wrench' },
  { name: 'Vehicle & Spares Inventory', path: '/admin/inventory', icon: 'Boxes' },
  { name: 'POS & Invoicing', path: '/admin/pos-billing', icon: 'Receipt' },
  { name: 'Business Reports', path: '/admin/reports', icon: 'BarChart3' },
  { name: 'Staff Management', path: '/admin/employees', icon: 'ShieldCheck' },
] as const;
