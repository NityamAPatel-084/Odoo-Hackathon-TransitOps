import { jsPDF } from 'jspdf';
import { Vehicle, Driver, Trip, MaintenanceLog, FuelLog, Expense, SystemConfig } from '../types';

interface PDFExportData {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: MaintenanceLog[];
  fuelLogs: FuelLog[];
  expenses: Expense[];
  config: SystemConfig;
  userRole: string;
  currentTab: string;
}

export function exportPDFStatement({
  vehicles,
  drivers,
  trips,
  maintenance,
  fuelLogs,
  expenses,
  config,
  userRole,
  currentTab
}: PDFExportData) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Corporate Header Banner (Deep Navy / Slate Charcoal color #1e293b)
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Accent line (Orange/Amber)
    doc.setFillColor(217, 119, 6);
    doc.rect(0, 41, pageWidth, 1, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text("TRANSITOPS LEDGER", 15, 18);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225); // Slate-300
    doc.text("CENTRALIZED FLEET TELEMETRY & COMPLIANCE SYSTEM STATEMENT", 15, 25);

    // Meta-information right-aligned in header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    const timeStr = new Date().toLocaleString();
    doc.text(`Generated: ${timeStr}`, pageWidth - 90, 15);
    doc.text(`Depot Terminal: ${config.depotName || "Main Hub"}`, pageWidth - 90, 20);
    doc.text(`Role Authority: ${userRole.toUpperCase().replace('_', ' ')}`, pageWidth - 90, 25);
    doc.text(`Section Ledger: ${currentTab.toUpperCase().replace('-', ' ')}`, pageWidth - 90, 30);

    yPos = 52;

    const drawHeaderLine = (title: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(title, 15, yPos);
      yPos += 2.5;
      doc.setDrawColor(217, 119, 6); // Orange Amber accent
      doc.setLineWidth(0.5);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 8;
    };

    const checkPageBreak = (needed: number) => {
      if (yPos + needed > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
        
        // Secondary Header line
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("TRANSITOPS CENTRAL LEDGER STATEMENT (CONTINUED)", 15, 12);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(15, 14, pageWidth - 15, 14);
        yPos = 20;
      }
    };

    // Render report depending on the selected tab
    if (currentTab === 'vehicles') {
      drawHeaderLine("REGISTERED FLEET ASSET REGISTRY");

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("REG NO", 18, yPos + 5.5);
      doc.text("ASSET NAME", 52, yPos + 5.5);
      doc.text("TYPE", 92, yPos + 5.5);
      doc.text("ACQUISITION COST", 122, yPos + 5.5);
      doc.text("ODOMETER", 158, yPos + 5.5);
      doc.text("STATUS", pageWidth - 32, yPos + 5.5);
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      vehicles.forEach(v => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.text(v.registrationNumber, 18, yPos + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(v.name || v.model, 52, yPos + 5);
        doc.text(v.type || "Heavy Truck", 92, yPos + 5);
        doc.text(`$${(v.acquisitionCost || 0).toLocaleString()}`, 122, yPos + 5);
        doc.text(`${(v.odometer || 0).toLocaleString()} ${config.distanceUnit}`, 158, yPos + 5);
        
        // Status color code
        const status = v.status || 'Available';
        if (status === 'Available') doc.setTextColor(16, 185, 129); // green
        else if (status === 'On Trip') doc.setTextColor(59, 130, 246); // blue
        else doc.setTextColor(239, 68, 68); // red

        doc.text(status, pageWidth - 32, yPos + 5);
        doc.setTextColor(30, 41, 59); // Reset color

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.15);
        doc.line(15, yPos + 8, pageWidth - 15, yPos + 8);
        yPos += 8;
      });

    } else if (currentTab === 'drivers') {
      drawHeaderLine("COMPLIANT ACTIVE OPERATORS & CDL DRIVER REGISTER");

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("DRIVER ID", 18, yPos + 5.5);
      doc.text("OPERATOR NAME", 48, yPos + 5.5);
      doc.text("CDL LICENSE", 92, yPos + 5.5);
      doc.text("EXPIRY DATE", 128, yPos + 5.5);
      doc.text("SAFETY SCORE", 158, yPos + 5.5);
      doc.text("STATUS", pageWidth - 32, yPos + 5.5);
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      drivers.forEach(d => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.text(d.id, 18, yPos + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(d.name, 48, yPos + 5);
        doc.text(d.licenseNumber, 92, yPos + 5);
        
        // Expiry color code
        const isExpired = new Date(d.licenseExpiryDate) < new Date();
        if (isExpired) {
          doc.setTextColor(239, 68, 68);
          doc.text(`${d.licenseExpiryDate} (EXP)`, 128, yPos + 5);
        } else {
          doc.text(d.licenseExpiryDate, 128, yPos + 5);
        }
        doc.setTextColor(30, 41, 59);

        // Safety score color code
        if (d.safetyScore >= 90) {
          doc.setTextColor(16, 185, 129);
        } else if (d.safetyScore >= 80) {
          doc.setTextColor(217, 119, 6);
        } else {
          doc.setTextColor(239, 68, 68);
        }
        doc.text(`${d.safetyScore}/100`, 158, yPos + 5);
        doc.setTextColor(30, 41, 59);

        doc.text(d.status, pageWidth - 32, yPos + 5);

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.15);
        doc.line(15, yPos + 8, pageWidth - 15, yPos + 8);
        yPos += 8;
      });

    } else if (currentTab === 'trips') {
      drawHeaderLine("TRIP DISPATCH LOADS & ROUTE AUDITS");

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("TRIP ID", 18, yPos + 5.5);
      doc.text("ROUTE DETAILS", 45, yPos + 5.5);
      doc.text("VEHICLE", 108, yPos + 5.5);
      doc.text("ASSIGNED DRIVER", 135, yPos + 5.5);
      doc.text("DISTANCE", 168, yPos + 5.5);
      doc.text("STATUS", pageWidth - 32, yPos + 5.5);
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      trips.forEach(t => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.text(t.id, 18, yPos + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(`${t.source} ➔ ${t.destination}`, 45, yPos + 5);
        doc.text(t.vehicleReg, 108, yPos + 5);
        doc.text(t.driverId || 'Unassigned', 135, yPos + 5);
        doc.text(`${t.plannedDistance} ${config.distanceUnit}`, 168, yPos + 5);
        doc.text(t.status, pageWidth - 32, yPos + 5);

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.15);
        doc.line(15, yPos + 8, pageWidth - 15, yPos + 8);
        yPos += 8;
      });

    } else if (currentTab === 'maintenance') {
      drawHeaderLine("FLEET PREVENTIVE MAINTENANCE & SERVICE LEDGER");

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("REPAIR ID", 18, yPos + 5.5);
      doc.text("VEHICLE REG", 45, yPos + 5.5);
      doc.text("SERVICE TYPE / DESCRIPTION", 80, yPos + 5.5);
      doc.text("SERVICE DATE", 140, yPos + 5.5);
      doc.text("REPAIR COST", 168, yPos + 5.5);
      doc.text("STATUS", pageWidth - 32, yPos + 5.5);
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      maintenance.forEach(m => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.text(m.id, 18, yPos + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(m.vehicleReg, 45, yPos + 5);
        doc.text(m.serviceType, 80, yPos + 5);
        doc.text(m.date, 140, yPos + 5);
        doc.text(`$${m.cost.toLocaleString()}`, 168, yPos + 5);
        doc.text(m.status, pageWidth - 32, yPos + 5);

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.15);
        doc.line(15, yPos + 8, pageWidth - 15, yPos + 8);
        yPos += 8;
      });

    } else if (currentTab === 'fuel' || currentTab === 'expenses') {
      drawHeaderLine("FUEL CHARGES & RECENT OPERATION EXPENSES");

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("LOG ID", 18, yPos + 5.5);
      doc.text("VEHICLE REG", 45, yPos + 5.5);
      doc.text("FUEL QUANTITY", 80, yPos + 5.5);
      doc.text("PRICE PER LITRE", 120, yPos + 5.5);
      doc.text("TOTAL COST", 158, yPos + 5.5);
      doc.text("TRANSACTION DATE", pageWidth - 48, yPos + 5.5);
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      fuelLogs.forEach(f => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.text(f.id, 18, yPos + 5);
        doc.setFont('helvetica', 'normal');
        doc.text(f.vehicleReg, 45, yPos + 5);
        doc.text(`${f.liters} L`, 80, yPos + 5);
        doc.text(`$${f.costPerLiter.toFixed(2)}`, 120, yPos + 5);
        doc.text(`$${f.totalCost.toFixed(2)}`, 158, yPos + 5);
        doc.text(f.dateTime, pageWidth - 48, yPos + 5);

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.15);
        doc.line(15, yPos + 8, pageWidth - 15, yPos + 8);
        yPos += 8;
      });

    } else if (currentTab === 'analytics') {
      drawHeaderLine("ANALYTICS AUDIT REPORT");
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text("Comprehensive logistics analytics indicators compiled across vehicles, mileage registries, and maintenance service records.", 15, yPos);
      yPos += 12;

      // Summary table or metrics depending on role
      const expiredDrivers = drivers.filter(d => new Date(d.licenseExpiryDate) < new Date());
      const activeTrips = trips.filter(t => t.status === 'Dispatched');

      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos, pageWidth - 30, 52, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, yPos, pageWidth - 30, 52, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("KEY FLEET TELEMETRY INDICATORS", 20, yPos + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total Registered Active Fleet Vehicles:   ${vehicles.length}`, 20, yPos + 18);
      doc.text(`Total CDL Operators:                     ${drivers.length}`, 20, yPos + 24);
      doc.text(`Current Active Dispatch Trips:          ${activeTrips.length}`, 20, yPos + 30);
      doc.text(`Expired/Warning Safety Licences:         ${expiredDrivers.length}`, 20, yPos + 36);
      doc.text(`Active Unresolved Fleet Shop Repairs:    ${maintenance.filter(m => m.status === 'In Shop').length}`, 20, yPos + 42);

      yPos += 64;

    } else {
      // General Dashboard overview or Fallback
      drawHeaderLine("CENTRAL OPERATIONS CONTROL OVERVIEW");

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Current Active Terminal: ${config.depotName || "Main Hub"}`, 15, yPos);
      yPos += 8;
      doc.text("Summary report covering registered vehicles, active dispatch operators, routes, dispatches, and mechanical compliance logs.", 15, yPos);
      yPos += 14;

      // Highlight stats boxes
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos, 50, 24, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("FLEET VEHICLES", 18, yPos + 7);
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(vehicles.length.toString(), 18, yPos + 18);

      doc.setFillColor(241, 245, 249);
      doc.rect(72, yPos, 50, 24, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("OPERATORS", 75, yPos + 7);
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(drivers.length.toString(), 75, yPos + 18);

      doc.setFillColor(241, 245, 249);
      doc.rect(129, yPos, 50, 24, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("ACTIVE TRIPS", 132, yPos + 7);
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(trips.filter(t => t.status === 'Dispatched').length.toString(), 132, yPos + 18);

      yPos += 35;

      checkPageBreak(50);
      drawHeaderLine("SYSTEM COMPLIANCE LOGS");
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Active Maintenance Tickets: ${maintenance.filter(m => m.status === 'In Shop').length}`, 20, yPos);
      doc.text(`Total Logged Fuel Consumption: ${fuelLogs.reduce((acc, curr) => acc + curr.liters, 0).toLocaleString()} Liters`, 20, yPos + 6);
      doc.text(`Total Operation Fuel Cost: $${fuelLogs.reduce((acc, curr) => acc + curr.totalCost, 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, yPos + 12);
      
      yPos += 22;
    }

    // Footers across all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text("TransitOps Systems Central Ledger - Automated PDF Generation Statement", 15, pageHeight - 10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 32, pageHeight - 10);
    }

    const cleanRole = userRole.toLowerCase().replace(/\s+/g, '_');
    const cleanTab = currentTab.toLowerCase().replace(/\s+/g, '_');
    const fileName = `TransitOps_${cleanRole}_${cleanTab}_Statement.pdf`;
    
    // Save/Download PDF
    doc.save(fileName);
    console.log(`PDF statement downloaded successfully: ${fileName}`);
    return true;
  } catch (error) {
    console.error("PDF programmatic export failed:", error);
    return false;
  }
}
