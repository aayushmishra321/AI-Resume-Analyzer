import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { ResumeTemplates } from "./pages/ResumeTemplates";
import { ResumeBuilder } from "./pages/ResumeBuilder";
import { ResumeAnalysis } from "./pages/ResumeAnalysis";
import { CoverLetterGenerator } from "./pages/CoverLetterGenerator";
import { MyResumes } from "./pages/MyResumes";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/app",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "templates", element: <ResumeTemplates /> },
      { path: "builder", element: <ResumeBuilder /> },
      { path: "analysis", element: <ResumeAnalysis /> },
      { path: "resumes", element: <MyResumes /> },
      { path: "cover-letter", element: <CoverLetterGenerator /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);