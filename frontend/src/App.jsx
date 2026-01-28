import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Home } from "./app/home/page";
import { Login } from "./app/login/page";
import { Register } from "./app/register/page";
import { Communities } from "./app/communities/page";
import { CommunityPage } from "./app/communities/[id]/page";
import { Notes } from "./app/notes/page";
import { Profile } from "./app/profile/[username]/page";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
