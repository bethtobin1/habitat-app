import { supabase } from "./supabase.js";
import { createMap } from "./map.js";

const { map, draw } = createMap("map");

// Submit handler
document.getElementById("submitForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const projectName = document.getElementById("projectName").value;
  const habitatType = document.getElementById("habitatType").value;
  const description = document.getElementById("description").value;

  // Get drawn geometry
  const geojson = draw.getAll();
  if (geojson.features.length === 0) {
    alert("Please draw a feature on the map.");
    return;
  }

  const wkt = Terraformer.WKT.convert(geojson.features[0].geometry);

  // Upload file (optional)
  let filePath = null;
  const file = document.getElementById("fileInput").files[0];

  if (file) {
    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      alert("File upload failed");
      return;
    }
    filePath = data.path;
  }

  // Insert into database
  const { error } = await supabase
    .from("submissions")
    .insert({
      project_name: projectName,
      habitat_type: habitatType,
      description: description,
      file_path: filePath,
      geom: wkt
    });

  if (error) {
    console.error(error);
    alert("Submission failed");
  } else {
    alert("Submission successful!");
    draw.deleteAll();
    document.getElementById("submitForm").reset();
  }
});