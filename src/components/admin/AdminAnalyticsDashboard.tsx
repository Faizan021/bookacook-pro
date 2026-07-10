import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { fetchAnalyticsData } from "@/lib/admin/analytics.functions";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  MousePointerClick,
  Clock,
  Calendar,
  Globe,
  Link,
  MapPin,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export function AdminAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<"-7d" | "-14d" | "-30d" | "-90d">("-30d");
  const fetchAnalytics = useServerFn(fetchAnalyticsData);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "analytics", dateRange],
    queryFn: () => fetchAnalytics({ data: { dateFrom: dateRange } }),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 mins
  });

  const getDaysLabel = () => {
    switch (dateRange) {
      case "-7d":
        return "Last 7 Days";
      case "-14d":
        return "Last 14 Days";
      case "-30d":
        return "Last 30 Days";
      case "-90d":
        return "Last 90 Days";
      default:
        return "Last 30 Days";
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div>
          <h3 className="text-lg font-bold text-red-900">Failed to load analytics</h3>
          <p className="text-sm text-red-700 mt-1">{error.message}</p>
        </div>
        <p className="text-xs text-red-600 max-w-md">
          Make sure POSTHOG_PROJECT_ID and POSTHOG_PERSONAL_API_KEY are correctly set in the
          environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-forest flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-forest" />
            Traffic & Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">Live insights powered by PostHog</p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          {(["-7d", "-14d", "-30d", "-90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                dateRange === range
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {range.replace("-", "").replace("d", " Days")}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
        </div>
      ) : data ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1 font-heading">
                  {data.kpis.uniqueVisitors.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-cream rounded-xl text-forest">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pageviews</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1 font-heading">
                  {data.kpis.pageviews.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <MousePointerClick className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Est. Sessions</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1 font-heading">
                  {data.kpis.sessions.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-heading">
              Traffic Trend ({getDaysLabel()})
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(val) => {
                      const date = new Date(val);
                      return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
                    }}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    name="Pageviews"
                    dataKey="pageviews"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    name="Visitors"
                    dataKey="visitors"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Top Pages</h3>
              </div>
              <div className="p-0 overflow-y-auto max-h-[400px]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white sticky top-0 border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3 font-medium text-gray-500">Path</th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.topPages.length > 0 ? (
                      data.topPages.map((page: any, i: number) => {
                        try {
                          const url = new URL(page.name);
                          return (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="px-5 py-3 text-gray-900 font-medium truncate max-w-[200px]">
                                {url.pathname}
                              </td>
                              <td className="px-5 py-3 text-gray-600 text-right">
                                {page.count.toLocaleString()}
                              </td>
                            </tr>
                          );
                        } catch {
                          return (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="px-5 py-3 text-gray-900 font-medium truncate max-w-[200px]">
                                {page.name}
                              </td>
                              <td className="px-5 py-3 text-gray-600 text-right">
                                {page.count.toLocaleString()}
                              </td>
                            </tr>
                          );
                        }
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-5 py-8 text-center text-gray-500">
                          No page data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Referrers & Sources */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Top Referrers</h3>
              </div>
              <div className="p-0 overflow-y-auto max-h-[190px]">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-50">
                    {data.referrers.length > 0 ? (
                      data.referrers.map((ref: any, i: number) => {
                        const domain =
                          ref.name.replace("https://", "").replace("http://", "").split("/")[0] ||
                          "Direct";
                        return (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="px-5 py-3 text-gray-900 font-medium truncate max-w-[200px]">
                              {domain === "$direct" ? "Direct / None" : domain}
                            </td>
                            <td className="px-5 py-3 text-gray-600 text-right">
                              {ref.count.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-5 py-8 text-center text-gray-500">
                          No referrer data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-5 border-y border-gray-100 bg-gray-50 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">UTM Sources</h3>
              </div>
              <div className="p-0 overflow-y-auto max-h-[190px]">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-50">
                    {data.sources.length > 0 ? (
                      data.sources.map((src: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3 text-gray-900 font-medium truncate max-w-[200px] capitalize">
                            {src.name}
                          </td>
                          <td className="px-5 py-3 text-gray-600 text-right">
                            {src.count.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-5 py-8 text-center text-gray-500">
                          No UTM source data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
