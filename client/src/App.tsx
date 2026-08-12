import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "@client/components/SiteShell";
import { HomePage } from "@client/pages/HomePage";
import { AboutPage } from "@client/pages/AboutPage";
import { StoryPage } from "@client/pages/StoryPage";
import { VisionPage } from "@client/pages/VisionPage";
import { BusinessesPage } from "@client/pages/BusinessesPage";
import { CompaniesPage } from "@client/pages/CompaniesPage";
import { CompanyProfilePage } from "@client/pages/CompanyProfilePage";
import { IndustriesPage } from "@client/pages/IndustriesPage";
import { ContactPage } from "@client/pages/ContactPage";
import { AdminPage } from "@client/pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/what-we-do" element={<BusinessesPage />} />
          <Route path="/businesses" element={<Navigate to="/what-we-do" replace />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
