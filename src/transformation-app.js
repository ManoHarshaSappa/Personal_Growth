// Personal Transformation Tracker - Sectional Data Management System
class TransformationTracker {
    constructor() {
        this.data = {};
        this.sections = ['hair', 'face', 'beard', 'body', 'skin', 'fitness', 'nutrition', 'style'];
        this.currentSection = 'hair';
        this.init();
    }

    init() {
        this.loadAllData();
        this.setupEventListeners();
        this.updateDashboard();
        this.setupRangeInputs();
        this.loadSectionData(this.currentSection);
    }

    // Data Management
    loadAllData() {
        const stored = localStorage.getItem('transformationTrackerData');
        if (stored) {
            this.data = JSON.parse(stored);
        } else {
            this.data = this.createDefaultData();
        }
    }

    createDefaultData() {
        const defaultData = {
            metadata: {
                createdDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                version: '2.0.0'
            },
            sections: {}
        };

        // Initialize empty sections
        this.sections.forEach(section => {
            defaultData.sections[section] = {
                data: {},
                lastSaved: null,
                completion: 0
            };
        });

        return defaultData;
    }

    saveAllData() {
        this.data.metadata.lastUpdated = new Date().toISOString();
        localStorage.setItem('transformationTrackerData', JSON.stringify(this.data));
        this.updateDashboard();
    }

    // Section Management
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Remove active from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Activate selected tab
        const targetTab = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        const sectionData = this.data.sections[sectionName]?.data || {};

        // Load data into form fields
        Object.keys(sectionData).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = sectionData[fieldId];

                // Handle range inputs
                if (field.type === 'range') {
                    this.updateRangeValue(field);
                }
            }
        });

        // Update last saved display
        const lastSaved = this.data.sections[sectionName]?.lastSaved;
        const lastSavedElement = document.getElementById(`${sectionName}-last-saved`);
        if (lastSavedElement) {
            if (lastSaved) {
                const date = new Date(lastSaved);
                lastSavedElement.textContent = `Last saved: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            } else {
                lastSavedElement.textContent = 'Never saved';
            }
        }
    }

    saveSection(sectionName) {
        const sectionData = {};
        const sectionElement = document.getElementById(`${sectionName}-section`);

        if (!sectionElement) return;

        // Collect all form data from the section
        const inputs = sectionElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.id) {
                let value = input.value;

                // Handle different input types
                if (input.type === 'number') {
                    value = value ? parseFloat(value) : null;
                } else if (input.type === 'date') {
                    value = value || null;
                } else if (input.type === 'range') {
                    value = parseInt(value);
                }

                sectionData[input.id] = value;
            }
        });

        // Save to data structure
        if (!this.data.sections[sectionName]) {
            this.data.sections[sectionName] = { data: {}, lastSaved: null, completion: 0 };
        }

        this.data.sections[sectionName].data = sectionData;
        this.data.sections[sectionName].lastSaved = new Date().toISOString();
        this.data.sections[sectionName].completion = this.calculateSectionCompletion(sectionData);

        this.saveAllData();
        this.loadSectionData(sectionName);
        this.showNotification(`✅ ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} data saved successfully!`, 'success');
    }

    resetSection(sectionName) {
        if (confirm(`Are you sure you want to reset all ${sectionName} data? This cannot be undone.`)) {
            const sectionElement = document.getElementById(`${sectionName}-section`);
            if (!sectionElement) return;

            // Reset all form fields
            const inputs = sectionElement.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'range') {
                    input.value = 5; // Default middle value for ranges
                    this.updateRangeValue(input);
                } else if (input.type === 'number') {
                    input.value = '';
                } else if (input.type === 'date') {
                    input.value = '';
                } else {
                    input.value = '';
                }
            });

            // Clear saved data
            this.data.sections[sectionName] = { data: {}, lastSaved: null, completion: 0 };
            this.saveAllData();
            this.showNotification(`🔄 ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} data reset`, 'info');
        }
    }

    calculateSectionCompletion(sectionData) {
        const fields = Object.keys(sectionData);
        const filledFields = fields.filter(field => {
            const value = sectionData[field];
            return value !== null && value !== undefined && value !== '';
        });

        return fields.length > 0 ? Math.round((filledFields.length / fields.length) * 100) : 0;
    }

    // Dashboard Updates
    updateDashboard() {
        const totalEntries = this.getTotalEntries();
        const sectionsCompleted = this.getCompletedSections();
        const overallCompletion = this.getOverallCompletion();
        const lastUpdate = this.getLastUpdate();

        // Update dashboard stats
        this.updateElement('total-entries', totalEntries);
        this.updateElement('sections-completed', `${sectionsCompleted}/${this.sections.length}`);
        this.updateElement('completion-rate', `${overallCompletion}%`);
        this.updateElement('last-update', lastUpdate);

        // Update progress bar
        const progressBar = document.getElementById('overall-progress');
        if (progressBar) {
            progressBar.style.width = `${overallCompletion}%`;
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    getTotalEntries() {
        let total = 0;
        this.sections.forEach(section => {
            const sectionData = this.data.sections[section]?.data || {};
            total += Object.keys(sectionData).length;
        });
        return total;
    }

    getCompletedSections() {
        return this.sections.filter(section => {
            const completion = this.data.sections[section]?.completion || 0;
            return completion >= 50; // Consider 50%+ as "completed"
        }).length;
    }

    getOverallCompletion() {
        const completions = this.sections.map(section => {
            return this.data.sections[section]?.completion || 0;
        });

        return completions.length > 0 ?
            Math.round(completions.reduce((sum, comp) => sum + comp, 0) / completions.length) : 0;
    }

    getLastUpdate() {
        const lastUpdate = this.data.metadata?.lastUpdated;
        if (!lastUpdate) return 'Never';

        const date = new Date(lastUpdate);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }

    // Event Listeners
    setupEventListeners() {
        // Auto-save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveAllData();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveSection(this.currentSection);
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportData();
                        break;
                }
            }
        });

        // Form change detection
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="range"]')) {
                this.updateRangeValue(e.target);
            }
        });
    }

    setupRangeInputs() {
        document.querySelectorAll('input[type="range"]').forEach(range => {
            this.updateRangeValue(range);
            range.addEventListener('input', () => this.updateRangeValue(range));
        });
    }

    updateRangeValue(rangeInput) {
        const valueId = rangeInput.id + '_val';
        const valueElement = document.getElementById(valueId);
        if (valueElement) {
            valueElement.textContent = rangeInput.value;
        }
    }

    // Data Import/Export
    exportData() {
        const dataToExport = {
            ...this.data,
            exportDate: new Date().toISOString(),
            appVersion: '2.0.0'
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transformation-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('📤 Data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (confirm('This will replace all current data. Are you sure you want to continue?')) {
                    this.data = importedData;
                    this.saveAllData();
                    this.loadSectionData(this.currentSection);
                    this.showNotification('📥 Data imported successfully!', 'success');

                    // Refresh the page to show all imported data
                    setTimeout(() => window.location.reload(), 1000);
                }
            } catch (error) {
                this.showNotification('❌ Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            if (confirm('This will permanently delete everything. Are you absolutely sure?')) {
                localStorage.removeItem('transformationTrackerData');
                this.data = this.createDefaultData();
                this.loadSectionData(this.currentSection);
                this.updateDashboard();
                this.showNotification('🗑️ All data cleared', 'info');
            }
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = 'notification';

        const colors = {
            success: '#48bb78',
            error: '#e53e3e',
            info: '#4299e1',
            warning: '#ed8936'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Data Analysis & Insights
    generateSectionSummary(sectionName) {
        const sectionData = this.data.sections[sectionName]?.data || {};
        const completion = this.data.sections[sectionName]?.completion || 0;

        return {
            sectionName,
            completion,
            totalFields: Object.keys(sectionData).length,
            filledFields: Object.values(sectionData).filter(v => v !== null && v !== '').length,
            lastSaved: this.data.sections[sectionName]?.lastSaved
        };
    }

    getDataOverview() {
        return {
            totalSections: this.sections.length,
            completedSections: this.getCompletedSections(),
            totalEntries: this.getTotalEntries(),
            overallCompletion: this.getOverallCompletion(),
            lastUpdate: this.data.metadata?.lastUpdated,
            sections: this.sections.map(section => this.generateSectionSummary(section))
        };
    }
}

// Global functions for HTML interactions
function showSection(sectionName) {
    window.tracker.showSection(sectionName);
}

function saveSection(sectionName) {
    window.tracker.saveSection(sectionName);
}

function resetSection(sectionName) {
    window.tracker.resetSection(sectionName);
}

function exportData() {
    window.tracker.exportData();
}

function importData(event) {
    window.tracker.importData(event);
}

function clearAllData() {
    window.tracker.clearAllData();
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    window.tracker = new TransformationTracker();

    // Show welcome message on first visit
    const isFirstVisit = !localStorage.getItem('transformationTrackerData');
    if (isFirstVisit) {
        setTimeout(() => {
            window.tracker.showNotification('🎯 Welcome to your Personal Transformation Tracker! Start by filling out any section and saving your data.', 'success');
        }, 1500);
    }

    // Add slideOut animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Auto-save interval (every 5 minutes if there are unsaved changes)
setInterval(() => {
    if (window.tracker && document.hasFocus()) {
        window.tracker.saveAllData();
    }
}, 5 * 60 * 1000);