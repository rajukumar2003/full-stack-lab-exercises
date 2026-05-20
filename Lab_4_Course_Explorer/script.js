
async function loadCourses() {
  const response = await fetch('courses.json');
  const data = await response.json();

  displayCourses(data);

  document.getElementById("search").addEventListener("input", function() {
    const filtered = data.filter(course =>
      course.title.toLowerCase().includes(this.value.toLowerCase())
    );
    displayCourses(filtered);
  });
}

function displayCourses(courses) {
  const container = document.getElementById("courses");
  container.innerHTML = "";

  courses.forEach(course => {
    container.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-bold">${course.title}</h2>
        <p>${course.department}</p>
      </div>
    `;
  });
}

loadCourses();
