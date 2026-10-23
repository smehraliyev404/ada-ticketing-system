const mapEl = document.getElementById("venue-map");

// every seat is saved here by its id (like "D12") so it's easy to find later
const seats = {};

function createSeatButton(section, row, number) {
  const id = row + number;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "seat";
  button.textContent = number;
  button.dataset.id = id;

  seats[id] = { id: id, row: row, number: number, section: section, button: button };
  return button;
}

function createRowLabel(row) {
  const label = document.createElement("span");
  label.className = "row-label";
  label.textContent = row;
  return label;
}

function renderVenue() {
  let zone = null;
  let title = null;

  for (const section of venue.sections) {
    if (section.joinPrevious) {
      title.textContent += ` / ${section.name} - ${section.price} ${venue.currency}`;
    } else {
      zone = document.createElement("section");
      zone.className = "zone";
      zone.id = "zone-" + section.id;

      title = document.createElement("h3");
      title.className = "zone-title";
      title.textContent = `${section.name} - ${section.price} ${venue.currency}`;
      zone.appendChild(title);
      mapEl.appendChild(zone);
    }

    for (const row of section.rows) {
      const rowEl = document.createElement("div");
      rowEl.className = "seat-row";
      rowEl.style.setProperty("--seat-color", section.color);
      rowEl.appendChild(createRowLabel(row));

      for (let n = 1; n <= section.seatsPerRow; n++) {
        rowEl.appendChild(createSeatButton(section, row, n));

        // two aisles split every row into a left, middle and right block
        if (section.aisles.includes(n)) {
          const aisle = document.createElement("span");
          aisle.className = "aisle";
          rowEl.appendChild(aisle);
        }
      }

      rowEl.appendChild(createRowLabel(row));
      zone.appendChild(rowEl);
    }
  }
}

function renderLegend() {
  const legend = document.getElementById("legend");

  for (const section of venue.sections) {
    const item = document.createElement("li");

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.backgroundColor = section.color;

    item.append(swatch, `${section.name} - ${section.price} ${venue.currency}`);
    legend.appendChild(item);
  }
}

renderVenue();
renderLegend();