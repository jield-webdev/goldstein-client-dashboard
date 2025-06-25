import 'goldstein-client-dashboard/dist/index.css';
import {
  GoldsteinClientDashboard,
  GoldsteinDataProvider,
} from 'goldstein-client-dashboard';

const App = () => {
  return (
    <GoldsteinDataProvider
      defaultData={{
        goldsteinFQDN: 'go-server.lan:50433',
        associationType: 'equipment',
        associationID: 1,
      }}
    >
      <GoldsteinClientDashboard />
    </GoldsteinDataProvider>
  );
};

export default App;

