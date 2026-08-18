/* ==========================================================================
   CAN 2 CURB — main.js
   Vanilla JS. No dependencies. Progressive enhancement:
   the site is fully usable with JS disabled.
   ==========================================================================

   ┌───────────────────────────────────────────────────────────────────────┐
   │  SITE CONFIG — EDIT BUSINESS DETAILS HERE (single source of truth)     │
   │  These values are safe to expose in the browser.                       │
   │  DO NOT put secret API keys or private tokens in this file.            │
   └───────────────────────────────────────────────────────────────────────┘ */
window.CAN2CURB = {
  businessName: "Can 2 Curb",
  domain: "https://www.can2curb.ca",      // TODO(Doug): confirm final domain
  phone: "(587) 545-0586",                // Doug's number
  email: "dougbystrom@yahoo.ca",          // Doug's email
  serviceArea: "Edmonton, Alberta",
  social: {
    facebook: "#",                        // TODO(Doug): Facebook page URL
    instagram: "#"                        // TODO(Doug): Instagram profile URL
  },
  /* Forms are prepared for a POST endpoint (Formspree / Netlify / Growtheon /
     custom API). Until Doug provides one, forms run in DEMO mode and just
     show the success state without sending. To go live:
       1. Set formEndpoint to your endpoint URL.
       2. Set formMode to "live".
     Netlify Forms: instead add `data-netlify="true"` to the <form> and keep
     formMode "live" with formEndpoint = "" (Netlify intercepts the POST). */
  formEndpoint: "",                       // TODO(Doug): e.g. https://formspree.io/f/xxxx
  formMode: "demo",                       // "demo" | "live" (fallback for forms without a Growtheon config)

  /* Growtheon (LeadRescue) lead submission. Any <form data-growtheon-form="<formId>">
     posts here on submit, building { formId, data } where data maps each field's
     data-gt attribute -> its value. The key below is a PUBLISHABLE (anon) key —
     safe to expose in the browser. Not a secret. */
  growtheon: {
    endpoint: "https://auth.growtheon.co/functions/v1/handle-form-submission",
    key: "sb_publishable_enLE5YM6C8teak0PBuPBHA_yxTm1MXO"
  }

  /* Stripe Payment Links live directly in the button hrefs on the pricing page
     and homepage (search the HTML for "buy.stripe.com"). They are Stripe TEST links.
     TODO(Doug): before launch, swap those hrefs for the LIVE Stripe links. */
};

(function () {
  "use strict";
  var C2C = window.CAN2CURB;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initAnnounce();
    initStickyNav();
    initMobileMenu();
    initReveal();
    initFaq();
    initBeforeAfter();
    initHeroMotion();
    initForms();
    injectContactDetails();
    initServicePrefill();
    initModals();
  });

  /* -------- Accessible modal dialogs (e.g. the referral form) -------- */
  function initModals() {
    var lastFocused = null;

    function openModal(modal, opener) {
      lastFocused = opener || document.activeElement;
      modal.hidden = false;
      void modal.offsetWidth; // force reflow so the open transition runs reliably
      modal.classList.add("is-open");
      document.body.classList.add("menu-open"); // reuse scroll lock
      var focusable = modal.querySelector("input, textarea, select, button, a[href]");
      if (focusable) focusable.focus();
    }
    function closeModal(modal) {
      modal.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      var finish = function () { modal.hidden = true; };
      reduceMotion ? finish() : setTimeout(finish, 240);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var modal = document.getElementById(btn.getAttribute("data-modal-open"));
        if (modal) openModal(modal, btn);
      });
    });

    document.querySelectorAll("[data-modal]").forEach(function (modal) {
      modal.querySelectorAll("[data-modal-close]").forEach(function (c) {
        c.addEventListener("click", function () { closeModal(modal); });
      });
      // Keep focus inside the open dialog
      modal.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { closeModal(modal); return; }
        if (e.key !== "Tab") return;
        var items = Array.prototype.filter.call(
          modal.querySelectorAll('a[href], button:not([disabled]), input, textarea, select'),
          function (el) { return el.offsetParent !== null; }
        );
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
  }

  /* -------- Preselect the contact "Service needed" dropdown from ?plan= / ?service= --------
     e.g. /contact/?plan=curbside-clean lands with that service already chosen. */
  function initServicePrefill() {
    var select = document.getElementById("c-service");
    if (!select) return;
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("plan") || params.get("service");
    if (!wanted) return;
    var hasMatch = Array.prototype.some.call(select.options, function (o) { return o.value === wanted; });
    if (hasMatch) select.value = wanted;
  }

  /* -------- Auto-updating copyright year -------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* -------- Dismissible announcement bar (remembers choice) -------- */
  function initAnnounce() {
    var bar = document.querySelector("[data-announce]");
    if (!bar) return;
    try {
      if (localStorage.getItem("c2c_announce_dismissed") === "1") { bar.hidden = true; return; }
    } catch (e) {}
    var close = bar.querySelector("[data-announce-close]");
    if (close) close.addEventListener("click", function () {
      bar.hidden = true;
      try { localStorage.setItem("c2c_announce_dismissed", "1"); } catch (e) {}
    });
  }

  /* -------- Sticky nav: add background/shadow after scroll -------- */
  function initStickyNav() {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Accessible mobile menu -------- */
  function initMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    var backdrop = document.querySelector("[data-menu-backdrop]");
    if (!toggle || !menu) return;

    function open() {
      menu.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    }
    function close() {
      menu.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
    function toggleMenu() {
      (toggle.getAttribute("aria-expanded") === "true") ? close() : open();
    }
    toggle.addEventListener("click", toggleMenu);
    if (backdrop) backdrop.addEventListener("click", close);
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { close(); toggle.focus(); }
    });
  }

  /* -------- Scroll reveal via IntersectionObserver -------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* -------- FAQ accordion (accessible) -------- */
  function initFaq() {
    var triggers = document.querySelectorAll("[data-faq-trigger]");
    triggers.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        if (expanded) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
      // keep height correct on resize when open
      window.addEventListener("resize", function () {
        if (btn.getAttribute("aria-expanded") === "true") {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* -------- Before / After toggle -------- */
  function initBeforeAfter() {
    var group = document.querySelector("[data-ba]");
    if (!group) return;
    var buttons = group.querySelectorAll("[data-ba-btn]");
    var panels = group.querySelectorAll("[data-ba-panel]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-ba-btn");
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-ba-panel") === key);
        });
      });
    });
  }

  /* -------- Hero motion: roll bin + draw route when in view -------- */
  function initHeroMotion() {
    if (reduceMotion) return;
    var art = document.querySelector("[data-hero-art]");
    if (!art) return;

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            art.classList.add("js-draw", "js-roll");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      io.observe(art);
    } else {
      art.classList.add("js-draw", "js-roll");
    }

    // Gentle cursor parallax on desktop only
    var parallax = document.querySelectorAll("[data-parallax]");
    if (parallax.length && window.matchMedia("(pointer:fine)").matches) {
      art.addEventListener("mousemove", function (e) {
        var r = art.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        parallax.forEach(function (el) {
          var depth = parseFloat(el.getAttribute("data-parallax")) || 6;
          el.style.transform = "translate(" + (x * depth) + "px," + (y * depth) + "px)";
        });
      });
      art.addEventListener("mouseleave", function () {
        parallax.forEach(function (el) { el.style.transform = ""; });
      });
    }
  }

  /* -------- Forms: validation, honeypot, states -------- */
  function initForms() {
    document.querySelectorAll("[data-form]").forEach(setupForm);
  }

  function setupForm(form) {
    var statusBox = form.querySelector("[data-form-error]");
    var errorList = form.querySelector("[data-form-error-list]");
    var successBox = form.querySelector("[data-form-success]");
    var submitBtn = form.querySelector("[type=submit]");
    var honeypot = form.querySelector("[data-honeypot]");
    var formStart = Date.now();

    // Live-clear errors as the user fixes fields
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("input", function () { clearFieldError(field); });
      field.addEventListener("blur", function () { validateField(field); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: if filled, silently pretend success (likely a bot)
      if (honeypot && honeypot.value) { showSuccess(); return; }

      var errors = validateAll();
      if (errors.length) {
        showErrorSummary(errors);
        return;
      }
      hide(statusBox);

      // Submit
      setLoading(true);

      // Growtheon (LeadRescue) integration — used when the form carries data-growtheon-form.
      var gtFormId = form.getAttribute("data-growtheon-form");
      if (gtFormId && C2C.growtheon && C2C.growtheon.endpoint) {
        submitToGrowtheon(gtFormId, formStart);
        return;
      }

      if (C2C.formMode === "live" && C2C.formEndpoint) {
        var data = new FormData(form);
        fetch(C2C.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (res) {
            if (!res.ok) throw new Error("Request failed");
            showSuccess();
          })
          .catch(function () {
            setLoading(false);
            showErrorSummary([{ msg: "Something went wrong sending your request. Please try again, or call us." }]);
          });
      } else {
        // DEMO mode — no endpoint configured yet.
        setTimeout(showSuccess, 700);
      }
    });

    function validateAll() {
      var errors = [];
      form.querySelectorAll("[required], [data-validate]").forEach(function (field) {
        var err = validateField(field);
        if (err) errors.push({ field: field, msg: err });
      });
      return errors;
    }

    function validateField(field) {
      if (field.hasAttribute("data-honeypot")) return "";
      var val = (field.value || "").trim();
      var label = fieldLabel(field);
      var err = "";

      if ((field.hasAttribute("required")) && !val) {
        err = label + " is required.";
      } else if (val && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        err = "Please enter a valid email address.";
      } else if (val && field.type === "tel" && !/^[0-9()+\-.\s]{7,}$/.test(val)) {
        err = "Please enter a valid phone number.";
      } else if (field.type === "checkbox" && field.hasAttribute("required") && !field.checked) {
        err = "Please tick the box to continue.";
      }

      if (err) { setFieldError(field, err); } else { clearFieldError(field); }
      return err;
    }

    function fieldLabel(field) {
      var lbl = form.querySelector('label[for="' + field.id + '"]');
      if (lbl) return lbl.textContent.replace("*", "").replace("(required)", "").trim();
      return field.getAttribute("data-label") || "This field";
    }

    function setFieldError(field, msg) {
      field.setAttribute("aria-invalid", "true");
      var box = field.closest(".field, .checkbox");
      if (!box) return;
      var out = box.querySelector(".field__error");
      if (out) { out.textContent = msg; }
    }
    function clearFieldError(field) {
      field.removeAttribute("aria-invalid");
      var box = field.closest(".field, .checkbox");
      if (!box) return;
      var out = box.querySelector(".field__error");
      if (out) out.textContent = "";
    }

    function showErrorSummary(errors) {
      if (!statusBox) return;
      if (errorList) {
        errorList.innerHTML = "";
        errors.forEach(function (er) {
          var li = document.createElement("li");
          if (er.field) {
            var a = document.createElement("a");
            a.href = "#" + er.field.id;
            a.textContent = er.msg;
            a.addEventListener("click", function (ev) { ev.preventDefault(); er.field.focus(); });
            li.appendChild(a);
          } else {
            li.textContent = er.msg;
          }
          errorList.appendChild(li);
        });
      }
      show(statusBox);
      statusBox.focus();
    }

    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.classList.toggle("is-loading", on);
      submitBtn.setAttribute("aria-busy", String(on));
      submitBtn.disabled = on;
    }

    function submitToGrowtheon(formId, startedAt) {
      var data = {};
      form.querySelectorAll("[data-gt]").forEach(function (el) {
        data[el.getAttribute("data-gt")] = (el.value || "").trim();
      });
      var payload = {
        formId: formId,
        data: data,
        deviceType: window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop",
        pageUrl: location.href,
        referrer: document.referrer,
        completionTimeSeconds: Math.round((Date.now() - startedAt) / 1000)
      };
      fetch(C2C.growtheon.endpoint, {
        method: "POST",
        headers: {
          "apikey": C2C.growtheon.key,
          "authorization": "Bearer " + C2C.growtheon.key,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (j) { return { ok: res.ok, j: j }; });
        })
        .then(function (r) {
          if (!(r.ok && r.j && r.j.success)) throw new Error((r.j && r.j.message) || "Submission failed");
          showSuccess();
        })
        .catch(function () {
          setLoading(false);
          showErrorSummary([{ msg: "Sorry — we couldn't send your message just now. Please try again, or email us." }]);
        });
    }

    function showSuccess() {
      setLoading(false);
      hide(statusBox);
      // Hide the form fields, reveal success state
      var fieldsets = form.querySelectorAll("[data-form-fields]");
      fieldsets.forEach(hide);
      if (successBox) {
        show(successBox);
        successBox.setAttribute("tabindex", "-1");
        successBox.focus();
        successBox.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    }
  }

  function show(el) { if (el) el.hidden = false; }
  function hide(el) { if (el) el.hidden = true; }

  /* -------- Inject contact details from config into placeholders -------- */
  function injectContactDetails() {
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      el.textContent = C2C.phone;
      if (el.tagName === "A") el.href = "tel:" + C2C.phone.replace(/[^0-9+]/g, "");
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.textContent = C2C.email;
      if (el.tagName === "A") el.href = "mailto:" + C2C.email;
    });
    document.querySelectorAll("[data-fb]").forEach(function (el) { if (el.tagName === "A") el.href = C2C.social.facebook; });
    document.querySelectorAll("[data-ig]").forEach(function (el) { if (el.tagName === "A") el.href = C2C.social.instagram; });
  }
})();
