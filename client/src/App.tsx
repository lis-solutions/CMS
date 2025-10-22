import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import TeamChat from "./pages/TeamChat";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import SuperAdmin from "./pages/SuperAdmin";

function Router() {
  const { user } = useAuth();
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"}>
        {() => (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/customers"}>
        {() => (
          <DashboardLayout>
            <Customers />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/analytics"}>
        {() => (
          <DashboardLayout>
            <Analytics />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/reports"}>
        {() => (
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/calendar"}>
        {() => (
          <DashboardLayout>
            <Calendar />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/chat"}>
        {() => (
          <DashboardLayout>
            <TeamChat />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/settings"}>
        {() => (
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/super-admin"}>
        {() => (
          <DashboardLayout>
            <SuperAdmin />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

