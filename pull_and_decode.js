const https = require('https');
const fs = require('fs');
const path = require('path');

const repoBaseUrl = 'https://raw.githubusercontent.com/NityamAPatel-084/Odoo-Hackathon-TransitOps/main/';

const filesToDownload = [
  'src/types.ts',
  'src/App.tsx',
  'src/index.css',
  'src/main.tsx',
  'src/components/AnalyticsReports.tsx',
  'src/components/Dashboard.tsx',
  'src/components/DriversManagement.tsx',
  'src/components/FleetRegistry.tsx',
  'src/components/FuelExpenses.tsx',
  'src/components/LoginScreen.tsx',
  'src/components/MaintenanceOps.tsx',
  'src/components/SettingsPanel.tsx',
  'src/components/TripDispatch.tsx'
];

function downloadFile(file) {
  return new Promise((resolve, reject) => {
    const url = repoBaseUrl + file;
    const dest = path.join(__dirname, file);

    // Ensure directory exists
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${file}: ${res.statusCode} ${res.statusMessage}`));
        return;
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${file}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log('Starting download of Odoo-Hackathon-TransitOps repository files...');
  for (const file of filesToDownload) {
    try {
      await downloadFile(file);
    } catch (err) {
      console.error(`Error downloading ${file}:`, err.message);
    }
  }
  console.log('Finished downloading files.');
}

run();
