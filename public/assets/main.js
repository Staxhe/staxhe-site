/* ==========================================================================
   STAXHE — PAGE SCRIPT
   Renders content.js into the page and handles the theme toggle and nav.
   You shouldn't need to edit this file to change content.
   ========================================================================== */

(function () {
  "use strict";

  var SITE = window.SITE || {};
  var ICONS = window.ICONS || { brand: {}, line: {} };
  var root = document.documentElement;
  var SVG_NS = "http://www.w3.org/2000/svg";
  var THEME_KEY = "staxhe-theme";

  // Project lifecycle. `step` fills the badge track (out of 3).
  var STATUS = {
    concept: { label: "Concept", step: 0 },
    development: { label: "In development", step: 1 },
    "release-prep": { label: "Release prep", step: 2 },
    beta: { label: "Beta", step: 2 },
    live: { label: "Available", step: 3 },
    paused: { label: "Paused", step: 1 },
  };
  var STATUS_STEPS = 3;

  /* ---------- Helpers ---------------------------------------------------- */

  function get(obj, path) {
    return path.split(".").reduce(function (o, key) {
      return o == null ? undefined : o[key];
    }, obj);
  }

  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "text") node.textContent = value;
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function hasUrl(item) {
    return typeof item.url === "string" && item.url.trim() !== "";
  }

  // name: a key in ICONS.line or ICONS.brand, or raw SVG path data.
  function icon(name, extraClass) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var cls = "icon";

    if (name && ICONS.line[name]) {
      svg.innerHTML = ICONS.line[name];
    } else {
      var d = name && ICONS.brand[name];
      if (!d && typeof name === "string" && /^[Mm][\d\s.,-]/.test(name)) d = name;
      if (d) {
        var path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", d);
        svg.appendChild(path);
        cls += " icon--brand";
      } else {
        svg.innerHTML = ICONS.line.link || "";
      }
    }

    svg.setAttribute("class", extraClass ? cls + " " + extraClass : cls);
    return svg;
  }

  function showPlaceholderTag(key, show) {
    var tag = document.querySelector('[data-placeholder-tag="' + key + '"]');
    if (tag) tag.hidden = !show;
  }

  /* ---------- Simple text bindings -------------------------------------- */

  function renderBindings() {
    document.querySelectorAll("[data-bind]").forEach(function (node) {
      var value = get(SITE, node.getAttribute("data-bind"));
      if (typeof value === "string" && value) node.textContent = value;
    });

    var status = document.querySelector("[data-hero-status]");
    var statusText = get(SITE, "hero.status");
    if (status && statusText) {
      status.textContent = statusText;
      status.hidden = false;
    }

    var year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ---------- About ------------------------------------------------------ */

  function renderAbout() {
    var mount = document.querySelector("[data-about]");
    var about = SITE.about || {};
    if (!mount) return;
    (about.paragraphs || []).forEach(function (text) {
      mount.appendChild(h("p", { text: text }));
    });
    showPlaceholderTag("about", !!about.placeholder);
  }

  /* ---------- Projects --------------------------------------------------- */

  function renderStatus(key, customLabel) {
    var info = STATUS[key] || { label: key || "In development", step: 1 };
    var track = h("span", { class: "status__track", "aria-hidden": "true" });
    for (var i = 1; i <= STATUS_STEPS; i++) {
      track.appendChild(h("i", { class: i <= info.step ? "is-on" : null }));
    }
    return h("p", { class: "status", "data-status": key }, [
      track,
      h("span", { class: "sr-only", text: "Status: " }),
      customLabel || info.label,
    ]);
  }

  function renderButton(button, showUnavailable) {
    var available = hasUrl(button);
    if (!available && !showUnavailable) return null;

    var cls = "btn " + (button.primary ? "btn--primary" : "btn--secondary");
    var leading = button.icon ? icon(button.icon) : null;

    if (available) {
      return h("a", { class: cls, href: button.url }, [
        leading,
        h("span", { text: button.label }),
        button.icon ? null : icon("arrow-up-right"),
      ]);
    }

    // No URL yet: visible, but not a link.
    return h("span", { class: cls + " is-pending" }, [
      leading,
      h("span", { text: button.label }),
      h("span", { class: "soon", "aria-hidden": "true", text: "Soon" }),
      h("span", { class: "sr-only", text: " (not available yet)" }),
    ]);
  }

  function renderProject(project, showUnavailable) {
    var media = project.image
      ? h("img", {
          class: "project__media",
          src: project.image,
          alt: project.imageAlt || "",
          loading: "lazy",
          decoding: "async",
        })
      : h("div", { class: "project__media project__media--placeholder", "aria-hidden": "true" }, [
          h("span", { text: "Artwork placeholder" }),
        ]);

    var tags = (project.tags || []).length
      ? h(
          "ul",
          { class: "tags", role: "list", "aria-label": "Tags" },
          project.tags.map(function (tag) {
            return h("li", { text: tag });
          })
        )
      : null;

    var buttons = (project.buttons || [])
      .map(function (button) {
        return renderButton(button, showUnavailable);
      })
      .filter(Boolean);

    return h("li", { class: "project" }, [
      media,
      h("div", { class: "project__body" }, [
        h("div", { class: "project__top" }, [
          h("h3", { class: "project__name", text: project.name }),
          renderStatus(project.status, project.statusLabel),
        ]),
        h("p", { class: "project__desc", text: project.description }),
        tags,
        buttons.length ? h("div", { class: "project__actions" }, buttons) : null,
      ]),
    ]);
  }

  function renderProjects() {
    var mount = document.querySelector("[data-projects]");
    if (!mount) return;
    var showUnavailable = get(SITE, "options.showUnavailableButtons") !== false;
    (SITE.projects || []).forEach(function (project) {
      mount.appendChild(renderProject(project, showUnavailable));
    });
  }

  /* ---------- Now -------------------------------------------------------- */

  function renderNow() {
    var mount = document.querySelector("[data-now]");
    var now = SITE.now || {};
    if (!mount) return;

    (now.items || []).forEach(function (item) {
      mount.appendChild(
        h("li", null, [
          h("span", { class: "now__label", text: item.label }),
          h("span", { class: "now__text", text: item.text }),
        ])
      );
    });

    var updated = document.querySelector("[data-now-updated]");
    if (updated && now.updated) {
      updated.textContent = "Updated " + now.updated;
      updated.hidden = false;
    }
    showPlaceholderTag("now", !!now.placeholder);
  }

  /* ---------- Links ------------------------------------------------------ */

  // "https://www.youtube.com/@name/" -> "youtube.com/@name"
  function linkNote(url) {
    if (/^mailto:/i.test(url)) return url.replace(/^mailto:/i, "").split("?")[0];
    try {
      var u = new URL(url, window.location.href);
      return u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/+$/, "");
    } catch (e) {
      return url;
    }
  }

  function renderLinks() {
    var mount = document.querySelector("[data-links]");
    if (!mount) return;
    var anyPlaceholder = false;

    (SITE.links || []).forEach(function (link) {
      if (!hasUrl(link)) return;
      if (link.placeholder) anyPlaceholder = true;
      var isMail = /^mailto:/i.test(link.url);

      mount.appendChild(
        h("li", null, [
          h("a", { class: "link-card", href: link.url, rel: isMail ? null : "me" }, [
            h("span", { class: "link-card__icon" }, [icon(link.icon || (isMail ? "email" : "link"))]),
            h("span", { class: "link-card__text" }, [
              h("span", { class: "link-card__label", text: link.label }),
              h("span", { class: "link-card__note", text: link.note || linkNote(link.url) }),
            ]),
            icon("arrow-up-right", "link-card__arrow"),
          ]),
        ])
      );
    });

    showPlaceholderTag("links", anyPlaceholder);
  }

  /* ---------- Theme toggle ----------------------------------------------- */

  function setupTheme() {
    var toggle = document.querySelector("[data-theme-toggle]");
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (!toggle) return;

    function current() {
      return root.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    function sync() {
      var next = current() === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-label", "Switch to " + next + " theme");
      if (themeColor) {
        var bg = getComputedStyle(root).getPropertyValue("--bg").trim();
        if (bg) themeColor.setAttribute("content", bg);
      }
    }

    var switchTimer = null;

    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      // Ease the colors over instead of flashing between themes.
      root.classList.add("theme-switching");
      clearTimeout(switchTimer);
      switchTimer = setTimeout(function () {
        root.classList.remove("theme-switching");
      }, 320);
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
      sync();
    });

    sync();
  }

  /* ---------- Header + active nav link ----------------------------------- */

  function setupNav() {
    var header = document.querySelector("[data-header]");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 4);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (!("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            if (a.hash === "#" + entry.target.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("[data-section]").forEach(function (section) {
      observer.observe(section);
    });
  }

  renderBindings();
  renderAbout();
  renderProjects();
  renderNow();
  renderLinks();
  setupTheme();
  setupNav();
})();
