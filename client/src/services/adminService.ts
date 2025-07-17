import API from "@/lib/axios";


export const getAllSummary = async (days: number) => {
  try {
    const res = await API.get("/admin/summary", {
      params: { days },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    throw error;
  }
};

export const getBussinessMetric = async (days: number) => {
  try {
    const res = await API.get("/admin/metrics/business", {
      params: { days },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    throw error;
  }
};

export const getUserStatistics = async () => {
  try {
    const res = await API.get("/admin/stats/users");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    throw error;
  }
};

export const getDailyRevenue = async (days = 30) => {
  try {
    const res = await API.get(`/admin/stats/orders/daily?days=${days}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch daily revenue:", error);
    throw error;
  }
};

export const getMonthlyOrders = async () => {
  try {
    const res = await API.get("/admin/stats/orders/monthly");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch monthly orders:", error);
    throw error;
  }
};