import { supabase } from "./supabase.js";

const map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json",
  center: [-1.5, 53.4],
  zoom: 7
});

map.on("load", async () => {
  const { data, error } = await supabase.from("submissions").select("*");

  if (error) {
    console.error(error);
    return;
  }

  const features = data.map(row => ({
    type: "Feature",
    properties: {
      id: row.id,
      project: row.project_name,
      habitat: row.habitat_type,
      description: row.description
    },
    geometry: Terraformer.WKT.parse(row.geom)
  }));

  map.addSource("submissions", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features
    }
  });

  map.addLayer({
    id: "submissions-layer",
    type: "fill",
    source: "submissions",
    paint: {
      "fill-color": "#008080",
      "fill-opacity": 0.5
    }
  });
});