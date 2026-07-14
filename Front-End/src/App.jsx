import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
// import Home from './pages/Home'; // <-- You can remove this now, Dashboard handles it!
import Login from './pages/Login';
import Register from './pages/Register';
import Sheets from './pages/Sheets';
import SheetDetail from './pages/SheetDetail';
import ProblemSolver from './pages/ProblemSolver';
import Rankings from './pages/Rankings';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CodePlayground from './pages/CodePlayground';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* --- THE FIX IS HERE --- */}
          
          {/* 1. Point '/' to Dashboard */}
          {/* 2. REMOVE ProtectedRoute (Dashboard handles auth logic internally) */}
          <Route path="/" element={<Dashboard />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Public Pages */}
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/playground" element={<CodePlayground />} />

          {/* Protected Pages (Login Required) */}
          <Route path="/sheets/:sheetId" element={<ProtectedRoute><SheetDetail /></ProtectedRoute>} />
          <Route path="/problem/:problemId" element={<ProtectedRoute><ProblemSolver /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Optional: You can keep this if you want /dashboard to work too, but / is enough */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        </Routes>
      </main>
    </div>
  );
}

export default App;