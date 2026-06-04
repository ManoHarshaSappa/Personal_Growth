// 3D Mannequin Visualization using Three.js
class BodyVisualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mannequin = null;
        this.controls = null;
        this.init();
    }

    init() {
        this.setupScene();
        this.createMannequin();
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
        this.scene.background = new THREE.Color(0xf5f5f5);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1, 3);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Replace placeholder content
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    createMannequin() {
        const mannequinGroup = new THREE.Group();

        // Materials
        const bodyMaterial = new THREE.MeshLambertMaterial({
            color: 0xf8f8f8,
            transparent: true,
            opacity: 0.95
        });

        const jointMaterial = new THREE.MeshLambertMaterial({
            color: 0xe0e0e0
        });

        // Head
        const headGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.7;
        head.castShadow = true;
        mannequinGroup.add(head);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.15, 8);
        const neck = new THREE.Mesh(neckGeometry, bodyMaterial);
        neck.position.y = 1.55;
        neck.castShadow = true;
        mannequinGroup.add(neck);

        // Torso
        const torsoGeometry = new THREE.BoxGeometry(0.35, 0.6, 0.2);
        const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        torso.position.y = 1.2;
        torso.castShadow = true;
        mannequinGroup.add(torso);

        // Shoulder joints
        const shoulderGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const leftShoulder = new THREE.Mesh(shoulderGeometry, jointMaterial);
        leftShoulder.position.set(-0.2, 1.45, 0);
        const rightShoulder = new THREE.Mesh(shoulderGeometry, jointMaterial);
        rightShoulder.position.set(0.2, 1.45, 0);
        mannequinGroup.add(leftShoulder, rightShoulder);

        // Arms - Upper
        const upperArmGeometry = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 8);
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
        leftUpperArm.position.set(-0.25, 1.25, 0);
        leftUpperArm.castShadow = true;
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
        rightUpperArm.position.set(0.25, 1.25, 0);
        rightUpperArm.castShadow = true;
        mannequinGroup.add(leftUpperArm, rightUpperArm);

        // Elbow joints
        const elbowGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const leftElbow = new THREE.Mesh(elbowGeometry, jointMaterial);
        leftElbow.position.set(-0.25, 1.05, 0);
        const rightElbow = new THREE.Mesh(elbowGeometry, jointMaterial);
        rightElbow.position.set(0.25, 1.05, 0);
        mannequinGroup.add(leftElbow, rightElbow);

        // Arms - Forearm
        const forearmGeometry = new THREE.CylinderGeometry(0.035, 0.04, 0.25, 8);
        const leftForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
        leftForearm.position.set(-0.25, 0.85, 0);
        leftForearm.castShadow = true;
        const rightForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
        rightForearm.position.set(0.25, 0.85, 0);
        rightForearm.castShadow = true;
        mannequinGroup.add(leftForearm, rightForearm);

        // Hands
        const handGeometry = new THREE.BoxGeometry(0.06, 0.12, 0.03);
        const leftHand = new THREE.Mesh(handGeometry, bodyMaterial);
        leftHand.position.set(-0.25, 0.7, 0);
        leftHand.castShadow = true;
        const rightHand = new THREE.Mesh(handGeometry, bodyMaterial);
        rightHand.position.set(0.25, 0.7, 0);
        rightHand.castShadow = true;
        mannequinGroup.add(leftHand, rightHand);

        // Waist
        const waistGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.1, 8);
        const waist = new THREE.Mesh(waistGeometry, bodyMaterial);
        waist.position.y = 0.85;
        waist.castShadow = true;
        mannequinGroup.add(waist);

        // Hip joints
        const hipGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const leftHip = new THREE.Mesh(hipGeometry, jointMaterial);
        leftHip.position.set(-0.08, 0.75, 0);
        const rightHip = new THREE.Mesh(hipGeometry, jointMaterial);
        rightHip.position.set(0.08, 0.75, 0);
        mannequinGroup.add(leftHip, rightHip);

        // Thighs
        const thighGeometry = new THREE.CylinderGeometry(0.06, 0.07, 0.4, 8);
        const leftThigh = new THREE.Mesh(thighGeometry, bodyMaterial);
        leftThigh.position.set(-0.08, 0.5, 0);
        leftThigh.castShadow = true;
        const rightThigh = new THREE.Mesh(thighGeometry, bodyMaterial);
        rightThigh.position.set(0.08, 0.5, 0);
        rightThigh.castShadow = true;
        mannequinGroup.add(leftThigh, rightThigh);

        // Knee joints
        const kneeGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const leftKnee = new THREE.Mesh(kneeGeometry, jointMaterial);
        leftKnee.position.set(-0.08, 0.25, 0);
        const rightKnee = new THREE.Mesh(kneeGeometry, jointMaterial);
        rightKnee.position.set(0.08, 0.25, 0);
        mannequinGroup.add(leftKnee, rightKnee);

        // Calves
        const calfGeometry = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 8);
        const leftCalf = new THREE.Mesh(calfGeometry, bodyMaterial);
        leftCalf.position.set(-0.08, 0.05, 0);
        leftCalf.castShadow = true;
        const rightCalf = new THREE.Mesh(calfGeometry, bodyMaterial);
        rightCalf.position.set(0.08, 0.05, 0);
        rightCalf.castShadow = true;
        mannequinGroup.add(leftCalf, rightCalf);

        // Feet
        const footGeometry = new THREE.BoxGeometry(0.08, 0.04, 0.15);
        const leftFoot = new THREE.Mesh(footGeometry, bodyMaterial);
        leftFoot.position.set(-0.08, -0.15, 0.05);
        leftFoot.castShadow = true;
        const rightFoot = new THREE.Mesh(footGeometry, bodyMaterial);
        rightFoot.position.set(0.08, -0.15, 0.05);
        rightFoot.castShadow = true;
        mannequinGroup.add(leftFoot, rightFoot);

        // Store references for updates
        this.mannequinParts = {
            head, neck, torso, waist,
            leftUpperArm, rightUpperArm,
            leftForearm, rightForearm,
            leftHand, rightHand,
            leftThigh, rightThigh,
            leftCalf, rightCalf,
            leftFoot, rightFoot
        };

        this.mannequin = mannequinGroup;
        this.scene.add(mannequinGroup);

        // Add a platform
        const platformGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.02, 32);
        const platformMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.2;
        platform.receiveShadow = true;
        this.scene.add(platform);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 4, 2);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-2, 2, -2);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
        rimLight.position.set(0, 2, -3);
        this.scene.add(rimLight);
    }

    setupControls() {
        // Simple mouse controls for orbiting
        let mouseX = 0;
        let mouseY = 0;
        let isMouseDown = false;

        const container = this.renderer.domElement;

        container.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        container.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;

            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;

            this.mannequin.rotation.y += deltaX * 0.01;
            this.mannequin.rotation.x += deltaY * 0.01;

            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        container.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        container.addEventListener('wheel', (event) => {
            const zoom = event.deltaY * 0.001;
            this.camera.position.z += zoom;
            this.camera.position.z = Math.max(1.5, Math.min(5, this.camera.position.z));
        });
    }

    updateModel(bodyData) {
        if (!this.mannequinParts || !bodyData) return;

        // Update proportions based on measurements
        const body = bodyData.body?.measurements || {};
        const arms = bodyData.arms?.measurements || {};
        const legs = bodyData.legs?.measurements || {};

        // Scale factors based on measurements
        const heightFactor = body.height ? body.height / 175 : 1; // Normalize to 175cm
        const chestFactor = body.chest_circumference ? body.chest_circumference / 95 : 1;
        const waistFactor = body.waist_circumference ? body.waist_circumference / 80 : 1;

        // Update torso
        if (this.mannequinParts.torso) {
            this.mannequinParts.torso.scale.set(
                chestFactor,
                heightFactor * 0.8,
                chestFactor * 0.8
            );
        }

        // Update waist
        if (this.mannequinParts.waist) {
            this.mannequinParts.waist.scale.set(
                waistFactor,
                1,
                waistFactor
            );
        }

        // Update overall height
        if (this.mannequin) {
            this.mannequin.scale.setScalar(heightFactor);
        }

        // Update muscle mass visualization
        const fitness = bodyData.body?.fitness || {};
        if (fitness.muscle_mass) {
            const muscleFactor = 0.8 + (fitness.muscle_mass / 10) * 0.4;

            // Scale arms and legs slightly based on muscle mass
            Object.values(this.mannequinParts).forEach(part => {
                if (part.userData && part.userData.type === 'muscle') {
                    part.scale.setScalar(muscleFactor);
                }
            });
        }

        // Add visual feedback for data completeness
        this.updateVisualFeedback(bodyData);
    }

    updateVisualFeedback(bodyData) {
        // Change mannequin color based on data completeness
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

        // Color from red (incomplete) to green (complete)
        const hue = completeness * 0.3; // 0 = red, 0.3 = green
        const color = new THREE.Color().setHSL(hue, 0.3, 0.9);

        // Update all body parts color
        Object.values(this.mannequinParts).forEach(part => {
            if (part.material) {
                part.material.color = color;
            }
        });

        // Add floating text showing completion percentage
        this.updateCompletionText(Math.round(completeness * 100));
    }

    updateCompletionText(percentage) {
        // Remove existing text
        const existingText = this.scene.getObjectByName('completionText');
        if (existingText) {
            this.scene.remove(existingText);
        }

        // Create new text (using basic geometry for simplicity)
        const textGeometry = new THREE.RingGeometry(0.02, 0.04, 8);
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 2.2, 0);
        textMesh.name = 'completionText';
        this.scene.add(textMesh);

        // Add percentage indicator with rings
        const rings = Math.floor(percentage / 10);
        for (let i = 0; i < rings; i++) {
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(0.15 + i * 0.02, 0.17 + i * 0.02, 16),
                new THREE.MeshBasicMaterial({ color: 0x4CAF50 })
            );
            ring.position.set(0, 2.3, 0);
            ring.rotation.x = -Math.PI / 2;
            ring.name = `completionRing${i}`;
            this.scene.add(ring);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Subtle rotation animation
        if (this.mannequin) {
            this.mannequin.rotation.y += 0.002;
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

    // Create a simple 3D visualization using basic shapes
    // This is a fallback if Three.js is not available
    const container = document.querySelector('.visualization-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3em; margin-bottom: 15px;">🏃‍♂️</div>
            <h3>3D Mannequin Preview</h3>
            <div style="background: #f0f0f0; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <div id="mannequin-stats">
                    <p><strong>Height:</strong> <span id="display-height">Not set</span></p>
                    <p><strong>Weight:</strong> <span id="display-weight">Not set</span></p>
                    <p><strong>Chest:</strong> <span id="display-chest">Not set</span></p>
                    <p><strong>Waist:</strong> <span id="display-waist">Not set</span></p>
                </div>
            </div>
            <p style="font-size: 0.9em; color: #666;">
                Enter measurements to see basic stats<br>
                <small>Full 3D visualization requires Three.js</small>
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
        }
    };
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Try to load Three.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
        setTimeout(() => new BodyVisualization(), 100);
    };
    script.onerror = () => {
        loadThreeJS(); // Fallback visualization
    };
    document.head.appendChild(script);
});