(function () {
  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // Active link on scroll (home page only)
  var sections = document.querySelectorAll("section[id]");
  var navItems = document.querySelectorAll(".nav-links a[href^='#']");
  function onScroll() {
    var pos = window.scrollY + 120;
    sections.forEach(function (sec) {
      var link = document.querySelector(".nav-links a[href='#" + sec.id + "']");
      if (!link) return;
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        navItems.forEach(function (l) { l.classList.remove("active"); });
        link.classList.add("active");
      }
    });
    var top = document.querySelector(".to-top");
    if (top) top.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll);

  // Back to top
  var top = document.querySelector(".to-top");
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Contact form (AJAX → contact.php; richiede hosting PHP)
  var form = document.getElementById("contactForm");
  var feedback = document.getElementById("cf-feedback");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var btn = form.querySelector("button[type='submit']");
      var oldLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Invio in corso...";
      feedback.textContent = "";
      feedback.className = "form-feedback";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "X-Requested-With": "fetch", Accept: "application/json" }
      })
        .then(function (r) {
          return r.json().catch(function () {
            return { ok: r.ok, message: r.ok ? "Richiesta inviata." : "Errore nell'invio." };
          });
        })
        .then(function (data) {
          feedback.textContent = data.message || (data.ok
            ? "Grazie! La tua richiesta è stata inviata. Ti ricontatteremo al più presto."
            : "Errore nell'invio. Riprova o chiamaci al 015 8353371.");
          feedback.className = "form-feedback " + (data.ok ? "ok" : "err");
          if (data.ok) form.reset();
        })
        .catch(function () {
          feedback.textContent = "Errore di rete. Riprova o chiamaci al 015 8353371.";
          feedback.className = "form-feedback err";
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = oldLabel;
        });
    });
  }

  // Cookie banner
  var banner = document.querySelector(".cookie-banner");
  if (banner) {
    if (localStorage.getItem("cookieChoice")) banner.classList.add("hidden");
    banner.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        localStorage.setItem("cookieChoice", b.classList.contains("accept") ? "accept" : "refuse");
        banner.classList.add("hidden");
      });
    });
  }
})();
