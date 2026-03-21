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
import { VerifyEmail } from "./app/verify-email/Page";
import { ForgotPassword } from "./app/forgot-password/page";
import { ResetPassword } from "./app/reset-password/page";
import { EditProfile } from "./app/accounts/edit-profile/page";


function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/accounts/edit-profile" element={<EditProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
