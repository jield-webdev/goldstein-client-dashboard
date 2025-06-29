import "goldstein-client-dashboard/dist/index.css";
import {
  GoldsteinClientDashboard,
  GoldsteinDataProvider,
} from "goldstein-client-dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoldsteinDataProvider
        defaultData={{
          goldsteinFQDN: "go-server.lan:50443",
          associationType: "equipment",
          associationID: 12,
        }}
      >
        <GoldsteinClientDashboard />
      </GoldsteinDataProvider>
    </QueryClientProvider>
  );
};

export default App;
