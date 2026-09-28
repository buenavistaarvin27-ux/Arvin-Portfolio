const $ = (s, p = document) => p.querySelector(s),
  $$ = (s, p = document) => [...p.querySelectorAll(s)];

const initPortfolio = () => {
  const menu = $(".menu-btn"),
    links = $(".nav-links");

  if (menu)
    menu.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(isOpen));
    });

  $$(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => {
      links?.classList.remove("open");
      menu?.setAttribute("aria-expanded", "false");
    });
    a.addEventListener("click", (event) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return;
      event.preventDefault();
      if (document.body.classList.contains("light")) {
        window.location.href = href;
        return;
      }
      document.body.classList.add("page-exit");
      setTimeout(() => {
        window.location.href = href;
      }, 260);
    });
  });

  const themeButtons = $$(".theme-btn");
  const setThemeButton = () => {
    const isLight = document.body.classList.contains("light");
    themeButtons.forEach((button) => {
      button.textContent = isLight ? "Dark mode" : "Light mode";
      button.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode",
      );
      button.title = isLight ? "Switch to dark mode" : "Switch to light mode";
    });
  };
  const applyTheme = (isLight) => {
    document.documentElement.classList.toggle("light", isLight);
    document.body.classList.toggle("light", isLight);
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    setThemeButton();
  };

  const saved = localStorage.getItem("portfolio-theme");
  const prefersLight =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved ? saved === "light" : prefersLight);

  themeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      applyTheme(!document.body.classList.contains("light"));
    }),
  );

  const current = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });

  const type = $("#typing");
  if (type) {
    const text = type.dataset.text || "Information Technology Student";
    let i = 0,
      del = false;
    const tick = () => {
      type.textContent = del ? text.slice(0, i--) : text.slice(0, i++);
      if (i === text.length + 1) del = true;
      if (del && i === 0) del = false;
      setTimeout(tick, del ? 55 : 90);
    };
    tick();
  }

  const top = $("#topBtn");
  window.addEventListener("scroll", () =>
    top?.classList.toggle("show", scrollY > 400),
  );
  top?.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: "smooth" }),
  );

  const panels = $$(".panel");
  if (panels.length > 1) {
    let lock = false;

    const scrollToPanel = (direction) => {
      const currentIndex = panels.findIndex((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45;
      });

      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const targetIndex = Math.min(
        panels.length - 1,
        Math.max(0, safeIndex + direction),
      );
      const target = panels[targetIndex];
      if (!target) return;
      window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    };

    window.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) < 10 || lock) return;
        event.preventDefault();
        lock = true;
        scrollToPanel(event.deltaY > 0 ? 1 : -1);
        setTimeout(() => {
          lock = false;
        }, 700);
      },
      { passive: false },
    );
  }

  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$(".filter").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$(".project-card").forEach((c) =>
        c.classList.toggle(
          "hidden",
          f !== "all" && !c.dataset.category.includes(f),
        ),
      );
    }),
  );

  const revealTargets = $$(
    ".reveal, .hero-copy, .page-head, .card, .project-card, .timeline-item, .contact-link, .profile-card, .bar",
  );
  revealTargets.forEach((target) => {
    target.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    revealTargets.forEach((x) => observer.observe(x));
  } else {
    revealTargets.forEach((x) => x.classList.add("visible"));
  }

  $$(".accordion-btn").forEach((btn) =>
    btn.addEventListener("click", () =>
      btn.parentElement.classList.toggle("open"),
    ),
  );

  const modal = $("#modal"),
    modalImg = $("#modalImg");
  $$(".zoomable").forEach((img) =>
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.add("open");
    }),
  );
  $("#modalClose")?.addEventListener("click", () =>
    modal.classList.remove("open"),
  );
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  const form = $("#contactForm");
  if (form)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const name = $("#name"),
        email = $("#email"),
        message = $("#message");
      $$(".error", form).forEach((x) => (x.textContent = ""));
      if (name.value.trim().length < 2) {
        $("#nameError").textContent = "Please enter your name.";
        ok = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        $("#emailError").textContent = "Please enter a valid email.";
        ok = false;
      }
      if (message.value.trim().length < 10) {
        $("#messageError").textContent =
          "Message must be at least 10 characters.";
        ok = false;
      }
      if (ok) {
        $("#formStatus").textContent =
          "Message validated successfully! (Connect a form service to receive submissions.)";
        form.reset();
      }
    });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}

