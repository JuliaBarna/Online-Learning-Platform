/* global filters renderCourses L */

document.addEventListener("DOMContentLoaded", async function () {
    // --- Елементи фільтрації та галереї ---
    const courseContainerGallery = document.getElementById("gallery");
    const levelFilter = document.getElementById("levelFilter");
    const topicFilter = document.getElementById("topicFilter");
    const sortBy = document.getElementById("sortBy");
    const titleFilter = document.getElementById("titleFilter");

    // --- Завантаження даних про курси ---
    let courses = [];
    try {
        const response = await fetch("/assets/data/courses.json");
        courses = await response.json();
    } catch (error) {
        console.error("Failed to load courses:", error);
        courseContainerGallery.innerHTML = "<p class='error-message'>Failed to load courses.</p>";
        return;
    }

    // --- Заповнення фільтрів опціями ---
    const levels = ["all", ...new Set(courses.map(course => course.level))];
    const topics = ["all", ...new Set(courses.flatMap(course => course.topics))];
    const titles = ["all", ...courses.map(course => course.title)];

    levelFilter.innerHTML = levels.map(level => `<option value="${level}">${level === "all" ? "Difficulty (all)" : level}</option>`).join("");
    topicFilter.innerHTML = topics.map(topic => `<option value="${topic}">${topic === "all" ? "Topic (all)" : topic}</option>`).join("");
    titleFilter.innerHTML = titles.map(title => `<option value="${title}">${title === "all" ? "Course Title (all)" : title}</option>`).join("");

    // --- Функція рендерингу карток курсів ---
    const renderCoursesGallery = (courseList) => {
        courseContainerGallery.innerHTML = "";
        if (courseList.length === 0) {
            courseContainerGallery.innerHTML = "<p class='no-results'>Nothing found for your criteria.</p>";
            return;
        }
        courseList.forEach(course => {
            const card = document.createElement("div");
            card.classList.add("course-card");
            card.innerHTML = `
                <img src="${course.image}" alt="${course.title}">
                <h3>${course.title}</h3>
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                <p><strong>Level:</strong> ${course.level}</p>
                <p><strong>Topics:</strong> ${course.topics.join(", ")}</p>
                <button class="enroll-btn" data-title="${course.title}">Enroll</button>
            `;
            card.querySelector('.enroll-btn').addEventListener('click', function () {
                alert(`You enrolled for the course"${this.dataset.title}"`);
            });
            courseContainerGallery.appendChild(card);
        });
    };

    // --- Функція фільтрації та сортування курсів ---
    const filterAndSortCourses = () => {
        const selectedLevel = levelFilter.value;
        const selectedTopic = topicFilter.value;
        const selectedSort = sortBy.value;
        const selectedTitle = titleFilter.value;

        let filtered = courses.filter(course => {
            const levelMatch = selectedLevel === "all" || course.level === selectedLevel;
            const topicMatch = selectedTopic === "all" || course.topics.includes(selectedTopic);
            const titleMatch = selectedTitle === "all" || course.title === selectedTitle;
            return levelMatch && topicMatch && titleMatch;
        });

        if (selectedSort === "asc") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSort === "desc") {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        renderCoursesGallery(filtered);
    };

    // --- Обробники подій для фільтрів ---
    [levelFilter, topicFilter, sortBy, titleFilter].forEach(el => {
        el.addEventListener("change", filterAndSortCourses);
    });

    const selected = localStorage.getItem("selectedCourseTitle");
    if (selected) {
        const match = courses.filter(c => c.title === selected);
        filters.title.value = selected;
        localStorage.removeItem("selectedCourseTitle");
        renderCourses(match);
    } else {
        renderCourses(courses);
    }
});
// --- Карта ---
document.addEventListener("DOMContentLoaded", function () {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map').setView([48.6219, 22.3002], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([48.6219, 22.3002])
            .addTo(map)
            .bindPopup('<b>Ужгород</b><br>вул. Шандора Петефі')
            .openPopup();
    }
});

// --- Слайдер ---
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll('.slide');
    const slidesContainer = document.querySelector('.slides');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const intervalTime = 5000;
    let currentIndex = 0;
    let intervalId;

    if (slides.length > 0 && slidesContainer && prevButton && nextButton) {
        function showSlide(index) {
            if (index < 0) index = slides.length - 1;
            else if (index >= slides.length) index = 0;
            currentIndex = index;
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        }

        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        prevButton.addEventListener('click', () => {
            showSlide(currentIndex - 1);
            resetInterval();
        });

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        function startInterval() {
            intervalId = setInterval(nextSlide, intervalTime);
        }

        function resetInterval() {
            clearInterval(intervalId);
            startInterval();
        }

        startInterval();
    }
});

// --- "Завантажити більше" курсів ---
document.addEventListener("DOMContentLoaded", async function () {
    const courseContainer = document.getElementById('courseContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let coursesData = [];
    let coursesToShow = 3;

    async function getCoursesForLoadMore() {
        try {
            const response = await fetch('/assets/data/courses.json');
            coursesData = await response.json();
            displayCourses();
        } catch (error) {
            console.error("Failed to load courses for 'Load More':", error);
            if (courseContainer) {
                courseContainer.innerHTML = "<p class='error-message'>Failed to load courses.</p>";
            }
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    function displayCourses() {
        if (!courseContainer) return;
        courseContainer.innerHTML = "";

        coursesData.slice(0, coursesToShow).forEach(course => {
            courseContainer.innerHTML += `
                <div class="course-card">
                    <img src="${course.image}" alt="${course.title}">
                    <h3>${course.title}</h3>
                    <p>Instructor: ${course.instructor}</p>
                    <p>Level: ${course.level}</p>
                    <p>Topics: ${course.topics.join(", ")}</p>
                    <button class="enroll-btn" data-title="${course.title}">Enroll</button>
                </div>
            `;
        });

        const enrollButtons = courseContainer.querySelectorAll('.enroll-btn');
        enrollButtons.forEach(button => {
            button.addEventListener('click', function () {
                alert(`You enrolled for the course "${this.dataset.title}"`);
            });
        });

        if (loadMoreBtn) {
            loadMoreBtn.style.display = coursesToShow >= coursesData.length ? 'none' : 'block';
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            coursesToShow += 2;
            displayCourses();
        });
    }

    getCoursesForLoadMore();
});

// --- Пошук курсів (автозаповнення) ---
document.addEventListener("DOMContentLoaded", async function () {
    const searchInput = document.getElementById("courseSearch");
    const searchResults = document.getElementById("courseSearchResults");
    let allCourses = [];

    if (!searchInput || !searchResults) return;

    try {
        const response = await fetch("/assets/data/courses.json");
        allCourses = await response.json();
    } catch (error) {
        console.error("Failed to load courses for search:", error);
        return;
    }

    function displayCourseTitles(coursesToDisplay) {
        searchResults.innerHTML = "";
        if (coursesToDisplay.length > 0) {
            searchResults.style.display = "block";
            coursesToDisplay.forEach(course => {
                const listItem = document.createElement("li");
                listItem.textContent = course.title;
                listItem.addEventListener("click", () => {
                    // Зберігаємо назву курсу в localStorage
                    localStorage.setItem("selectedCourseTitle", course.title);
                    // Перенаправляємо на сторінку gallery.html
                    window.location.href = "gallery.html";
                });
                searchResults.appendChild(listItem);
            });
        } else {
            searchResults.style.display = "none";
        }
    }

    searchInput.addEventListener("focus", () => {
        displayCourseTitles(allCourses);
    });

    searchInput.addEventListener("blur", () => {
        setTimeout(() => {
            searchResults.style.display = "none";
        }, 200);
    });

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        const filteredCourses = allCourses.filter(course => course.title.toLowerCase().includes(query));
        displayCourseTitles(filteredCourses);
    });
});

// --- Кнопка "Переглянути всі курси" на головній сторінці ---
document.addEventListener("DOMContentLoaded", function () {
    const exploreBtn = document.querySelector(".find-course-btn");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", function () {
            window.location.href = "gallery.html";
        });
    }
});

// --- Розширений пошук на сторінці галереї ---
document.addEventListener("DOMContentLoaded", async function () {
    const gallery = document.getElementById("gallery");
    const keywordSearch = document.getElementById("keywordSearch");
    const levelFilter = document.getElementById("levelFilter");
    const topicFilter = document.getElementById("topicFilter");
    const sortBy = document.getElementById("sortBy");
    const titleFilter = document.getElementById("titleFilter");

    let courses = [];

    try {
        const res = await fetch("/assets/data/courses.json");
        courses = await res.json();
    } catch (err) {
        console.error("Failed to load courses for advanced search:", err);
        if (gallery) {
            gallery.innerHTML = "<p class='error-message'>Failed to load courses.</p>";
        }
        return;
    }

    const levels = ["all", ...new Set(courses.map(c => c.level))];
    const topics = ["all", ...new Set(courses.flatMap(c => c.topics))];
    const titles = ["all", ...courses.map(c => c.title)];

    if (levelFilter) levelFilter.innerHTML = levels.map(l => `<option value="${l}">${l === "all" ? "Difficulty (all)" : l}</option>`).join("");
    if (topicFilter) topicFilter.innerHTML = topics.map(t => `<option value="${t}">${t === "all" ? "Topic (all)" : t}</option>`).join("");
    if (titleFilter) titleFilter.innerHTML = titles.map(t => `<option value="${t}">${t === "all" ? "Course Title (all)" : t}</option>`).join("");

    function renderCourses(list) {
        if (!gallery) return;
        gallery.innerHTML = "";

        if (list.length === 0) {
            gallery.innerHTML = `<p class="no-results">Nothing found for your criteria.</p>`;
            return;
        }

        list.forEach(course => {
            const card = document.createElement("div");
            card.className = "course-card";
            card.innerHTML = `
                <img src="${course.image}" alt="${course.title}">
                <h3>${course.title}</h3>
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                <p><strong>Level:</strong> ${course.level}</p>
                <p><strong>Topics:</strong> ${course.topics.join(", ")}</p>
                <button class="enroll-btn" data-title="${course.title}">Enroll</button>
            `;
            const enrollButton = card.querySelector('.enroll-btn');
            if (enrollButton) {
                enrollButton.addEventListener('click', function () {
                    alert(`You enrolled for the course."${this.dataset.title}"`);
                });
            }
            gallery.appendChild(card);
        });
    }

    function applyFilters() {
        const keyword = keywordSearch?.value?.toLowerCase() || "";
        const selectedLevel = levelFilter?.value;
        const selectedTopic = topicFilter?.value;
        const selectedSort = sortBy?.value;
        const selectedTitle = titleFilter?.value;

        let filtered = courses.filter(course => {
            const matchesKeyword = !keyword ||
                                   course.title.toLowerCase().includes(keyword) ||
                                   course.instructor.toLowerCase().includes(keyword) ||
                                   course.level.toLowerCase().includes(keyword) ||
                                   course.topics.join(", ").toLowerCase().includes(keyword);
            const levelMatch = !selectedLevel || selectedLevel === "all" || course.level === selectedLevel;
            const topicMatch = !selectedTopic || selectedTopic === "all" || course.topics.includes(selectedTopic);
            const titleMatch = !selectedTitle || selectedTitle === "all" || course.title === selectedTitle;
            return matchesKeyword && levelMatch && topicMatch && titleMatch;
        });

        if (selectedSort === "asc") filtered.sort((a, b) => a.title.localeCompare(b.title));
        if (selectedSort === "desc") filtered.sort((a, b) => b.title.localeCompare(a.title));

        renderCourses(filtered);
    }

    [keywordSearch, levelFilter, topicFilter, sortBy, titleFilter].forEach(el => {
        el?.addEventListener("input", applyFilters);
        el?.addEventListener("change", applyFilters);
    });

    const selectedCourse = localStorage.getItem("selectedCourseTitle");
    if (selectedCourse && gallery) {
        const matched = courses.filter(c => c.title === selectedCourse);
        renderCourses(matched);
        localStorage.removeItem("selectedCourseTitle");
    } else if (gallery) {
        renderCourses(courses);
    }
});

