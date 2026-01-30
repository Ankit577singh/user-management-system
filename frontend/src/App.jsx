import { BrowserRouter, Routes, Route } from "react-router";
import ListUsers from "./pages/ListUsers";
import AddEditUser from "./pages/AddEditUser";
import ViewUser from "./pages/ViewUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListUsers />} />
        <Route path="/add" element={<AddEditUser />} />
        <Route path="/edit/:id" element={<AddEditUser />} />
        <Route path="/view/:id" element={<ViewUser />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
