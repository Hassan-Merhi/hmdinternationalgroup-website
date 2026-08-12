import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteShell } from "@client/components/SiteShell";
import { HomePage } from "@client/pages/HomePage";
import { AboutPage } from "@client/pages/AboutPage";
import { BusinessesPage } from "@client/pages/BusinessesPage";
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
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
