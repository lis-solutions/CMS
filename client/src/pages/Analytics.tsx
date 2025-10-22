import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Target, Clock } from "lucide-react";

export default function Analytics() {
  const { data: metrics } = trpc.analytics.getMetrics.useQuery({ days: 30 });
  const { data: traffic } = trpc.analytics.getTrafficSources.useQuery({ days: 30 });

  const trafficSummary = traffic ? [
    { name: "Direct", value: traffic.filter(t => t.source === "direct").reduce((sum, t) => sum + (t.visits || 0), 0), color: "#3b82f6" },
    { name: "Social", value: traffic.filter(t => t.source === "social").reduce((sum, t) => sum + (t.visits || 0), 0), color: "#10b981" },
    { name: "Search", value: traffic.filter(t => t.source === "search").reduce((sum, t) => sum + (t.visits || 0), 0), color: "#f59e0b" },
    { name: "Referral", value: traffic.filter(t => t.source === "referral").reduce((sum, t) => sum + (t.visits || 0), 0), color: "#8b5cf6" },
  ] : [];

  const StatCard = ({ title, value, change, icon: Icon }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-green-600 mt-1">{change}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your business performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231" 
          change="+12.5% vs last period"
          icon={TrendingUp}
        />
        <StatCard 
          title="New Customers" 
          value="1,234" 
          change="+18.2% vs last period"
          icon={Users}
        />
        <StatCard 
          title="Conversion Rate" 
          value="4.2%" 
          change="-1.2% vs last period"
          icon={Target}
        />
        <StatCard 
          title="Avg. Session" 
          value="5m 23s" 
          change="+2.1% vs last period"
          icon={Clock}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Revenue and user growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={(metrics || []).map(m => ({
                ...m,
                date: m.date ? new Date(m.date).toLocaleDateString() : '',
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
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Distribution of traffic by source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSummary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>Last 30 days performance data</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={(metrics || []).map(m => ({
                ...m,
                date: m.date ? new Date(m.date).toLocaleDateString() : '',
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newCustomers" fill="#3b82f6" name="New Customers" />
                <Bar dataKey="activeUsers" fill="#10b981" name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Source Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Source Breakdown</CardTitle>
          <CardDescription>Visitor distribution by source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficSummary.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="font-medium">{source.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{(source.value || 0).toLocaleString()} visits</p>
                  <p className="text-sm text-gray-500">
                    {trafficSummary.length > 0 ? (((source.value || 0) / trafficSummary.reduce((sum, s) => sum + (s.value || 0), 0)) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

