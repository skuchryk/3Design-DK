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
      var location = (section && section.id) || link.id || "unknown";
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

  // Launch-offer promo: bar + echoes, auto-hidden once the offer ends.
  // Offer runs through Aug 11, 2026 (client-local time); from Aug 12 the bar
  // and every [data-promo] element disappear without a redeploy.
  var PROMO_END = new Date(2026, 7, 12);
  var promoNow = new Date();
  if (promoNow < PROMO_END) {
    document.body.classList.add("promo-active");
    var promoDays = document.getElementById("promoDays");
    if (promoDays) {
      var daysLeft = Math.ceil((PROMO_END - promoNow) / 86400000);
      promoDays.textContent =
        daysLeft <= 1 ? "— last day!" : "— ends in " + daysLeft + " days";
    }
    // The bar can wrap to two lines on narrow screens — measure it and let
    // the CSS offset the fixed nav / hero padding by the real height.
    var promoBar = document.getElementById("promoBar");
    function setPromoHeight() {
      if (promoBar) {
        document.documentElement.style.setProperty(
          "--promo-h",
          promoBar.offsetHeight + "px"
        );
      }
    }
    setPromoHeight();
    window.addEventListener("resize", setPromoHeight);
    window.addEventListener("load", setPromoHeight);
    // Webfont load can re-wrap the bar without a resize event
    if (promoBar && "ResizeObserver" in window) {
      new ResizeObserver(setPromoHeight).observe(promoBar);
    }
  } else {
    document.querySelectorAll("[data-promo]").forEach(function (el) {
      el.style.display = "none";
    });
  }

  // Current year in footer
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
