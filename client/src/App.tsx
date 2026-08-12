import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "@client/components/SiteShell";

const HomePage = lazy(() => import("@client/pages/HomePage").then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import("@client/pages/AboutPage").then((module) => ({ default: module.AboutPage })));
const BusinessesPage = lazy(() => import("@client/pages/BusinessesPage").then((module) => ({ default: module.BusinessesPage })));
const IndustriesPage = lazy(() => import("@client/pages/IndustriesPage").then((module) => ({ default: module.IndustriesPage })));
const ProcessPage = lazy(() => import("@client/pages/ProcessPage").then((module) => ({ default: module.ProcessPage })));
const CompanyProfilePage = lazy(() => import("@client/pages/CompanyProfilePage").then((module) => ({ default: module.CompanyProfilePage })));
const GlobalReachPage = lazy(() => import("@client/pages/GlobalReachPage").then((module) => ({ default: module.GlobalReachPage })));
const GalleryPage = lazy(() => import("@client/pages/GalleryPage").then((module) => ({ default: module.GalleryPage })));
const ContactPage = lazy(() => import("@client/pages/ContactPage").then((module) => ({ default: module.ContactPage })));
const AdminPage = lazy(() => import("@client/pages/AdminPage").then((module) => ({ default: module.AdminPage })));
const NotFoundPage = lazy(() => import("@client/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

function RouteFallback() {
  return <div className="route-loading" role="status" aria-live="polite"><span>Loading SAMWATEX</span></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route element={<SiteShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/what-we-do" element={<BusinessesPage />} />
            <Route path="/products" element={<IndustriesPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/companies/:slug" element={<CompanyProfilePage />} />
            <Route path="/export-markets" element={<GlobalReachPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/hmd" element={<Navigate to="/companies/hmd-international-group" replace />} />
            <Route path="/companies" element={<Navigate to="/companies/hmd-international-group" replace />} />
            <Route path="/industries" element={<Navigate to="/products" replace />} />
            <Route path="/global-reach" element={<Navigate to="/export-markets" replace />} />
            <Route path="/businesses" element={<Navigate to="/what-we-do" replace />} />
            <Route path="/about/story" element={<Navigate to="/about" replace />} />
            <Route path="/about/vision" element={<Navigate to="/about" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
