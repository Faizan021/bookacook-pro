import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOverview,
  getAdminUsers,
  getAdminListings,
  getAdminOrders
} from "@/lib/admin/queries.functions";
import {
  updateUserRole,
  toggleListingPublish
} from "@/lib/admin/mutations.functions";
import { CompetitorMonitor } from "@/components/geo/CompetitorMonitor";
import { GeoTargetingEngine } from "@/components/geo/GeoTargetingEngine";
import { SitemapMonitor } from "@/components/geo/SitemapMonitor";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  Store,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Globe
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Portal — Speisely" }] }),
  component: AdminPage
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "listings" | "orders" | "ai-tools">("overview");

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Sub-tab for listings
  const [listingSubTab, setListingSubTab] = useState<"restaurants" | "caterers" | "planners">("restaurants");

  // Sub-tab for AI Tools
  const [aiSubTab, setAiSubTab] = useState<"competitor" | "geo" | "sitemap">("sitemap");

  // Server functions
  const fetchOverview = useServerFn(getAdminOverview);
  const fetchUsers = useServerFn(getAdminUsers);
  const fetchListings = useServerFn(getAdminListings);
  const fetchOrders = useServerFn(getAdminOrders);

  const mutateRole = useServerFn(updateUserRole);
  const mutatePublish = useServerFn(toggleListingPublish);

  // Load auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setAuthLoading(false);
    }
  };

  // Queries (only enabled if verified as admin)
  const overviewQuery = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => fetchOverview(),
    enabled: !!isAdmin
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetchUsers(),
    enabled: !!isAdmin
  });

  const listingsQuery = useQuery({
    queryKey: ["admin", "listings"],
    queryFn: () => fetchListings(),
    enabled: !!isAdmin
  });

  const ordersQuery = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => fetchOrders(),
    enabled: !!isAdmin
  });

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: (vars: { targetUserId: string; newRole: string }) => mutateRole({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "listings"] });
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: (vars: { listingType: string; listingId: string; isPublished: boolean }) =>
      mutatePublish({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "listings"] });
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        checkAdminRole(data.user.id);
      }
    } catch (e: any) {
      setLoginError(e.message || "Invalid credentials");
      setLoginLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    navigate({ to: "/admin" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-gray-600 font-medium">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated State -> Render Admin-only Login Card
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-emerald-50 rounded-xl mb-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-heading">Speisely Admin Portal</h2>
            <p className="text-gray-500 text-sm mt-1">Authorized Administrator Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label className="text-gray-700">Email Address</Label>
              <Input
                type="email"
                required
                className="mt-1"
                placeholder="admin@speisely.de"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-gray-700">Password</Label>
              <Input
                type="password"
                required
                className="mt-1"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{loginError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition"
            >
              {loginLoading ? "Authenticating..." : "Sign In to Control Panel"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated but NOT Admin State -> Render Access Denied Page
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
          <div className="inline-flex p-3 bg-red-50 rounded-full text-red-600 mb-4">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Access Denied</h2>
          <p className="text-gray-500 mt-2">
            Your account ({session.user.email}) does not have administrative privileges.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={() => navigate({ to: "/dashboard" })}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-2 font-medium"
            >
              Go to Dashboard
            </Button>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition"
            >
              Sign in with another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Verified State -> Render Admin Dashboard
  const overview = overviewQuery.data;
  const users = usersQuery.data || [];
  const listings = listingsQuery.data || { restaurants: [], caterers: [], planners: [] };
  const orders = ordersQuery.data || [];

  // Filtered users
  const filteredUsers = users.filter(u =>
    (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.includes(searchTerm)
  );

  // Filtered listings
  const filterListings = (list: any[]) => {
    return list.filter(l =>
      (l.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.slug || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.owner?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.owner?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <span className="font-heading font-bold text-xl text-gray-900">Speisely Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-400">Loged in as admin</p>
              <p className="text-sm font-semibold text-gray-700">{session.user.email}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-gray-500 border-gray-200 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => { setActiveTab("overview"); setSearchTerm(""); }}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Revenue</span>
          </button>
          <button
            onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "users"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </button>
          <button
            onClick={() => { setActiveTab("listings"); setSearchTerm(""); }}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "listings"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Listing Management</span>
          </button>
          <button
            onClick={() => { setActiveTab("orders"); setSearchTerm(""); }}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Bookings</span>
          </button>
          <button
            onClick={() => { setActiveTab("ai-tools"); setSearchTerm(""); }}
            className={`py-3 px-4 font-medium text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "ai-tools"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>AI Visibility & Tools</span>
          </button>
        </div>

        {/* Tab 1: Overview & Revenue */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Monthly Recurring Revenue (MRR)</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1 font-heading">
                    €{(overview?.mrr || 0).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Commissions Collected</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1 font-heading">
                    €{(overview?.commissions || 0).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Subscriptions</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1 font-heading">
                    {overview?.metrics?.subscriptions || 0}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* MRR Month-by-Month Trend Line Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 font-heading">6-Month MRR Trend</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={overview?.mrrTrend || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={val => `€${val}`}
                    />
                    <Tooltip formatter={val => [`€${val}`, "MRR"]} />
                    <Line
                      type="monotone"
                      dataKey="mrr"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#059669" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audit / Overview Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Platform Metrics */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading">Platform Scale</h3>
                <div className="divide-y divide-gray-100">
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500 font-medium">Total Registered Users</span>
                    <span className="font-semibold text-gray-900">{overview?.metrics?.users}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500 font-medium">Active Restaurants</span>
                    <span className="font-semibold text-gray-900">{overview?.metrics?.restaurants}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500 font-medium">Active Caterers</span>
                    <span className="font-semibold text-gray-900">{overview?.metrics?.caterers}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500 font-medium">Active Event Planners</span>
                    <span className="font-semibold text-gray-900">{overview?.metrics?.planners}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-500 font-medium">Total Orders & Bookings</span>
                    <span className="font-semibold text-gray-900">{overview?.metrics?.orders}</span>
                  </div>
                </div>
              </div>

              {/* Recent Commissions */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading">Recent Commission Income</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-semibold text-gray-400 border-b border-gray-100 pb-2">
                        <th className="py-2">Date</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Commission (10%)</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                      {(overview?.recentPayments || []).map((p: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5">{new Date(p.created_at).toLocaleDateString()}</td>
                          <td className="py-2.5">€{Number(p.amount_total).toFixed(2)}</td>
                          <td className="py-2.5 text-emerald-600 font-medium">€{Number(p.platform_fee_amount).toFixed(2)}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(overview?.recentPayments || []).length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-400">
                            No commissions captured yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search Filters */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-900 font-heading">User Roles & Accounts</h3>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users name, email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Primary Role</th>
                    <th className="px-6 py-3">Joined Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                  {filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {u.full_name || "Anonymous User"}
                      </td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                          u.role === 'restaurant_owner' ? 'bg-orange-50 text-orange-700' :
                          u.role === 'caterer' ? 'bg-emerald-50 text-emerald-700' :
                          u.role === 'planner' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role || "customer"}
                          onChange={e => {
                            if (window.confirm(`Are you sure you want to change role of ${u.email} to ${e.target.value}?`)) {
                              updateRoleMutation.mutate({ targetUserId: u.id, newRole: e.target.value });
                            }
                          }}
                          className="text-xs bg-white border border-gray-200 rounded p-1 text-gray-700 font-medium"
                        >
                          <option value="customer">Customer</option>
                          <option value="restaurant_owner">Restaurant Owner</option>
                          <option value="caterer">Caterer</option>
                          <option value="planner">Event Planner</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No profiles found matching search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Listing Management */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            {/* Listing Segment Sub-Tabs */}
            <div className="flex border-b border-gray-200 gap-1 bg-white p-2 rounded-2xl border border-gray-100">
              <button
                onClick={() => { setListingSubTab("restaurants"); setSearchTerm(""); }}
                className={`py-2 px-4 rounded-xl font-medium text-xs transition ${
                  listingSubTab === "restaurants"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Restaurants ({listings.restaurants.length})
              </button>
              <button
                onClick={() => { setListingSubTab("caterers"); setSearchTerm(""); }}
                className={`py-2 px-4 rounded-xl font-medium text-xs transition ${
                  listingSubTab === "caterers"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Caterers ({listings.caterers.length})
              </button>
              <button
                onClick={() => { setListingSubTab("planners"); setSearchTerm(""); }}
                className={`py-2 px-4 rounded-xl font-medium text-xs transition ${
                  listingSubTab === "planners"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Event Planners ({listings.planners.length})
              </button>
            </div>

            {/* List Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h4 className="text-md font-bold text-gray-900 font-heading">
                  Active Listings for {listingSubTab.toUpperCase()}
                </h4>
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  {listingSubTab === "restaurants" && (
                    <>
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-6 py-3">Restaurant</th>
                          <th className="px-6 py-3">Owner</th>
                          <th className="px-6 py-3">Stripe Status</th>
                          <th className="px-6 py-3">Subscription</th>
                          <th className="px-6 py-3">Onboarding Step</th>
                          <th className="px-6 py-3 text-right">Publishing Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                        {filterListings(listings.restaurants).map((r: any) => (
                          <tr key={r.id}>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              <div>{r.name || "Unnamed"}</div>
                              <div className="text-xs text-gray-400 font-normal">slug: {r.slug}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div>{r.owner.name}</div>
                              <div className="text-xs text-gray-400">{r.owner.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                r.stripe_connect_status === 'connected'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {r.stripe_connect_status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {r.subscription ? (
                                <div>
                                  <span className="font-medium text-gray-700 uppercase">{r.subscription.plan}</span>
                                  <span className="ml-1 text-xs text-emerald-600">({r.subscription.status})</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">None</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                r.onboardingStep.includes('Complete') ? 'bg-emerald-50 text-emerald-700' :
                                r.onboardingStep.includes('Publish') ? 'bg-blue-50 text-blue-700' :
                                r.onboardingStep.includes('Subscription') ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                              }`}>
                                {r.onboardingStep}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className={`text-xs ${r.is_published ? "text-emerald-600 font-semibold" : "text-gray-400"}`}>
                                  {r.is_published ? "Published" : "Draft"}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={r.is_published}
                                  onChange={e => {
                                    togglePublishMutation.mutate({
                                      listingType: "restaurant",
                                      listingId: r.id,
                                      isPublished: e.target.checked
                                    });
                                  }}
                                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {listingSubTab === "caterers" && (
                    <>
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-6 py-3">Caterer</th>
                          <th className="px-6 py-3">Owner</th>
                          <th className="px-6 py-3">Location</th>
                          <th className="px-6 py-3">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                        {filterListings(listings.caterers).map((c: any) => (
                          <tr key={c.id}>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              <div>{c.name || "Unnamed"}</div>
                              <div className="text-xs text-gray-400 font-normal">slug: {c.slug}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div>{c.owner.name}</div>
                              <div className="text-xs text-gray-400">{c.owner.email}</div>
                            </td>
                            <td className="px-6 py-4">{c.service_areas || "Not set"}</td>
                            <td className="px-6 py-4">{new Date(c.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {listingSubTab === "planners" && (
                    <>
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-6 py-3">Planner</th>
                          <th className="px-6 py-3">Owner</th>
                          <th className="px-6 py-3">Service Areas</th>
                          <th className="px-6 py-3">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                        {filterListings(listings.planners).map((p: any) => (
                          <tr key={p.id}>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              <div>{p.name || "Unnamed"}</div>
                              <div className="text-xs text-gray-400 font-normal">slug: {p.slug}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div>{p.owner.name}</div>
                              <div className="text-xs text-gray-400">{p.owner.email}</div>
                            </td>
                            <td className="px-6 py-4">{p.service_areas || "Not set"}</td>
                            <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Orders & Bookings */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search Filters */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-900 font-heading">Transactions Feed</h3>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search orders customer, merchant..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Merchant</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                  {orders
                    .filter((o: any) =>
                      o.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.type.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((o: any) => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">{new Date(o.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{o.type}</td>
                        <td className="px-6 py-4">{o.merchantName}</td>
                        <td className="px-6 py-4">{o.customerName}</td>
                        <td className="px-6 py-4 font-semibold">€{o.amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            o.status === 'confirmed' || o.status === 'delivered' || o.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : o.status === 'cancelled' || o.status === 'failed'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No orders or bookings placed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: AI Tools */}
        {activeTab === "ai-tools" && (
          <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                onClick={() => setAiSubTab("sitemap")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  aiSubTab === "sitemap" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sitemap Monitor
              </button>
              <button
                onClick={() => setAiSubTab("competitor")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  aiSubTab === "competitor" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Competitor Intelligence
              </button>
              <button
                onClick={() => setAiSubTab("geo")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  aiSubTab === "geo" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Geo-Targeting Engine
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {aiSubTab === "sitemap" && (
                <div className="p-6 lg:p-8">
                  <SitemapMonitor />
                </div>
              )}
              {aiSubTab === "competitor" && (
                <div className="p-6 lg:p-8">
                  <CompetitorMonitor />
                </div>
              )}
              {aiSubTab === "geo" && (
                <div className="p-6 lg:p-8">
                  <GeoTargetingEngine />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
