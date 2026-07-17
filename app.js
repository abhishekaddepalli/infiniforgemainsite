// Expose require globally so the poorly bundled .mjs file can access it
global.require = require;

async function startServer() {
  try {
    // Dynamically import the compiled ES Module server
    await import('./.output/server/index.mjs');
    console.log("Server loaded successfully via Passenger wrapper.");
  } catch (err) {
    console.error("Failed to load the server:", err);
  }
}

startServer();
