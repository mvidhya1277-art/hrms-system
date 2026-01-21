import Company from "../models/Company.js";

/* SUPER ADMIN → CREATE COMPANY */
export const createCompany = async (req, res) => {
  try {
    const { companyId, companyName } = req.body;

    if (!companyId || !companyName) {
      return res.status(400).json({ message: "Company ID & name required" });
    }

    const exists = await Company.findOne({ companyId });
    if (exists) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const company = await Company.create({
      companyId,
      companyName,
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (err) {
    console.error("CREATE COMPANY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};