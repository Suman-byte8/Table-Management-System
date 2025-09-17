// src/utils/exportUtils.js
import * as XLSX from 'xlsx'; // Make sure you have installed xlsx: npm install xlsx

/**
 * Exports data to an Excel file with improved handling of nested objects and column selection.
 * @param {Array} data - The array of objects to export.
 * @param {string} filename - The desired filename for the exported file (e.g., 'data.xlsx').
 * @param {Array} columns - An array defining which columns to include and how to format them.
 *                          Each item is an object: { key: 'path.to.data', label: 'Column Header', format: (value) => ... }
 *                          If not provided, it will try to flatten the first object's keys.
 */
export const exportToExcel = (data, filename = 'export.xlsx', columns = null) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data provided for export.');
    alert('No data available to export.');
    return;
  }

  let processedData = [];

  if (columns && Array.isArray(columns) && columns.length > 0) {
    // Use provided column definitions
    processedData = data.map(item => {
      const row = {};
      columns.forEach(col => {
        // Simple path resolution (e.g., 'guestInfo.name')
        const keys = col.key.split('.');
        let value = item;
        for (const key of keys) {
          value = value ? value[key] : '';
        }
        // Apply formatting if provided
        row[col.label] = col.format ? col.format(value, item) : value;
      });
      return row;
    });
  } else {
    // Fallback: Try to flatten the first object's keys for column names
    // This is less reliable for deeply nested or inconsistent data
    console.warn('No column definitions provided, attempting to flatten data.');
    processedData = data.map(item => {
      const flattened = {};
      const flatten = (obj, prefix = '') => {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              // Recurse for nested objects, but stop at guestInfo level for display
              if (newKey === 'guestInfo') {
                 // Handle guestInfo specifically
                 flattened['Guest Name'] = obj[key].name || '';
                 flattened['Guest Phone'] = obj[key].phoneNumber || '';
                 flattened['Guest Email'] = obj[key].email || '';
              } else {
                 flatten(obj[key], newKey);
              }
            } else {
              // For arrays or primitives, or if we don't want to recurse further
              flattened[newKey] = obj[key];
            }
          }
        }
      };
      flatten(item);
      return flattened;
    });
  }

  // Create a new workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(processedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Trigger download
  XLSX.writeFile(wb, filename);
  console.log(`Exported data to ${filename}`);
};

// Specific export function for reservations
export const exportReservationsToExcel = async (fetchReservationsFunction) => {
  try {
    // --- Fetch Data ---
    // Pass the function to get the latest data, respecting any filters applied in the UI
    const rawData = await fetchReservationsFunction();
    const reservations = Array.isArray(rawData) ? rawData : rawData?.data || [];

    if (!reservations || reservations.length === 0) {
      alert('No reservations found to export.');
      return;
    }

    // --- Define Columns ---
    const reservationColumns = [
      { key: '_id', label: 'Reservation ID' },
      { key: 'guestInfo.name', label: 'Guest Name' },
      { key: 'guestInfo.phoneNumber', label: 'Phone Number' },
      { key: 'guestInfo.email', label: 'Email' },
      { key: 'typeOfReservation', label: 'Section' },
      { key: 'noOfDiners', label: 'Party Size' },
      {
        key: 'date',
        label: 'Reservation Date',
        format: (value) => value ? new Date(value).toLocaleDateString() : ''
      },
      { key: 'timeSlot', label: 'Time Slot' },
      { key: 'specialRequests', label: 'Special Requests' },
      { key: 'additionalDetails', label: 'Additional Details' },
      {
        key: 'status',
        label: 'Status',
        format: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : ''
      },
      {
        key: 'createdAt',
        label: 'Created At',
        format: (value) => value ? new Date(value).toLocaleString() : ''
      },
      {
        key: 'updatedAt',
        label: 'Last Updated',
        format: (value) => value ? new Date(value).toLocaleString() : ''
      },
      // Add more columns as needed, like assignedTable, staff, etc., if available
    ];

    // --- Export ---
    exportToExcel(reservations, "reservations_export.xlsx", reservationColumns);

  } catch (error) {
    console.error("Failed to export reservations:", error);
    alert("Failed to export reservations. Please try again.");
  }
};