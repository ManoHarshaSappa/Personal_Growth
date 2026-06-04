# Virtual Dressing Room - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Modern web browser with WebGL support
- Internet connection for CDN dependencies

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sappamanoharsha/virtual-dressing-room.git
cd virtual-dressing-room
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
# Or for simple local testing:
npm start
```

4. **Open in browser**
```
http://localhost:8080
```

## 🏗️ Project Structure

```
virtual-dressing-room/
├── fashion-index.html          # Main application entry
├── src/
│   └── virtual-dressing-room.js # Core application logic
├── assets/                     # 3D models and textures
├── package.json               # Dependencies
├── webpack.config.js          # Build configuration
└── docs/                      # Documentation
```

## 🎯 Features

### Implemented ✅
- **Realistic 3D Human Models** - Male/Female with anatomical proportions
- **Multiple Skin Tones** - 5 different skin tones including Harsha's (#7a4825)
- **Body Measurements** - Real-time height, weight, chest, waist, hips adjustment
- **Virtual Try-On** - 6 clothing categories with realistic fitting
- **Interactive 3D Controls** - Mouse/touch rotation, zoom, pan
- **Fashion E-commerce UI** - Modern retail interface like Zara/Nike
- **Responsive Design** - Works on desktop, tablet, mobile
- **Clothing Upload** - Support for GLB/GLTF files

### Clothing Types
1. **Tops** - T-shirts, hoodies, blouses
2. **Bottoms** - Jeans, pants, shorts
3. **Dresses** - Various dress styles
4. **Outerwear** - Jackets, coats, blazers
5. **Shoes** - Sneakers, dress shoes, boots
6. **Accessories** - (Future implementation)

## 🔧 Technical Implementation

### 3D Rendering Engine
- **Three.js r160** - WebGL-based 3D rendering
- **Physically Based Rendering (PBR)** - Realistic material system
- **Shadow Mapping** - Dynamic shadows for depth
- **HDR Environment** - Professional lighting setup

### Human Model System
```javascript
// Realistic body parts with proper anatomy
createRealisticBodyParts(skinMaterial) {
    // Head - anatomically correct proportions
    // Torso - chest, abdomen, pelvis segments
    // Arms - upper arm, forearm, hands with realistic joints
    // Legs - thighs, shins, feet with proper scaling
}
```

### Virtual Try-On Algorithm
```javascript
// Clothing fitting system
addClothingToModel(item) {
    // 1. Remove conflicting clothing types
    // 2. Create geometry based on clothing type
    // 3. Apply material properties (fabric, color, texture)
    // 4. Scale to fit current body measurements
    // 5. Add physics simulation (future)
}
```

### Body Measurement Scaling
```javascript
// Real-time body adjustment
updateBodyMeasurements() {
    const heightScale = height / 175;    // 175cm baseline
    const chestScale = chest / 95;       // 95cm baseline
    const waistScale = waist / 80;       // 80cm baseline
    
    // Apply proportional scaling to body parts
    // Update clothing fit automatically
}
```

## 🎨 Repository Analysis Integration

### 1. MakeHuman Integration
```javascript
// Future: Load realistic human base models
async loadMakeHumanModel() {
    const loader = new GLTFLoader();
    const model = await loader.loadAsync('assets/models/male_base.glb');
    // Apply morph targets for body measurements
    // Add clothing attachment points
}
```

### 2. Virtual Try-On Physics
```javascript
// Inspired by 3DVirtualTryOn repository
setupClothPhysics() {
    // Cloth simulation using Cannon.js
    // Collision detection with body mesh
    // Fabric draping and movement
}
```

### 3. AI Outfit Recommendations
```javascript
// Based on OutfitAnyone concepts
generateOutfitSuggestions(userPreferences) {
    // Style analysis
    // Color matching
    // Seasonal recommendations
    // Body type optimization
}
```

### 4. Size Recommendation Engine
```javascript
// OpenTryOn integration concepts
calculateSizeRecommendation(measurements, item) {
    // Compare user measurements with garment specs
    // Predict fit quality
    // Suggest optimal size
}
```

## 📱 Usage Guide

### Basic Operations

1. **Select Model**
   - Choose male/female
   - Pick skin tone (5 options)
   - Adjust body measurements

2. **Try On Clothes**
   - Browse clothing categories
   - Click "Try On" on any item
   - Mix and match different pieces

3. **Interact with 3D Model**
   - Drag to rotate 360°
   - Scroll to zoom in/out
   - Use control buttons for reset/fullscreen

4. **Save and Share**
   - Take snapshots
   - Save outfits
   - Share via social media

### Advanced Features

1. **Upload Custom Clothing**
   ```javascript
   // Supported formats: GLB, GLTF
   document.getElementById('uploadClothing').click();
   ```

2. **Body Measurement Matching**
   ```javascript
   // Real-time scaling based on measurements
   bodyMeasurements = {
       height: 175,  // 150-200 cm
       weight: 70,   // 40-150 kg
       chest: 95,    // 80-140 cm
       waist: 80,    // 60-120 cm
       hips: 95      // 80-140 cm
   };
   ```

## 🛒 E-commerce Integration

### Shopping Cart
```javascript
// Add items to cart
addToCart(item) {
    // Include size, color, customizations
    // Calculate total price
    // Update cart counter
}
```

### Size Chart Integration
```javascript
// Size recommendation based on measurements
getSizeRecommendation(userMeasurements, item) {
    // Compare with garment specifications
    // Return optimal size and fit prediction
}
```

## 🔨 Build and Deployment

### Development
```bash
npm run dev          # Start webpack dev server
npm run lint         # Check code quality
npm run test         # Run unit tests
```

### Production
```bash
npm run build        # Create optimized build
npm start           # Serve production files
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

## 📊 Performance Optimization

### 3D Model Optimization
- **Draco Compression** - 80% size reduction
- **Texture Compression** - WebP format support
- **LOD System** - Level of detail for different zoom levels
- **Frustum Culling** - Only render visible parts

### Loading Performance
```javascript
// Progressive loading
async initializeApp() {
    // 1. Load basic UI (fast)
    // 2. Load 3D engine (medium)
    // 3. Load detailed models (slower)
    // 4. Load clothing database (background)
}
```

## 🔍 Browser Support

### Minimum Requirements
- Chrome 91+
- Firefox 89+
- Safari 14+
- Edge 91+

### Features Used
- WebGL 2.0
- ES6 Modules
- Async/Await
- Canvas API
- File API

## 🐛 Troubleshooting

### Common Issues

1. **3D Model Not Loading**
   - Check WebGL support: `chrome://gpu/`
   - Clear browser cache
   - Try different browser

2. **Performance Issues**
   - Reduce texture quality
   - Disable shadows in low-end devices
   - Use lower polygon models

3. **File Upload Problems**
   - Verify file format (GLB/GLTF only)
   - Check file size (<10MB recommended)
   - Ensure proper UV mapping

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('DEBUG_MODE', 'true');
// Check console for detailed logs
```

## 🚀 Next Steps

### Phase 1 Enhancements
- [ ] Add MakeHuman GLB model loading
- [ ] Implement cloth physics simulation
- [ ] Add more clothing types and brands
- [ ] Improve mobile responsiveness

### Phase 2 Features
- [ ] AI-powered outfit recommendations
- [ ] Social sharing and wishlists
- [ ] AR preview mode
- [ ] Size prediction accuracy improvements

### Phase 3 Integration
- [ ] E-commerce platform APIs
- [ ] Payment processing
- [ ] Inventory management
- [ ] Analytics and user tracking

## 📞 Support

For technical support or questions:
- Email: sappamanoharsha@gmail.com
- GitHub Issues: [Create Issue](https://github.com/sappamanoharsha/virtual-dressing-room/issues)
- Documentation: `/docs/`

---

*Built with ❤️ using Three.js, inspired by professional fashion retail experiences*