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
