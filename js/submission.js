// --- INIT MAP ---
const map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json",
  center: [-0.1276, 51.5072], // London
  zoom: 10
});

// Add drawing tools
const draw = new MapboxDraw();
map.addControl(draw);

// --- INIT SUPABASE ---
const SUPABASE_URL = "YOUR_URL";
const SUPABASE_KEY = "YOUR_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- HANDLE FORM ---
document.getElementById("submitForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const projectName = document.getElementById("projectName").value;
  const habitatType = document.getElementById("habitatType").value;
  const description = document.getElementById("description").value;

  const drawn = draw.getAll();

  if (!drawn.features.length) {
    alert("Please draw a geometry on the map.");
    return;
  }

  const geometry = drawn.features[0].geometry;

  const { error } = await supabaseClient
    .from("habitats")
    .insert([
      {
        name: projectName,
        habitat: habitatType,
        description: description,
        geom: geometry
      }
    ]);

  if (error) {
    console.error(error);
    alert("Error saving data");
  } else {
    alert("Saved successfully!");
  }
});
