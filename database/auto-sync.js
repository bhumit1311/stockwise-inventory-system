const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const SQL_FILE = path.join(__dirname, 'create_stockwise.sql');
const DB_FILE = path.join(__dirname, 'stockwise.db');

console.log('🔄 Auto-Sync Started');
console.log(`📁 Watching: ${SQL_FILE}`);
console.log(`💾 Database: ${DB_FILE}`);
console.log('-----------------------------------');

// Function to sync SQL file to database
function syncDatabase() {
    console.log(`\n⏰ ${new Date().toLocaleTimeString()} - Change detected!`);
    console.log('🔄 Syncing database...');

    const command = `Get-Content "${SQL_FILE}" | sqlite3 "${DB_FILE}"`;

    exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Sync failed:', error.message);
            return;
        }
        if (stderr) {
            console.error('⚠️  Warning:', stderr);
            return;
        }
        console.log('✅ Database synced successfully!');
    });
}

// Watch for file changes
fs.watch(SQL_FILE, (eventType, filename) => {
    if (eventType === 'change') {
        // Debounce: wait 500ms before syncing to avoid multiple rapid syncs
        clearTimeout(global.syncTimeout);
        global.syncTimeout = setTimeout(syncDatabase, 500);
    }
});

console.log('✅ Watching for changes... (Press Ctrl+C to stop)\n');
