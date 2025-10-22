import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowUp, ArrowDown, Users, TrendingUp, Activity } from "lucide-react";

export default function Dashboard() {
  const { data: overview, isLoading } = trpc.dashboard.getOverview.useQuery();
  const { data: trends } = trpc.dashboard.getPerformanceTrends.useQuery({ days: 30 });

  if (isLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const metrics = overview?.metrics || {
    totalRevenue: 0,
    subscriptions: 0,
    newCustomers: 0,
    activeUsers: 0,
    conversionRate: 0,
    systemUptime: 0,
  };
  const recentActivities = overview?.recentActivities || [];
  const upcomingEvents = overview?.upcomingEvents || [];
  const teamMembers = overview?.teamMembers || [];

  const KPICard = ({ title, value, change, icon: Icon, trend }: { title: string; value: string | number; change: string; icon: any; trend: 'up' | 'down' }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend === "up" ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
          {trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {change}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Revenue" 
          value={`$${(metrics.totalRevenue || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
          change="+20.1% from last month"
          icon={TrendingUp}
          trend="up"
        />
        <KPICard 
          title="Subscriptions" 
          value={`+${(metrics.subscriptions || 0).toLocaleString()}`}
          change="+18.2% from last month"
          icon={Users}
          trend="up"
        />
        <KPICard 
          title="Sales" 
          value={`+${(metrics.newCustomers || 0).toLocaleString()}`}
          change="-1.2% from last month"
          icon={Activity}
          trend="down"
        />
        <KPICard 
          title="Active Now" 
          value={`${metrics.activeUsers || 573}`}
          change="+2.1% from last month"
          icon={Users}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Analytics for the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={(trends || []).map(t => ({
                ...t,
                date: t.date ? new Date(t.date).toLocaleDateString() : '',
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#3b82f6" name="Revenue" />
                <Line type="monotone" dataKey="activeUsers" stroke="#10b981" name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Monthly conversion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={(trends || []).map(t => ({
                ...t,
                date: t.date ? new Date(t.date).toLocaleDateString() : '',
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversionRate" fill="#8b5cf6" name="Conversion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Scheduled meetings and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event: any) => (
                  <div key={event.id} className="pb-4 border-b last:border-b-0">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600 capitalize">{event.type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.startTime).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.length > 0 ? (
              teamMembers.map((member: any) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold">{member.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{member.status}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{member.jobTitle}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600">Performance: {member.performance}%</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No team members</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

