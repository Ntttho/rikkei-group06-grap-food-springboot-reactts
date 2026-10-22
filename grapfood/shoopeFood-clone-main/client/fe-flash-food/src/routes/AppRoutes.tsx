import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { AuthLayout, MainLayout, DashboardLayout } from '@/layouts';
import { PageLoading } from '@/components/Loading';

// Lazy loading pages with Code-Splitting for speed
const LandingPage = lazy(() =>
  import('@/features/restaurant/components/landing/LandingPage').then((m) => ({
    default: m.LandingPage,
  }))
);

const CustomerLogin = lazy(() =>
  import('@/features/auth/components/CustomerAuthPages').then((m) => ({ default: m.CustomerLogin }))
);
const CustomerRegister = lazy(() =>
  import('@/features/auth/components/CustomerAuthPages').then((m) => ({
    default: m.CustomerRegister,
  }))
);
const ProfilePage = lazy(() =>
  import('@/features/auth/components/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const MerchantLogin = lazy(() =>
  import('@/features/restaurant/components/MerchantAuthPages').then((m) => ({
    default: m.MerchantLogin,
  }))
);
const MerchantRegister = lazy(() =>
  import('@/features/restaurant/components/MerchantAuthPages').then((m) => ({
    default: m.MerchantRegister,
  }))
);
const DriverLogin = lazy(() =>
  import('@/features/driver/components/DriverAuthPages').then((m) => ({ default: m.DriverLogin }))
);
const AdminLogin = lazy(() =>
  import('@/features/admin/components/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);

const HomePage = lazy(() =>
  import('@/features/restaurant/components/HomePage').then((m) => ({ default: m.HomePage }))
);
const BrowsePage = lazy(() =>
  import('@/features/restaurant/components/BrowsePage').then((m) => ({ default: m.BrowsePage }))
);
const DetailPage = lazy(() =>
  import('@/features/restaurant/components/DetailPage').then((m) => ({ default: m.DetailPage }))
);
const CheckoutPage = lazy(() =>
  import('@/features/order/components/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const QrPaymentPage = lazy(() =>
  import('@/features/order/components/QrPaymentPage').then((m) => ({ default: m.QrPaymentPage }))
);
const MockGatewayPage = lazy(() =>
  import('@/features/order/components/MockGatewayPage').then((m) => ({
    default: m.MockGatewayPage,
  }))
);
const TrackingPage = lazy(() =>
  import('@/features/order/components/TrackingPage').then((m) => ({ default: m.TrackingPage }))
);
const MerchantDashboard = lazy(() =>
  import('@/features/restaurant/components/MerchantDashboard').then((m) => ({
    default: m.MerchantDashboard,
  }))
);
const MerchantRestaurantList = lazy(() =>
  import('@/features/restaurant/components/MerchantRestaurantList').then((m) => ({
    default: m.MerchantRestaurantList,
  }))
);
const MerchantOrderDashboard = lazy(() =>
  import('@/features/order/components/MerchantOrderDashboard').then((m) => ({
    default: m.MerchantOrderDashboard,
  }))
);
const MerchantMenuManager = lazy(() =>
  import('@/features/restaurant/components/menu/MerchantMenuManager').then((m) => ({
    default: m.MerchantMenuManager,
  }))
);
const RestaurantForm = lazy(() =>
  import('@/features/restaurant/components/store/RestaurantForm').then((m) => ({
    default: m.RestaurantForm,
  }))
);
const DriverDashboard = lazy(() =>
  import('@/features/driver/components/DriverDashboard').then((m) => ({
    default: m.DriverDashboard,
  }))
);
const AdminDashboard = lazy(() =>
  import('@/features/admin/components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<PageLoading message="Đang tải giao diện FlashFood..." />}>
        <ScrollRestoration />
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout portalType="customer" />,
            children: [
              { path: '/login', element: <CustomerLogin /> },
              { path: '/register', element: <CustomerRegister /> },
            ],
          },
          {
            element: <AuthLayout portalType="merchant" />,
            children: [
              { path: '/merchant/login', element: <MerchantLogin /> },
              { path: '/merchant/register', element: <MerchantRegister /> },
            ],
          },
          {
            element: <AuthLayout portalType="driver" />,
            children: [{ path: '/driver/login', element: <DriverLogin /> }],
          },
          {
            element: <AuthLayout portalType="admin" />,
            children: [{ path: '/admin/login', element: <AdminLogin /> }],
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          { path: '/app', element: <HomePage /> },
          { path: '/app/restaurants', element: <BrowsePage /> },
          { path: '/app/restaurants/:id', element: <DetailPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['customer']} redirectPath="/login" />,
        children: [
          {
            element: <MainLayout />,
            children: [{ path: '/app/checkout', element: <CheckoutPage /> }],
          },
          { path: '/payment/qr', element: <QrPaymentPage /> },
          { path: '/mock-gateway/:id', element: <MockGatewayPage /> },
          {
            element: <MainLayout />,
            children: [{ path: '/tracking', element: <TrackingPage /> }],
          },
          {
            element: <MainLayout />,
            children: [{ path: '/profile', element: <ProfilePage /> }],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['merchant']} redirectPath="/merchant/login" />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/merchant', element: <Navigate to="/merchant/restaurants" replace /> },
              { path: '/merchant/restaurants', element: <MerchantRestaurantList /> },
              { path: '/merchant/dashboard', element: <MerchantDashboard /> },
              { path: '/merchant/orders', element: <MerchantOrderDashboard /> },
              { path: '/merchant/menu', element: <MerchantMenuManager /> },
              { path: '/merchant/store', element: <RestaurantForm /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['driver']} redirectPath="/driver/login" />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: '/driver/dashboard', element: <DriverDashboard /> }],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin/login" />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: '/admin/dashboard', element: <AdminDashboard /> }],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
