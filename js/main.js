// HotspotUV site — nav, mobile menu, scroll reveal

(function () {
  "use strict";

  // Sticky nav border on scroll
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // Cookie consent (Google Analytics Consent Mode v2)
  var banner = document.getElementById("cookie-banner");
  if (banner) {
    var stored = null;
    try { stored = localStorage.getItem("cookie-consent"); } catch (e) {}
    if (!stored) banner.hidden = false;

    function setConsent(value) {
      try { localStorage.setItem("cookie-consent", value); } catch (e) {}
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: value === "granted" ? "granted" : "denied"
        });
      }
      banner.hidden = true;
    }

    var accept = document.getElementById("cookie-accept");
    var decline = document.getElementById("cookie-decline");
    if (accept) accept.addEventListener("click", function () { setConsent("granted"); });
    if (decline) decline.addEventListener("click", function () { setConsent("denied"); });
  }

  // Track clicks on the "Get HotspotUV" (Gumroad) buttons in GA4.
  // Fires a custom `purchase_click` event; GA respects Consent Mode, so it is
  // only sent for visitors who accepted analytics. gtag uses sendBeacon, so the
  // event survives the navigation to Gumroad.
  document.querySelectorAll('a[href*="gumroad.com"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (typeof window.gtag !== "function") return;
      var section = link.closest("section, header");
      var location = (section && section.id) || "unknown";
      window.gtag("event", "purchase_click", {
        link_location: location,
        item_id: "hotspotuv",
        currency: "USD",
        value: 15
      });
    });
  });

  // Lightbox for the control-panel screenshots
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = document.getElementById("lightboxImg");
    var lbClose = document.getElementById("lightboxClose");

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lightbox.hidden = true;
      lbImg.src = "";
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".control-shot").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        if (img) openLightbox(img.src, img.alt);
      });
    });
    lightbox.addEventListener("click", closeLightbox);
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  // Masonry layout for the control-panel cards — packs each card into the
  // shortest column so there are no ragged vertical gaps. Every screenshot
  // carries width/height attributes, so card heights are known before the
  // images finish loading and the layout doesn't jump.
  var cgrid = document.querySelector(".controls-grid");
  if (cgrid) {
    var cgCards = Array.prototype.slice.call(cgrid.querySelectorAll(".control-group"));
    var CG_GAP = 18;

    function cgColumns() {
      var w = window.innerWidth;
      if (w <= 620) return 1;
      if (w <= 980) return 2;
      return 3;
    }

    function cgLayout() {
      var cols = cgColumns();
      if (cols === 1) {
        // hand layout back to normal document flow on mobile
        cgrid.style.position = "";
        cgrid.style.height = "";
        cgCards.forEach(function (c) {
          c.style.position = "";
          c.style.left = "";
          c.style.top = "";
          c.style.width = "";
        });
        return;
      }
      var colW = (cgrid.clientWidth - CG_GAP * (cols - 1)) / cols;
      var heights = [];
      for (var i = 0; i < cols; i++) heights[i] = 0;
      cgrid.style.position = "relative";
      cgCards.forEach(function (c) {
        c.style.position = "absolute";
        c.style.width = colW + "px";
        var min = 0;
        for (var j = 1; j < cols; j++) {
          if (heights[j] < heights[min]) min = j;
        }
        c.style.left = min * (colW + CG_GAP) + "px";
        c.style.top = heights[min] + "px";
        heights[min] += c.offsetHeight + CG_GAP;
      });
      cgrid.style.height = Math.max.apply(null, heights) + "px";
    }

    var cgTimer;
    function cgLayoutDebounced() {
      clearTimeout(cgTimer);
      cgTimer = setTimeout(cgLayout, 100);
    }

    cgLayout();
    window.addEventListener("resize", cgLayoutDebounced);
    window.addEventListener("load", cgLayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(cgLayout);
    cgrid.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", cgLayout);
    });
  }

  // Current year in footer
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
