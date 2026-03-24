// ===== CONFIGURATION & UTILITIES =====

// Centralized configuration (no hardcoding scattered)
const config = {
    formats: ["DD-MM-YYYY", "DD/MM/YYYY", "MM-DD-YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "YYYY/MM/DD", "DD.MM.YYYY"],
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    dom: {
        inputDate: "inputDate",
        inputFormat: "inputFormat",
        outputFormat: "outputFormat",
        result: "result",
        currentDate: "currentDate",
        currentTime: "currentTime"
    }
};

// Helper: Get value by ID
const getElement = (id) => document.getElementById(id);
const setValue = (id, value) => getElement(id).innerText = value;

// Helper: Pad numbers (e.g., 5 -> "05")
const pad = (n) => n.toString().padStart(2, '0');

// Helper: Get month name by index
const getMonthName = (index) => config.monthNames[index];

// Helper: Get day name by index
const getDayName = (index) => config.dayNames[index];

// Helper: Get days in month (accounting for leap years)
const getDaysInMonth = (month, year) => {
    const days = [...config.daysInMonth];
    if (month === 2 && isLeapYear(year)) days[1] = 29;
    return days[month - 1];
};

// Helper: Check if leap year
const isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

// ===== DATE CONVERSION METHODS =====

// Step 2: Determine separator and component positions
function getFormatInfo(formatString) {
    const separator = formatString.match(/[-/\.]/)[0];
    const components = formatString.split(separator);
    
    return {
        separator: separator,
        components: components,
        pattern: new RegExp(`^(\\d{1,2})${separator === '.' ? '\\.' : separator}(\\d{1,2})${separator === '.' ? '\\.' : separator}(\\d{4})$`)
    };
}

// Step 3: Extract date components from input string
function extractDateParts(dateString, formatInfo) {
    const match = dateString.match(formatInfo.pattern);
    if (!match) return null;
    
    return {
        [formatInfo.components[0]]: parseInt(match[1]),
        [formatInfo.components[1]]: parseInt(match[2]),
        [formatInfo.components[2]]: parseInt(match[3])
    };
}

// Step 4: Validate date (day, month, year)
function isValidDateValue(day, month, year) {
    if (month < 1 || month > 12 || day < 1 || year < 1000 || year > 9999) return false;
    return day <= getDaysInMonth(month, year);
}

// Step 5: Create JavaScript Date object
function createDateObject(parts) {
    const day = parts.DD || parts.day;
    const month = parts.MM || parts.month;
    const year = parts.YYYY || parts.year;
    
    if (!isValidDateValue(day, month, year)) return null;
    return new Date(year, month - 1, day);
}

// Step 6: Format date object to desired format
function formatDateOutput(dateObject, outputFormat) {
    if (!dateObject || isNaN(dateObject.getTime())) return "Invalid Date";
    
    return outputFormat
        .replace(/DD/g, pad(dateObject.getDate()))
        .replace(/YYYY/g, dateObject.getFullYear())
        .replace(/MM/g, pad(dateObject.getMonth() + 1))
        .replace(/MMM/g, getMonthName(dateObject.getMonth()));
}

// Main: Convert date format
function convertDateFormat(inputDate, inputFormat, outputFormat) {
    if (!inputDate || !inputFormat || !outputFormat) {
        return "Error: Please provide date, input format, and output format";
    }
    
    if (!config.formats.includes(inputFormat) && inputFormat !== "auto") {
        return `Error: Input format '${inputFormat}' is not supported`;
    }
    
    inputDate = inputDate.trim();
    
    // Auto-detect format
    if (inputFormat === "auto") {
        for (let format of config.formats) {
            const result = convertDateFormat(inputDate, format, outputFormat);
            if (!result.includes("Error") && !result.includes("Invalid")) return result;
        }
        return "Error: Could not detect date format";
    }
    
    const formatInfo = getFormatInfo(inputFormat);
    const dateParts = extractDateParts(inputDate, formatInfo);
    
    if (!dateParts) return `Error: Date does not match format ${inputFormat}`;
    
    const dateObject = createDateObject(dateParts);
    if (!dateObject) return "Error: Invalid date (check day/month values)";
    
    return formatDateOutput(dateObject, outputFormat);
}

// ===== UI FUNCTIONS =====

function convertDate() {
    const input = getElement(config.dom.inputDate).value;
    const inputFormat = getElement(config.dom.inputFormat).value;
    const outputFormat = getElement(config.dom.outputFormat).value;
    
    if (!input) {
        setValue(config.dom.result, "Please enter a date");
        return;
    }
    
    const result = convertDateFormat(input, inputFormat, outputFormat);
    setValue(config.dom.result, result);
}

// Update current date and time
function updateCurrentDate() {
    const now = new Date();
    const dateText = `${getDayName(now.getDay())}, ${pad(now.getDate())} ${getMonthName(now.getMonth())} ${now.getFullYear()}`;
    const timeText = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    setValue(config.dom.currentDate, dateText);
    setValue(config.dom.currentTime, timeText);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentDate();
    setInterval(updateCurrentDate, 1000);
});