// MHS C LAB — calculator functionality and mobile navigation
"use strict";

function showResult(elementId, message, status = "success") {
  const element = document.getElementById(elementId);
  if (!element) return;
  // All inserted messages are authored below; text is used for error messages.
  element.classList.remove("is-error", "is-success");
  element.classList.add(status === "error" ? "is-error" : "is-success");
  element.innerHTML = message;
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}

// Mobile navigation
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

// Age Calculator
const ageForm = document.getElementById("age-form");
if (ageForm) {
  const birthDateInput = document.getElementById("birth-date");
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  birthDateInput.max = localToday;

  ageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!birthDateInput.value) {
      showResult("age-result", "Please select your date of birth.", "error");
      return;
    }

    const parts = birthDateInput.value.split("-").map(Number);
    const birth = new Date(parts[0], parts[1] - 1, parts[2]);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (Number.isNaN(birth.getTime()) || birth > now) {
      showResult("age-result", "Please enter a valid date that is not in the future.", "error");
      return;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const daysInPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += daysInPreviousMonth;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    showResult("age-result", `You are <strong>${years}</strong> years, <strong>${months}</strong> months, and <strong>${days}</strong> days old.`);
  });
}

// Rectangle Calculator
const rectangleForm = document.getElementById("rectangle-form");
if (rectangleForm) {
  rectangleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const lengthInput = document.getElementById("rect-length");
    const widthInput = document.getElementById("rect-width");
    const length = Number(lengthInput.value);
    const width = Number(widthInput.value);

    if (lengthInput.value.trim() === "" || widthInput.value.trim() === "" ||
        !Number.isFinite(length) || !Number.isFinite(width) || length < 0 || width < 0) {
      showResult("rectangle-result", "Please enter valid non-negative values for length and width.", "error");
      return;
    }

    const area = length * width;
    const perimeter = 2 * (length + width);
    showResult("rectangle-result", `Area: <strong>${formatNumber(area)}</strong><br>Perimeter: <strong>${formatNumber(perimeter)}</strong>`);
  });
}

// Even / Odd Checker
const evenOddForm = document.getElementById("even-odd-form");
if (evenOddForm) {
  evenOddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("number-input");
    const raw = input.value.trim();
    const number = Number(raw);

    if (raw === "" || !Number.isSafeInteger(number)) {
      showResult("even-odd-result", "Please enter a valid whole number.", "error");
      return;
    }

    const kind = number % 2 === 0 ? "Even" : "Odd";
    showResult("even-odd-result", `<strong>${number}</strong> is an <strong>${kind}</strong> number.`);
  });
}

// Grade Calculator: 0–39 Fail, 40–49 D, 50–59 C, 60–69 B, 70–79 A, 80–100 A+
const gradeForm = document.getElementById("grade-form");
if (gradeForm) {
  gradeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const marksInput = document.getElementById("marks");
    const raw = marksInput.value.trim();
    const marks = Number(raw);

    if (raw === "" || !Number.isInteger(marks) || marks < 0 || marks > 100) {
      showResult("grade-result", "Enter a whole number from 0 to 100.", "error");
      return;
    }

    let grade;
    if (marks < 40) grade = "F (Fail)";
    else if (marks < 50) grade = "D";
    else if (marks < 60) grade = "C";
    else if (marks < 70) grade = "B";
    else if (marks < 80) grade = "A";
    else grade = "A+";

    showResult("grade-result", `Your marks: <strong>${marks}</strong><br>Your grade: <strong>${grade}</strong>`);
  });
}


(() => {
  const input = document.getElementById("nsInput");
  const from = document.getElementById("nsFrom");
  const to = document.getElementById("nsTo");
  const output = document.getElementById("nsResult");
  const convert = document.getElementById("nsConvert");
  const reset = document.getElementById("nsReset");

  if (!input || !from || !to || !output || !convert || !reset) return;

  function convertNumber(raw, sourceBase, targetBase) {
    let s = raw.trim().toUpperCase();

    if (!s || s.includes(" ")) throw Error("Enter a number first.");
    if (s.includes("." ) && s.indexOf(".") !== s.lastIndexOf(".")) {
      throw Error("Use only one decimal point.");
    }

    let sign = "";
    if (s[0] === "-" || s[0] === "+") {
      if (s[0] === "-") sign = "-";
      s = s.slice(1);
    }

    if (!s || s === ".") throw Error("Enter a valid number.");

    const parts = s.split(".");
    const integerPart = parts[0] || "0";
    const fractionPart = parts[1] || "";

    const valid = "0123456789ABCDEF".slice(0, sourceBase);

    for (const ch of integerPart + fractionPart) {
      if (!valid.includes(ch)) {
        throw Error(`Invalid digit "${ch}" for base ${sourceBase}.`);
      }
    }

    // Convert the integer part exactly using BigInt.
    let integer = 0n;
    for (const ch of integerPart) {
      integer = integer * BigInt(sourceBase) +
        BigInt(valid.indexOf(ch));
    }

    let integerResult = integer.toString(targetBase).toUpperCase();

    // Convert the fraction exactly as a rational number.
    let numerator = 0n;
    for (const ch of fractionPart) {
      numerator = numerator * BigInt(sourceBase) +
        BigInt(valid.indexOf(ch));
    }

    let denominator = BigInt(sourceBase) ** BigInt(fractionPart.length);
    let fractionResult = "";

    if (numerator !== 0n) {
      let remainder = numerator;
      const digits = "0123456789ABCDEF";

      for (let i = 0; i < 12 && remainder !== 0n; i++) {
        remainder *= BigInt(targetBase);
        const digit = remainder / denominator;
        remainder %= denominator;
        fractionResult += digits[Number(digit)];
      }

      // Round the displayed fraction to 12 digits.
      if (remainder !== 0n && fractionResult.length === 12) {
        // Truncation is used to keep the displayed result predictable.
      }
    }

    const result = integerResult +
      (fractionResult ? "." + fractionResult : "");

    return (sign && (integer !== 0n || numerator !== 0n) ? sign : "") + result;
  }

  convert.addEventListener("click", () => {
    try {
      const result = convertNumber(
        input.value,
        Number(from.value),
        Number(to.value)
      );

      output.textContent = `Result: ${result}`;
      output.style.color = "#67e8f9";
    } catch (error) {
      output.textContent = error.message;
      output.style.color = "#ff7b86";
    }
  });

  reset.addEventListener("click", () => {
    input.value = "";
    from.value = "10";
    to.value = "16";
    output.textContent = "Your result will appear here.";
    output.style.color = "#67e8f9";
    input.focus();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") convert.click();
  });
})();

(() => {
  const baseInput = document.getElementById("subBase");
  const aInput = document.getElementById("subA");
  const bInput = document.getElementById("subB");
  const output = document.getElementById("subResult");
  const calculate = document.getElementById("subCalculate");
  const reset = document.getElementById("subReset");

  if (!baseInput || !aInput || !bInput || !output ||
      !calculate || !reset) return;

  function parseBaseNumber(text, base) {
    let s = text.trim().toUpperCase();
    if (!s) throw Error("Please enter both numbers.");

    let sign = 1n;
    if (s.startsWith("-")) {
      sign = -1n;
      s = s.slice(1);
    } else if (s.startsWith("+")) {
      s = s.slice(1);
    }

    if (!s) throw Error("Invalid number.");

    const digits = "0123456789ABCDEF";
    let value = 0n;

    for (const ch of s) {
      const digit = digits.indexOf(ch);

      if (digit < 0 || digit >= base) {
        throw Error(`Digit "${ch}" is invalid in base ${base}.`);
      }

      value = value * BigInt(base) + BigInt(digit);
    }

    return sign * value;
  }

  function formatBaseNumber(value, base) {
    if (value < 0n) {
      return "-" + (-value).toString(base).toUpperCase();
    }
    return value.toString(base).toUpperCase();
  }

  calculate.addEventListener("click", () => {
    try {
      const base = Number(baseInput.value);
      const a = parseBaseNumber(aInput.value, base);
      const b = parseBaseNumber(bInput.value, base);
      const answer = a - b;

      const result = formatBaseNumber(answer, base);
      const decimalResult = answer.toString();

      output.textContent =
        `A − B = ${result}\n` +
        `Base: ${base}\n` +
        `Decimal equivalent: ${decimalResult}`;

      output.style.color = "#67e8b5";
    } catch (error) {
      output.textContent = error.message;
      output.style.color = "#ff7b86";
    }
  });

  reset.addEventListener("click", () => {
    aInput.value = "";
    bInput.value = "";
    baseInput.value = "10";
    output.textContent = "Result will appear here.";
    output.style.color = "#67e8f9";
  });
})();
