document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    const label = menuButton.querySelector(".sr-only");
    if (label) label.textContent = "Abrir menú";
}

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
        menuButton.setAttribute("aria-expanded", String(willOpen));
        navigation.classList.toggle("is-open", willOpen);
        document.body.classList.toggle("menu-open", willOpen);
        const label = menuButton.querySelector(".sr-only");
        if (label) label.textContent = willOpen ? "Cerrar menú" : "Abrir menú";
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuButton.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 864) closeMenu();
    });
}

function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window && sections.length) {
    const activeSectionObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;
            navLinks.forEach((link) => {
                const isCurrent = link.getAttribute("href") === "#" + visible.target.id;
                if (isCurrent) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
        },
        { rootMargin: "-30% 0px -58% 0px", threshold: [0.01, 0.25, 0.5] }
    );
    sections.forEach((section) => activeSectionObserver.observe(section));
}

const filters = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll("[data-category]")];

filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
        const selected = filterButton.dataset.filter;
        filters.forEach((button) => {
            const isActive = button === filterButton;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        projectCards.forEach((card) => {
            const categories = card.dataset.category.split(" ");
            card.hidden = selected !== "all" && !categories.includes(selected);
        });
    });
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const status = document.querySelector("[data-form-status]");
const params = new URLSearchParams(window.location.search);
if (status && params.get("sent") === "1") {
    status.textContent = "Mensaje enviado. Gracias por contactarme; te responderé lo antes posible.";
    status.classList.add("is-success");
}
