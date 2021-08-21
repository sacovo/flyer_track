var map = L.map("map");

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

map.fitBounds([
  [47.952483, 5.646172],
  [45.847265, 11.192652],
]);

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

const userID = +document.getElementById("userId").dataset.id;

let patchLayer = null;

function onEachFeature(feature, layer) {
  let popupContent = `<p><em><a href="/?id=${feature.properties.pk}">#${feature.properties.pk}</a></em>: ${feature.properties.flyer_count} ${i18n.objName}</p>`;

  if (feature.properties.owner === userID) {
    popupContent += `<p><a href="/delete/${feature.properties.pk}/">${i18n.delete}</a> | <a href="/update/${feature.properties.pk}/">${i18n.edit}</a> </p>`;
  }

  layer.bindPopup(popupContent);
}

const highlight = document.getElementById("highlight");

const highlightColor = highlight.dataset.color;
const highlightId = highlight.dataset.id;
const extent = JSON.parse(document.getElementById("extent").textContent);
const highlightLat = highlight.dataset.lat;
const highlightLng = highlight.dataset.lng;

const updatePatches = () => {
  const bounds = map.getBounds();
  const bbox = bounds.toBBoxString();

  fetch(`/patches/?bbox=${bbox}`)
    .then((response) => response.json())
    .then((geoJson) => {
      if (patchLayer) {
        patchLayer.remove();
      }
      patchLayer = L.geoJson(geoJson, {
        onEachFeature: onEachFeature,
        style: function (feature) {
          if (feature.properties.pk == highlightId) {
            return { color: highlightColor, fillOpacity: 0.4, weight: 5 };
          }
          if (feature.properties.confirmed) {
            return { color: "#d20729", fillOpacity: 0.75 };
          }
          return { color: "#d20729", fillOpacity: 0.25 };
        },
      }).addTo(map);
    });
};

updatePatches();
function loadView() {
  if (extent) {
    map.fitBounds([
      [extent[1], extent[0]],
      [extent[3], extent[2]],
    ]);
  } else if (window.sessionStorage.getItem("locationSaved")) {
    map.setView(
      JSON.parse(window.sessionStorage.getItem("mapCenter")),
      window.sessionStorage.getItem("mapZoom")
    );
  } else {
    handlePermission();
  }
}
loadView();
