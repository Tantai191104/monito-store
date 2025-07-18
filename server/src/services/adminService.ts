import OrderModel from "../models/orderModel";
import PetModel from "../models/petModel";
import ProductModel from "../models/productModel";
import UserModel from "../models/userModel";


export const adminService = {
    async getSummary(days: number = 7) {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - days);

        // Tổng số user hiện tại
        const totalUsers = await UserModel.countDocuments({});

        // Số user mới trong n ngày
        const newUsers = await UserModel.countDocuments({
            createdAt: { $gte: pastDate },
        });
        const previousUsers = totalUsers - newUsers;
        const userChangePercent = previousUsers === 0 ? 100 : (newUsers / previousUsers) * 100;
        const userTrend = userChangePercent >= 0 ? "up" : "down";

        // Tổng số staff active
        const activeStaff = await UserModel.countDocuments({
            role: "staff",
            isActive: true,
        });

        // Số staff mới
        const newActiveStaff = await UserModel.countDocuments({
            role: "staff",
            isActive: true,
            createdAt: { $gte: pastDate },
        });
        const staffChange = newActiveStaff;
        const staffTrend = staffChange >= 0 ? "up" : "down";

        // Doanh thu tháng hiện tại và tháng trước
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(startOfCurrentMonth.getTime() - 1);

        const currentMonthOrders = await OrderModel.aggregate([
            {
                $match: {
                    orderDate: { $gte: startOfCurrentMonth },
                    status: { $in: ["delivered", "processing", "refunded"] },
                    paymentStatus: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                },
            },
        ]);

        const currentRevenue = currentMonthOrders[0]?.totalRevenue || 0;

        const lastMonthOrders = await OrderModel.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: startOfLastMonth,
                        $lte: endOfLastMonth,
                    },
                    status: { $in: ["delivered", "processing", "refunded"] },
                    paymentStatus: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                },
            },
        ]);

        const lastRevenue = lastMonthOrders[0]?.totalRevenue || 0;
        const revenueChange =
            lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;
        const revenueTrend = revenueChange >= 0 ? "up" : "down";

        // Mock uptime
        const systemUptime = 99.9;
        const systemUptimeChange = -0.1;
        const uptimeTrend = systemUptimeChange >= 0 ? "up" : "down";

        return [
            {
                name: "Total Users",
                value: totalUsers.toLocaleString(),
                change: `${userChangePercent >= 0 ? "+" : ""}${userChangePercent.toFixed(1)}%`,
                trend: userTrend,
                color: userTrend === "up" ? "text-blue-600" : "text-red-600",
                bgColor: userTrend === "up" ? "bg-blue-50" : "bg-red-50",
            },
            {
                name: "Active Staff",
                value: activeStaff.toString(),
                change: `${staffChange >= 0 ? "+" : ""}${staffChange}`,
                trend: staffTrend,
                color: staffTrend === "up" ? "text-green-600" : "text-red-600",
                bgColor: staffTrend === "up" ? "bg-green-50" : "bg-red-50",
            },
            {
                name: "Total Revenue",
                value: `${currentRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                })}`,
                change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`,
                trend: revenueTrend,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
            },
            {
                name: "System Uptime",
                value: `${systemUptime}%`,
                change: `${systemUptimeChange >= 0 ? "+" : ""}${systemUptimeChange}%`,
                trend: uptimeTrend,
                color: uptimeTrend === "up" ? "text-green-600" : "text-red-600",
                bgColor: uptimeTrend === "up" ? "bg-green-50" : "bg-red-50",
            },
        ];
    },
    async getBussinessMetric(days: number = 1) {
        const now = new Date();

        // ==== PRODUCTS ====
        const totalProducts = await ProductModel.countDocuments();
        const productCompareDate = new Date(now);
        productCompareDate.setDate(productCompareDate.getDate() - days);

        const oldProductCount = await ProductModel.countDocuments({
            createdAt: { $lt: productCompareDate },
        });
        const productDelta = totalProducts - oldProductCount;
        const productChange =
            oldProductCount === 0 ? 100 : (productDelta / oldProductCount) * 100;
        const productTrend = productChange >= 0 ? "up" : "down";

        // ==== PETS ====
        const totalPets = await PetModel.countDocuments();
        const oldPetCount = await PetModel.countDocuments({
            createdAt: { $lt: productCompareDate },
        });
        const petDelta = totalPets - oldPetCount;
        const petChange = oldPetCount === 0 ? 100 : (petDelta / oldPetCount) * 100;
        const petTrend = petChange >= 0 ? "up" : "down";

        // ==== ORDERS ====
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        // Đơn hàng hôm nay
        const ordersToday = await OrderModel.countDocuments({
            orderDate: { $gte: startOfToday, $lt: endOfToday },
        });

        // Đơn hàng hôm qua
        const ordersYesterday = await OrderModel.countDocuments({
            orderDate: { $gte: startOfYesterday, $lt: startOfToday },
        });

        const orderDelta = ordersToday - ordersYesterday;
        const orderChange =
            ordersYesterday === 0 ? 100 : (orderDelta / ordersYesterday) * 100;
        const orderTrend = orderChange >= 0 ? "up" : "down";

        return [
            {
                name: "Products",
                value: totalProducts.toLocaleString(),
                change: `${productChange >= 0 ? "+" : ""}${productChange.toFixed(1)}%`,
                trend: productTrend,
            },
            {
                name: "Pets Registered",
                value: totalPets.toLocaleString(),
                change: `${petChange >= 0 ? "+" : ""}${petChange.toFixed(1)}%`,
                trend: petTrend,
            },
            {
                name: "Orders Today",
                value: ordersToday.toLocaleString(),
                change: `${orderChange >= 0 ? "+" : ""}${orderChange.toFixed(1)}%`,
                trend: orderTrend,
            },
        ];
    },
    async getUserStats() {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);

        const activeToday = await UserModel.countDocuments({
            lastLogin: { $gte: startOfToday },
        });

        const newThisWeek = await UserModel.countDocuments({
            createdAt: { $gte: startOfWeek },
        });

        const suspended = await UserModel.countDocuments({
            isActive: false,
        });
        return [
            { label: "Active Today", value: activeToday, color: "bg-green-500" },
            { label: "New This Week", value: newThisWeek, color: "bg-blue-500" },
            { label: "Suspended", value: suspended, color: "bg-red-500" },
        ];
    },
    async getOrdersByMonth() {
        const orders = await OrderModel.aggregate([
            {
                $match: {
                    orderDate: { $gte: new Date(new Date().getFullYear(), 0, 1) }, // từ tháng 1 năm nay
                    status: { $in: ["delivered", "processing", "refunded"] },
                    paymentStatus: "paid",
                },
            },
            {
                $group: {
                    _id: { $month: "$orderDate" },
                    count: { $sum: 1 },
                    revenue: { $sum: "$total" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        return months.map((month, index) => {
            const match = orders.find((o) => o._id === index + 1);
            return {
                month,
                count: match?.count || 0,
                revenue: match?.revenue || 0,
                profit: match ? Math.round((match.revenue || 0) * 0.1) : 0, // 10% lợi nhuận
            };
        });
    },
    async getOrdersByDay(days = 30) {
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - days + 1); // Lấy đủ 30 ngày gần nhất

        const orders = await OrderModel.aggregate([
            {
                $match: {
                    orderDate: { $gte: startDate },
                    status: { $in: ["delivered", "processing", "refunded"] },
                    paymentStatus: "paid",
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$orderDate" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$total" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Tạo mảng đủ ngày, kể cả ngày không có đơn hàng
        const result = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().slice(0, 10);
            const match = orders.find(o => o._id === dateStr);
            result.push({
                date: dateStr,
                count: match?.count || 0,
                revenue: match?.revenue || 0,
                profit: match ? Math.round((match.revenue || 0) * 0.1) : 0, // 10% lợi nhuận giả lập
            });
        }
        return result;
    },
};
