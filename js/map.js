export function createMap(containerId, center = [-1.5, 53.4], zoom = 7) {

  const map = new maplibregl.Map({
    container: containerId,
    style: "https://demotiles.maplibre.org/style.json",
    center,
    zoom
  });

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      line_string: true,
      point: true,
      trash: true
    }
  });

  map.addControl(draw);

  return { map, draw };
}