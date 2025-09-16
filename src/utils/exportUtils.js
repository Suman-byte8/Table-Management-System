export function exportToExcel(data, filename = "export.xlsx") {
  // Convert JSON data to CSV string
  const csvRows = [];
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // Map data rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ("" + (row[header] ?? "")).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  // Create CSV blob
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename.replace(/\.xlsx$/, ".csv"));
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
