// ===== SIMPLE & REUSABLE DATE CONVERTER =====

// Step 1: Define supported date formats
const supportedFormats = [
    "DD-MM-YYYY", "DD/MM/YYYY", "MM-DD-YYYY", "MM/DD/YYYY", 
    "YYYY-MM-DD", "YYYY/MM/DD", "DD.MM.YYYY"
];

// Step 2: Determine separator and component positions
function getFormatInfo(formatString) {
    const separator = formatString.match(/[-/\.]/)[0];
    const components = formatString.split(separator);
    
    return {
        separator: separator,
        components: components, // e.g., ["DD", "MM", "YYYY"]
        pattern: new RegExp(`^(\\d{1,2})${separator === '.' ? '\\.' : separator}(\\d{1,2})${separator === '.' ? '\\.' : separator}(\\d{4})$`)
    };
}

// Step 3: Extract date components from input string
function extractDateParts(dateString, formatInfo) {
    const match = dateString.match(formatInfo.pattern);
    
    if (!match) return null;
    
    // Create an object to store date parts
    const parts = {
        [formatInfo.components[0]]: parseInt(match[1]),
        [formatInfo.components[1]]: parseInt(match[2]),
        [formatInfo.components[2]]: parseInt(match[3])
    };
    
    return parts;
}

// Step 4: Validate if date is correct (check valid day, month, year)
function isValidDateValue(day, month, year) {
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;
    if (year < 1000 || year > 9999) return false;
    
    // Days in each month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Handle leap year
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        daysInMonth[1] = 29;
    }
    
    return day <= daysInMonth[month - 1];
}

// Step 5: Create JavaScript Date object from parts
function createDateObject(parts) {
    const { DD, MM, YYYY } = parts;
    
    if (!isValidDateValue(DD || parts.day, MM || parts.month, YYYY || parts.year)) {
        return null;
    }
    
    const day = DD || parts.day;
    const month = MM || parts.month;
    const year = YYYY || parts.year;
    
    return new Date(year, month - 1, day);
}

// Step 6: Format date object into desired format
function formatDateOutput(dateObject, outputFormat) {
    if (!dateObject || isNaN(dateObject.getTime())) {
        return "Invalid Date";
    }
    
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][dateObject.getMonth()];
    
    // Replace placeholders with actual values
    return outputFormat
        .replace(/DD/g, day)
        .replace(/MM/g, month)
        .replace(/YYYY/g, year)
        .replace(/MMM/g, monthName);
}

// ===== MAIN FUNCTION: Convert Date to Desired Format =====
/**
 * Simple function to convert any date to desired format
 * @param {string} inputDate - The date string to convert (e.g., "25/12/2023")
 * @param {string} inputFormat - Format of input date (e.g., "DD/MM/YYYY")
 * @param {string} outputFormat - Desired output format (e.g., "YYYY-MM-DD")
 * @returns {string} - Formatted date or error message
 */
function convertDateFormat(inputDate, inputFormat, outputFormat) {
    // Validate inputs
    if (!inputDate || !inputFormat || !outputFormat) {
        return "Error: Please provide date, input format, and output format";
    }
    
    // Check if formats are supported
    if (!supportedFormats.includes(inputFormat) && inputFormat !== "auto") {
        return `Error: Input format '${inputFormat}' is not supported`;
    }
    
    if (!supportedFormats.includes(outputFormat) && outputFormat !== "MMM DD, YYYY" && outputFormat !== "DD MMM YYYY") {
        return `Error: Output format '${outputFormat}' is not supported`;
    }
    
    // Trim whitespace
    inputDate = inputDate.trim();
    
    // Handle auto-detect
    if (inputFormat === "auto") {
        for (let format of supportedFormats) {
            const result = convertDateFormat(inputDate, format, outputFormat);
            if (!result.includes("Error") && !result.includes("Invalid")) {
                return result;
            }
        }
        return "Error: Could not detect date format";
    }
    
    // Step-by-step conversion
    const formatInfo = getFormatInfo(inputFormat);
    const dateParts = extractDateParts(inputDate, formatInfo);
    
    if (!dateParts) {
        return `Error: Date does not match format ${inputFormat}`;
    }
    
    const dateObject = createDateObject(dateParts);
    
    if (!dateObject) {
        return "Error: Invalid date (check day/month values)";
    }
    
    const result = formatDateOutput(dateObject, outputFormat);
    return result;
}

function convertDate() {
    const input = document.getElementById("inputDate").value;
    const inputFormat = document.getElementById("inputFormat").value;
    const outputFormat = document.getElementById("outputFormat").value;
    
    if (!input) {
        document.getElementById("result").innerText = "Please enter a date";
        return;
    }
    
    // Use the main conversion function
    const result = convertDateFormat(input, inputFormat, outputFormat);
    document.getElementById("result").innerText = result;
}

// Update current date and time dynamically
function updateCurrentDate() {
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const day = now.getDate().toString().padStart(2, '0');
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const dayName = dayNames[now.getDay()];
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    document.getElementById("currentDate").innerText = `${dayName}, ${day} ${month} ${year}`;
    document.getElementById("currentTime").innerText = `${hours}:${minutes}:${seconds}`;
}

// Update date and time on page load and every second
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    setInterval(updateCurrentDate, 1000);
});