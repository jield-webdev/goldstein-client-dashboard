import 'goldstein-client-dashboard/dist/index.css';
import {
  GoldsteinClientDashboard,
  GoldsteinDataProvider,
} from 'goldstein-client-dashboard';

const App = () => {
  return (
    <GoldsteinDataProvider
      defaultData={{
        goldsteinFQDN: 'go-server.lan:50443',
        associationType: 'equipment',
        associationID: 12,
      }}
    >
      <GoldsteinClientDashboard />
    </GoldsteinDataProvider>
  );
};

export default App;

