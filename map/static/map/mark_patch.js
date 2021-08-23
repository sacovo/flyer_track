const points = [];

const newLayer = L.polygon(points, { color: "#00bb00" }).addTo(map);

map.on("click", function (e) {
  newLayer.addLatLng(e.latlng);
  updateShapeField();
});

let tooltipShown = false;

function showTooltip() {
  if (!tooltipShown) {
    const tooltip = document.createElement("div");
    tooltip.innerHTML = i18n.backTooltip;
    tooltip.id = "backBtnTooltip";
    tooltip.classList.add("btn-tooltip");
    backBtn.parentNode.appendChild(tooltip);
    tooltipShown = true;
  }
}

function hideTooltip() {
  if (tooltipShown) {
    document.getElementById("backBtnTooltip").remove();
    tooltipShown = false;
  }
}

const updateShapeField = () => {
  if (
    newLayer.getLatLngs()[0].length === 1 &&
    !tooltipShown &&
    !(window.localStorage.getItem("tooltipShown") || false)
  ) {
    showTooltip();
  } else if (newLayer.getLatLngs()[0].length === 0 && tooltipShown) {
    hideTooltip();
  }
  id_shape.value = JSON.stringify(
    L.polygon(
      newLayer.getLatLngs()[0].map((p) => {
        let x = L.CRS.EPSG3857.project(p);
        return [x.y, x.x];
      })
    ).toGeoJSON()["geometry"]
  );
};

L.easyButton(
  "fa-undo",
  function (btn, map) {
    const points = newLayer.getLatLngs()[0];
    const length = points.length;

    hideTooltip();
    if (length > 0) {
      newLayer.setLatLngs(points.slice(0, length - 1));
      updateShapeField();
      window.localStorage.setItem("tooltipShown", true);
    }
  },
  "Back",
  "backBtn"
).addTo(map);
