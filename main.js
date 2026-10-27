document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setupMobileNavigation();
  setupAdmissionForm();
  setupContactForm();
  loadSchoolData();
});

function setYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function setupMobileNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

async function loadSchoolData() {
  const stepsContainer = document.querySelector("#admission-steps");
  const galleryContainer = document.querySelector("#gallery-grid");

  if (!stepsContainer && !galleryContainer) return;

  try {
    const response = await fetch("data/school-data.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (stepsContainer) {
      renderAdmissionSteps(stepsContainer, data.admissionSteps);
    }

    if (galleryContainer) {
      renderGallery(galleryContainer, data.gallery);
    }
  } catch (error) {
    if (stepsContainer) {
      stepsContainer.innerHTML = "<p class='error-message'>Unable to load admission information.</p>";
    }

    if (galleryContainer) {
      galleryContainer.innerHTML = "<p class='error-message'>Unable to load gallery information. Run the project through a local web server.</p>";
    }

    console.error("Fetch error:", error);
  }
}

function renderAdmissionSteps(container, steps) {
  container.innerHTML = steps.map((step) => `
    <article class="info-card">
      <div class="icon">${escapeHtml(step.number)}</div>
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.description)}</p>
    </article>
  `).join("");
}

function renderGallery(container, items) {
  container.innerHTML = items.map((item, index) => `
    <button class="gallery-item" type="button" data-gallery-index="${index}">
      <div class="gallery-image">${escapeHtml(item.image)}</div>
      <div class="gallery-caption">
        <strong>${escapeHtml(item.title)}</strong>
        <span>View details →</span>
      </div>
    </button>
  `).join("");

  container.querySelectorAll("[data-gallery-index]").forEach((item) => {
    item.addEventListener("click", () => {
      openLightbox(items[Number(item.dataset.galleryIndex)]);
    });
  });
}

function openLightbox(item) {
  const lightbox = document.querySelector("#lightbox");
  const image = document.querySelector("#lightbox-image");
  const title = document.querySelector("#lightbox-title");
  const description = document.querySelector("#lightbox-description");

  if (!lightbox || !image || !title || !description) return;

  image.textContent = item.image;
  title.textContent = item.title;
  description.textContent = item.description;
  lightbox.hidden = false;
  document.body.classList.add("no-scroll");

  const closeButton = lightbox.querySelector(".lightbox-close");
  closeButton.focus();
}

function closeLightbox() {
  const lightbox = document.querySelector("#lightbox");
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");
}

document.addEventListener("click", (event) => {
  if (event.target.matches(".lightbox-close") || event.target.id === "lightbox") {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

function setupAdmissionForm() {
  const form = document.querySelector("#admission-form");
  const status = document.querySelector("#admission-status");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent = "Application received successfully. This is a school-project demonstration.";
    status.className = "form-status success";
    form.reset();
  });
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#contact-status");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent = "Your message has been sent successfully. This is a school-project demonstration.";
    status.className = "form-status success";
    form.reset();
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
