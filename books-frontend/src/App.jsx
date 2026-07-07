import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layout/MainLayout";
import BookDetails from "./pages/BookDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import RecommendationsPage from "./pages/RecommendationsPage";
import AddBook from "./pages/AddBook";


export default function App() {
  return (
      <MainLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add" element={<AddBook />} />
            </Routes>
      </MainLayout>
  );
}
