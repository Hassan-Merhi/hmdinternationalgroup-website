import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "@client/components/SiteShell";

const HomePage = lazy(() => import("@client/pages/HomePage").then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import("@client/pages/AboutPage").then((module) => ({ default: module.AboutPage })));
const StoryPage = lazy(() => import("@client/pages/StoryPage").then((module) => ({ default: module.StoryPage })));
const VisionPage = lazy(() => import("@client/pages/VisionPage").then((module) => ({ default: module.VisionPage })));
const BusinessesPage = lazy(() => import("@client/pages/BusinessesPage").then((module) => ({ default: module.BusinessesPage })));
const CompaniesPage = lazy(() => import("@client/pages/CompaniesPage").then((module) => ({ default: module.CompaniesPage })));
const CompanyProfilePage = lazy(() => import("@client/pages/CompanyProfilePage").then((module) => ({ default: module.CompanyProfilePage })));
const IndustriesPage = lazy(() => import("@client/pages/IndustriesPage").then((module) => ({ default: module.IndustriesPage })));
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
            <Route path="/about/story" element={<StoryPage />} />
            <Route path="/about/vision" element={<VisionPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:slug" element={<CompanyProfilePage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/global-reach" element={<GlobalReachPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/what-we-do" element={<BusinessesPage />} />
            <Route path="/businesses" element={<Navigate to="/what-we-do" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
