import Routes from "@/routes/Routes";
import { Toaster } from "react-hot-toast";
import boxicons from "boxicons";
import QueryProvider from "@/providers/QueryProvider";

const App = () => {
  return (
    <QueryProvider>
      <Toaster />
      <Routes />
    </QueryProvider>
  );
};

export default App;
