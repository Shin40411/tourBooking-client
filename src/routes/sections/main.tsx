import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';
import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const FaqsPage = lazy(() => import('src/pages/faqs'));
const HomeLoginPage = lazy(() => import('src/pages/home-login/index'));
const HomeTourPage = lazy(() => import('src/pages/home-tour/list'));
const CategoryPage = lazy(() => import('src/pages/category/index'));
const HomeTourDetailPage = lazy(() => import('src/pages/home-tour/details'));
const ContactPage = lazy(() => import('src/pages/contact-us'));
const PaymentPage = lazy(() => import('src/pages/payment'));
const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));
// Product
// Blog
// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));
// Blank
const BlankPage = lazy(() => import('src/pages/blank'));

// ----------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          {
            path: 'tour',
            children: [
              {
                index: true, element:
                  <Suspense fallback={<SplashScreen />}>
                    <HomeTourPage />
                  </Suspense>,
              },
              { path: 'category/:id', element: <CategoryPage /> },
              { path: ':id', element: <HomeTourDetailPage /> },
              {
                path: 'checkout',
                element: (
                  <PaymentPage />
                ),
              },
            ],
          },
          { path: 'contact-us', element: <ContactPage /> },
          { path: 'faqs', element: <FaqsPage /> },
          { path: 'blank', element: <BlankPage /> },
        ],
      },
      {
        path: 'login',
        element: (
          <SimpleLayout>
            <HomeLoginPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'coming-soon',
        element: (
          <SimpleLayout slotProps={{ content: { compact: true } }}>
            <ComingSoonPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'maintenance',
        element: (
          <SimpleLayout slotProps={{ content: { compact: true } }}>
            <MaintenancePage />
          </SimpleLayout>
        ),
      },
      {
        path: 'error',
        children: [
          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
