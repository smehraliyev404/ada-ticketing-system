const viewportEl = document.getElementById("map-viewport");
const venueMap = document.getElementById("venue-map");
const zoomLabel = document.getElementById("zoom-level");

const MIN_ZOOM = 0.2; // small enough that the whole venue fits on a phone
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.2;
const MOVE_STEP = 80;

// x and y = how far the center of the map is from the center of the viewport
const view = { x: 0, y: 0, zoom: 1 };

function applyView() {
  const maxX = (venueMap.offsetWidth * view.zoom + viewportEl.clientWidth) / 2 - 80;
  const maxY = (venueMap.offsetHeight * view.zoom + viewportEl.clientHeight) / 2 - 80;
  view.x = Math.max(-maxX, Math.min(maxX, view.x));
  view.y = Math.max(-maxY, Math.min(maxY, view.y));

  venueMap.style.transform =
    `translate(calc(-50% + ${view.x}px), calc(-50% + ${view.y}px)) scale(${view.zoom})`;

  zoomLabel.textContent = Math.round(view.zoom * 100) + "%";
  document.getElementById("zoom-in").disabled = view.zoom >= MAX_ZOOM;
  document.getElementById("zoom-out").disabled = view.zoom <= MIN_ZOOM;
}

// cx, cy = the point to zoom around, measured from the center of the viewport.
function zoomTo(newZoom, cx, cy) {
  newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
  const ratio = newZoom / view.zoom;
  view.x = cx - (cx - view.x) * ratio;
  view.y = cy - (cy - view.y) * ratio;
  view.zoom = newZoom;
  applyView();
}

function moveBy(dx, dy) {
  view.x += dx;
  view.y += dy;
  applyView();
}

function resetView() {
  const fitWidth = (viewportEl.clientWidth - 110) / venueMap.offsetWidth;
  const fitHeight = viewportEl.clientHeight / venueMap.offsetHeight;

  view.x = 0;
  view.y = 0;
  view.zoom = Math.max(MIN_ZOOM, Math.min(1, Math.min(fitWidth, fitHeight) * 0.95));
  applyView();
}

document.getElementById("zoom-in").addEventListener("click", function () {
  zoomTo(view.zoom + ZOOM_STEP, 0, 0);
});
document.getElementById("zoom-out").addEventListener("click", function () {
  zoomTo(view.zoom - ZOOM_STEP, 0, 0);
});
document.getElementById("move-up").addEventListener("click", function () {
  moveBy(0, MOVE_STEP);
});
document.getElementById("move-down").addEventListener("click", function () {
  moveBy(0, -MOVE_STEP);
});
document.getElementById("move-left").addEventListener("click", function () {
  moveBy(MOVE_STEP, 0);
});
document.getElementById("move-right").addEventListener("click", function () {
  moveBy(-MOVE_STEP, 0);
});

document.getElementById("reset-view").addEventListener("click", resetView);

window.addEventListener("resize", applyView);

resetView();