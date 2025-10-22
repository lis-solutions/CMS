import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Filter } from "lucide-react";

const sampleData = [
  { month: "Jan", sales: 4000, revenue: 2400, customers: 240 },
  { month: "Feb", sales: 3000, revenue: 1398, customers: 221 },
  { month: "Mar", sales: 2000, revenue: 9800, customers: 229 },
  { month: "Apr", sales: 2780, revenue: 3908, customers: 200 },
  { month: "May", sales: 1890, revenue: 4800, customers: 221 },
  { month: "Jun", sales: 2390, revenue: 3800, customers: 250 },
];

export default function Reports() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-600">Comprehensive business intelligence and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$45,231</p>
            <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+1,234</p>
            <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Market Share</CardTitle>
            <CardDescription>Competitive positioning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24.5%</p>
            <p className="text-sm text-gray-600 mt-2">Industry average</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Report Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Monthly sales and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales" />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
          <CardDescription>New customer acquisition trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#8b5cf6" name="New Customers" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
          <CardDescription>Most visited pages in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { page: "/dashboard", views: 24567, change: "+12.5%" },
              { page: "/products", views: 18432, change: "+8.2%" },
              { page: "/pricing", views: 12876, change: "-2.1%" },
              { page: "/about", views: 9234, change: "+5.7%" },
              { page: "/contact", views: 7654, change: "+3.4%" },
            ].map((item) => (
              <div key={item.page} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{item.page}</p>
                  <p className="text-sm text-gray-600">{item.views.toLocaleString()} views</p>
                </div>
                <span className="text-green-600 font-medium">{item.change}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
          <CardDescription>Key metrics overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-2xl font-bold">12,543</p>
              <p className="text-xs text-green-600 mt-1">+2.5% this month</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold">8,234</p>
              <p className="text-xs text-green-600 mt-1">+5.2% this month</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold">4.2%</p>
              <p className="text-xs text-red-600 mt-1">-0.8% this month</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
              <p className="text-2xl font-bold">$234.56</p>
              <p className="text-xs text-green-600 mt-1">+3.1% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

