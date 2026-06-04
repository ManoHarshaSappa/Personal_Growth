// Personal Body Care Tracker - Main Application Logic
class BodyTracker {
    constructor() {
        this.currentData = {};
        this.schema = {};
        this.init();
    }

    async init() {
        await this.loadSchema();
        this.loadUserData();
        this.setupEventListeners();
        this.generateCategoryContent();
        this.updateStats();
    }

    async loadSchema() {
        try {
            const response = await fetch('data/body-schema.json');
            this.schema = await response.json();
        } catch (error) {
            console.log('Schema not loaded, using default structure');
        }
    }

    loadUserData() {
        const stored = localStorage.getItem('bodyTrackerData');
        if (stored) {
            this.currentData = JSON.parse(stored);
        } else {
            this.currentData = this.createDefaultData();
        }
        this.populateForm();
    }

    createDefaultData() {
        return {
            user_info: {
                created_date: new Date().toISOString().split('T')[0],
                last_updated: new Date().toISOString().split('T')[0],
                notes: 'Personal body care tracking data'
            },
            current_data: {
                face: { measurements: {}, skin_care: {} },
                hair: { measurements: {}, health: {} },
                eyes: { measurements: {}, health: {} },
                body: { measurements: {}, fitness: {} },
                arms: { measurements: {}, hands: {} },
                legs: { measurements: {}, feet: {} },
                back: { measurements: {}, health: {} }
            },
            history: []
        };
    }

    populateForm() {
        // Populate form fields with current data
        Object.keys(this.currentData.current_data).forEach(category => {
            Object.keys(this.currentData.current_data[category]).forEach(subcategory => {
                Object.keys(this.currentData.current_data[category][subcategory]).forEach(field => {
                    const element = document.getElementById(field);
                    if (element) {
                        element.value = this.currentData.current_data[category][subcategory][field] || '';
                    }
                });
            });
        });
    }

    saveData() {
        // Collect data from form
        this.collectFormData();

        // Save to history
        this.currentData.history.push({
            date: new Date().toISOString().split('T')[0],
            data: JSON.parse(JSON.stringify(this.currentData.current_data))
        });

        // Update metadata
        this.currentData.user_info.last_updated = new Date().toISOString().split('T')[0];

        // Save to localStorage
        localStorage.setItem('bodyTrackerData', JSON.stringify(this.currentData));

        // Update UI
        this.updateStats();
        this.update3DVisualization();

        // Show success message
        this.showNotification('Data saved successfully! 📊', 'success');
    }

    collectFormData() {
        const categories = ['face', 'hair', 'eyes', 'body', 'arms', 'legs', 'back'];

        categories.forEach(category => {
            const categoryData = this.currentData.current_data[category];
            Object.keys(categoryData).forEach(subcategory => {
                Object.keys(categoryData[subcategory]).forEach(field => {
                    const element = document.getElementById(field);
                    if (element) {
                        let value = element.value;
                        if (element.type === 'number' || element.type === 'range') {
                            value = value ? parseFloat(value) : null;
                        }
                        categoryData[subcategory][field] = value;
                    }
                });
            });
        });
    }

    generateCategoryContent() {
        const categories = {
            hair: this.generateHairContent(),
            eyes: this.generateEyesContent(),
            body: this.generateBodyContent(),
            arms: this.generateArmsContent(),
            legs: this.generateLegsContent(),
            back: this.generateBackContent()
        };

        Object.keys(categories).forEach(category => {
            const container = document.getElementById(`${category}-content`);
            if (!container) {
                const content = document.createElement('div');
                content.id = `${category}-content`;
                content.className = 'category-content';
                content.innerHTML = categories[category];
                document.querySelector('.data-input-panel').appendChild(content);
            }
        });
    }

    generateHairContent() {
        return `
            <h3>Hair Measurements & Health</h3>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Hair Length (cm)</label>
                    <input type="number" step="0.1" id="length" placeholder="e.g., 25.0">
                </div>
                <div class="input-group">
                    <label>Hair Thickness (1-10)</label>
                    <input type="range" min="1" max="10" id="thickness" oninput="updateRangeValue(this)">
                    <span id="thickness_value">5</span>
                </div>
                <div class="input-group">
                    <label>Hair Density (1-10)</label>
                    <input type="range" min="1" max="10" id="density" oninput="updateRangeValue(this)">
                    <span id="density_value">5</span>
                </div>
                <div class="input-group">
                    <label>Hair Color</label>
                    <input type="text" id="color" placeholder="e.g., Black, Brown, Blonde">
                </div>
            </div>
            <h4 style="margin: 20px 0 15px;">Hair Health</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Texture</label>
                    <select id="texture">
                        <option value="">Select texture</option>
                        <option value="straight">Straight</option>
                        <option value="wavy">Wavy</option>
                        <option value="curly">Curly</option>
                        <option value="coily">Coily</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Condition (1-10)</label>
                    <input type="range" min="1" max="10" id="condition" oninput="updateRangeValue(this)">
                    <span id="condition_value">5</span>
                </div>
            </div>
        `;
    }

    generateEyesContent() {
        return `
            <h3>Eye Measurements & Health</h3>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Eye Distance (cm)</label>
                    <input type="number" step="0.1" id="eye_distance" placeholder="e.g., 3.2">
                </div>
                <div class="input-group">
                    <label>Eye Width (cm)</label>
                    <input type="number" step="0.1" id="eye_width" placeholder="e.g., 2.8">
                </div>
                <div class="input-group">
                    <label>Eye Color</label>
                    <input type="text" id="eye_color" placeholder="e.g., Brown, Blue, Green">
                </div>
                <div class="input-group">
                    <label>Vision Clarity (1-10)</label>
                    <input type="range" min="1" max="10" id="vision_clarity" oninput="updateRangeValue(this)">
                    <span id="vision_clarity_value">8</span>
                </div>
            </div>
        `;
    }

    generateBodyContent() {
        return `
            <h3>Body Measurements</h3>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Height (cm)</label>
                    <input type="number" step="0.1" id="height" placeholder="e.g., 175.5">
                </div>
                <div class="input-group">
                    <label>Weight (kg)</label>
                    <input type="number" step="0.1" id="weight" placeholder="e.g., 70.2">
                </div>
                <div class="input-group">
                    <label>Chest Circumference (cm)</label>
                    <input type="number" step="0.1" id="chest_circumference" placeholder="e.g., 95.0">
                </div>
                <div class="input-group">
                    <label>Waist Circumference (cm)</label>
                    <input type="number" step="0.1" id="waist_circumference" placeholder="e.g., 80.0">
                </div>
                <div class="input-group">
                    <label>Hip Circumference (cm)</label>
                    <input type="number" step="0.1" id="hip_circumference" placeholder="e.g., 95.0">
                </div>
                <div class="input-group">
                    <label>Shoulder Width (cm)</label>
                    <input type="number" step="0.1" id="shoulder_width" placeholder="e.g., 45.0">
                </div>
            </div>
            <h4 style="margin: 20px 0 15px;">Fitness Metrics</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Muscle Mass (1-10)</label>
                    <input type="range" min="1" max="10" id="muscle_mass" oninput="updateRangeValue(this)">
                    <span id="muscle_mass_value">5</span>
                </div>
                <div class="input-group">
                    <label>Body Fat (%)</label>
                    <input type="number" step="0.1" id="body_fat" placeholder="e.g., 15.5">
                </div>
            </div>
        `;
    }

    generateArmsContent() {
        return `
            <h3>Arms & Hands</h3>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Arm Length (cm)</label>
                    <input type="number" step="0.1" id="arm_length" placeholder="e.g., 65.0">
                </div>
                <div class="input-group">
                    <label>Bicep Circumference (cm)</label>
                    <input type="number" step="0.1" id="bicep_circumference" placeholder="e.g., 32.0">
                </div>
                <div class="input-group">
                    <label>Forearm Circumference (cm)</label>
                    <input type="number" step="0.1" id="forearm_circumference" placeholder="e.g., 25.0">
                </div>
                <div class="input-group">
                    <label>Hand Length (cm)</label>
                    <input type="number" step="0.1" id="hand_length" placeholder="e.g., 18.5">
                </div>
                <div class="input-group">
                    <label>Hand Width (cm)</label>
                    <input type="number" step="0.1" id="hand_width" placeholder="e.g., 8.5">
                </div>
                <div class="input-group">
                    <label>Nail Health (1-10)</label>
                    <input type="range" min="1" max="10" id="nail_health" oninput="updateRangeValue(this)">
                    <span id="nail_health_value">8</span>
                </div>
            </div>
        `;
    }

    generateLegsContent() {
        return `
            <h3>Legs & Feet</h3>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Leg Length (cm)</label>
                    <input type="number" step="0.1" id="leg_length" placeholder="e.g., 85.0">
                </div>
                <div class="input-group">
                    <label>Thigh Circumference (cm)</label>
                    <input type="number" step="0.1" id="thigh_circumference" placeholder="e.g., 55.0">
                </div>
                <div class="input-group">
                    <label>Calf Circumference (cm)</label>
                    <input type="number" step="0.1" id="calf_circumference" placeholder="e.g., 35.0">
                </div>
                <div class="input-group">
                    <label>Foot Length (cm)</label>
                    <input type="number" step="0.1" id="foot_length" placeholder="e.g., 26.0">
                </div>
                <div class="input-group">
                    <label>Foot Width (cm)</label>
                    <input type="number" step="0.1" id="foot_width" placeholder="e.g., 10.0">
                </div>
                <div class="input-group">
                    <label>Arch Height (cm)</label>
                    <input type="number" step="0.1" id="arch_height" placeholder="e.g., 2.5">
                </div>
            </div>
        `;
    }

    generateBackContent() {
        return `
            <h3>Back Measurements & Health</h3>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Back Width (cm)</label>
                    <input type="number" step="0.1" id="back_width" placeholder="e.g., 40.0">
                </div>
                <div class="input-group">
                    <label>Back Length (cm)</label>
                    <input type="number" step="0.1" id="back_length" placeholder="e.g., 50.0">
                </div>
                <div class="input-group">
                    <label>Posture Quality (1-10)</label>
                    <input type="range" min="1" max="10" id="posture" oninput="updateRangeValue(this)">
                    <span id="posture_value">7</span>
                </div>
                <div class="input-group">
                    <label>Back Flexibility (1-10)</label>
                    <input type="range" min="1" max="10" id="flexibility" oninput="updateRangeValue(this)">
                    <span id="flexibility_value">6</span>
                </div>
                <div class="input-group">
                    <label>Pain Level (1-10)</label>
                    <input type="range" min="1" max="10" id="pain_level" oninput="updateRangeValue(this)">
                    <span id="pain_level_value">2</span>
                </div>
                <div class="input-group">
                    <label>Muscle Tension (1-10)</label>
                    <input type="range" min="1" max="10" id="muscle_tension" oninput="updateRangeValue(this)">
                    <span id="muscle_tension_value">3</span>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalFields = this.getTotalFields();
        const filledFields = this.getFilledFields();
        const completionRate = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
        const trackingDays = this.getTrackingDays();

        document.getElementById('total-measurements').textContent = filledFields;
        document.getElementById('completion-rate').textContent = `${completionRate}%`;
        document.getElementById('tracking-days').textContent = trackingDays;
        document.getElementById('last-update').textContent = this.currentData.user_info?.last_updated || 'Never';
    }

    getTotalFields() {
        let count = 0;
        Object.values(this.currentData.current_data).forEach(category => {
            Object.values(category).forEach(subcategory => {
                count += Object.keys(subcategory).length;
            });
        });
        return count;
    }

    getFilledFields() {
        let count = 0;
        Object.values(this.currentData.current_data).forEach(category => {
            Object.values(category).forEach(subcategory => {
                Object.values(subcategory).forEach(value => {
                    if (value !== null && value !== '' && value !== undefined) {
                        count++;
                    }
                });
            });
        });
        return count;
    }

    getTrackingDays() {
        if (!this.currentData.user_info?.created_date) return 0;
        const created = new Date(this.currentData.user_info.created_date);
        const now = new Date();
        return Math.floor((now - created) / (1000 * 60 * 60 * 24));
    }

    update3DVisualization() {
        // This will trigger the 3D visualization update
        if (window.bodyVisualization) {
            window.bodyVisualization.updateModel(this.currentData.current_data);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#667eea'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupEventListeners() {
        // Auto-save on input changes
        document.addEventListener('input', () => {
            // Debounced auto-save could be added here
        });
    }
}

// Global functions for HTML interactions
function showCategory(category) {
    // Hide all content
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active from all tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected content
    const content = document.getElementById(`${category}-content`);
    if (content) {
        content.classList.add('active');
    }

    // Activate selected tab
    event.target.classList.add('active');
}

function updateRangeValue(range) {
    const valueSpan = document.getElementById(`${range.id}_value`);
    if (valueSpan) {
        valueSpan.textContent = range.value;
    }
}

function saveData() {
    window.bodyTracker.saveData();
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    window.bodyTracker = new BodyTracker();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);