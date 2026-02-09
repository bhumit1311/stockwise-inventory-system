# 🔄 Auto-Sync Database Setup

This folder contains an auto-sync script that automatically updates your SQLite database whenever you edit the SQL file.

## 📋 Requirements

- Node.js installed on your system
- SQLite3 command-line tool

## 🚀 How to Use

### 1. Start Auto-Sync

Open a terminal in the `database` folder and run:

```powershell
node auto-sync.js
```

### 2. Edit Your SQL File

Now whenever you edit `create_stockwise.sql` and save it, the database will automatically update!

### 3. Stop Auto-Sync

Press `Ctrl+C` in the terminal to stop watching.

## ⚙️ How It Works

- The script watches `create_stockwise.sql` for changes
- When you save the file, it automatically runs the SQL commands
- Changes are synced to `stockwise.db` within 500ms
- Debouncing prevents multiple rapid syncs

## 💡 Tips

- Keep the terminal window open while editing
- You'll see confirmation messages when syncing happens
- If there are SQL errors, they'll be displayed in the terminal

## 🎯 Alternative: Manual Sync

If you don't want auto-sync running, you can manually sync anytime:

```powershell
Get-Content "create_stockwise.sql" | sqlite3 "stockwise.db"
```

---

**Note:** For production use, it's better to add data through your web application UI rather than editing SQL files directly.
