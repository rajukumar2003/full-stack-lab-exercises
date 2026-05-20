const courseContainer = document.getElementById("courses");
const searchInput = document.getElementById("search");
const departmentFilter = document.getElementById("departmentFilter");
const statusText = document.getElementById("status");
const themeToggle = document.getElementById("themeToggle");

let allCourses = [];
let draggedCode = null;

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "Light Theme" : "Dark Theme";
  localStorage.setItem("courseExplorerTheme", theme);
}

function populateDepartments(courses) {
  const departments = [...new Set(courses.map(course => course.department))].sort();
  departments.forEach(department => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    departmentFilter.appendChild(option);
  });
}

function getFilteredCourses() {
  const query = searchInput.value.trim().toLowerCase();
  const department = departmentFilter.value;

  return allCourses.filter(course => {
    const matchesSearch = `${course.title} ${course.department} ${course.code}`.toLowerCase().includes(query);
    const matchesDepartment = department === "All" || course.department === department;
    return matchesSearch && matchesDepartment;
  });
}

function displayCourses(courses) {
  courseContainer.innerHTML = "";
  statusText.textContent = `${courses.length} course${courses.length === 1 ? "" : "s"} displayed. Drag cards to reorder them.`;

  courses.forEach(course => {
    const card = document.createElement("article");
    card.className = "course-card rounded-3xl p-5";
    card.draggable = true;
    card.dataset.code = course.code;
    card.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-extrabold text-blue-600">${course.code}</p>
          <h2 class="mt-2 text-2xl font-extrabold">${course.title}</h2>
        </div>
        <span class="rounded-full px-3 py-1 text-sm font-bold" style="background: rgba(37, 99, 235, 0.1); color: var(--accent);">${course.credits} credits</span>
      </div>
      <dl class="mt-5 grid gap-3 text-sm" style="color: var(--muted);">
        <div><dt class="font-bold" style="color: var(--ink);">Department</dt><dd>${course.department}</dd></div>
        <div><dt class="font-bold" style="color: var(--ink);">Instructor</dt><dd>${course.instructor}</dd></div>
      </dl>
    `;

    card.addEventListener("dragstart", () => {
      draggedCode = course.code;
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      draggedCode = null;
      card.classList.remove("dragging");
    });

    card.addEventListener("dragover", event => event.preventDefault());

    card.addEventListener("drop", event => {
      event.preventDefault();
      reorderCourses(draggedCode, course.code);
    });

    courseContainer.appendChild(card);
  });
}

function reorderCourses(fromCode, toCode) {
  if (!fromCode || fromCode === toCode) return;

  const fromIndex = allCourses.findIndex(course => course.code === fromCode);
  const toIndex = allCourses.findIndex(course => course.code === toCode);
  const [movedCourse] = allCourses.splice(fromIndex, 1);
  allCourses.splice(toIndex, 0, movedCourse);
  localStorage.setItem("courseOrder", JSON.stringify(allCourses.map(course => course.code)));
  displayCourses(getFilteredCourses());
}

function restoreCourseOrder(courses) {
  const savedOrder = JSON.parse(localStorage.getItem("courseOrder") || "[]");
  if (!savedOrder.length) return courses;

  return [...courses].sort((a, b) => {
    const aIndex = savedOrder.indexOf(a.code);
    const bIndex = savedOrder.indexOf(b.code);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
}

async function loadCourses() {
  try {
    const response = await fetch("courses.json");
    const data = await response.json();
    allCourses = restoreCourseOrder(data).slice(0, 10);
    populateDepartments(allCourses);
    displayCourses(allCourses);
  } catch (error) {
    statusText.textContent = "Unable to load courses. Use a local server such as VS Code Live Server.";
  }
}

searchInput.addEventListener("input", () => displayCourses(getFilteredCourses()));
departmentFilter.addEventListener("change", () => displayCourses(getFilteredCourses()));

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
});

applyTheme(localStorage.getItem("courseExplorerTheme") || "light");
loadCourses();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
