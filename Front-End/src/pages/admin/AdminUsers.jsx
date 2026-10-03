import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Search,
  UserCheck,
  UserX,
  Award,
  Sparkles,
  AlertTriangle,
  Loader2,
  CheckCircle,
  FileCode,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { getAdminUsers, updateUserRole } from '../../services/apiService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [loadError, setLoadError] = useState(null);

  // Role Change Confirmation Modal State
  const [selectedUserForRoleChange, setSelectedUserForRoleChange] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await getAdminUsers();
      // Handle response structure { success: true, data: [...] } or array
      const userList = Array.isArray(res) ? res : res?.data || [];
      setUsers(userList);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch users';
      setLoadError(msg);
      toast({
        title: 'Error loading users',
        description: msg,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openRoleChangeModal = (user, newRole) => {
    setSelectedUserForRoleChange(user);
    setTargetRole(newRole);
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUserForRoleChange || !targetRole) return;
    setIsUpdatingRole(true);
    try {
      await updateUserRole(selectedUserForRoleChange.id, targetRole);
      toast({
        title: 'Role Updated Successfully',
        description: `User @${selectedUserForRoleChange.username} is now an ${targetRole}.`,
        variant: 'default'
      });

      // Update local state smoothly
      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUserForRoleChange.id
            ? { ...u, role: targetRole }
            : u
        )
      );

      setSelectedUserForRoleChange(null);
    } catch (err) {
      toast({
        title: 'Failed to update role',
        description: err.response?.data?.message || err.message || 'Server error',
        variant: 'destructive'
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Calculations for Admin Stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const regularCount = users.filter(u => u.role !== 'ADMIN').length;
  const totalPoints = users.reduce((acc, u) => acc + (u.points || 0), 0);
  const avgPoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.name && u.name.toLowerCase().includes(term));
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs between Admin Sections */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-600/10 text-purple-500 rounded-xl border border-purple-500/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
              <p className="text-xs text-muted-foreground">Manage platform problems, users, and permissions</p>
            </div>
          </div>

          <div className="flex space-x-2 bg-muted/50 p-1 rounded-xl border border-border">
            <Link
              to="/admin/problems"
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all text-muted-foreground hover:text-foreground"
            >
              <FileCode className="w-3.5 h-3.5 inline mr-1.5" />
              Problems
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all bg-background text-foreground shadow-sm"
            >
              <Users className="w-3.5 h-3.5 inline mr-1.5 text-purple-500" />
              Users & Permissions
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-card/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Users</p>
                <h3 className="text-2xl font-bold mt-1 text-foreground">{totalUsers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Administrators</p>
                <h3 className="text-2xl font-bold mt-1 text-purple-500">{adminCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Learners / Users</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-500">{regularCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/80">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg User Points</p>
                <h3 className="text-2xl font-bold mt-1 text-amber-500">{avgPoints}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Controls */}
        <Card className="border border-border bg-card/60">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search user by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background/80"
                />
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Filter Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary"
                >
                  <option value="ALL">All Roles ({totalUsers})</option>
                  <option value="ADMIN">Admins Only ({adminCount})</option>
                  <option value="USER">Users Only ({regularCount})</option>
                </select>

                <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading} className="text-xs">
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Refresh'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border border-border overflow-hidden bg-card/80 shadow-md">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground font-medium">Fetching registered users...</p>
            </div>
          ) : loadError ? (
            <div className="py-16 text-center space-y-3 px-4">
              <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
              <h3 className="text-base font-semibold">Failed to Load Users</h3>
              <p className="text-xs text-muted-foreground">{loadError}</p>
              <Button size="sm" onClick={fetchUsers}>Retry</Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <Users className="w-12 h-12 text-muted-foreground/40 mx-auto" />
              <h3 className="text-base font-semibold">No Users Found</h3>
              <p className="text-xs text-muted-foreground">Try clearing your search query or filter settings.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Score / Points</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role === 'ADMIN';
                    const isSelf = currentUser?.id === u.id || currentUser?.username === u.username;

                    return (
                      <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                              {(u.name || u.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {u.name || u.username}
                                {isSelf && (
                                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-normal">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">@{u.username}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                          {u.email}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {isAdmin ? (
                            <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500/30 gap-1 text-[11px]">
                              <Shield className="w-3 h-3" /> ADMIN
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted text-muted-foreground gap-1 text-[11px]">
                              <UserCheck className="w-3 h-3" /> USER
                            </Badge>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-foreground text-xs">{u.points || 0}</span>
                            <span className="text-[11px] text-muted-foreground">pts</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {isSelf ? (
                            <span className="text-xs text-muted-foreground italic">Current Account</span>
                          ) : isAdmin ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRoleChangeModal(u, 'USER')}
                              className="text-xs h-8 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 border-amber-500/30"
                            >
                              <UserX className="w-3.5 h-3.5 mr-1" /> Demote to User
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRoleChangeModal(u, 'ADMIN')}
                              className="text-xs h-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border-purple-500/30"
                            >
                              <Shield className="w-3.5 h-3.5 mr-1" /> Promote to Admin
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Role Change Confirmation Modal */}
      {selectedUserForRoleChange && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  targetRole === 'ADMIN'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'bg-amber-500/10 text-amber-500'
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {targetRole === 'ADMIN' ? 'Promote to Administrator?' : 'Demote to Standard User?'}
                </h3>
                <p className="text-xs text-muted-foreground">Confirm permission changes for this account</p>
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl text-xs space-y-1">
              <div>
                <span className="text-muted-foreground">User: </span>
                <span className="font-semibold text-foreground">
                  {selectedUserForRoleChange.name || selectedUserForRoleChange.username} (@{selectedUserForRoleChange.username})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Target Role: </span>
                <span className={`font-bold ${targetRole === 'ADMIN' ? 'text-purple-400' : 'text-emerald-500'}`}>
                  {targetRole}
                </span>
              </div>
              <p className="text-muted-foreground/80 pt-2 text-[11px] leading-relaxed">
                {targetRole === 'ADMIN'
                  ? 'This user will gain full privileges to create, update, and delete problems and manage other users.'
                  : 'This user will lose administrative privileges and revert to standard problem solving.'}
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUserForRoleChange(null)}
                disabled={isUpdatingRole}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmRoleChange}
                disabled={isUpdatingRole}
                className={targetRole === 'ADMIN' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}
              >
                {isUpdatingRole ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                Confirm {targetRole === 'ADMIN' ? 'Promotion' : 'Demotion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
