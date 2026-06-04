// Load Harsha's Personal Analysis Data
function loadHarshaData() {
    const harshaData = {
        // Face Analysis
        face_shape: "round-oval",
        forehead_type: "broad",
        cheekbones: "prominent",
        jawline_type: "rounded",
        eye_color: "dark espresso brown, almond-shaped",
        eye_shape: "almond",
        eyebrow_type: "thick",
        nose_type: "broad",
        skin_tone: "deep warm brown",
        fitzpatrick_scale: "V",
        undertone: "golden-warm",
        hex_color: "#7a4825",
        best_clothing_colors: "earthy tones (olive, rust, camel, terracotta), jewel tones (navy, forest green, burgundy, deep teal), crisp white and off-white, warm neutrals (tan, chocolate brown, warm gray)",
        avoid_colors: "washed-out pastels, neon, cool grays, icy blue",
        face_shape_tips: "To create illusion of length, add height on top and keep sides tight. Beard filling the chin area helps elongate the face.",

        // Hair Analysis
        length_top: "3.5",
        hair_thickness: "8",
        hair_density: "9",
        hair_volume: "9",
        hair_color: "dark brown-black (near-black base, slight olive-brown in light)",
        hair_color_hex: "#1a0f0a",
        texture_type: "2B",
        current_hair_style: "natural grown-out top, unstructured",
        hair_condition: "8",
        hair_dandruff: "1",
        hair_damage: "2",
        thinning_areas: "none",
        recommended_cuts: "1) Textured curly crop - keep natural curl on top, tight fade on sides\n2) Modern quiff/wavy quiff - push volume forward and up\n3) Mid-fade with volume on top\n4) Edgar cut (curly) - blunt fringe version",
        hair_product_recommendations: "Light curl cream or sea salt spray to define 2B/2C waves without weighing them down. Avoid heavy gels that flatten natural texture.",
        hair_styling_tips: "Style with product to define curls before recording/photos. HeyGen captures texture well when defined, not fluffy.",

        // Beard Analysis
        beard_style: "medium stubble / short beard",
        growth_stage: "~2-3 weeks",
        beard_color: "dark brown, uniform",
        beard_density: "8",
        chin_coverage: "9",
        cheek_coverage: "7",
        mustache_coverage: "8",
        neck_coverage: "8",
        neckline_defined: "no",
        cheek_line_defined: "no",
        trimming_frequency: "irregular",
        beard_products_used: "none",
        beard_style_suggestions: "1) Maintain current stage with clean edges for polished medium stubble\n2) Grow to full short beard (4-5 weeks) for more jaw definition\n3) Corporate stubble (3-5mm all over) for professional content",
        beard_grooming_tips: "1) Define neckline 1-2 fingers above adam's apple\n2) Sharpen cheek line - gentle diagonal from sideburn to mustache corner\n3) Keep chin full for face shape\n4) Clean up before recording sessions"
    };

    // Populate all form fields
    Object.keys(harshaData).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            if (element.type === 'range') {
                element.value = harshaData[fieldId];
                // Update range value display
                const valueSpan = document.getElementById(`${fieldId}_value`);
                if (valueSpan) {
                    valueSpan.textContent = harshaData[fieldId];
                }
            } else {
                element.value = harshaData[fieldId];
            }
        }
    });

    // Show success message
    showLoadMessage("✅ Harsha's complete face analysis data loaded successfully!");

    // Update the 3D visualization
    if (window.bodyTracker) {
        window.bodyTracker.collectFormData();
        window.bodyTracker.update3DVisualization();
        window.bodyTracker.updateStats();
    }
}

function showLoadMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add load button to the interface when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Add load button after interface is ready
        const saveButton = document.querySelector('.save-button');
        if (saveButton) {
            const loadButton = document.createElement('button');
            loadButton.className = 'save-button';
            loadButton.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            loadButton.innerHTML = '📊 Load Harsha\'s Analysis Data';
            loadButton.onclick = loadHarshaData;

            saveButton.parentNode.insertBefore(loadButton, saveButton);
        }
    }, 500);
});