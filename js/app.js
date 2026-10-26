const mapEl = document.getElementById("venue-map");
const floorEl = document.getElementById("floor");

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
      if (section.sides) {
        mapEl.appendChild(zone);
      } else {
        floorEl.appendChild(zone);
      }
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
    if (section.sides) {
      renderBalconySide(section, section.sides.left, "balcony-left");
      renderBalconySide(section, section.sides.right, "balcony-right");
    }
  }
}

function renderBalconySide(section, row, containerId) {
  const side = document.getElementById(containerId);
  side.style.setProperty("--seat-color", section.color);
  side.appendChild(createRowLabel(row));

  for (let n = 1; n <= section.sides.seats; n++) {
    side.appendChild(createSeatButton(section, row, n));
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

let inspectedId = null; 
let cart = [];

function getSeatState(id) {
  if (venue.unavailable.includes(id)) return "unavailable";
  if (cart.includes(id)) return "in-cart";
  if (id === inspectedId) return "inspected";
  return "available";
}

const stateNames = {
  available: "Available",
  inspected: "Selected",
  "in-cart": "In your cart",
  unavailable: "Unavailable"
};

// sets the right class on one seat button
function updateSeat(id) {
  const seat = seats[id];
  const state = getSeatState(id);

  seat.button.classList.remove("seat--inspected", "seat--in-cart", "seat--unavailable");
  if (state !== "available") {
    seat.button.classList.add("seat--" + state);
  }
  seat.button.classList.toggle("seat--current", id === inspectedId);

  // for screen readers, since the button itself only shows the number
  seat.button.setAttribute("aria-label",
    `Row ${seat.row}, seat ${seat.number}, ${seat.section.name}, ${seat.section.price} ${venue.currency}, ${stateNames[state]}`);
}

function updateAllSeats() {
  for (const id in seats) {
    updateSeat(id);
  }
}

const detailsCard = document.getElementById("seat-details");
const addButton = document.getElementById("add-to-cart");
const detailsMessage = document.getElementById("details-message");

function inspectSeat(id) {
  const previous = inspectedId;
  inspectedId = id;

  if (previous) updateSeat(previous);
  updateSeat(id);
  showDetails();
}

// a click on a seat bubbles up to the map, closest() finds which seat it was
mapEl.addEventListener("click", function (event) {
  const button = event.target.closest(".seat");
  if (!button || !mapEl.contains(button)) return;

  inspectSeat(button.dataset.id);
});

function closeDetails() {
  if (!inspectedId) return;

  const previous = inspectedId;
  inspectedId = null;
  updateSeat(previous);
  showDetails();
}

document.getElementById("close-details").addEventListener("click", closeDetails);

function showDetails() {
  if (!inspectedId) {
    detailsCard.hidden = true;
    addButton.disabled = true;
    detailsMessage.textContent = "";
    return;
  }

  const seat = seats[inspectedId];
  const state = getSeatState(inspectedId);

  detailsCard.hidden = false;
  detailsCard.style.setProperty("--seat-color", seat.section.color);

  document.getElementById("detail-section").textContent = seat.section.name;
  document.getElementById("detail-row").textContent = seat.row;
  document.getElementById("detail-seat").textContent = seat.number;
  document.getElementById("detail-price").textContent = seat.section.price + " " + venue.currency;

  if (state === "inspected") {
    document.getElementById("detail-status").textContent = "Available (not in cart yet)";
  } else {
    document.getElementById("detail-status").textContent = stateNames[state];
  }

  // only a free seat can be added
  addButton.disabled = state !== "inspected";

  if (state === "unavailable") {
    detailsMessage.textContent = "Sorry, this seat is already taken.";
  } else if (state === "in-cart") {
    detailsMessage.textContent = "This seat is already in your cart.";
  } else {
    detailsMessage.textContent = "";
  }
}

renderVenue();
renderLegend();
updateAllSeats();