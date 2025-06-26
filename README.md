# goldstein-client-dashboard

> This package provides a dashboard for interacting with the Goldstein functionalities.

[![NPM](https://img.shields.io/npm/v/goldstein-client-dashboard.svg)](https://www.npmjs.com/package/goldstein-client-dashboard) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save goldstein-client-dashboard
```

## Usage

```tsx
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
}
```

## License

MIT © [pedrofmu](https://github.com/pedrofmu)
