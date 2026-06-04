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
            beard: this.generateBeardContent(),
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
            <h3>💇‍♂️ Complete Hair Analysis</h3>

            <h4 style="margin: 20px 0 15px;">Hair Measurements</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Length on Top (cm)</label>
                    <input type="number" step="0.1" id="length_top" value="3.5" placeholder="e.g., 3.5">
                </div>
                <div class="input-group">
                    <label>Hair Thickness (1-10)</label>
                    <input type="range" min="1" max="10" id="hair_thickness" value="8" oninput="updateRangeValue(this)">
                    <span id="hair_thickness_value">8</span>
                </div>
                <div class="input-group">
                    <label>Hair Density (1-10)</label>
                    <input type="range" min="1" max="10" id="hair_density" value="9" oninput="updateRangeValue(this)">
                    <span id="hair_density_value">9</span>
                </div>
                <div class="input-group">
                    <label>Volume (1-10)</label>
                    <input type="range" min="1" max="10" id="hair_volume" value="9" oninput="updateRangeValue(this)">
                    <span id="hair_volume_value">9</span>
                </div>
            </div>

            <h4 style="margin: 20px 0 15px;">Hair Analysis</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Hair Color</label>
                    <input type="text" id="hair_color" value="dark brown-black (near-black base, slight olive-brown in light)" placeholder="Detailed color description">
                </div>
                <div class="input-group">
                    <label>Color Hex Code</label>
                    <input type="text" id="hair_color_hex" value="#1a0f0a" placeholder="e.g., #1a0f0a">
                </div>
                <div class="input-group">
                    <label>Texture Type</label>
                    <select id="texture_type">
                        <option value="">Select type</option>
                        <option value="1A">1A - Straight, fine</option>
                        <option value="1B">1B - Straight, medium</option>
                        <option value="1C">1C - Straight, coarse</option>
                        <option value="2A">2A - Wavy, fine</option>
                        <option value="2B" selected>2B - Wavy, medium</option>
                        <option value="2C">2C - Wavy, coarse</option>
                        <option value="3A">3A - Curly, fine</option>
                        <option value="3B">3B - Curly, medium</option>
                        <option value="3C">3C - Curly, coarse</option>
                        <option value="4A">4A - Kinky, fine</option>
                        <option value="4B">4B - Kinky, medium</option>
                        <option value="4C">4C - Kinky, coarse</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Current Style</label>
                    <input type="text" id="current_hair_style" value="natural grown-out top, unstructured" placeholder="Current haircut description">
                </div>
            </div>

            <h4 style="margin: 20px 0 15px;">Hair Health</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Condition (1-10)</label>
                    <input type="range" min="1" max="10" id="hair_condition" value="8" oninput="updateRangeValue(this)">
                    <span id="hair_condition_value">8</span>
                </div>
                <div class="input-group">
                    <label>Dandruff Level (1-10)</label>
                    <input type="range" min="1" max="10" id="hair_dandruff" value="1" oninput="updateRangeValue(this)">
                    <span id="hair_dandruff_value">1</span>
                </div>
                <div class="input-group">
                    <label>Damage Level (1-10)</label>
                    <input type="range" min="1" max="10" id="hair_damage" value="2" oninput="updateRangeValue(this)">
                    <span id="hair_damage_value">2</span>
                </div>
                <div class="input-group">
                    <label>Thinning Areas</label>
                    <input type="text" id="thinning_areas" value="none" placeholder="e.g., crown, temples, none">
                </div>
            </div>

            <h4 style="margin: 20px 0 15px;">Professional Recommendations</h4>
            <div class="input-group">
                <label>Recommended Cuts</label>
                <textarea id="recommended_cuts" rows="3" placeholder="Best haircut styles for face shape and texture">1) Textured curly crop - keep natural curl on top, tight fade on sides
2) Modern quiff/wavy quiff - push volume forward and up
3) Mid-fade with volume on top
4) Edgar cut (curly) - blunt fringe version</textarea>
            </div>
            <div class="input-group">
                <label>Product Recommendations</label>
                <textarea id="hair_product_recommendations" rows="2" placeholder="Best products for hair type">Light curl cream or sea salt spray to define 2B/2C waves without weighing them down. Avoid heavy gels that flatten natural texture.</textarea>
            </div>
            <div class="input-group">
                <label>Styling Tips</label>
                <textarea id="hair_styling_tips" rows="2" placeholder="How to style for best results">Style with product to define curls before recording/photos. HeyGen captures texture well when defined, not fluffy.</textarea>
            </div>
        `;
    }

    generateBeardContent() {
        return `
            <h3>🧔 Beard Analysis & Care</h3>

            <h4 style="margin: 20px 0 15px;">Current Beard Style</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Beard Style</label>
                    <input type="text" id="beard_style" value="medium stubble / short beard" placeholder="e.g., Medium stubble, full beard, goatee">
                </div>
                <div class="input-group">
                    <label>Growth Stage</label>
                    <input type="text" id="growth_stage" value="~2-3 weeks" placeholder="e.g., 2-3 weeks, 1 month">
                </div>
                <div class="input-group">
                    <label>Beard Color</label>
                    <input type="text" id="beard_color" value="dark brown, uniform" placeholder="e.g., Dark brown, black, mixed colors">
                </div>
                <div class="input-group">
                    <label>Beard Density (1-10)</label>
                    <input type="range" min="1" max="10" id="beard_density" value="8" oninput="updateRangeValue(this)">
                    <span id="beard_density_value">8</span>
                </div>
            </div>

            <h4 style="margin: 20px 0 15px;">Coverage Areas</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Chin Coverage (1-10)</label>
                    <input type="range" min="1" max="10" id="chin_coverage" value="9" oninput="updateRangeValue(this)">
                    <span id="chin_coverage_value">9</span>
                </div>
                <div class="input-group">
                    <label>Cheek Coverage (1-10)</label>
                    <input type="range" min="1" max="10" id="cheek_coverage" value="7" oninput="updateRangeValue(this)">
                    <span id="cheek_coverage_value">7</span>
                </div>
                <div class="input-group">
                    <label>Mustache Coverage (1-10)</label>
                    <input type="range" min="1" max="10" id="mustache_coverage" value="8" oninput="updateRangeValue(this)">
                    <span id="mustache_coverage_value">8</span>
                </div>
                <div class="input-group">
                    <label>Neck Coverage (1-10)</label>
                    <input type="range" min="1" max="10" id="neck_coverage" value="8" oninput="updateRangeValue(this)">
                    <span id="neck_coverage_value">8</span>
                </div>
            </div>

            <h4 style="margin: 20px 0 15px;">Maintenance Status</h4>
            <div class="measurement-grid">
                <div class="input-group">
                    <label>Neckline Defined</label>
                    <select id="neckline_defined">
                        <option value="">Select status</option>
                        <option value="yes">Yes, clean</option>
                        <option value="no" selected>No, needs work</option>
                        <option value="needs_work">Partially defined</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Cheek Line Defined</label>
                    <select id="cheek_line_defined">
                        <option value="">Select status</option>
                        <option value="yes">Yes, clean</option>
                        <option value="no" selected>No, needs work</option>
                        <option value="needs_work">Partially defined</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Trimming Frequency</label>
                    <input type="text" id="trimming_frequency" value="irregular" placeholder="e.g., Weekly, bi-weekly, monthly">
                </div>
                <div class="input-group">
                    <label>Current Products</label>
                    <input type="text" id="beard_products_used" value="none" placeholder="e.g., Beard oil, trimmer, none">
                </div>
            </div>

            <h4 style="margin: 20px 0 15px;">Professional Recommendations</h4>
            <div class="input-group">
                <label>Style Suggestions</label>
                <textarea id="beard_style_suggestions" rows="3" placeholder="Recommended beard styles for your face shape">1) Maintain current stage with clean edges for polished medium stubble
2) Grow to full short beard (4-5 weeks) for more jaw definition
3) Corporate stubble (3-5mm all over) for professional content</textarea>
            </div>
            <div class="input-group">
                <label>Grooming Tips</label>
                <textarea id="beard_grooming_tips" rows="3" placeholder="Professional grooming recommendations">1) Define neckline 1-2 fingers above adam's apple
2) Sharpen cheek line - gentle diagonal from sideburn to mustache corner
3) Keep chin full for face shape
4) Clean up before recording sessions</textarea>
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