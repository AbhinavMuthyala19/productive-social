import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Home } from './app/home/page'
import { Login } from './app/login/page'
import { Register } from './app/register/page'
import { Communities } from './app/communities/page'
import { CommunityPage } from './app/communities/[id]/page'
import { CreatePost } from './app/communities/create-post/page'
import { Notes } from './app/notes/page'
import { Profile } from './app/profile/page'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

function App() {

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/communities/:id" element={<CommunityPage />} />
        <Route path="/communities/create-post" element={<CreatePost />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App
