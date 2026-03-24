// Generalized date parsing function
function parseDate(dateString, inputFormat) {
    dateString = dateString.trim();
    
    // If input format is auto-detect, try common formats
    if (inputFormat === "auto") {
        const commonFormats = [
            "YYYY-MM-DD", "YYYY/MM/DD", "DD-MM-YYYY", "DD/MM/YYYY",
            "MM-DD-YYYY", "MM/DD/YYYY", "DD.MM.YYYY"
        ];
        for (let format of commonFormats) {
            const parsed = parseDate(dateString, format);
            if (parsed && !isNaN(parsed)) return parsed;
        }
        return null;
    }
    
    const patterns = {
        "DD-MM-YYYY": /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
        "DD/MM/YYYY": /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        "MM-DD-YYYY": /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
        "MM/DD/YYYY": /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        "YYYY-MM-DD": /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        "YYYY/MM/DD": /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
        "DD.MM.YYYY": /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
    };
    
    const pattern = patterns[inputFormat];
    if (!pattern) return null;
    
    const match = dateString.match(pattern);
    if (!match) return null;
    
    let day, month, year;
    
    if (inputFormat === "YYYY-MM-DD" || inputFormat === "YYYY/MM/DD") {
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
    } else if (inputFormat === "MM-DD-YYYY" || inputFormat === "MM/DD/YYYY") {
        month = parseInt(match[1]);
        day = parseInt(match[2]);
        year = parseInt(match[3]);
    } else {
        day = parseInt(match[1]);
        month = parseInt(match[2]);
        year = parseInt(match[3]);
    }
    
    // Validate date
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1000 || year > 9999) {
        return null;
    }
    
    return new Date(year, month - 1, day);
}

// Generalized date formatting function
function formatDate(date, outputFormat) {
    if (!date || isNaN(date)) {
        return "Invalid Date";
    }
    
    const pad = (n) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthFull = monthNames[date.getMonth()];
    
    const formatMap = {
        "DD-MM-YYYY": `${day}-${month}-${year}`,
        "DD/MM/YYYY": `${day}/${month}/${year}`,
        "YYYY-MM-DD": `${year}-${month}-${day}`,
        "YYYY/MM/DD": `${year}/${month}/${day}`,
        "MM/DD/YYYY": `${month}/${day}/${year}`,
        "MM-DD-YYYY": `${month}-${day}-${year}`,
        "DD.MM.YYYY": `${day}.${month}.${year}`,
        "MMM DD, YYYY": `${monthFull} ${pad(date.getDate())}, ${year}`,
        "DD MMM YYYY": `${day} ${monthFull} ${year}`
    };
    
    return formatMap[outputFormat] || "Unsupported format";
}

function convertDate() {
    const input = document.getElementById("inputDate").value;
    const inputFormat = document.getElementById("inputFormat").value;
    const outputFormat = document.getElementById("outputFormat").value;
    
    if (!input) {
        document.getElementById("result").innerText = "Please enter a date";
        return;
    }
    
    const parsedDate = parseDate(input, inputFormat);
    
    if (!parsedDate) {
        document.getElementById("result").innerText = `Invalid date format. Please use ${inputFormat === "auto" ? "a valid date format" : inputFormat}`;
        return;
    }
    
    const result = formatDate(parsedDate, outputFormat);
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