import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "./components/provider/theme-provider";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Dashboard } from "@/pages/dashboard";
import { Clients } from "@/pages/clients";
import { Tasks } from "@/pages/tasks";
import { Documents } from "@/pages/documents";
import { Attendance } from "@/pages/attendance";
import { LoginPage } from "@/pages/login";
import { AddTask } from "@/pages/add-task";
import { NewTask } from "@/pages/newTask";
import { Profile } from "@/pages/profile";
import ClientProfile from "@/pages/clientProfile";
import TaskProfile from "@/pages/taskProfile";

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <AppSidebar onLogout={handleLogout} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientProfile />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskProfile />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route
              path="/tasks/add"
              element={<AddTask onBack={() => navigate("/tasks")} />}
            />
            <Route
              path="/tasks/new"
              element={
                <NewTask open={true} onClose={() => navigate("/tasks")} />
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

function App() {
  useLocation(); // Force re-render on route change
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route
                path="/login"
                element={<LoginPage onLogin={() => navigate("/dashboard")} />}
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/*" element={<AppLayout />} />
            </>
          )}
        </Routes>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
