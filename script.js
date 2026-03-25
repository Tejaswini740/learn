// Format configuration
const formatMap = {
     "en-GB": { locale: "en-GB", options: { dateStyle: "short" } },
   "en-US": { locale: "en-US", options: { dateStyle: "short" } },
   "longUS": { locale: "en-US", options: { dateStyle: "long" } },
   "longGB": { locale: "en-GB", options: { dateStyle: "long" } }
};
  
function parseDate(input) {
    if (!input) return new Date();
    input = input.trim();
    let date = new Date(input);
    if (!isNaN(date)) return date;
    let cleaned = input.replace(/[.\-]/g, "/");
    let parts = cleaned.split("/");
    if (parts.length === 3) {
        let [a, b,c] = parts;
        if (c.length === 4) {
let day = a;
let month = b;
let year = c;
let d1 = new Date(`${month}/${day}/${year}`);
if (!isNaN(d1)) return d1;
let d2 = new Date(`${day}/${month}/${year}`);
if (!isNaN(d2)) return d2;
        
    }
    if (c.length === 2) {
        let year = "20" + c;
        let d3 = new Date(`${a}/${b}/${year}`);
        if (!isNaN(d3)) return d3;
    }
}
return null;
}
function formatOutput(date, type) {
   if (type === "iso") {
        return date.toISOString().split("T")[0];
    }
    if (type === "dash"){
        return new Intl.DateTimeFormat("en-GB").format(date).replace(/\//g, "-");
    }
    const config = formatMap[type];
    if (config) {
        return new Intl.DateTimeFormat(config.locale, config.options).format(date);
    }
    return "Format not supported";
}
function convertDate() {
    let input = document.getElementById("inputDate").value;
    let type = document.getElementById("outputFormat").value;
    if (!type) {
document.getElementById("result").innerText = "Please select format";
return;
    }
let date = parseDate(input);
if (!date) {
document.getElementById("result").innerText = "Invalid date";
return;
}
document.getElementById("result").innerText = formatOutput(date, type);
console.log(formatOutput(date, type)); 
let today = new Date(); 
document.getElementById("currentDate").innerText = formatOutput(today, type);
}
window.onload = function () {
    let today = new Date();
    document.getElementById("currentDate").innerText = new Intl.DateTimeFormat().format(today);
};
