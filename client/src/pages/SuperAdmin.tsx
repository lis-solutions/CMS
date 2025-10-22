import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Users, Settings, BarChart3, AlertCircle, Lock, Trash2, Edit2 } from "lucide-react";

export default function SuperAdmin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active", createdAt: "2024-01-15" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", status: "active", createdAt: "2024-02-20" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "user", status: "inactive", createdAt: "2024-03-10" },
  ]);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800">
              You do not have permission to access the super admin panel. Only administrators can access this area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handlePromoteUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Panel</h1>
          <p className="text-gray-600">System management and advanced controls</p>
        </div>
        <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
          Admin Access
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-xs text-green-600 mt-1">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">456</p>
            <p className="text-xs text-gray-600 mt-1">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">99.9%</p>
            <p className="text-xs text-green-600 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.4 GB</p>
            <p className="text-xs text-gray-600 mt-1">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          User Management
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "system"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          System Settings
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "analytics"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "security"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Lock className="h-4 w-4 inline mr-2" />
          Security
        </button>
      </div>

      {/* User Management Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all system users and permissions</CardDescription>
                </div>
                <Button>Add New User</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Created</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{u.name}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{u.createdAt}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePromoteUser(u.id)}
                              className="gap-1"
                            >
                              <Edit2 className="h-3 w-3" />
                              {u.role === "admin" ? "Demote" : "Promote"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(u.id)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === "system" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Application Name</label>
                  <Input defaultValue="Enterprise CRM" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Support Email</label>
                  <Input defaultValue="support@example.com" type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Upload Size (MB)</label>
                  <Input defaultValue="100" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                  <Input defaultValue="30" type="number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maintenance Mode</label>
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-600">Enable maintenance mode (users cannot access the system)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Notifications</label>
                <div className="space-y-2">
                  {["New user registration", "System errors", "Daily reports", "Security alerts"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Monitor system performance and usage statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">API Requests (24h)</p>
                  <p className="text-3xl font-bold">45,234</p>
                  <p className="text-xs text-blue-600 mt-2">+12% from yesterday</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Average Response Time</p>
                  <p className="text-3xl font-bold">245ms</p>
                  <p className="text-xs text-green-600 mt-2">-5% improvement</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Error Rate</p>
                  <p className="text-3xl font-bold">0.12%</p>
                  <p className="text-xs text-purple-600 mt-2">Within acceptable range</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                  <p className="text-3xl font-bold">2.4 GB</p>
                  <p className="text-xs text-orange-600 mt-2">24% of 10 GB quota</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <p>✓ Database backup completed - 2 hours ago</p>
                  <p>✓ Security scan passed - 4 hours ago</p>
                  <p>⚠ High memory usage detected - 6 hours ago</p>
                  <p>✓ System update installed - 1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Management</CardTitle>
              <CardDescription>Configure security settings and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Require 2FA for all users</p>
                    <p className="text-xs text-gray-600">Enforce two-factor authentication</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Password Policy</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum Password Length</label>
                    <Input defaultValue="8" type="number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password Expiry (days)</label>
                    <Input defaultValue="90" type="number" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">Require uppercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">Require numbers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm">Require special characters</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">IP Whitelist</h3>
                <p className="text-sm text-gray-600 mb-3">Restrict access to specific IP addresses</p>
                <div className="space-y-2">
                  <Input placeholder="192.168.1.1" />
                  <Input placeholder="10.0.0.0/8" />
                </div>
                <Button className="mt-3">Add IP Address</Button>
              </div>

              <div>
                <h3 className="font-medium mb-3">Audit Logs</h3>
                <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                  <p>Admin login from 192.168.1.100 - 2 hours ago</p>
                  <p>User deletion: john@example.com - 5 hours ago</p>
                  <p>System settings changed - 1 day ago</p>
                  <p>Database backup completed - 2 days ago</p>
                </div>
              </div>

              <Button>Save Security Settings</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

