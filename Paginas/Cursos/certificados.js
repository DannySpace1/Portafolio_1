const tables = [...document.querySelectorAll("main table")];
const certificateCards = [...document.querySelectorAll("[data-certificate-card]")];

function titleFromImage(image) {
    const source = image.getAttribute("src") || "";
    return decodeURIComponent(source.split("/").pop() || "")
        .replace(/.[^.]+$/, "")
        .replace(/=/g, ":")
        .trim();
}

tables.forEach((table) => {
    const rows = [...table.rows];
    const grid = document.createElement("div");
    grid.className = "certificate-grid";

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 2) {
        const imageCells = [...(rows[rowIndex]?.cells || [])];
        const titleCells = [...(rows[rowIndex + 1]?.cells || [])];

        imageCells.forEach((cell, cellIndex) => {
            const image = cell.querySelector("img");
            if (!image || !(image.getAttribute("src") || "").trim()) return;

            const title = titleCells[cellIndex]?.textContent.trim() || titleFromImage(image);
            const originalLink = image.closest("a");
            const card = document.createElement("article");
            const link = document.createElement("a");
            const cardImage = image.cloneNode(true);
            const heading = document.createElement("h3");

            card.className = "certificate-card";
            card.dataset.certificateCard = "";
            card.dataset.search = title.toLocaleLowerCase("es");
            link.href = originalLink?.getAttribute("href") || image.getAttribute("src");
            link.target = "_blank";
            link.rel = "noreferrer";
            link.setAttribute("aria-label", "Abrir constancia: " + title);
            cardImage.alt = "Constancia de " + title;
            cardImage.loading = "lazy";
            heading.textContent = title;

            link.append(cardImage);
            card.append(link, heading);
            grid.append(card);
            certificateCards.push(card);
        });
    }

    table.replaceWith(grid);
});

const searchInput = document.querySelector("#certificate-search");
const resultsCount = document.querySelector("[data-results-count]");

function updateResults() {
    const query = (searchInput?.value || "")
        .trim()
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    let visible = 0;

    certificateCards.forEach((card) => {
        const haystack = card.dataset.search
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        const matches = !query || haystack.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
    });

    if (resultsCount) {
        resultsCount.textContent = query
            ? visible + " resultado" + (visible === 1 ? "" : "s")
            : certificateCards.length + " constancias disponibles";
    }
}

searchInput?.addEventListener("input", updateResults);
updateResults();

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
