import PayrollSettings from "../../models/PayrollSettings.js";

/**
 * GET Payroll Settings
 * HR Admin only
 */
export const getPayrollSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findOne({
      companyId: req.user.companyId,
    });

    res.json({
      success: true,
      settings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE Payroll Settings
 * HR Admin only
 */
export const updatePayrollSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findOneAndUpdate(
      { companyId: req.user.companyId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Payroll settings updated successfully",
      settings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
