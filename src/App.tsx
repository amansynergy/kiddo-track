import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TestProvider } from "./contexts/TestContext";
import { DoubtProvider } from "./contexts/DoubtContext";
import { FlowProvider } from "./contexts/FlowContext";
import Index from "./pages/Index";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentTestPage from "./pages/StudentTestPage";
import DoubtSession from "./pages/DoubtSession";
import ChatDoubtSession from "./pages/ChatDoubtSession";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TestProvider>
      <DoubtProvider>
        <FlowProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/parent" element={<ParentDashboard />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/test/:testId" element={<StudentTestPage />} />
                <Route path="/doubts" element={<DoubtSession />} />
                <Route path="/chat-doubts" element={<ChatDoubtSession />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FlowProvider>
      </DoubtProvider>
    </TestProvider>
  </QueryClientProvider>
);

export default App;
