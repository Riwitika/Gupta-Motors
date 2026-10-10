/**
 * Gupta Motors — Core Business Information & Dealership Profile
 * Strictly verified details only.
 */

export const DEALERSHIP_INFO = {
  name: 'Gupta Motors',
  owner: 'Vishal Gupta',
  tagline: 'Bajaj Motorcycle Sales, Servicing & Genuine Spare-Parts Retail',
  brandPartner: 'Bajaj Auto',
  address: {
    line1: 'G.T. Road, Kurawali',
    city: 'Mainpuri',
    state: 'Uttar Pradesh',
    pincode: '205265',
    full: 'G.T. Road, Kurawali, Mainpuri, Uttar Pradesh — 205265',
  },
  contact: {
    phone: '9410043111',
    displayPhone: '+91 94100 43111',
    phoneHref: 'tel:9410043111',
    whatsAppHref: 'https://wa.me/919410043111',
  },
  maps: {
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Gupta+Motors+G.T.+Road+Kurawali+Mainpuri+Uttar+Pradesh',
  },
} as const;

export const PUBLIC_NAV_LINKS = [
  { key: 'home', path: '/' },
  { key: 'bikes', path: '/bikes' },
  { key: 'offers', path: '/offers' },
  { key: 'service', path: '/service-booking' },
  { key: 'spares', path: '/spare-parts' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
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
