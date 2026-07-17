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

  // Contact form → Web3Forms (GitHub Pages non esegue PHP)
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

      var formData = new FormData(form);
      var payload = Object.fromEntries(formData.entries());
      payload.access_key = "e8398d31-21a4-4522-85f0-f839fb995380";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var ok = data.success === true;
          feedback.textContent = ok
            ? "Grazie! La tua richiesta è stata inviata. Ti ricontatteremo al più presto."
            : (data.message || "Errore nell'invio. Riprova o chiamaci al 015 8353371.");
          feedback.className = "form-feedback " + (ok ? "ok" : "err");
          if (ok) form.reset();
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
