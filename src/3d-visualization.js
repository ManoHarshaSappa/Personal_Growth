// Enhanced 3D Male Body Structure Visualization
class BodyVisualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.bodyModel = null;
        this.bodyParts = {};
        this.skinColor = new THREE.Color('#7a4825'); // Harsha's skin tone
        this.init();
    }

    init() {
        this.setupScene();
        this.createMaleBodyStructure();
        this.setupLighting();
        this.setupControls();
        this.animate();

        // Make globally accessible
        window.bodyVisualization = this;
    }

    setupScene() {
        const container = document.querySelector('.visualization-container');

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f8f8);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 4);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 0);

        // Replace placeholder content
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    createMaleBodyStructure() {
        const bodyGroup = new THREE.Group();

        // Body material with Harsha's skin tone
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: this.skinColor,
            shininess: 10,
            transparent: true,
            opacity: 0.95
        });

        const jointMaterial = new THREE.MeshPhongMaterial({
            color: this.skinColor.clone().multiplyScalar(0.8),
            shininess: 15
        });

        // === HEAD (Simple sphere) ===
        const headGeometry = new THREE.SphereGeometry(0.14, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.75;
        head.castShadow = true;
        head.name = 'head';
        bodyGroup.add(head);

        // === NECK ===
        const neckGeometry = new THREE.CylinderGeometry(0.06, 0.07, 0.15, 12);
        const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
        neck.position.y = 1.6;
        neck.castShadow = true;
        neck.name = 'neck';
        bodyGroup.add(neck);

        // === UPPER TORSO (Chest) ===
        const chestGeometry = new THREE.BoxGeometry(0.4, 0.35, 0.22);
        const chest = new THREE.Mesh(chestGeometry, bodyMaterial);
        chest.position.y = 1.35;
        chest.castShadow = true;
        chest.name = 'chest';
        bodyGroup.add(chest);

        // === MIDDLE TORSO (Abdomen) ===
        const abdomenGeometry = new THREE.BoxGeometry(0.35, 0.25, 0.2);
        const abdomen = new THREE.Mesh(abdomenGeometry, bodyMaterial);
        abdomen.position.y = 1.05;
        abdomen.castShadow = true;
        abdomen.name = 'abdomen';
        bodyGroup.add(abdomen);

        // === LOWER TORSO (Waist/Hips) ===
        const waistGeometry = new THREE.BoxGeometry(0.38, 0.2, 0.22);
        const waist = new THREE.Mesh(waistGeometry, bodyMaterial);
        waist.position.y = 0.85;
        waist.castShadow = true;
        waist.name = 'waist';
        bodyGroup.add(waist);

        // === SHOULDERS ===
        const shoulderGeometry = new THREE.SphereGeometry(0.05, 12, 12);
        const leftShoulder = new THREE.Mesh(shoulderGeometry, jointMaterial);
        leftShoulder.position.set(-0.25, 1.5, 0);
        const rightShoulder = new THREE.Mesh(shoulderGeometry, jointMaterial);
        rightShoulder.position.set(0.25, 1.5, 0);
        bodyGroup.add(leftShoulder, rightShoulder);

        // === ARMS - Upper Arms ===
        const upperArmGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.32, 12);
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
        leftUpperArm.position.set(-0.3, 1.25, 0);
        leftUpperArm.castShadow = true;
        leftUpperArm.name = 'leftUpperArm';
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
        rightUpperArm.position.set(0.3, 1.25, 0);
        rightUpperArm.castShadow = true;
        rightUpperArm.name = 'rightUpperArm';
        bodyGroup.add(leftUpperArm, rightUpperArm);

        // === ELBOWS ===
        const elbowGeometry = new THREE.SphereGeometry(0.04, 10, 10);
        const leftElbow = new THREE.Mesh(elbowGeometry, jointMaterial);
        leftElbow.position.set(-0.3, 1.05, 0);
        const rightElbow = new THREE.Mesh(elbowGeometry, jointMaterial);
        rightElbow.position.set(0.3, 1.05, 0);
        bodyGroup.add(leftElbow, rightElbow);

        // === FOREARMS ===
        const forearmGeometry = new THREE.CylinderGeometry(0.04, 0.05, 0.28, 12);
        const leftForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
        leftForearm.position.set(-0.3, 0.85, 0);
        leftForearm.castShadow = true;
        leftForearm.name = 'leftForearm';
        const rightForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
        rightForearm.position.set(0.3, 0.85, 0);
        rightForearm.castShadow = true;
        rightForearm.name = 'rightForearm';
        bodyGroup.add(leftForearm, rightForearm);

        // === HANDS ===
        const handGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.04);
        const leftHand = new THREE.Mesh(handGeometry, bodyMaterial);
        leftHand.position.set(-0.3, 0.68, 0);
        leftHand.castShadow = true;
        leftHand.name = 'leftHand';
        const rightHand = new THREE.Mesh(handGeometry, bodyMaterial);
        rightHand.position.set(0.3, 0.68, 0);
        rightHand.castShadow = true;
        rightHand.name = 'rightHand';
        bodyGroup.add(leftHand, rightHand);

        // === HIP JOINTS ===
        const hipGeometry = new THREE.SphereGeometry(0.05, 12, 12);
        const leftHip = new THREE.Mesh(hipGeometry, jointMaterial);
        leftHip.position.set(-0.1, 0.72, 0);
        const rightHip = new THREE.Mesh(hipGeometry, jointMaterial);
        rightHip.position.set(0.1, 0.72, 0);
        bodyGroup.add(leftHip, rightHip);

        // === THIGHS ===
        const thighGeometry = new THREE.CylinderGeometry(0.07, 0.08, 0.45, 12);
        const leftThigh = new THREE.Mesh(thighGeometry, bodyMaterial);
        leftThigh.position.set(-0.1, 0.45, 0);
        leftThigh.castShadow = true;
        leftThigh.name = 'leftThigh';
        const rightThigh = new THREE.Mesh(thighGeometry, bodyMaterial);
        rightThigh.position.set(0.1, 0.45, 0);
        rightThigh.castShadow = true;
        rightThigh.name = 'rightThigh';
        bodyGroup.add(leftThigh, rightThigh);

        // === KNEES ===
        const kneeGeometry = new THREE.SphereGeometry(0.04, 10, 10);
        const leftKnee = new THREE.Mesh(kneeGeometry, jointMaterial);
        leftKnee.position.set(-0.1, 0.18, 0);
        const rightKnee = new THREE.Mesh(kneeGeometry, jointMaterial);
        rightKnee.position.set(0.1, 0.18, 0);
        bodyGroup.add(leftKnee, rightKnee);

        // === CALVES ===
        const calfGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.38, 12);
        const leftCalf = new THREE.Mesh(calfGeometry, bodyMaterial);
        leftCalf.position.set(-0.1, -0.05, 0);
        leftCalf.castShadow = true;
        leftCalf.name = 'leftCalf';
        const rightCalf = new THREE.Mesh(calfGeometry, bodyMaterial);
        rightCalf.position.set(0.1, -0.05, 0);
        rightCalf.castShadow = true;
        rightCalf.name = 'rightCalf';
        bodyGroup.add(leftCalf, rightCalf);

        // === FEET ===
        const footGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.18);
        const leftFoot = new THREE.Mesh(footGeometry, bodyMaterial);
        leftFoot.position.set(-0.1, -0.26, 0.06);
        leftFoot.castShadow = true;
        leftFoot.name = 'leftFoot';
        const rightFoot = new THREE.Mesh(footGeometry, bodyMaterial);
        rightFoot.position.set(0.1, -0.26, 0.06);
        rightFoot.castShadow = true;
        rightFoot.name = 'rightFoot';
        bodyGroup.add(leftFoot, rightFoot);

        // Store body parts for scaling
        this.bodyParts = {
            head, neck, chest, abdomen, waist,
            leftUpperArm, rightUpperArm,
            leftForearm, rightForearm,
            leftHand, rightHand,
            leftThigh, rightThigh,
            leftCalf, rightCalf,
            leftFoot, rightFoot
        };

        this.bodyModel = bodyGroup;
        this.scene.add(bodyGroup);

        // Add a simple platform
        const platformGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.03, 32);
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0xe8e8e8,
            shininess: 5
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.3;
        platform.receiveShadow = true;
        this.scene.add(platform);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light (warm lighting for Harsha's skin tone)
        const mainLight = new THREE.DirectionalLight(0xfff8e1, 1.2);
        mainLight.position.set(3, 5, 3);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.1;
        mainLight.shadow.camera.far = 20;
        mainLight.shadow.camera.left = -3;
        mainLight.shadow.camera.right = 3;
        mainLight.shadow.camera.top = 3;
        mainLight.shadow.camera.bottom = -3;
        this.scene.add(mainLight);

        // Fill light (softer, cooler)
        const fillLight = new THREE.DirectionalLight(0xb3e5fc, 0.4);
        fillLight.position.set(-2, 3, -2);
        this.scene.add(fillLight);

        // Rim light for definition
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
        rimLight.position.set(0, 2, -4);
        this.scene.add(rimLight);
    }

    setupControls() {
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let rotationSpeed = 0.005;

        const container = this.renderer.domElement;

        container.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
            container.style.cursor = 'grabbing';
        });

        container.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;

            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;

            this.bodyModel.rotation.y += deltaX * rotationSpeed;
            this.bodyModel.rotation.x += deltaY * rotationSpeed;

            // Limit vertical rotation
            this.bodyModel.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.bodyModel.rotation.x));

            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        container.addEventListener('mouseup', () => {
            isMouseDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseleave', () => {
            isMouseDown = false;
            container.style.cursor = 'grab';
        });

        // Mouse wheel for zooming
        container.addEventListener('wheel', (event) => {
            event.preventDefault();
            const zoom = event.deltaY * 0.002;
            this.camera.position.z += zoom;
            this.camera.position.z = Math.max(2, Math.min(8, this.camera.position.z));
        });

        container.style.cursor = 'grab';

        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        container.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });

        container.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            this.bodyModel.rotation.y += deltaX * rotationSpeed;
            this.bodyModel.rotation.x += deltaY * rotationSpeed;

            this.bodyModel.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.bodyModel.rotation.x));

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });
    }

    updateModel(bodyData) {
        if (!this.bodyParts || !bodyData) return;

        // Get measurements
        const body = bodyData.body?.measurements || {};
        const arms = bodyData.arms?.measurements || {};
        const legs = bodyData.legs?.measurements || {};

        // Calculate scale factors (normalized to average male proportions)
        const heightFactor = body.height ? body.height / 175 : 1; // Average 175cm
        const chestFactor = body.chest_circumference ? body.chest_circumference / 100 : 1;
        const waistFactor = body.waist_circumference ? body.waist_circumference / 85 : 1;
        const shoulderFactor = body.shoulder_width ? body.shoulder_width / 45 : 1;

        // Scale the entire model based on height
        this.bodyModel.scale.setScalar(heightFactor);

        // Scale chest area
        if (this.bodyParts.chest) {
            this.bodyParts.chest.scale.set(
                chestFactor,
                1,
                chestFactor * 0.8
            );
        }

        // Scale waist
        if (this.bodyParts.waist && this.bodyParts.abdomen) {
            this.bodyParts.waist.scale.set(waistFactor, 1, waistFactor * 0.8);
            this.bodyParts.abdomen.scale.set(
                (chestFactor + waistFactor) / 2,
                1,
                (chestFactor + waistFactor) / 2 * 0.8
            );
        }

        // Scale arms based on measurements
        if (arms.bicep_circumference) {
            const armScale = arms.bicep_circumference / 32; // Average 32cm
            if (this.bodyParts.leftUpperArm && this.bodyParts.rightUpperArm) {
                this.bodyParts.leftUpperArm.scale.set(armScale, 1, armScale);
                this.bodyParts.rightUpperArm.scale.set(armScale, 1, armScale);
            }
        }

        if (arms.forearm_circumference) {
            const forearmScale = arms.forearm_circumference / 27; // Average 27cm
            if (this.bodyParts.leftForearm && this.bodyParts.rightForearm) {
                this.bodyParts.leftForearm.scale.set(forearmScale, 1, forearmScale);
                this.bodyParts.rightForearm.scale.set(forearmScale, 1, forearmScale);
            }
        }

        // Scale legs based on measurements
        if (legs.thigh_circumference) {
            const thighScale = legs.thigh_circumference / 55; // Average 55cm
            if (this.bodyParts.leftThigh && this.bodyParts.rightThigh) {
                this.bodyParts.leftThigh.scale.set(thighScale, 1, thighScale);
                this.bodyParts.rightThigh.scale.set(thighScale, 1, thighScale);
            }
        }

        if (legs.calf_circumference) {
            const calfScale = legs.calf_circumference / 36; // Average 36cm
            if (this.bodyParts.leftCalf && this.bodyParts.rightCalf) {
                this.bodyParts.leftCalf.scale.set(calfScale, 1, calfScale);
                this.bodyParts.rightCalf.scale.set(calfScale, 1, calfScale);
            }
        }

        // Update visual feedback
        this.updateCompletionFeedback(bodyData);
    }

    updateCompletionFeedback(bodyData) {
        // Calculate data completeness
        let totalFields = 0;
        let filledFields = 0;

        Object.values(bodyData).forEach(category => {
            if (typeof category === 'object' && category !== null) {
                Object.values(category).forEach(subcategory => {
                    if (typeof subcategory === 'object' && subcategory !== null) {
                        Object.values(subcategory).forEach(value => {
                            totalFields++;
                            if (value !== null && value !== '' && value !== undefined) {
                                filledFields++;
                            }
                        });
                    }
                });
            }
        });

        const completeness = totalFields > 0 ? filledFields / totalFields : 0;

        // Update body color based on completeness
        const baseColor = this.skinColor.clone();
        if (completeness > 0.7) {
            // High completion - slightly brighter
            baseColor.multiplyScalar(1.1);
        } else if (completeness > 0.3) {
            // Medium completion - normal
            baseColor.multiplyScalar(1.0);
        } else {
            // Low completion - slightly darker
            baseColor.multiplyScalar(0.9);
        }

        // Apply color to all body parts
        Object.values(this.bodyParts).forEach(part => {
            if (part.material) {
                part.material.color = baseColor;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Subtle auto-rotation when not being controlled
        if (this.bodyModel) {
            this.bodyModel.rotation.y += 0.003;
        }

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const container = document.querySelector('.visualization-container');
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Load Three.js library and initialize visualization
function loadThreeJS() {
    // Check if Three.js is already loaded
    if (window.THREE) {
        new BodyVisualization();
        return;
    }

    // Fallback visualization if Three.js fails to load
    const container = document.querySelector('.visualization-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 30px; background: linear-gradient(145deg, #f0f0f0, #e0e0e0); border-radius: 15px;">
            <div style="font-size: 4em; margin-bottom: 20px; color: #7a4825;">🏃‍♂️</div>
            <h3 style="color: #333; margin-bottom: 20px;">3D Male Body Structure</h3>
            <div style="background: white; border-radius: 10px; padding: 25px; margin: 20px 0; border: 2px solid #7a4825;">
                <div id="body-stats" style="text-align: left;">
                    <h4 style="color: #7a4825; margin-bottom: 15px;">📊 Current Measurements:</h4>
                    <p><strong>Height:</strong> <span id="display-height" style="color: #7a4825;">Not set</span></p>
                    <p><strong>Weight:</strong> <span id="display-weight" style="color: #7a4825;">Not set</span></p>
                    <p><strong>Chest:</strong> <span id="display-chest" style="color: #7a4825;">Not set</span></p>
                    <p><strong>Waist:</strong> <span id="display-waist" style="color: #7a4825;">Not set</span></p>
                    <p><strong>Shoulders:</strong> <span id="display-shoulders" style="color: #7a4825;">Not set</span></p>
                </div>
            </div>
            <p style="color: #666; font-size: 0.9em;">
                <strong>Skin Tone:</strong> Deep warm brown (#7a4825)<br>
                <small>Enter measurements to see proportional adjustments</small>
            </p>
        </div>
    `;

    // Simple fallback visualization
    window.bodyVisualization = {
        updateModel(bodyData) {
            const body = bodyData.body?.measurements || {};

            document.getElementById('display-height').textContent =
                body.height ? `${body.height} cm` : 'Not set';
            document.getElementById('display-weight').textContent =
                body.weight ? `${body.weight} kg` : 'Not set';
            document.getElementById('display-chest').textContent =
                body.chest_circumference ? `${body.chest_circumference} cm` : 'Not set';
            document.getElementById('display-waist').textContent =
                body.waist_circumference ? `${body.waist_circumference} cm` : 'Not set';
            document.getElementById('display-shoulders').textContent =
                body.shoulder_width ? `${body.shoulder_width} cm` : 'Not set';
        }
    };
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Try to load Three.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
        setTimeout(() => new BodyVisualization(), 200);
    };
    script.onerror = () => {
        loadThreeJS(); // Fallback visualization
    };
    document.head.appendChild(script);
});