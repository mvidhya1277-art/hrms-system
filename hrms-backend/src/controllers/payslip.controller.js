import PDFDocument from "pdfkit";
import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import Company from "../models/Company.js";

/* ================= UTIL ================= */

const safe = (v) => (v !== undefined && v !== null && v !== "" ? v : "-");
const money = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

// Layout constants
const PAGE_LEFT = 30;
const PAGE_RIGHT = 565;
const LABEL_X = 45;
const VALUE_X = 520;
const ROW_GAP = 16;

/* ================= GET PAYSLIP (JSON) ================= */

export const getPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    if (
      req.user.role === "employee" &&
      String(payroll.employeeId) !== String(req.user.employeeId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const employee = await Employee.findById(payroll.employeeId);
    const company = await Company.findOne({ companyId: payroll.companyId });

    const [year, mon] = payroll.month.split("-");
    const monthName = new Date(year, mon - 1).toLocaleString("default", {
      month: "long",
    });

    const attendanceDeduction =
      payroll.attendanceDeduction ??
      payroll.deductions - payroll.statutoryDeductions;

    res.json({
      company: {
        name: company?.companyName,
        month: `${monthName} ${year}`,
      },
      employee: {
        name: employee.name,
        empCode: payroll.empCode,
      },
      attendance: payroll,
      salary: {
        basicSalary: payroll.basicSalary,
        attendanceDeduction,
        pf: payroll.pfAmount,
        esi: payroll.esiAmount,
        professionalTax: payroll.professionalTaxAmount,
        totalDeductions: payroll.deductions,
        netSalary: payroll.netSalary,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch payslip" });
  }
};

/* ================= DOWNLOAD PDF ================= */

export const downloadPayslipPDF = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    if (
      req.user.role === "employee" &&
      String(payroll.employeeId) !== String(req.user.employeeId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const employee = await Employee.findById(payroll.employeeId);
    const company = await Company.findOne({ companyId: payroll.companyId });

    const attendanceDeduction =
      payroll.attendanceDeduction ??
      payroll.deductions - payroll.statutoryDeductions;

    const [year, mon] = payroll.month.split("-");
    const monthName = new Date(year, mon - 1).toLocaleString("default", {
      month: "long",
    });

    const doc = new PDFDocument({ size: "A4", margin: 30 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip-${payroll.empCode}-${payroll.month}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */

    doc.font("Helvetica-Bold").fontSize(15).text(
      company?.companyName || "COMPANY NAME",
      { align: "center" }
    );

    doc
      .fontSize(9)
      .font("Helvetica")
      .text("This is a computer generated payslip. No signature required.", {
        align: "center",
      });

    doc
      .moveDown(0.4)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`PAY SLIP – ${monthName} ${year}`, { align: "center" });

    drawDivider(doc);

    /* ================= EMPLOYEE DETAILS ================= */

    drawSection(doc, "EMPLOYEE DETAILS");
    drawRow(doc, "Employee ID", payroll.empCode);
    drawRow(doc, "Name", employee.name);
    drawRow(doc, "Designation", safe(employee.designation));
    drawRow(doc, "Department", safe(employee.department));
    drawRow(doc, "Date of Joining", safe(employee.joiningDate));
    drawRow(doc, "Bank A/C No", safe(employee.accountNumber));
    drawRow(doc, "IFSC", safe(employee.ifsc));

    /* ================= ATTENDANCE ================= */

    drawSection(doc, "ATTENDANCE SUMMARY");
    drawRow(doc, "Total Working Days", payroll.totalWorkingDays);
    drawRow(doc, "Present Days", payroll.presentDays);
    drawRow(doc, "Half Days", payroll.halfDays);
    drawRow(doc, "Absent Days", payroll.absentDays);

    /* ================= EARNINGS ================= */

    drawSection(doc, "EARNINGS");
    drawRow(doc, "Basic Salary", money(payroll.basicSalary));

    /* ================= DEDUCTIONS ================= */

    drawSection(doc, "DEDUCTIONS");
    drawRow(doc, "Attendance / LOP Deduction", money(attendanceDeduction));
    drawRow(doc, "Provident Fund (PF)", money(payroll.pfAmount));
    drawRow(doc, "ESI", money(payroll.esiAmount));
    drawRow(doc, "Professional Tax", money(payroll.professionalTaxAmount));

    drawRow(
      doc,
      "TOTAL DEDUCTIONS",
      money(payroll.deductions),
      true
    );

    /* ================= NET PAY ================= */

    drawSection(doc, "NET SALARY");

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("red")
      .text(
        `NET SALARY PAYABLE : ${money(payroll.netSalary)}`,
        PAGE_LEFT,
        doc.y,
        { align: "center" }
      )
      .fillColor("black");

    doc
      .moveDown(1)
      .fontSize(9)
      .text(
        `Generated on ${new Date().toLocaleDateString()} | HRMS`,
        { align: "center" }
      );

    doc.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to generate payslip PDF" });
  }
};

/* ================= DRAW HELPERS ================= */

function drawDivider(doc) {
  doc.moveDown(0.4);
  doc.moveTo(PAGE_LEFT, doc.y).lineTo(PAGE_RIGHT, doc.y).stroke();
  doc.moveDown(0.6);
}

function drawSection(doc, title) {
  doc.moveDown(0.6);
  doc
    .rect(PAGE_LEFT, doc.y, PAGE_RIGHT - PAGE_LEFT, 18)
    .stroke();
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(title, PAGE_LEFT + 8, doc.y + 4);
  doc.moveDown(1.4);
}

function drawRow(doc, label, value, isTotal = false) {
  doc
    .font(isTotal ? "Helvetica-Bold" : "Helvetica")
    .fontSize(10)
    .fillColor(isTotal ? "red" : "black")
    .text(label, LABEL_X, doc.y, { width: 260 });

  doc
    .font(isTotal ? "Helvetica-Bold" : "Helvetica")
    .fontSize(10)
    .fillColor(isTotal ? "red" : "black")
    .text(value, VALUE_X, doc.y, {
      align: "right",
      width: 150,
    });

  doc.moveDown(0.6);
  doc.fillColor("black");
}

