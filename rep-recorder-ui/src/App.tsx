import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Homepage from "./components/homepage";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Homepage />
    </QueryClientProvider>
  );
}
