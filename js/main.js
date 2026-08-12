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
      // threshold must stay 0: a percentage threshold can never be met by an
      // element taller than the viewport (the mobile one-column .controls-grid
      // is ~9000px, so at most ~9% of it is ever on screen) and such blocks
      // would stay invisible forever. The negative bottom margin still delays
      // the reveal until the element is properly in view.
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      // A block taller than the screen can't be "revealed" perceptibly anyway,
      // and on phones (one-column layouts) it is the case most likely to get
      // stuck hidden. Show those straight away and only animate the rest.
      if (el.getBoundingClientRect().height >= window.innerHeight) {
        el.classList.add("visible");
        return;
      }
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

  // Promo machinery: bar + [data-promo] lines, auto-hidden once the offer ends.
  // PROMO_END is the first day WITHOUT the offer (client-local time), so both
  // disappear on their own, with no redeploy.
  // Currently parked: the launch offer ended Aug 11, 2026 and the bar markup in
  // index.html is commented out. Re-arm the bar and this date together.
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
