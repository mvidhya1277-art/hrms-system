import Holiday from "../models/Holiday.js";
import dayjs from "dayjs";

const isAdmin = (user) =>
  ["hr_admin", "super_admin"].includes(user.role);

export const createHoliday = async (req, res) => {
  try {
    if (!isAdmin(req.user))
      return res.status(403).json({ message: "Access denied" });

    const { date, name } = req.body;
    if (!date || !name)
      return res.status(400).json({ message: "date and name are required" });

    let parsedDate;

    // Accept both DD/MM/YYYY and ISO formats
    if (date.includes("/")) {
      const [d, m, y] = date.split("/");
      parsedDate = new Date(`${y}-${m}-${d}`);
    } else {
      parsedDate = new Date(date);
    }

    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const normalizedDate = dayjs(parsedDate).startOf("day").toDate();

    const exists = await Holiday.findOne({
      date: normalizedDate,
      companyId: req.user.companyId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Holiday already exists for this date",
      });
    }

    const holiday = await Holiday.create({
      date: normalizedDate,
      name,
      companyId: req.user.companyId,
    });

    res.status(201).json({ message: "Holiday created", holiday });
  } catch (err) {
    console.error("CREATE HOLIDAY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ADMIN VIEW */
export const getAllHolidays = async (req, res) => {
  try {
    if (!isAdmin(req.user))
      return res.status(403).json({ message: "Access denied" });

    const holidays = await Holiday.find({
      companyId: req.user.companyId,
    }).sort({ date: 1 });

    res.json(holidays);
  } catch (err) {
    console.error("GET HOLIDAYS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
export const deleteHoliday = async (req, res) => {
  try {
    if (!isAdmin(req.user))
      return res.status(403).json({ message: "Access denied" });

    const holiday = await Holiday.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!holiday)
      return res.status(404).json({ message: "Holiday not found" });

    res.json({ message: "Holiday deleted" });
  } catch (err) {
    console.error("DELETE HOLIDAY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const updateHoliday = async (req, res) => {
  try {
    if (!isAdmin(req.user))
      return res.status(403).json({ message: "Access denied" });

    const { name, date } = req.body;
    const update = {};

    if (name) update.name = name;

    if (date) {
      let parsedDate;

      if (date.includes("/")) {
        const [d, m, y] = date.split("/");
        parsedDate = new Date(`${y}-${m}-${d}`);
      } else {
        parsedDate = new Date(date);
      }

      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      update.date = dayjs(parsedDate).startOf("day").toDate();
    }

    const holiday = await Holiday.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      update,
      { new: true }
    );

    if (!holiday)
      return res.status(404).json({ message: "Holiday not found" });

    res.json({ message: "Holiday updated", holiday });
  } catch (err) {
    console.error("UPDATE HOLIDAY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* EMPLOYEE VIEW */
export const getCompanyHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find({
      companyId: req.user.companyId,
    }).sort({ date: 1 });

    res.json(holidays);
  } catch (err) {
    console.error("PUBLIC HOLIDAY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
