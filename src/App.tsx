import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateFunnelPage from "./pages/CreateFunnelPage";
import Header from "@/components/layout/Header"; 
import L1Panel from "@/components/layout/L1Panel"; 
import { DashboardProvider } from "@/contexts/DashboardContext.tsx";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="flex flex-col min-h-screen">
          <Header />
          <BrowserRouter>
            <DashboardProvider>
          <div className="flex flex-1 pt-16"> 
            <L1Panel />
                <main className="flex-1 pl-16 h-[calc(100vh-4rem)] overflow-y-auto bg-transparent"> 
              {/* Main content area where routes are rendered */}
                <Routes>
                  <Route path="/" element={<Index />} />
                      <Route path="/create-funnel" element={<CreateFunnelPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
          </div>
            </DashboardProvider>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
