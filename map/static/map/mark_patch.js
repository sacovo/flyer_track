const points = [];

const newLayer = L.polygon(points, { color: "#00bb00" }).addTo(map);

map.on("click", function (e) {
  newLayer.addLatLng(e.latlng);
  updateShapeField();
});

const updateShapeField = () => {
  id_shape.value = JSON.stringify(
    L.polygon(
      newLayer.getLatLngs()[0].map((p) => {
        let x = L.CRS.EPSG3857.project(p);
        return [x.y, x.x];
      })
    ).toGeoJSON()["geometry"]
  );
};

L.easyButton("fa-undo", function (btn, map) {
  const points = newLayer.getLatLngs()[0];
  const length = points.length;
  if (length > 0) {
    newLayer.setLatLngs(points.slice(0, length - 1));
    updateShapeField();
  }
}).addTo(map);
