import axios from "axios";
import { API_BASE_URL } from "../constants/api";

export const getAdminDashboard = async (token) => {
  const res = await axios.get(
    `${API_BASE_URL}/dashboard/admin`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

