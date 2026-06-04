// Professional Virtual Dressing Room - Main Application
class VirtualDressingRoom {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;

        // Human model system
        this.humanModel = null;
        this.currentGender = 'male';
        this.currentSkinTone = 'brown';
        this.bodyMeasurements = {
            height: 175,
            weight: 70,
            chest: 95,
            waist: 80,
            hips: 95
        };

        // Clothing system
        this.clothingItems = new Map();
        this.currentOutfit = new Map();
        this.clothingDatabase = [];

        // Controls
        this.controls = null;
        this.isLoading = false;

        // Initialize
        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            await this.setupScene();
            await this.loadHumanModel();
            this.setupControls();
            this.setupEventListeners();
            this.setupClothingDatabase();
            this.animate();
            this.showLoading(false);
            this.showNotification('Virtual dressing room ready!', 'success');
        } catch (error) {
            console.error('Failed to initialize Virtual Dressing Room:', error);
            this.showNotification('Failed to load 3D models. Please refresh.', 'error');
            this.showLoading(false);
        }
    }

    async setupScene() {
        // Get canvas
        this.canvas = document.getElementById('canvas3d');
        const container = this.canvas.parentElement;

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f7fa);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 3);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        // Setup lighting
        this.setupLighting();

        // Setup environment
        this.setupEnvironment();

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light (key light)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(2, 4, 3);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 10;
        keyLight.shadow.camera.left = -3;
        keyLight.shadow.camera.right = 3;
        keyLight.shadow.camera.top = 3;
        keyLight.shadow.camera.bottom = -3;
        keyLight.shadow.bias = -0.0001;
        this.scene.add(keyLight);

        // Fill light (softer)
        const fillLight = new THREE.DirectionalLight(0xb3e5fc, 0.3);
        fillLight.position.set(-2, 2, 2);
        this.scene.add(fillLight);

        // Rim light (for edge definition)
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
        rimLight.position.set(0, 2, -3);
        this.scene.add(rimLight);

        // Environment light (HDRI simulation)
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x98FB98, 0.3);
        this.scene.add(hemiLight);
    }

    setupEnvironment() {
        // Create a simple platform/floor
        const floorGeometry = new THREE.CircleGeometry(3, 32);
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.01;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Optional: Add a subtle background gradient
        this.createBackgroundGradient();
    }

    createBackgroundGradient() {
        const gradientGeometry = new THREE.PlaneGeometry(20, 20);
        const gradientMaterial = new THREE.MeshBasicMaterial({
            map: this.createGradientTexture(),
            transparent: true,
            opacity: 0.3
        });
        const gradientPlane = new THREE.Mesh(gradientGeometry, gradientMaterial);
        gradientPlane.position.set(0, 1, -5);
        this.scene.add(gradientPlane);
    }

    createGradientTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#c3cfe2');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        return new THREE.CanvasTexture(canvas);
    }

    async loadHumanModel() {
        try {
            // For now, create a realistic human-like model using advanced geometry
            // In a real implementation, this would load MakeHuman GLB files
            await this.createRealisticHumanModel();
        } catch (error) {
            console.error('Failed to load human model:', error);
            throw error;
        }
    }

    async createRealisticHumanModel() {
        const humanGroup = new THREE.Group();

        // Create skin material based on selected tone
        const skinMaterial = this.createSkinMaterial();

        // Create realistic body parts
        const bodyParts = this.createRealisticBodyParts(skinMaterial);

        // Add all parts to the group
        Object.values(bodyParts).forEach(part => {
            if (part) humanGroup.add(part);
        });

        // Store references
        this.humanModel = humanGroup;
        this.bodyParts = bodyParts;

        // Add to scene
        this.scene.add(humanGroup);

        // Apply initial measurements
        this.updateBodyMeasurements();
    }

    createSkinMaterial() {
        const skinTones = {
            light: { color: 0xfdbcb4, roughness: 0.4, metalness: 0.0 },
            medium: { color: 0xedb98a, roughness: 0.4, metalness: 0.0 },
            tan: { color: 0xd08b5b, roughness: 0.4, metalness: 0.0 },
            brown: { color: 0x7a4825, roughness: 0.4, metalness: 0.0 },
            dark: { color: 0x594a42, roughness: 0.4, metalness: 0.0 }
        };

        const toneData = skinTones[this.currentSkinTone] || skinTones.brown;

        return new THREE.MeshPhysicalMaterial({
            color: toneData.color,
            roughness: toneData.roughness,
            metalness: toneData.metalness,
            clearcoat: 0.1,
            clearcoatRoughness: 0.1,
            sheen: 0.5,
            sheenRoughness: 0.5,
            sheenColor: new THREE.Color(toneData.color).multiplyScalar(0.5),
            transparent: true,
            opacity: 0.98
        });
    }

    createRealisticBodyParts(skinMaterial) {
        const parts = {};

        // Head - more realistic shape
        const headGeometry = new THREE.SphereGeometry(0.12, 32, 24);
        headGeometry.scale(1, 1.1, 0.8); // Make more head-like
        parts.head = new THREE.Mesh(headGeometry, skinMaterial);
        parts.head.position.y = 1.68;
        parts.head.castShadow = true;

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.12, 16);
        parts.neck = new THREE.Mesh(neckGeometry, skinMaterial);
        parts.neck.position.y = 1.55;
        parts.neck.castShadow = true;

        // Torso - more anatomical
        const torsoGeometry = new THREE.CapsuleGeometry(0.15, 0.4, 8, 16);
        torsoGeometry.scale(1.4, 1, 1); // Broader chest
        parts.torso = new THREE.Mesh(torsoGeometry, skinMaterial);
        parts.torso.position.y = 1.2;
        parts.torso.castShadow = true;

        // Abdomen
        const abdomenGeometry = new THREE.CapsuleGeometry(0.12, 0.25, 8, 16);
        abdomenGeometry.scale(1.2, 1, 1);
        parts.abdomen = new THREE.Mesh(abdomenGeometry, skinMaterial);
        parts.abdomen.position.y = 0.85;
        parts.abdomen.castShadow = true;

        // Pelvis
        const pelvisGeometry = new THREE.CapsuleGeometry(0.14, 0.15, 8, 16);
        pelvisGeometry.scale(1.1, 1, 1.2);
        parts.pelvis = new THREE.Mesh(pelvisGeometry, skinMaterial);
        parts.pelvis.position.y = 0.65;
        parts.pelvis.castShadow = true;

        // Arms
        this.createArms(parts, skinMaterial);

        // Legs
        this.createLegs(parts, skinMaterial);

        return parts;
    }

    createArms(parts, skinMaterial) {
        // Upper arms
        const upperArmGeometry = new THREE.CapsuleGeometry(0.04, 0.25, 8, 16);

        parts.leftUpperArm = new THREE.Mesh(upperArmGeometry, skinMaterial);
        parts.leftUpperArm.position.set(-0.25, 1.3, 0);
        parts.leftUpperArm.rotation.z = 0.2;
        parts.leftUpperArm.castShadow = true;

        parts.rightUpperArm = new THREE.Mesh(upperArmGeometry, skinMaterial);
        parts.rightUpperArm.position.set(0.25, 1.3, 0);
        parts.rightUpperArm.rotation.z = -0.2;
        parts.rightUpperArm.castShadow = true;

        // Forearms
        const forearmGeometry = new THREE.CapsuleGeometry(0.035, 0.22, 8, 16);

        parts.leftForearm = new THREE.Mesh(forearmGeometry, skinMaterial);
        parts.leftForearm.position.set(-0.32, 1.0, 0.05);
        parts.leftForearm.rotation.z = 0.1;
        parts.leftForearm.castShadow = true;

        parts.rightForearm = new THREE.Mesh(forearmGeometry, skinMaterial);
        parts.rightForearm.position.set(0.32, 1.0, 0.05);
        parts.rightForearm.rotation.z = -0.1;
        parts.rightForearm.castShadow = true;

        // Hands
        const handGeometry = new THREE.CapsuleGeometry(0.03, 0.08, 8, 12);
        handGeometry.scale(1.2, 1, 0.6);

        parts.leftHand = new THREE.Mesh(handGeometry, skinMaterial);
        parts.leftHand.position.set(-0.35, 0.8, 0.08);
        parts.leftHand.castShadow = true;

        parts.rightHand = new THREE.Mesh(handGeometry, skinMaterial);
        parts.rightHand.position.set(0.35, 0.8, 0.08);
        parts.rightHand.castShadow = true;
    }

    createLegs(parts, skinMaterial) {
        // Thighs
        const thighGeometry = new THREE.CapsuleGeometry(0.06, 0.35, 8, 16);

        parts.leftThigh = new THREE.Mesh(thighGeometry, skinMaterial);
        parts.leftThigh.position.set(-0.08, 0.35, 0);
        parts.leftThigh.castShadow = true;

        parts.rightThigh = new THREE.Mesh(thighGeometry, skinMaterial);
        parts.rightThigh.position.set(0.08, 0.35, 0);
        parts.rightThigh.castShadow = true;

        // Shins
        const shinGeometry = new THREE.CapsuleGeometry(0.04, 0.32, 8, 16);

        parts.leftShin = new THREE.Mesh(shinGeometry, skinMaterial);
        parts.leftShin.position.set(-0.08, 0.0, 0);
        parts.leftShin.castShadow = true;

        parts.rightShin = new THREE.Mesh(shinGeometry, skinMaterial);
        parts.rightShin.position.set(0.08, 0.0, 0);
        parts.rightShin.castShadow = true;

        // Feet
        const footGeometry = new THREE.CapsuleGeometry(0.035, 0.08, 8, 12);
        footGeometry.scale(1, 0.6, 2);

        parts.leftFoot = new THREE.Mesh(footGeometry, skinMaterial);
        parts.leftFoot.position.set(-0.08, -0.18, 0.04);
        parts.leftFoot.castShadow = true;

        parts.rightFoot = new THREE.Mesh(footGeometry, skinMaterial);
        parts.rightFoot.position.set(0.08, -0.18, 0.04);
        parts.rightFoot.castShadow = true;
    }

    setupControls() {
        // Mouse/touch controls for 3D interaction
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationY = 0;
        let targetRotationX = 0;

        this.canvas.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;

            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;

            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;

            // Limit vertical rotation
            targetRotationX = Math.max(-Math.PI/4, Math.min(Math.PI/4, targetRotationX));

            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        this.canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const zoom = event.deltaY * 0.001;
            this.camera.position.z += zoom;
            this.camera.position.z = Math.max(1.5, Math.min(6, this.camera.position.z));
        });

        // Store rotation targets for smooth animation
        this.targetRotationX = targetRotationX;
        this.targetRotationY = targetRotationY;

        // Touch controls
        this.setupTouchControls();
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        let isTouching = false;

        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            isTouching = true;
            const touch = event.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });

        this.canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (!isTouching) return;

            const touch = event.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            this.targetRotationY += deltaX * 0.01;
            this.targetRotationX += deltaY * 0.01;
            this.targetRotationX = Math.max(-Math.PI/4, Math.min(Math.PI/4, this.targetRotationX));

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });

        this.canvas.addEventListener('touchend', () => {
            isTouching = false;
        });
    }

    setupEventListeners() {
        // Gender selection
        document.querySelectorAll('.gender-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.gender-option.active')?.classList.remove('active');
                e.target.classList.add('active');
                this.changeGender(e.target.dataset.gender);
            });
        });

        // Skin tone selection
        document.querySelectorAll('.skin-tone').forEach(tone => {
            tone.addEventListener('click', (e) => {
                document.querySelector('.skin-tone.active')?.classList.remove('active');
                e.target.classList.add('active');
                this.changeSkinTone(e.target.dataset.tone);
            });
        });

        // Body measurement sliders
        document.querySelectorAll('.measurement-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const measurement = e.target.dataset.measurement;
                const value = parseFloat(e.target.value);
                this.bodyMeasurements[measurement] = value;

                // Update display
                const valueDisplay = e.target.parentElement.querySelector('.measurement-value');
                const unit = measurement === 'weight' ? 'kg' : 'cm';
                valueDisplay.textContent = `${value} ${unit}`;

                // Update model
                this.updateBodyMeasurements();
            });
        });

        // Clothing category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelector('.category-tab.active')?.classList.remove('active');
                e.target.classList.add('active');
                this.filterClothing(e.target.dataset.category);
            });
        });

        // Control buttons
        document.getElementById('resetView').addEventListener('click', () => this.resetView());
        document.getElementById('fullscreen').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('snapshot').addEventListener('click', () => this.takeSnapshot());
        document.getElementById('share').addEventListener('click', () => this.shareOutfit());

        // File upload
        document.getElementById('uploadClothing').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
    }

    setupClothingDatabase() {
        // Sample clothing database
        this.clothingDatabase = [
            {
                id: 1,
                name: 'Classic White T-Shirt',
                category: 'tops',
                price: '$29',
                color: '#ffffff',
                type: 'shirt',
                sizes: ['S', 'M', 'L', 'XL']
            },
            {
                id: 2,
                name: 'Slim Blue Jeans',
                category: 'bottoms',
                price: '$79',
                color: '#1e3a8a',
                type: 'pants',
                sizes: ['28', '30', '32', '34', '36']
            },
            {
                id: 3,
                name: 'Navy Blazer',
                category: 'outerwear',
                price: '$199',
                color: '#1e293b',
                type: 'jacket',
                sizes: ['S', 'M', 'L', 'XL']
            },
            {
                id: 4,
                name: 'Summer Dress',
                category: 'dresses',
                price: '$89',
                color: '#f97316',
                type: 'dress',
                sizes: ['XS', 'S', 'M', 'L']
            },
            {
                id: 5,
                name: 'Sneakers',
                category: 'shoes',
                price: '$129',
                color: '#ffffff',
                type: 'shoes',
                sizes: ['7', '8', '9', '10', '11', '12']
            },
            {
                id: 6,
                name: 'Black Hoodie',
                category: 'tops',
                price: '$69',
                color: '#000000',
                type: 'hoodie',
                sizes: ['S', 'M', 'L', 'XL', 'XXL']
            }
        ];

        this.renderClothingGrid();
    }

    renderClothingGrid() {
        const grid = document.getElementById('clothingGrid');
        grid.innerHTML = '';

        this.clothingDatabase.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'clothing-item';
            itemElement.innerHTML = `
                <div class="clothing-image" style="background: ${item.color};">👕</div>
                <div class="clothing-info">
                    <div class="clothing-name">${item.name}</div>
                    <div class="clothing-price">${item.price}</div>
                    <button class="try-on-btn" onclick="virtualDressingRoom.tryOnItem(${item.id})">
                        Try On
                    </button>
                </div>
            `;
            grid.appendChild(itemElement);
        });
    }

    filterClothing(category) {
        const filteredItems = category === 'all'
            ? this.clothingDatabase
            : this.clothingDatabase.filter(item => item.category === category);

        const grid = document.getElementById('clothingGrid');
        grid.innerHTML = '';

        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'clothing-item';
            itemElement.innerHTML = `
                <div class="clothing-image" style="background: ${item.color};">👕</div>
                <div class="clothing-info">
                    <div class="clothing-name">${item.name}</div>
                    <div class="clothing-price">${item.price}</div>
                    <button class="try-on-btn" onclick="virtualDressingRoom.tryOnItem(${item.id})">
                        Try On
                    </button>
                </div>
            `;
            grid.appendChild(itemElement);
        });
    }

    tryOnItem(itemId) {
        const item = this.clothingDatabase.find(i => i.id === itemId);
        if (!item) return;

        // Remove existing item of same type
        this.removeClothingType(item.type);

        // Add new item
        this.addClothingToModel(item);
        this.updateCurrentOutfit(item);

        this.showNotification(`Trying on ${item.name}`, 'success');
    }

    addClothingToModel(item) {
        // Create clothing geometry based on type
        let clothingMesh;

        switch (item.type) {
            case 'shirt':
                clothingMesh = this.createShirt(item);
                break;
            case 'pants':
                clothingMesh = this.createPants(item);
                break;
            case 'dress':
                clothingMesh = this.createDress(item);
                break;
            case 'jacket':
                clothingMesh = this.createJacket(item);
                break;
            case 'shoes':
                clothingMesh = this.createShoes(item);
                break;
            case 'hoodie':
                clothingMesh = this.createHoodie(item);
                break;
        }

        if (clothingMesh) {
            this.clothingItems.set(item.type, clothingMesh);
            this.scene.add(clothingMesh);
        }
    }

    createShirt(item) {
        const shirtGroup = new THREE.Group();

        // Create shirt material
        const shirtMaterial = new THREE.MeshPhysicalMaterial({
            color: item.color,
            roughness: 0.8,
            metalness: 0.0,
            transparent: true,
            opacity: 0.95
        });

        // Shirt body
        const bodyGeometry = new THREE.CylinderGeometry(0.18, 0.16, 0.45, 16);
        const bodyMesh = new THREE.Mesh(bodyGeometry, shirtMaterial);
        bodyMesh.position.y = 1.2;
        bodyMesh.scale.set(1, 1, 0.8);
        shirtGroup.add(bodyMesh);

        // Sleeves
        const sleeveGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.25, 12);

        const leftSleeve = new THREE.Mesh(sleeveGeometry, shirtMaterial);
        leftSleeve.position.set(-0.23, 1.25, 0);
        leftSleeve.rotation.z = 0.2;
        shirtGroup.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(sleeveGeometry, shirtMaterial);
        rightSleeve.position.set(0.23, 1.25, 0);
        rightSleeve.rotation.z = -0.2;
        shirtGroup.add(rightSleeve);

        return shirtGroup;
    }

    createPants(item) {
        const pantsGroup = new THREE.Group();

        const pantsMaterial = new THREE.MeshPhysicalMaterial({
            color: item.color,
            roughness: 0.9,
            metalness: 0.0,
            transparent: true,
            opacity: 0.95
        });

        // Waist
        const waistGeometry = new THREE.CylinderGeometry(0.15, 0.16, 0.15, 16);
        const waistMesh = new THREE.Mesh(waistGeometry, pantsMaterial);
        waistMesh.position.y = 0.65;
        pantsGroup.add(waistMesh);

        // Left leg
        const legGeometry = new THREE.CylinderGeometry(0.055, 0.07, 0.7, 12);

        const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        leftLeg.position.set(-0.08, 0.15, 0);
        pantsGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        rightLeg.position.set(0.08, 0.15, 0);
        pantsGroup.add(rightLeg);

        return pantsGroup;
    }

    createJacket(item) {
        const jacketGroup = new THREE.Group();

        const jacketMaterial = new THREE.MeshPhysicalMaterial({
            color: item.color,
            roughness: 0.7,
            metalness: 0.1,
            transparent: true,
            opacity: 0.95
        });

        // Jacket body (slightly larger than shirt)
        const bodyGeometry = new THREE.CylinderGeometry(0.20, 0.18, 0.5, 16);
        const bodyMesh = new THREE.Mesh(bodyGeometry, jacketMaterial);
        bodyMesh.position.y = 1.22;
        bodyMesh.scale.set(1, 1, 0.85);
        jacketGroup.add(bodyMesh);

        // Sleeves (longer and wider)
        const sleeveGeometry = new THREE.CylinderGeometry(0.055, 0.07, 0.35, 12);

        const leftSleeve = new THREE.Mesh(sleeveGeometry, jacketMaterial);
        leftSleeve.position.set(-0.25, 1.2, 0);
        leftSleeve.rotation.z = 0.2;
        jacketGroup.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(sleeveGeometry, jacketMaterial);
        rightSleeve.position.set(0.25, 1.2, 0);
        rightSleeve.rotation.z = -0.2;
        jacketGroup.add(rightSleeve);

        return jacketGroup;
    }

    createDress(item) {
        const dressGroup = new THREE.Group();

        const dressMaterial = new THREE.MeshPhysicalMaterial({
            color: item.color,
            roughness: 0.6,
            metalness: 0.0,
            transparent: true,
            opacity: 0.95
        });

        // Dress body (flared)
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.16, 0.8, 16);
        const bodyMesh = new THREE.Mesh(bodyGeometry, dressMaterial);
        bodyMesh.position.y = 1.0;
        bodyMesh.scale.set(1, 1, 0.8);
        dressGroup.add(bodyMesh);

        // Sleeves (optional, short)
        const sleeveGeometry = new THREE.CylinderGeometry(0.04, 0.055, 0.15, 12);

        const leftSleeve = new THREE.Mesh(sleeveGeometry, dressMaterial);
        leftSleeve.position.set(-0.20, 1.35, 0);
        leftSleeve.rotation.z = 0.3;
        dressGroup.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(sleeveGeometry, dressMaterial);
        rightSleeve.position.set(0.20, 1.35, 0);
        rightSleeve.rotation.z = -0.3;
        dressGroup.add(rightSleeve);

        return dressGroup;
    }

    createHoodie(item) {
        const hoodieGroup = new THREE.Group();

        const hoodieMaterial = new THREE.MeshPhysicalMaterial({
            color: item.color,
            roughness: 0.9,
            metalness: 0.0,
            transparent: true,
            opacity: 0.95
        });

        // Hoodie body (slightly loose)
        const bodyGeometry = new THREE.CylinderGeometry(0.19, 0.17, 0.48, 16);
        const bodyMesh = new THREE.Mesh(bodyGeometry, hoodieMaterial);
        bodyMesh.position.y = 1.2;
        bodyMesh.scale.set(1, 1, 0.85);
        hoodieGroup.add(bodyMesh);

        // Hood
        const hoodGeometry = new THREE.SphereGeometry(0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const hoodMesh = new THREE.Mesh(hoodGeometry, hoodieMaterial);
        hoodMesh.position.set(0, 1.65, -0.05);
        hoodieGroup.add(hoodMesh);

        // Sleeves (baggy)
        const sleeveGeometry = new THREE.CylinderGeometry(0.06, 0.07, 0.35, 12);

        const leftSleeve = new THREE.Mesh(sleeveGeometry, hoodieMaterial);
        leftSleeve.position.set(-0.24, 1.15, 0);
        leftSleeve.rotation.z = 0.2;
        hoodieGroup.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(sleeveGeometry, hoodieMaterial);
        rightSleeve.position.set(0.24, 1.15, 0);
        rightSleeve.rotation.z = -0.2;
        hoodieGroup.add(rightSleeve);

        return hoodieGroup;
    }

    createShoes(item) {
        const shoesGroup = new THREE.Group();

        const shoeMaterial = new THREE.MeshPhysicalMaterial({
            color: item.color,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.98
        });

        // Left shoe
        const shoeGeometry = new THREE.CapsuleGeometry(0.04, 0.1, 8, 12);
        shoeGeometry.scale(1.2, 0.8, 2.5);

        const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        leftShoe.position.set(-0.08, -0.16, 0.06);
        shoesGroup.add(leftShoe);

        const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        rightShoe.position.set(0.08, -0.16, 0.06);
        shoesGroup.add(rightShoe);

        return shoesGroup;
    }

    removeClothingType(type) {
        if (this.clothingItems.has(type)) {
            const mesh = this.clothingItems.get(type);
            this.scene.remove(mesh);
            this.clothingItems.delete(type);
        }
    }

    updateCurrentOutfit(item) {
        this.currentOutfit.set(item.type, item);
        this.renderCurrentOutfit();
    }

    renderCurrentOutfit() {
        const container = document.getElementById('currentOutfit');
        container.innerHTML = '';

        this.currentOutfit.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'outfit-item';
            itemElement.innerHTML = `
                <span class="outfit-item-name">${item.name}</span>
                <button class="remove-item" onclick="virtualDressingRoom.removeOutfitItem('${item.type}')">✕</button>
            `;
            container.appendChild(itemElement);
        });
    }

    removeOutfitItem(type) {
        this.removeClothingType(type);
        this.currentOutfit.delete(type);
        this.renderCurrentOutfit();
        this.showNotification('Item removed from outfit', 'success');
    }

    changeGender(gender) {
        this.currentGender = gender;
        // In a real implementation, this would load different base models
        this.showNotification(`Switched to ${gender} model`, 'success');
    }

    changeSkinTone(tone) {
        this.currentSkinTone = tone;

        if (this.humanModel && this.bodyParts) {
            const newSkinMaterial = this.createSkinMaterial();

            Object.values(this.bodyParts).forEach(part => {
                if (part && part.material) {
                    part.material = newSkinMaterial;
                }
            });
        }

        this.showNotification('Skin tone updated', 'success');
    }

    updateBodyMeasurements() {
        if (!this.humanModel) return;

        const { height, weight, chest, waist, hips } = this.bodyMeasurements;

        // Calculate scale factors
        const heightScale = height / 175; // 175cm baseline
        const weightScale = Math.sqrt(weight / 70); // 70kg baseline
        const chestScale = chest / 95; // 95cm baseline
        const waistScale = waist / 80; // 80cm baseline

        // Apply overall height scaling
        this.humanModel.scale.setScalar(heightScale);

        // Apply body part specific scaling
        if (this.bodyParts) {
            // Torso scaling
            if (this.bodyParts.torso) {
                this.bodyParts.torso.scale.set(chestScale, 1, chestScale * 0.8);
            }

            if (this.bodyParts.abdomen) {
                this.bodyParts.abdomen.scale.set(waistScale, 1, waistScale * 0.8);
            }

            // Limb scaling based on weight
            const limbScale = weightScale;
            ['leftUpperArm', 'rightUpperArm', 'leftForearm', 'rightForearm',
             'leftThigh', 'rightThigh', 'leftShin', 'rightShin'].forEach(partName => {
                if (this.bodyParts[partName]) {
                    this.bodyParts[partName].scale.set(limbScale, 1, limbScale);
                }
            });
        }

        // Update clothing if any
        this.updateClothingFit();
    }

    updateClothingFit() {
        // Update clothing to fit the new body measurements
        this.clothingItems.forEach((clothingMesh, type) => {
            const { height, chest, waist } = this.bodyMeasurements;
            const heightScale = height / 175;
            const chestScale = chest / 95;
            const waistScale = waist / 80;

            clothingMesh.scale.setScalar(heightScale);

            // Adjust specific clothing types
            if (type === 'shirt' || type === 'jacket' || type === 'hoodie') {
                clothingMesh.children.forEach(child => {
                    if (child.position.y > 1.0) { // Torso area
                        child.scale.set(chestScale, 1, chestScale * 0.8);
                    }
                });
            } else if (type === 'pants') {
                clothingMesh.children.forEach(child => {
                    if (child.position.y > 0.5) { // Waist area
                        child.scale.set(waistScale, 1, waistScale * 0.8);
                    }
                });
            }
        });
    }

    resetView() {
        this.camera.position.set(0, 1.6, 3);
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.humanModel.rotation.set(0, 0, 0);
        this.showNotification('View reset', 'success');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.parentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    takeSnapshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.download = 'virtual-outfit.png';
        link.href = dataURL;
        link.click();

        this.showNotification('Snapshot saved!', 'success');
    }

    shareOutfit() {
        if (navigator.share) {
            navigator.share({
                title: 'My Virtual Outfit',
                text: 'Check out my virtual try-on outfit!',
                url: window.location.href
            });
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('Link copied to clipboard!', 'success');
        }
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type === 'model/gltf+json' || file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
                this.loadClothingFile(file);
            } else {
                this.showNotification('Please upload GLB or GLTF files only', 'error');
            }
        });
    }

    loadClothingFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            // In a real implementation, this would use GLTFLoader to load the file
            this.showNotification(`Uploaded ${file.name}`, 'success');
        };
        reader.readAsArrayBuffer(file);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth rotation animation
        if (this.humanModel) {
            this.humanModel.rotation.y += (this.targetRotationY - this.humanModel.rotation.y) * 0.1;
            this.humanModel.rotation.x += (this.targetRotationX - this.humanModel.rotation.x) * 0.1;
        }

        // Subtle idle animation
        if (this.humanModel && this.bodyParts) {
            const time = Date.now() * 0.001;

            // Gentle breathing animation
            if (this.bodyParts.torso) {
                this.bodyParts.torso.scale.z = 1 + Math.sin(time * 0.5) * 0.02;
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const container = this.canvas.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    showLoading(show) {
        const loadingEl = document.getElementById('loading');
        loadingEl.style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');

        text.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application
let virtualDressingRoom;

document.addEventListener('DOMContentLoaded', () => {
    virtualDressingRoom = new VirtualDressingRoom();
});

// Export for global access
window.virtualDressingRoom = virtualDressingRoom;