import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMonthlyOrders } from "@/services/adminService";

const MonthlyOrderChart = () => {
  const [data, setData] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      try {
        const res = await getMonthlyOrders();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch monthly order stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">Monthly Orders</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Number of orders for each month
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} barGap={16}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                wrapperClassName="rounded-md shadow-md"
                contentStyle={{ borderRadius: 8, fontSize: 14 }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                barSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyOrderChart;
