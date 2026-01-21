import Admin from "../models/Admin.js";

const getEmployeeId = async (req) => {
  // EMPLOYEE LOGIN
  if (req.user.userType === "employee") {
    return req.user.id;
  }

  // ADMIN LOGIN
  if (req.user.userType === "admin") {
    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.employeeId) {
      throw new Error("Admin employee profile not linked");
    }
    return admin.employeeId;
  }

  throw new Error("Invalid user");
};

export default getEmployeeId;
