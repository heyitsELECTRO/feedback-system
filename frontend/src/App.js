import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserHomePage from "./pages/UserHomePage";
import UserHistoryPage from "./pages/UserHistoryPage";
import SignupPage from "./pages/SignupPage";
import AdminHomePage from "./pages/AdminHomePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ManageFormsPage from "./pages/ManageFormsPage";
import EditFormPage from "./pages/EditFormPage";
import AddFormPage from "./pages/AddFormPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user" element={<UserHomePage />} />
        <Route path="/history" element={<UserHistoryPage />} />
        <Route path="/admin" element={<AnalyticsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/manage-forms" element={<ManageFormsPage />} />
        <Route path="/edit-form/:id" element={<EditFormPage />} />
        <Route path="/add-form" element={<AddFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
