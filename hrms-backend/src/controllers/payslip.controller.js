// import PDFDocument from "pdfkit";
// import Payroll from "../models/Payroll.js";
// import Employee from "../models/Employee.js";

// export const getPayslip = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const payroll = await Payroll.findById(id);
//         if (!payroll) {
//             return res.status(404).json({ message: "Payroll not found" });
//         }

//         // 🔐 Access control
//         if (
//             req.user.role === "employee" &&
//             String(payroll.employeeId) !== String(req.user.employeeId)
//         ) {
//             return res.status(403).json({ message: "Access denied" });
//         }

//         const employee = await Employee.findById(payroll.employeeId);

//         const [year, mon] = payroll.month.split("-");
//         const monthName = new Date(year, mon - 1).toLocaleString("default", {
//             month: "long",
//         });

//         const payslip = {
//             company: {
//                 name: payroll.companyId, // you can replace with companyName later
//                 month: `${monthName} ${year}`,
//             },
//             employee: {
//                 name: employee?.name || payroll.employeeName,
//                 empCode: payroll.empCode,
//             },
//             attendance: {
//                 totalWorkingDays: payroll.totalWorkingDays,
//                 presentDays: payroll.presentDays,
//                 leaveDays: payroll.leaveDays,
//                 halfDays: payroll.halfDays,
//                 absentDays: payroll.absentDays,
//             },
//             salary: {
//                 basicSalary: payroll.basicSalary,
//                 deductions: payroll.deductions,
//                 netSalary: payroll.netSalary,
//             },
//         };

//         res.json(payslip);
//     } catch (err) {
//         console.error("PAYSLIP ERROR:", err);
//         res.status(500).json({ message: err.message });
//     }
// };

// export const downloadPayslipPDF = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const payroll = await Payroll.findById(id);
//     if (!payroll) {
//       return res.status(404).json({ message: "Payroll not found" });
//     }

//     // 🔐 Access control
//     if (
//       req.user.role === "employee" &&
//       String(payroll.employeeId) !== String(req.user.employeeId)
//     ) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const employee = await Employee.findById(payroll.employeeId);

//     const [year, mon] = payroll.month.split("-");
//     const monthName = new Date(year, mon - 1).toLocaleString("default", {
//       month: "long",
//     });

//     /* ---------------- PDF SETUP ---------------- */
//     const doc = new PDFDocument({ size: "A4", margin: 40 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=payslip-${payroll.empCode}-${payroll.month}.pdf`
//     );

//     doc.pipe(res);

//     /* ---------------- HEADER ---------------- */
//     doc
//       .fontSize(18)
//       .text("PAYSLIP", { align: "center", underline: true })
//       .moveDown(0.5);

//     doc
//       .fontSize(11)
//       .text(`Company: ${payroll.companyId}`, { align: "center" })
//       .text(`Month: ${monthName} ${year}`, { align: "center" })
//       .moveDown(1.5);

//     /* ---------------- EMPLOYEE INFO ---------------- */
//     doc.fontSize(12).text("Employee Details", { underline: true });
//     doc.moveDown(0.3);

//     doc
//       .fontSize(10)
//       .text(`Name          : ${employee?.name || payroll.employeeName}`)
//       .text(`Employee Code : ${payroll.empCode}`)
//       .text(`Company ID    : ${payroll.companyId}`)
//       .moveDown(1);

//     /* ---------------- ATTENDANCE SUMMARY ---------------- */
//     doc.fontSize(12).text("Attendance Summary", { underline: true });
//     doc.moveDown(0.3);

//     const attendanceTableTop = doc.y;

//     drawRow(doc, attendanceTableTop, "Total Working Days", payroll.totalWorkingDays);
//     drawRow(doc, attendanceTableTop + 18, "Present Days", payroll.presentDays);
//     drawRow(doc, attendanceTableTop + 36, "Leave Days", payroll.leaveDays);
//     drawRow(doc, attendanceTableTop + 54, "Half Days", payroll.halfDays);
//     drawRow(doc, attendanceTableTop + 72, "Absent Days", payroll.absentDays);

//     doc.moveDown(6);

//     /* ---------------- SALARY DETAILS ---------------- */
//     doc.fontSize(12).text("Salary Details", { underline: true });
//     doc.moveDown(0.3);

//     const salaryTop = doc.y;

//     drawRow(doc, salaryTop, "Basic Salary", `₹ ${payroll.basicSalary}`);
//     drawRow(doc, salaryTop + 18, "Deductions", `₹ ${payroll.deductions}`);
//     drawRow(doc, salaryTop + 36, "Net Salary", `₹ ${payroll.netSalary}`, true);

//     doc.moveDown(6);

//     /* ---------------- FOOTER ---------------- */
//     doc
//       .fontSize(9)
//       .text(
//         "This is a system generated payslip. No signature is required.",
//         { align: "center" }
//       );

//     doc.end();
//   } catch (err) {
//     console.error("PAYSLIP PDF ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ---------------- HELPER: table rows ---------------- */

// function drawRow(doc, y, label, value, highlight = false) {
//   const xLabel = 60;
//   const xValue = 350;

//   if (highlight) {
//     doc
//       .rect(40, y - 4, 520, 20)
//       .fillOpacity(0.08)
//       .fill("#000")
//       .fillOpacity(1);
//   }

//   doc
//     .fontSize(10)
//     .fillColor("black")
//     .text(label, xLabel, y)
//     .text(value, xValue, y, { align: "right", width: 150 });
// }

import PDFDocument from "pdfkit";
import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import Company from "../models/Company.js";

/* ================= GET PAYSLIP (JSON) ================= */

export const getPayslip = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // 🔐 Access control
    if (
      req.user.role === "employee" &&
      String(payroll.employeeId) !== String(req.user.employeeId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const employee = await Employee.findById(payroll.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const company = await Company.findOne({
      companyId: payroll.companyId,
    });

    const [year, mon] = payroll.month.split("-");
    const monthName = new Date(year, mon - 1).toLocaleString("default", {
      month: "long",
    });

    res.json({
      company: {
        name: company?.companyName || payroll.companyId,
        address: company?.address || "",
        month: `${monthName} ${year}`,
      },
      employee: {
        name: employee.name,
        empCode: payroll.empCode,
      },
      attendance: {
        totalWorkingDays: payroll.totalWorkingDays,
        presentDays: payroll.presentDays,
        leaveDays: payroll.leaveDays,
        halfDays: payroll.halfDays,
        absentDays: payroll.absentDays,
      },
      salary: {
        basicSalary: payroll.basicSalary,
        deductions: payroll.deductions,
        netSalary: payroll.netSalary,
      },
    });
  } catch (err) {
    console.error("PAYSLIP ERROR:", err);
    res.status(500).json({ message: "Failed to fetch payslip" });
  }
};

/* ================= DOWNLOAD PAYSLIP PDF ================= */

export const downloadPayslipPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // 🔐 Access control
    if (
      req.user.role === "employee" &&
      String(payroll.employeeId) !== String(req.user.employeeId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const employee = await Employee.findById(payroll.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const company = await Company.findOne({
      companyId: payroll.companyId,
    });

    const [year, mon] = payroll.month.split("-");
    const monthName = new Date(year, mon - 1).toLocaleString("default", {
      month: "long",
    });

    /* ---------------- PDF SETUP ---------------- */
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip-${payroll.empCode}-${payroll.month}.pdf`
    );

    doc.pipe(res);

    /* ---------------- HEADER ---------------- */
    doc
      .fontSize(18)
      .text(company?.companyName || payroll.companyId, {
        align: "center",
        underline: true,
      })
      .moveDown(0.3);

    if (company?.address) {
      doc
        .fontSize(10)
        .text(company.address, { align: "center" })
        .moveDown(0.5);
    }

    doc
      .fontSize(11)
      .text(`Payslip for ${monthName} ${year}`, { align: "center" })
      .moveDown(1.5);

    /* ---------------- EMPLOYEE INFO ---------------- */
    doc.fontSize(12).text("Employee Details", { underline: true });
    doc.moveDown(0.3);

    doc
      .fontSize(10)
      .text(`Name          : ${employee.name}`)
      .text(`Employee Code : ${payroll.empCode}`)
      .moveDown(1);

    /* ---------------- ATTENDANCE SUMMARY ---------------- */
    doc.fontSize(12).text("Attendance Summary", { underline: true });
    doc.moveDown(0.3);

    const attendanceTop = doc.y;

    drawRow(doc, attendanceTop, "Total Working Days", payroll.totalWorkingDays);
    drawRow(doc, attendanceTop + 18, "Present Days", payroll.presentDays);
    drawRow(doc, attendanceTop + 36, "Leave Days", payroll.leaveDays);
    drawRow(doc, attendanceTop + 54, "Half Days", payroll.halfDays);
    drawRow(doc, attendanceTop + 72, "Absent Days", payroll.absentDays);

    doc.moveDown(6);

    /* ---------------- SALARY DETAILS ---------------- */
    doc.fontSize(12).text("Salary Details", { underline: true });
    doc.moveDown(0.3);

    const salaryTop = doc.y;

    drawRow(
      doc,
      salaryTop,
      "Basic Salary",
      `₹ ${payroll.basicSalary.toLocaleString("en-IN")}`
    );
    drawRow(
      doc,
      salaryTop + 18,
      "Deductions",
      `₹ ${payroll.deductions.toLocaleString("en-IN")}`
    );
    drawRow(
      doc,
      salaryTop + 36,
      "Net Salary",
      `₹ ${payroll.netSalary.toLocaleString("en-IN")}`,
      true
    );

    doc.moveDown(6);

    /* ---------------- FOOTER ---------------- */
    doc
      .fontSize(9)
      .text(
        "This is a system generated payslip. No signature is required.",
        { align: "center" }
      );

    doc.end();
  } catch (err) {
    console.error("PAYSLIP PDF ERROR:", err);
    res.status(500).json({ message: "Failed to generate payslip PDF" });
  }
};

/* ================= HELPER ================= */

function drawRow(doc, y, label, value, highlight = false) {
  const xLabel = 60;
  const xValue = 350;

  if (highlight) {
    doc
      .rect(40, y - 4, 520, 20)
      .fillOpacity(0.08)
      .fill("#000")
      .fillOpacity(1);
  }

  doc
    .fontSize(10)
    .fillColor("black")
    .text(label, xLabel, y)
    .text(value, xValue, y, { align: "right", width: 150 });
}

