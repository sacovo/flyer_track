var map = L.map("map", {
  zoom: 10,
  center: new L.latLng([46.8182, 8.2275]),
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

let locationMarker = null;

function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then(function (result) {
    if (result.state == "granted") {
      map.locate({ setView: true, maxZoom: 16 });
    }
  });
}

function saveView() {
  window.sessionStorage.setItem("locationSaved", true);
  window.sessionStorage.setItem("mapZoom", map.getZoom());
  window.sessionStorage.setItem("mapCenter", JSON.stringify(map.getCenter()));
}

map.on("zoomend", saveView);
map.on("moveend", saveView);

function loadView() {
  if (window.sessionStorage.getItem("locationSaved")) {
    map.setView(
      JSON.parse(window.sessionStorage.getItem("mapCenter")),
      window.sessionStorage.getItem("mapZoom")
    );
  } else {
    handlePermission();
  }
}

function onLocationFound(e) {
  if (locationMarker != null) {
    locationMarker.remove();
  }
  locationMarker = L.marker(e.latlng);
  locationMarker.addTo(map);
}

map.on("locationfound", onLocationFound);

L.easyButton("fa-crosshairs", function (btn, map) {
  map.locate({ setView: true, maxZoom: 18 });
}).addTo(map);

map.addControl(
  new L.Control.Search({
    url: "https://nominatim.openstreetmap.org/search?format=json&q={s}",
    position: "topright",
    jsonpParam: "json_callback",
    propertyName: "display_name",
    propertyLoc: ["lat", "lon"],
    marker: L.marker([0, 0]),
    autoCollapse: false,
    autoType: false,
    minLength: 2,
    zoom: 16,
    delayType: 800,
  })
);

let patchLayer = null;

const updatePatches = () => {
  const bounds = map.getBounds();
  const bbox = bounds.toBBoxString();

  fetch(`/patches/?bbox=${bbox}`)
    .then((response) => response.json())
    .then((geoJson) => {
      if (patchLayer) {
        patchLayer.remove();
      }
      patchLayer = L.geoJson(geoJson).addTo(map);
    });
};

updatePatches();
loadView();
