import Company from "../../models/Company.js";

export const getCompanySettings = async (req, res) => {
  try {
    const company = await Company.findOne({
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company settings not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Get Company Settings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company settings",
    });
  }
};

export const updateCompanySettings = async (req, res) => {
  try {
    const updates = {};

    /* ---------------- ADDRESS ---------------- */
    if (req.body.address !== undefined) {
      updates.address = req.body.address;
    }

    /* ---------------- OFFICE TIMINGS ---------------- */
    if (req.body.officeTimings) {
      const { startTime, endTime } = req.body.officeTimings;

      if (!startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "Both office start and end time are required",
        });
      }

      updates.officeTimings = { startTime, endTime };
    }

    /* ---------------- WEEKENDS (🔥 FIX HERE) ---------------- */
    if (req.body.weekends) {
      const { sundayOff, saturday } = req.body.weekends;

      updates.weekends = {
        sundayOff: sundayOff ?? true,
        saturday: {
          enabled: Boolean(saturday?.enabled),
          offWeeks: Array.isArray(saturday?.offWeeks)
            ? saturday.offWeeks
            : [],
        },
      };
    }


    const company = await Company.findOneAndUpdate(
      {
        companyId: req.user.companyId,
        isActive: true,
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company settings updated successfully",
      data: company,
    });
  } catch (error) {
    console.error("Update Company Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
