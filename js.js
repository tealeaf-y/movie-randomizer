document.addEventListener('DOMContentLoaded', () => {
  // Загружаем фильмы из localStorage или создаём пустой массив
  let movies = JSON.parse(localStorage.getItem("movies")) || [];

  // Кнопка "Что мне посмотреть?"
  const randomBtn = document.getElementById("randomBtn");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      if (movies.length === 0) {
        alert("Нет фильмов в библиотеке!");
        return;
      }

      // Получаем выбранные фильтры
      const selectedType = document.querySelector('input[name="type"]:checked')?.value;
      const selectedMood = document.querySelector('input[name="mood"]:checked')?.value;
      const selectedFamiliarity = document.querySelector('input[name="familiarity"]:checked')?.value;
      const selectedDuration = document.querySelector('input[name="duration"]:checked')?.value;

      // Фильтруем фильмы по выбранным параметрам
      const filtered = movies.filter(movie => {
        const matchType = !selectedType || movie.type === selectedType;
        const matchMood = !selectedMood || movie.mood.includes(selectedMood);
        const matchFamiliarity = !selectedFamiliarity || movie.familiarity === selectedFamiliarity;
        const matchDuration = !selectedDuration || movie.duration === selectedDuration;
        return matchType && matchMood && matchFamiliarity && matchDuration;
      });

      if (filtered.length === 0) {
        alert("Фильмы по заданным фильтрам не найдены 😢");
        return;
      }

      const result = filtered[Math.floor(Math.random() * filtered.length)];
      alert(`🎬 ${result.title}\n⏱ ${result.length}\n🔗 ${result.link}`);
    });
  }

  // Кнопка "ФИЛЬТР"
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');

  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', () => {
      filterPanel.classList.toggle('show');
    });
  }

  // Отщелкивание radio-кнопок
  let lastChecked = {};

  document.querySelectorAll('input[type="radio"][data-toggleable]').forEach(radio => {
    radio.addEventListener('click', function () {
      const name = this.name;

      if (lastChecked[name] === this) {
        this.checked = false;
        lastChecked[name] = null;
      } else {
        lastChecked[name] = this;
      }
    });
  });

  // Обработка формы добавления фильма
  const form = document.getElementById("addMovieForm");
  const output = document.getElementById("movieOutput");

  if (form && output) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const movie = {
        title: form.title.value.trim(),
        type: form.type.value,
        mood: form.mood.value.split(",").map(m => m.trim()).filter(Boolean),
        familiarity: form.familiarity.value,
        duration: form.duration.value,
        poster: form.poster.value.trim(),
        link: form.link.value.trim(),
        code: form.code.value.trim(),
        length: form.length.value.trim()
      };

      movies.push(movie);
      localStorage.setItem("movies", JSON.stringify(movies));
      alert("Фильм успешно добавлен в библиотеку!");
      form.reset();

      const formOverlay = document.getElementById("formOverlay");
      if (formOverlay) formOverlay.classList.remove("active");
    });
  }

  // Показ/скрытие формы по кнопке-звезде
  const toggleFormBtn = document.getElementById("toggleFormBtn");
  const formOverlay = document.getElementById("formOverlay");

  if (toggleFormBtn && formOverlay) {
    toggleFormBtn.addEventListener("click", () => {
      formOverlay.classList.toggle("active");
    });

    formOverlay.addEventListener("click", (e) => {
      if (e.target === formOverlay) {
        formOverlay.classList.remove("active");
      }
    });
  }


 const downloadBtn = document.getElementById("downloadLibraryBtn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const movies = JSON.parse(localStorage.getItem("movies")) || [];
      const blob = new Blob([JSON.stringify(movies, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "моя_библиотека_фильмов.json";
      a.click();

      URL.revokeObjectURL(url);
    });
  }
});