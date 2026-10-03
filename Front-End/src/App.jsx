import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
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
import AdminRoute from './components/AdminRoute';
import AdminProblems from './pages/admin/AdminProblems';
import AdminUsers from './pages/admin/AdminUsers';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <ErrorBoundary>
          <Routes>

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

          {/* Admin Protected Pages */}
          <Route path="/admin" element={<AdminRoute><AdminProblems /></AdminRoute>} />
          <Route path="/admin/problems" element={<AdminRoute><AdminProblems /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

        </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;