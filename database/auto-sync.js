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
    console.log('🗑️  Clearing old data...');

    // First, drop all tables to avoid UNIQUE constraint errors
    const dropCommand = `sqlite3 "${DB_FILE}" "DROP TABLE IF EXISTS stockwise_activity_logs; DROP TABLE IF EXISTS stockwise_stock_logs; DROP TABLE IF EXISTS stockwise_products; DROP TABLE IF EXISTS stockwise_suppliers; DROP TABLE IF EXISTS stockwise_categories; DROP TABLE IF EXISTS stockwise_users; DROP VIEW IF EXISTS v_low_stock_products; DROP VIEW IF EXISTS v_recent_stock_movements; DROP VIEW IF EXISTS v_inventory_summary;"`;

    exec(dropCommand, { shell: 'powershell.exe' }, (dropError) => {
        if (dropError) {
            console.error('⚠️  Warning during cleanup:', dropError.message);
        }

        // Then import the SQL file
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
