import Holiday from "../models/Holiday.js";

/**
 * 🔹 Create Holiday (ADMIN)
 * POST /api/holidays
 */
export const createHoliday = async (req, res) => {
    try {
        if (!["hr_admin", "super_admin"].includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { date, name } = req.body;

        if (!date || !name) {
            return res.status(400).json({ message: "date and name are required" });
        }

        // prevent duplicate holiday on same date
        const exists = await Holiday.findOne({
            date,
            companyId: req.user.companyId,
        });

        if (exists) {
            return res.status(400).json({
                message: "Holiday already exists for this date",
            });
        }

        const holiday = await Holiday.create({
            date,
            name,
            companyId: req.user.companyId,
        });

        
        res.status(201).json({
            message: "Holiday created successfully",
            holiday,
        });
    } catch (err) {
        console.error("CREATE HOLIDAY ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * 🔹 Get all holidays (ADMIN)
 * GET /api/holidays
 */
export const getAllHolidays = async (req, res) => {
    try {
        if (!["hr_admin", "super_admin"].includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const holidays = await Holiday.find({
            companyId: req.user.companyId,
        }).sort({ date: 1 });

        res.json(holidays);
    } catch (err) {
        console.error("GET HOLIDAYS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * 🔹 Delete holiday (ADMIN)
 * DELETE /api/holidays/:id
 */
export const deleteHoliday = async (req, res) => {
    try {
        if (!["hr_admin", "super_admin"].includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const holiday = await Holiday.findOneAndDelete({
            _id: req.params.id,
            companyId: req.user.companyId,
        });

        if (!holiday) {
            return res.status(404).json({ message: "Holiday not found" });
        }

        res.json({ message: "Holiday deleted successfully" });
    } catch (err) {
        console.error("DELETE HOLIDAY ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
