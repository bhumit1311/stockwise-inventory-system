/**
 * StockWise Central Data Service
 * Provides unified interface for data operations
 */

class DataService {
    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Stored data or default value
     */
    static get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error reading ${key}:`, e);
            return defaultValue;
        }
    }
    
    /**
     * Set data in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} True if successful
     */
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error writing ${key}:`, e);
            return false;
        }
    }
    
    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error(`Error removing ${key}:`, e);
            return false;
        }
    }
    
    /**
     * Clear all data
     * @param {string[]} keysToKeep - Keys to preserve
     */
    static clear(keysToKeep = []) {
        try {
            const dataToKeep = {};
            keysToKeep.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) dataToKeep[key] = value;
            });
            
            localStorage.clear();
            
            Object.keys(dataToKeep).forEach(key => {
                localStorage.setItem(key, dataToKeep[key]);
            });
            
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }
    
    /**
     * Get all products
     * @returns {Array} Array of products
     */
    static getProducts() {
        return StockWiseDB.db.getAll('products');
    }
    
    /**
     * Get all suppliers
     * @returns {Array} Array of suppliers
     */
    static getSuppliers() {
        return StockWiseDB.db.getAll('suppliers');
    }
    
    /**
     * Get all users
     * @returns {Array} Array of users
     */
    static getUsers() {
        return StockWiseDB.db.getAll('users');
    }
    
    /**
     * Get low stock products
     * @returns {Array} Array of low stock products
     */
    static getLowStockProducts() {
        const products = this.getProducts();
        return products.filter(p => p.current_stock <= p.minimum_stock);
    }
    
    /**
     * Get inventory statistics
     * @returns {Object} Statistics object
     */
    static getInventoryStats() {
        const products = this.getProducts();
        const suppliers = this.getSuppliers();
        const lowStock = this.getLowStockProducts();
        
        const totalValue = products.reduce((sum, p) => 
            sum + (p.unit_price * p.current_stock), 0
        );
        
        const activeSuppliers = suppliers.filter(s => s.status === 'active');
        
        return {
            totalProducts: products.length,
            totalSuppliers: activeSuppliers.length,
            lowStockCount: lowStock.length,
            totalValue: totalValue,
            categories: this.getCategoryStats(products)
        };
    }
    
    /**
     * Get category statistics
     * @param {Array} products - Products array
     * @returns {Object} Category statistics
     */
    static getCategoryStats(products) {
        const stats = {};
        
        products.forEach(product => {
            if (!stats[product.category]) {
                stats[product.category] = {
                    count: 0,
                    totalStock: 0,
                    totalValue: 0
                };
            }
            
            stats[product.category].count++;
            stats[product.category].totalStock += product.current_stock;
            stats[product.category].totalValue += product.unit_price * product.current_stock;
        });
        
        return stats;
    }
    
    /**
     * Export data to JSON file
     * @param {string} filename - Export filename
     */
    static exportToJSON(filename = 'stockwise-export.json') {
        const data = StockWiseDB.db.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Export data to CSV
     * @param {Array} data - Data array
     * @param {string} filename - Export filename
     */
    static exportToCSV(data, filename = 'export.csv') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' && value.includes(',') 
                        ? `"${value}"` 
                        : value;
                }).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Make available globally
window.DataService = DataService;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}