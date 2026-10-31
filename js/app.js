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

const cartList = document.getElementById("cart-list");

function addToCart() {
  if (!inspectedId) return;

  // the button is already disabled in these cases, but just to be safe
  if (venue.unavailable.includes(inspectedId)) return;
  if (cart.includes(inspectedId)) {
    detailsMessage.textContent = "This seat is already in your cart.";
    return;
  }

  cart.push(inspectedId);
  updateSeat(inspectedId);
  renderCart();
  showDetails();

  const seat = seats[inspectedId];
  detailsMessage.textContent = `Row ${seat.row}, seat ${seat.number} added to your cart.`;
}

function getTotal() {
  return cart.reduce((sum, id) => sum + seats[id].section.price, 0);
}

function renderCart() {
  cartList.replaceChildren();

  for (const id of cart) {
    const seat = seats[id];
    const item = document.createElement("li");
    item.className = "ticket";
    item.style.setProperty("--seat-color", seat.section.color);

    // left part: section and seat
    const info = document.createElement("div");
    info.className = "ticket-info";

    const sectionName = document.createElement("span");
    sectionName.className = "ticket-section";
    sectionName.textContent = seat.section.name;

    const place = document.createElement("strong");
    place.className = "ticket-seat";
    place.textContent = `Row ${seat.row}, Seat ${seat.number}`;

    info.append(sectionName, place);

    const stub = document.createElement("div");
    stub.className = "ticket-stub";

    const price = document.createElement("span");
    price.className = "ticket-price";
    price.textContent = `${seat.section.price} ${venue.currency}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.setAttribute("aria-label", `Remove row ${seat.row} seat ${seat.number}`);
    removeBtn.addEventListener("click", function () {
      removeFromCart(id);
    });

    stub.append(price, removeBtn);
    item.append(info, stub);
    cartList.appendChild(item);
  }

  document.getElementById("cart-count").textContent = cart.length;
  document.getElementById("cart-total").textContent = getTotal() + " " + venue.currency;
  document.getElementById("cart-empty").hidden = cart.length > 0;
  document.getElementById("clear-cart").disabled = cart.length === 0;

  saveCart();
}

addButton.addEventListener("click", addToCart);

function removeFromCart(id) {
  cart = cart.filter(cartId => cartId !== id);

  updateSeat(id); // seat goes back to normal on the map straight away
  renderCart();

  if (id === inspectedId) {
    showDetails();
  }
}

function clearCart() {
  if (cart.length === 0) return;
  if (!confirm("Remove all tickets from the cart?")) return;

  const removed = cart;
  cart = [];
  for (const id of removed) {
    updateSeat(id);
  }
  renderCart();
  showDetails();
}

document.getElementById("clear-cart").addEventListener("click", clearCart);

const STORAGE_KEY = "adaHallCart";

// the cart is saved as an object, the seat ids + when it was last changed
function saveCart() {
  const savedCart = {
    seatIds: cart,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCart));
}

function loadCart() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const savedCart = JSON.parse(stored);
    if (Array.isArray(savedCart.seatIds)) {
      cart = savedCart.seatIds;
    }
  } catch (error) {
    console.warn("Saved cart could not be read, starting with an empty cart");
    cart = [];
  }
}

renderVenue();
renderLegend();
loadCart();
updateAllSeats();
renderCart();