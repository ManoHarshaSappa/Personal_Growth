// 2D Body Visualization Component
class Body2DVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bodyData = {};
        this.svg = null;
        this.bodyParts = {};
        this.init();
    }

    init() {
        this.createSVGBody();
        this.setupInteractivity();
    }

    createSVGBody() {
        // Clear container
        this.container.innerHTML = '';

        // Create SVG container
        const svgNS = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(svgNS, "svg");
        this.svg.setAttribute("width", "400");
        this.svg.setAttribute("height", "600");
        this.svg.setAttribute("viewBox", "0 0 400 600");
        this.svg.style.background = "#f8f9fa";
        this.svg.style.borderRadius = "10px";
        this.svg.style.border = "2px solid #e2e8f0";

        // Create body outline with measurements zones
        this.createBodyOutline();
        this.createMeasurementZones();
        this.createColorCoding();

        this.container.appendChild(this.svg);
    }

    createBodyOutline() {
        const svgNS = "http://www.w3.org/2000/svg";

        // Head/Face
        this.bodyParts.head = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.head.setAttribute("cx", "200");
        this.bodyParts.head.setAttribute("cy", "80");
        this.bodyParts.head.setAttribute("rx", "40");
        this.bodyParts.head.setAttribute("ry", "50");
        this.bodyParts.head.setAttribute("fill", "#f4d1c4");
        this.bodyParts.head.setAttribute("stroke", "#333");
        this.bodyParts.head.setAttribute("stroke-width", "2");
        this.bodyParts.head.setAttribute("data-part", "face");
        this.svg.appendChild(this.bodyParts.head);

        // Hair
        this.bodyParts.hair = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.hair.setAttribute("cx", "200");
        this.bodyParts.hair.setAttribute("cy", "50");
        this.bodyParts.hair.setAttribute("rx", "45");
        this.bodyParts.hair.setAttribute("ry", "35");
        this.bodyParts.hair.setAttribute("fill", "#1a0f0a");
        this.bodyParts.hair.setAttribute("data-part", "hair");
        this.svg.appendChild(this.bodyParts.hair);

        // Eyes
        this.bodyParts.eyeLeft = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.eyeLeft.setAttribute("cx", "185");
        this.bodyParts.eyeLeft.setAttribute("cy", "75");
        this.bodyParts.eyeLeft.setAttribute("rx", "8");
        this.bodyParts.eyeLeft.setAttribute("ry", "5");
        this.bodyParts.eyeLeft.setAttribute("fill", "#2d1a10");
        this.bodyParts.eyeLeft.setAttribute("data-part", "eyes");
        this.svg.appendChild(this.bodyParts.eyeLeft);

        this.bodyParts.eyeRight = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.eyeRight.setAttribute("cx", "215");
        this.bodyParts.eyeRight.setAttribute("cy", "75");
        this.bodyParts.eyeRight.setAttribute("rx", "8");
        this.bodyParts.eyeRight.setAttribute("ry", "5");
        this.bodyParts.eyeRight.setAttribute("fill", "#2d1a10");
        this.bodyParts.eyeRight.setAttribute("data-part", "eyes");
        this.svg.appendChild(this.bodyParts.eyeRight);

        // Beard area
        this.bodyParts.beard = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.beard.setAttribute("cx", "200");
        this.bodyParts.beard.setAttribute("cy", "105");
        this.bodyParts.beard.setAttribute("rx", "25");
        this.bodyParts.beard.setAttribute("ry", "15");
        this.bodyParts.beard.setAttribute("fill", "#3a2318");
        this.bodyParts.beard.setAttribute("opacity", "0.8");
        this.bodyParts.beard.setAttribute("data-part", "beard");
        this.svg.appendChild(this.bodyParts.beard);

        // Neck
        this.bodyParts.neck = document.createElementNS(svgNS, "rect");
        this.bodyParts.neck.setAttribute("x", "180");
        this.bodyParts.neck.setAttribute("y", "125");
        this.bodyParts.neck.setAttribute("width", "40");
        this.bodyParts.neck.setAttribute("height", "25");
        this.bodyParts.neck.setAttribute("fill", "#f4d1c4");
        this.bodyParts.neck.setAttribute("stroke", "#333");
        this.bodyParts.neck.setAttribute("stroke-width", "1");
        this.svg.appendChild(this.bodyParts.neck);

        // Torso/Body
        this.bodyParts.torso = document.createElementNS(svgNS, "rect");
        this.bodyParts.torso.setAttribute("x", "120");
        this.bodyParts.torso.setAttribute("y", "150");
        this.bodyParts.torso.setAttribute("width", "160");
        this.bodyParts.torso.setAttribute("height", "200");
        this.bodyParts.torso.setAttribute("rx", "20");
        this.bodyParts.torso.setAttribute("fill", "#e8e8e8");
        this.bodyParts.torso.setAttribute("stroke", "#333");
        this.bodyParts.torso.setAttribute("stroke-width", "2");
        this.bodyParts.torso.setAttribute("data-part", "body");
        this.svg.appendChild(this.bodyParts.torso);

        // Arms
        this.bodyParts.armLeft = document.createElementNS(svgNS, "rect");
        this.bodyParts.armLeft.setAttribute("x", "60");
        this.bodyParts.armLeft.setAttribute("y", "160");
        this.bodyParts.armLeft.setAttribute("width", "60");
        this.bodyParts.armLeft.setAttribute("height", "150");
        this.bodyParts.armLeft.setAttribute("rx", "25");
        this.bodyParts.armLeft.setAttribute("fill", "#e8e8e8");
        this.bodyParts.armLeft.setAttribute("stroke", "#333");
        this.bodyParts.armLeft.setAttribute("stroke-width", "2");
        this.bodyParts.armLeft.setAttribute("data-part", "arms");
        this.svg.appendChild(this.bodyParts.armLeft);

        this.bodyParts.armRight = document.createElementNS(svgNS, "rect");
        this.bodyParts.armRight.setAttribute("x", "280");
        this.bodyParts.armRight.setAttribute("y", "160");
        this.bodyParts.armRight.setAttribute("width", "60");
        this.bodyParts.armRight.setAttribute("height", "150");
        this.bodyParts.armRight.setAttribute("rx", "25");
        this.bodyParts.armRight.setAttribute("fill", "#e8e8e8");
        this.bodyParts.armRight.setAttribute("stroke", "#333");
        this.bodyParts.armRight.setAttribute("stroke-width", "2");
        this.bodyParts.armRight.setAttribute("data-part", "arms");
        this.svg.appendChild(this.bodyParts.armRight);

        // Hands
        this.bodyParts.handLeft = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.handLeft.setAttribute("cx", "90");
        this.bodyParts.handLeft.setAttribute("cy", "325");
        this.bodyParts.handLeft.setAttribute("rx", "20");
        this.bodyParts.handLeft.setAttribute("ry", "25");
        this.bodyParts.handLeft.setAttribute("fill", "#f4d1c4");
        this.bodyParts.handLeft.setAttribute("stroke", "#333");
        this.bodyParts.handLeft.setAttribute("stroke-width", "1");
        this.bodyParts.handLeft.setAttribute("data-part", "arms");
        this.svg.appendChild(this.bodyParts.handLeft);

        this.bodyParts.handRight = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.handRight.setAttribute("cx", "310");
        this.bodyParts.handRight.setAttribute("cy", "325");
        this.bodyParts.handRight.setAttribute("rx", "20");
        this.bodyParts.handRight.setAttribute("ry", "25");
        this.bodyParts.handRight.setAttribute("fill", "#f4d1c4");
        this.bodyParts.handRight.setAttribute("stroke", "#333");
        this.bodyParts.handRight.setAttribute("stroke-width", "1");
        this.bodyParts.handRight.setAttribute("data-part", "arms");
        this.svg.appendChild(this.bodyParts.handRight);

        // Legs
        this.bodyParts.legLeft = document.createElementNS(svgNS, "rect");
        this.bodyParts.legLeft.setAttribute("x", "140");
        this.bodyParts.legLeft.setAttribute("y", "350");
        this.bodyParts.legLeft.setAttribute("width", "50");
        this.bodyParts.legLeft.setAttribute("height", "180");
        this.bodyParts.legLeft.setAttribute("rx", "20");
        this.bodyParts.legLeft.setAttribute("fill", "#e8e8e8");
        this.bodyParts.legLeft.setAttribute("stroke", "#333");
        this.bodyParts.legLeft.setAttribute("stroke-width", "2");
        this.bodyParts.legLeft.setAttribute("data-part", "legs");
        this.svg.appendChild(this.bodyParts.legLeft);

        this.bodyParts.legRight = document.createElementNS(svgNS, "rect");
        this.bodyParts.legRight.setAttribute("x", "210");
        this.bodyParts.legRight.setAttribute("y", "350");
        this.bodyParts.legRight.setAttribute("width", "50");
        this.bodyParts.legRight.setAttribute("height", "180");
        this.bodyParts.legRight.setAttribute("rx", "20");
        this.bodyParts.legRight.setAttribute("fill", "#e8e8e8");
        this.bodyParts.legRight.setAttribute("stroke", "#333");
        this.bodyParts.legRight.setAttribute("stroke-width", "2");
        this.bodyParts.legRight.setAttribute("data-part", "legs");
        this.svg.appendChild(this.bodyParts.legRight);

        // Feet
        this.bodyParts.footLeft = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.footLeft.setAttribute("cx", "165");
        this.bodyParts.footLeft.setAttribute("cy", "550");
        this.bodyParts.footLeft.setAttribute("rx", "30");
        this.bodyParts.footLeft.setAttribute("ry", "15");
        this.bodyParts.footLeft.setAttribute("fill", "#f4d1c4");
        this.bodyParts.footLeft.setAttribute("stroke", "#333");
        this.bodyParts.footLeft.setAttribute("stroke-width", "1");
        this.bodyParts.footLeft.setAttribute("data-part", "legs");
        this.svg.appendChild(this.bodyParts.footLeft);

        this.bodyParts.footRight = document.createElementNS(svgNS, "ellipse");
        this.bodyParts.footRight.setAttribute("cx", "235");
        this.bodyParts.footRight.setAttribute("cy", "550");
        this.bodyParts.footRight.setAttribute("rx", "30");
        this.bodyParts.footRight.setAttribute("ry", "15");
        this.bodyParts.footRight.setAttribute("fill", "#f4d1c4");
        this.bodyParts.footRight.setAttribute("stroke", "#333");
        this.bodyParts.footRight.setAttribute("stroke-width", "1");
        this.bodyParts.footRight.setAttribute("data-part", "legs");
        this.svg.appendChild(this.bodyParts.footRight);
    }

    createMeasurementZones() {
        const svgNS = "http://www.w3.org/2000/svg";

        // Create measurement indicators (small circles that show data is available)
        const measurements = [
            { x: 160, y: 80, part: "face" },    // Face measurements
            { x: 170, y: 50, part: "hair" },    // Hair measurements
            { x: 200, y: 105, part: "beard" },  // Beard measurements
            { x: 200, y: 250, part: "body" },   // Body measurements
            { x: 90, y: 235, part: "arms" },    // Left arm measurements
            { x: 310, y: 235, part: "arms" },   // Right arm measurements
            { x: 165, y: 440, part: "legs" },   // Left leg measurements
            { x: 235, y: 440, part: "legs" },   // Right leg measurements
        ];

        this.measurementIndicators = {};
        measurements.forEach((measurement, index) => {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", measurement.x);
            circle.setAttribute("cy", measurement.y);
            circle.setAttribute("r", "6");
            circle.setAttribute("fill", "#ff6b6b");
            circle.setAttribute("opacity", "0.8");
            circle.setAttribute("data-part", measurement.part);
            circle.style.cursor = "pointer";
            this.measurementIndicators[`${measurement.part}_${index}`] = circle;
            this.svg.appendChild(circle);
        });
    }

    createColorCoding() {
        // Create legend for color coding
        const svgNS = "http://www.w3.org/2000/svg";

        // Legend background
        const legendBg = document.createElementNS(svgNS, "rect");
        legendBg.setAttribute("x", "10");
        legendBg.setAttribute("y", "10");
        legendBg.setAttribute("width", "180");
        legendBg.setAttribute("height", "100");
        legendBg.setAttribute("fill", "white");
        legendBg.setAttribute("stroke", "#333");
        legendBg.setAttribute("rx", "5");
        legendBg.setAttribute("opacity", "0.9");
        this.svg.appendChild(legendBg);

        // Legend items
        const legendItems = [
            { color: "#4ade80", text: "Complete Data", y: 30 },
            { color: "#fbbf24", text: "Partial Data", y: 50 },
            { color: "#ff6b6b", text: "No Data", y: 70 },
            { color: "#f4d1c4", text: "Skin Areas", y: 90 }
        ];

        legendItems.forEach(item => {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", "25");
            circle.setAttribute("cy", item.y);
            circle.setAttribute("r", "6");
            circle.setAttribute("fill", item.color);
            this.svg.appendChild(circle);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", "40");
            text.setAttribute("y", item.y + 4);
            text.setAttribute("font-family", "Arial, sans-serif");
            text.setAttribute("font-size", "12");
            text.setAttribute("fill", "#333");
            text.textContent = item.text;
            this.svg.appendChild(text);
        });
    }

    setupInteractivity() {
        // Add hover effects and click handlers
        Object.keys(this.bodyParts).forEach(partKey => {
            const part = this.bodyParts[partKey];

            part.addEventListener('mouseenter', (e) => {
                const partName = e.target.getAttribute('data-part');
                this.highlightBodyPart(partName);
                this.showTooltip(e, partName);
            });

            part.addEventListener('mouseleave', (e) => {
                this.removeHighlight();
                this.hideTooltip();
            });

            part.addEventListener('click', (e) => {
                const partName = e.target.getAttribute('data-part');
                this.selectBodyPart(partName);
            });
        });
    }

    highlightBodyPart(partName) {
        // Remove previous highlights
        this.removeHighlight();

        // Highlight all parts of the same category
        Object.keys(this.bodyParts).forEach(partKey => {
            const part = this.bodyParts[partKey];
            if (part.getAttribute('data-part') === partName) {
                const currentStroke = part.getAttribute('stroke-width') || '1';
                part.setAttribute('stroke-width', '4');
                part.setAttribute('stroke', '#667eea');
            }
        });
    }

    removeHighlight() {
        Object.keys(this.bodyParts).forEach(partKey => {
            const part = this.bodyParts[partKey];
            part.setAttribute('stroke-width', part.dataset.originalStrokeWidth || '2');
            part.setAttribute('stroke', part.dataset.originalStroke || '#333');
        });
    }

    showTooltip(event, partName) {
        this.hideTooltip(); // Remove any existing tooltip

        const tooltip = document.createElement('div');
        tooltip.id = 'body-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            left: ${event.pageX + 10}px;
            top: ${event.pageY - 10}px;
        `;

        const partData = this.getPartDataSummary(partName);
        tooltip.textContent = `${partName.toUpperCase()}: ${partData}`;
        document.body.appendChild(tooltip);
    }

    hideTooltip() {
        const tooltip = document.getElementById('body-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    selectBodyPart(partName) {
        // Switch to the appropriate tab in the form
        const button = document.querySelector(`[onclick="showCategory('${partName}')"]`);
        if (button) {
            button.click();
        }
    }

    getPartDataSummary(partName) {
        if (!this.bodyData || !this.bodyData[partName]) {
            return "No data available";
        }

        const partData = this.bodyData[partName];
        let filledFields = 0;
        let totalFields = 0;

        // Count filled vs empty fields
        Object.values(partData).forEach(subcategory => {
            if (typeof subcategory === 'object' && subcategory !== null) {
                Object.values(subcategory).forEach(value => {
                    totalFields++;
                    if (value !== null && value !== '' && value !== undefined) {
                        filledFields++;
                    }
                });
            }
        });

        if (totalFields === 0) return "No fields defined";
        const percentage = Math.round((filledFields / totalFields) * 100);
        return `${percentage}% complete (${filledFields}/${totalFields})`;
    }

    updateModel(bodyData) {
        this.bodyData = bodyData;
        this.updateBodyColors();
        this.updateMeasurementIndicators();
        this.updateBodyProportions(bodyData);
    }

    updateBodyColors() {
        // Update body parts based on data completion
        Object.keys(this.bodyData).forEach(partName => {
            const completion = this.getDataCompletion(partName);
            const color = this.getCompletionColor(completion);

            // Update all body parts with this category
            Object.keys(this.bodyParts).forEach(partKey => {
                const part = this.bodyParts[partKey];
                if (part.getAttribute('data-part') === partName) {
                    part.setAttribute('fill', color);
                }
            });
        });

        // Apply specific colors from user data
        if (this.bodyData.face && this.bodyData.face.skin_analysis) {
            const skinColor = this.bodyData.face.skin_analysis.hex_color || '#f4d1c4';
            this.bodyParts.head.setAttribute('fill', skinColor);
            this.bodyParts.handLeft.setAttribute('fill', skinColor);
            this.bodyParts.handRight.setAttribute('fill', skinColor);
            this.bodyParts.footLeft.setAttribute('fill', skinColor);
            this.bodyParts.footRight.setAttribute('fill', skinColor);
            this.bodyParts.neck.setAttribute('fill', skinColor);
        }

        if (this.bodyData.hair && this.bodyData.hair.analysis) {
            const hairColor = this.bodyData.hair.analysis.color_hex || '#1a0f0a';
            this.bodyParts.hair.setAttribute('fill', hairColor);
        }

        if (this.bodyData.beard && this.bodyData.beard.analysis) {
            const beardColor = this.bodyData.beard.analysis.color || '#3a2318';
            this.bodyParts.beard.setAttribute('fill', beardColor);
        }
    }

    updateMeasurementIndicators() {
        Object.keys(this.measurementIndicators).forEach(key => {
            const indicator = this.measurementIndicators[key];
            const partName = indicator.getAttribute('data-part');
            const completion = this.getDataCompletion(partName);
            const color = this.getCompletionColor(completion);
            indicator.setAttribute('fill', color);
        });
    }

    updateBodyProportions(bodyData) {
        // Basic body proportions based on measurements
        if (bodyData.body && bodyData.body.measurements) {
            const measurements = bodyData.body.measurements;

            // Adjust torso width based on chest/waist measurements
            if (measurements.chest_circumference) {
                const chestWidth = Math.max(120, measurements.chest_circumference * 1.5);
                this.bodyParts.torso.setAttribute('width', chestWidth);
                this.bodyParts.torso.setAttribute('x', 200 - chestWidth/2);
            }

            // Adjust height proportions if height is provided
            if (measurements.height) {
                const scale = measurements.height / 175; // Normalize to 175cm
                const newTorsoHeight = 200 * scale;
                this.bodyParts.torso.setAttribute('height', newTorsoHeight);
            }
        }
    }

    getDataCompletion(partName) {
        if (!this.bodyData || !this.bodyData[partName]) return 0;

        const partData = this.bodyData[partName];
        let filledFields = 0;
        let totalFields = 0;

        Object.values(partData).forEach(subcategory => {
            if (typeof subcategory === 'object' && subcategory !== null) {
                Object.values(subcategory).forEach(value => {
                    totalFields++;
                    if (value !== null && value !== '' && value !== undefined) {
                        filledFields++;
                    }
                });
            }
        });

        return totalFields > 0 ? (filledFields / totalFields) : 0;
    }

    getCompletionColor(completion) {
        if (completion >= 0.8) return '#4ade80';      // Green - complete
        if (completion >= 0.4) return '#fbbf24';      // Yellow - partial
        return '#ff6b6b';                             // Red - incomplete
    }

    // Method to export body diagram as image
    exportAsImage() {
        const svgData = new XMLSerializer().serializeToString(this.svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = 400;
        canvas.height = 600;

        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            // Create download link
            const downloadLink = document.createElement("a");
            downloadLink.download = "body-diagram.png";
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
}

// Make it available globally
window.Body2DVisualization = Body2DVisualization;