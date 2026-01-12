import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";
import * as THREE from "https://esm.sh/three@0.170.0";

// ============== Styles ==============
const WIDGET_STYLES = `
  .synvow-multiangle-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: #0a0a0f;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    border-radius: 8px;
    overflow: hidden;
  }
  .synvow-multiangle-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
  .synvow-multiangle-prompt {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    background: rgba(10, 10, 15, 0.9);
    border: 1px solid rgba(233, 61, 130, 0.3);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 11px;
    color: #E93D82;
    backdrop-filter: blur(4px);
    font-family: 'Consolas', 'Monaco', monospace;
    word-break: break-all;
    line-height: 1.4;
  }
  .synvow-multiangle-info {
    position: absolute;
    bottom: 8px;
    left: 8px;
    right: 8px;
    background: rgba(10, 10, 15, 0.9);
    border: 1px solid rgba(233, 61, 130, 0.3);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 11px;
    color: #e0e0e0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    backdrop-filter: blur(4px);
  }
  .synvow-multiangle-param { text-align: center; }
  .synvow-multiangle-param-label {
    color: #888;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .synvow-multiangle-param-value { font-weight: 600; font-size: 13px; }
  .synvow-multiangle-param-value.azimuth { color: #E93D82; }
  .synvow-multiangle-param-value.elevation { color: #00FFD0; }
  .synvow-multiangle-param-value.zoom { color: #FFB800; }
  .synvow-multiangle-reset {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid rgba(233, 61, 130, 0.4);
    background: rgba(10, 10, 15, 0.8);
    color: #E93D82;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .synvow-multiangle-reset:hover {
    background: rgba(233, 61, 130, 0.2);
    border-color: #E93D82;
  }
  .synvow-multiangle-dropdowns {
    position: absolute;
    top: 40px;
    left: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 10;
  }
  .synvow-multiangle-dropdown { display: flex; align-items: center; gap: 6px; }
  .synvow-multiangle-dropdown-label {
    font-size: 9px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 28px;
    text-align: right;
    white-space: nowrap;
  }
  .synvow-multiangle-dropdown-label.azimuth { color: #E93D82; }
  .synvow-multiangle-dropdown-label.elevation { color: #00FFD0; }
  .synvow-multiangle-dropdown-label.distance { color: #FFB800; }
  .synvow-multiangle-select {
    background: rgba(10, 10, 15, 0.9);
    border: 1px solid rgba(100, 100, 120, 0.4);
    border-radius: 4px;
    padding: 3px 6px;
    font-size: 10px;
    color: #e0e0e0;
    cursor: pointer;
    outline: none;
    min-width: 120px;
    backdrop-filter: blur(4px);
  }
  .synvow-multiangle-select:hover { border-color: rgba(150, 150, 170, 0.6); }
  .synvow-multiangle-select:focus { border-color: #E93D82; }
  .synvow-multiangle-select option { background: #1a1a2e; color: #e0e0e0; }
  .synvow-multiangle-upload-btn {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid rgba(100, 180, 255, 0.4);
    background: rgba(10, 10, 15, 0.8);
    color: #64B4FF;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.2s ease;
    flex-shrink: 0;
    margin-right: 4px;
  }
  .synvow-multiangle-upload-btn:hover {
    background: rgba(100, 180, 255, 0.2);
    border-color: #64B4FF;
  }
  .synvow-multiangle-file-input { display: none; }
`;

function injectStyles() {
  if (document.getElementById('synvow-multiangle-styles')) return;
  const style = document.createElement('style');
  style.id = 'synvow-multiangle-styles';
  style.textContent = WIDGET_STYLES;
  document.head.appendChild(style);
}

// ============== Translations ==============
const translations = {
  horizontal: 'H',
  vertical: 'V',
  zoom: 'Z',
  horizontalFull: 'HORIZONTAL',
  verticalFull: 'VERTICAL',
  zoomFull: 'ZOOM',
  resetToDefaults: 'Reset to defaults',
  loadImage: 'Load image',
  frontView: 'front view',
  frontRightQuarterView: 'front-right quarter view',
  rightSideView: 'right side view',
  backRightQuarterView: 'back-right quarter view',
  backView: 'back view',
  backLeftQuarterView: 'back-left quarter view',
  leftSideView: 'left side view',
  frontLeftQuarterView: 'front-left quarter view',
  extremeLowAngleShot: 'extreme low-angle shot',
  lowAngleShot: 'low-angle shot',
  eyeLevelShot: 'eye-level shot',
  elevatedShot: 'elevated shot',
  highAngleShot: 'high-angle shot',
  wideShot: 'wide shot',
  mediumShot: 'medium shot',
  closeUp: 'close-up'
};

function t(key) {
  return translations[key] || key;
}

// ============== CameraWidget Class ==============
class CameraWidget {
  constructor(options) {
    injectStyles();
    
    this.container = options.container;
    this.onStateChange = options.onStateChange;
    this.state = {
      azimuth: options.initialState?.azimuth ?? 0,
      elevation: options.initialState?.elevation ?? 0,
      distance: options.initialState?.distance ?? 5,
      imageUrl: null,
      uploadedImageFile: null
    };
    this.node = options.node;
    
    this.liveAzimuth = this.state.azimuth;
    this.liveElevation = this.state.elevation;
    this.liveDistance = this.state.distance;
    
    this.CENTER = new THREE.Vector3(0, 0.5, 0);
    this.AZIMUTH_RADIUS = 1.8;
    this.ELEVATION_RADIUS = 1.4;
    this.ELEV_ARC_X = -0.8;
    
    this.isDragging = false;
    this.dragTarget = null;
    this.hoveredHandle = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.animationId = null;
    this.time = 0;
    this.needsRender = true;
    
    this.AZIMUTH_OPTIONS = [
      { key: 'frontView', value: 0 },
      { key: 'frontRightQuarterView', value: 45 },
      { key: 'rightSideView', value: 90 },
      { key: 'backRightQuarterView', value: 135 },
      { key: 'backView', value: 180 },
      { key: 'backLeftQuarterView', value: 225 },
      { key: 'leftSideView', value: 270 },
      { key: 'frontLeftQuarterView', value: 315 }
    ];
    
    this.ELEVATION_OPTIONS = [
      { key: 'extremeLowAngleShot', value: -60 },
      { key: 'lowAngleShot', value: -30 },
      { key: 'eyeLevelShot', value: 0 },
      { key: 'elevatedShot', value: 30 },
      { key: 'highAngleShot', value: 60 }
    ];
    
    this.DISTANCE_OPTIONS = [
      { key: 'wideShot', value: 1 },
      { key: 'mediumShot', value: 4 },
      { key: 'closeUp', value: 8 }
    ];
    
    this.createDOM();
    this.initThreeJS();
    this.bindEvents();
    this.updateDisplay();
    this.animate();
  }
  
  createDOM() {
    const azimuthOptionsHtml = this.AZIMUTH_OPTIONS.map(opt => 
      `<option value="${opt.value}">${t(opt.key)}</option>`
    ).join('');
    const elevationOptionsHtml = this.ELEVATION_OPTIONS.map(opt => 
      `<option value="${opt.value}">${t(opt.key)}</option>`
    ).join('');
    const distanceOptionsHtml = this.DISTANCE_OPTIONS.map(opt => 
      `<option value="${opt.value}">${t(opt.key)}</option>`
    ).join('');
    
    this.container.innerHTML = `
      <div class="synvow-multiangle-container">
        <div class="synvow-multiangle-canvas"></div>
        <div class="synvow-multiangle-prompt">&lt;sks&gt; front view eye-level shot medium shot</div>
        <div class="synvow-multiangle-dropdowns">
          <div class="synvow-multiangle-dropdown">
            <span class="synvow-multiangle-dropdown-label azimuth">${t('horizontal')}</span>
            <select class="synvow-multiangle-select azimuth">${azimuthOptionsHtml}</select>
          </div>
          <div class="synvow-multiangle-dropdown">
            <span class="synvow-multiangle-dropdown-label elevation">${t('vertical')}</span>
            <select class="synvow-multiangle-select elevation">${elevationOptionsHtml}</select>
          </div>
          <div class="synvow-multiangle-dropdown">
            <span class="synvow-multiangle-dropdown-label distance">${t('zoom')}</span>
            <select class="synvow-multiangle-select distance">${distanceOptionsHtml}</select>
          </div>
        </div>
        <div class="synvow-multiangle-info">
          <div class="synvow-multiangle-param">
            <div class="synvow-multiangle-param-label">${t('horizontalFull')}</div>
            <div class="synvow-multiangle-param-value azimuth">0°</div>
          </div>
          <div class="synvow-multiangle-param">
            <div class="synvow-multiangle-param-label">${t('verticalFull')}</div>
            <div class="synvow-multiangle-param-value elevation">0°</div>
          </div>
          <div class="synvow-multiangle-param">
            <div class="synvow-multiangle-param-label">${t('zoomFull')}</div>
            <div class="synvow-multiangle-param-value zoom">5.0</div>
          </div>
          <input type="file" class="synvow-multiangle-file-input" accept="image/*">
          <button class="synvow-multiangle-upload-btn" title="${t('loadImage')}">📁</button>
          <button class="synvow-multiangle-reset" title="${t('resetToDefaults')}">↺</button>
        </div>
      </div>
    `;
    
    const containerEl = this.container.querySelector('.synvow-multiangle-container');
    this.canvasContainer = containerEl.querySelector('.synvow-multiangle-canvas');
    this.promptEl = containerEl.querySelector('.synvow-multiangle-prompt');
    this.hValueEl = containerEl.querySelector('.synvow-multiangle-param-value.azimuth');
    this.vValueEl = containerEl.querySelector('.synvow-multiangle-param-value.elevation');
    this.zValueEl = containerEl.querySelector('.synvow-multiangle-param-value.zoom');
    this.azimuthSelect = containerEl.querySelector('.synvow-multiangle-select.azimuth');
    this.elevationSelect = containerEl.querySelector('.synvow-multiangle-select.elevation');
    this.distanceSelect = containerEl.querySelector('.synvow-multiangle-select.distance');
    
    containerEl.querySelector('.synvow-multiangle-reset').addEventListener('click', () => this.resetToDefaults());
    
    this.fileInput = containerEl.querySelector('.synvow-multiangle-file-input');
    containerEl.querySelector('.synvow-multiangle-upload-btn').addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    
    this.azimuthSelect.addEventListener('change', () => {
      const value = parseInt(this.azimuthSelect.value, 10);
      this.state.azimuth = value;
      this.liveAzimuth = value;
      this.updateVisuals();
      this.updateDisplay();
      this.notifyStateChange();
    });
    
    this.elevationSelect.addEventListener('change', () => {
      const value = parseInt(this.elevationSelect.value, 10);
      this.state.elevation = value;
      this.liveElevation = value;
      this.updateVisuals();
      this.updateDisplay();
      this.notifyStateChange();
    });
    
    this.distanceSelect.addEventListener('change', () => {
      const value = parseInt(this.distanceSelect.value, 10);
      this.state.distance = value;
      this.liveDistance = value;
      this.updateVisuals();
      this.updateDisplay();
      this.notifyStateChange();
    });
  }
  
  initThreeJS() {
    const width = this.canvasContainer.clientWidth || 300;
    const height = this.canvasContainer.clientHeight || 300;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(4, 3.5, 4);
    this.camera.lookAt(0, 0.3, 0);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.canvasContainer.appendChild(this.renderer.domElement);
    
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    this.scene.add(mainLight);
    
    const fillLight = new THREE.DirectionalLight(0xE93D82, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
    
    this.gridHelper = new THREE.GridHelper(5, 10, 0x1a1a2e, 0x12121a);
    this.gridHelper.position.y = -0.01;
    this.scene.add(this.gridHelper);
    
    this.createSubject();
    this.createCameraIndicator();
    this.createAzimuthRing();
    this.createElevationArc();
    this.createDistanceHandle();
    this.updateVisuals();
  }
  
  createGridTexture() {
    const canvas = document.createElement('canvas');
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(0, 0, size, size);
    
    ctx.strokeStyle = '#2a2a3a';
    ctx.lineWidth = 1;
    const gridSize = 16;
    for (let i = 0; i <= size; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }
  
  createSubject() {
    const cardGeo = new THREE.BoxGeometry(1.2, 1.2, 0.02);
    const frontMat = new THREE.MeshBasicMaterial({ color: 0x3a3a4a });
    const backMat = new THREE.MeshBasicMaterial({ map: this.createGridTexture() });
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x1a1a2a });
    
    this.imagePlane = new THREE.Mesh(cardGeo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]);
    this.imagePlane.position.copy(this.CENTER);
    this.scene.add(this.imagePlane);
    this.planeMat = frontMat;
    
    const frameGeo = new THREE.EdgesGeometry(cardGeo);
    this.imageFrame = new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({ color: 0xE93D82 }));
    this.imageFrame.position.copy(this.CENTER);
    this.scene.add(this.imageFrame);
    
    const glowRingMat = new THREE.MeshBasicMaterial({ color: 0xE93D82, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    this.glowRing = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.58, 24), glowRingMat);
    this.glowRing.position.set(0, 0.01, 0);
    this.glowRing.rotation.x = -Math.PI / 2;
    this.scene.add(this.glowRing);
  }
  
  createCameraIndicator() {
    const camMat = new THREE.MeshBasicMaterial({ color: 0xE93D82 });
    this.cameraIndicator = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 4), camMat);
    this.scene.add(this.cameraIndicator);
    
    const camGlowMat = new THREE.MeshBasicMaterial({ color: 0xff6ba8, transparent: true, opacity: 0.8 });
    this.camGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), camGlowMat);
    this.scene.add(this.camGlow);
  }
  
  createAzimuthRing() {
    const azRingMat = new THREE.MeshBasicMaterial({ color: 0xE93D82, transparent: true, opacity: 0.7 });
    this.azimuthRing = new THREE.Mesh(new THREE.TorusGeometry(this.AZIMUTH_RADIUS, 0.04, 8, 48), azRingMat);
    this.azimuthRing.rotation.x = Math.PI / 2;
    this.azimuthRing.position.y = 0.02;
    this.scene.add(this.azimuthRing);
    
    const azHandleMat = new THREE.MeshBasicMaterial({ color: 0xE93D82 });
    this.azimuthHandle = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), azHandleMat);
    this.scene.add(this.azimuthHandle);
    
    const azGlowMat = new THREE.MeshBasicMaterial({ color: 0xE93D82, transparent: true, opacity: 0.2 });
    this.azGlow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), azGlowMat);
    this.scene.add(this.azGlow);
  }
  
  createElevationArc() {
    const arcPoints = [];
    for (let i = 0; i <= 16; i++) {
      const angle = (-60 + (120 * i / 16)) * Math.PI / 180;
      arcPoints.push(new THREE.Vector3(
        this.ELEV_ARC_X,
        this.ELEVATION_RADIUS * Math.sin(angle) + this.CENTER.y,
        this.ELEVATION_RADIUS * Math.cos(angle)
      ));
    }
    const arcCurve = new THREE.CatmullRomCurve3(arcPoints);
    const elArcMat = new THREE.MeshBasicMaterial({ color: 0x00FFD0, transparent: true, opacity: 0.8 });
    this.elevationArc = new THREE.Mesh(new THREE.TubeGeometry(arcCurve, 16, 0.04, 6, false), elArcMat);
    this.scene.add(this.elevationArc);
    
    const elHandleMat = new THREE.MeshBasicMaterial({ color: 0x00FFD0 });
    this.elevationHandle = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), elHandleMat);
    this.scene.add(this.elevationHandle);
    
    const elGlowMat = new THREE.MeshBasicMaterial({ color: 0x00FFD0, transparent: true, opacity: 0.2 });
    this.elGlow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), elGlowMat);
    this.scene.add(this.elGlow);
  }
  
  createDistanceHandle() {
    const distHandleMat = new THREE.MeshBasicMaterial({ color: 0xFFB800 });
    this.distanceHandle = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), distHandleMat);
    this.scene.add(this.distanceHandle);
    
    const distGlowMat = new THREE.MeshBasicMaterial({ color: 0xFFB800, transparent: true, opacity: 0.25 });
    this.distGlow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), distGlowMat);
    this.scene.add(this.distGlow);
  }
  
  updateDistanceLine(start, end) {
    if (!this.distanceLine) {
      const lineMat = new THREE.LineBasicMaterial({ color: 0xFFB800, transparent: true, opacity: 0.8 });
      this.distanceLine = new THREE.Line(new THREE.BufferGeometry(), lineMat);
      this.scene.add(this.distanceLine);
    }
    const positions = new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z]);
    this.distanceLine.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.distanceLine.geometry.attributes.position.needsUpdate = true;
  }
  
  updateVisuals() {
    const azRad = (this.liveAzimuth * Math.PI) / 180;
    const elRad = (this.liveElevation * Math.PI) / 180;
    const visualDist = 2.6 - (this.liveDistance / 10) * 2.0;
    
    const camX = visualDist * Math.sin(azRad) * Math.cos(elRad);
    const camY = this.CENTER.y + visualDist * Math.sin(elRad);
    const camZ = visualDist * Math.cos(azRad) * Math.cos(elRad);
    
    this.cameraIndicator.position.set(camX, camY, camZ);
    this.cameraIndicator.lookAt(this.CENTER);
    this.cameraIndicator.rotateX(Math.PI / 2);
    this.camGlow.position.copy(this.cameraIndicator.position);
    
    const azX = this.AZIMUTH_RADIUS * Math.sin(azRad);
    const azZ = this.AZIMUTH_RADIUS * Math.cos(azRad);
    this.azimuthHandle.position.set(azX, 0.16, azZ);
    this.azGlow.position.copy(this.azimuthHandle.position);
    
    const elY = this.CENTER.y + this.ELEVATION_RADIUS * Math.sin(elRad);
    const elZ = this.ELEVATION_RADIUS * Math.cos(elRad);
    this.elevationHandle.position.set(this.ELEV_ARC_X, elY, elZ);
    this.elGlow.position.copy(this.elevationHandle.position);
    
    const distT = 0.15 + ((10 - this.liveDistance) / 10) * 0.7;
    this.distanceHandle.position.lerpVectors(this.CENTER, this.cameraIndicator.position, distT);
    this.distGlow.position.copy(this.distanceHandle.position);
    
    this.updateDistanceLine(this.CENTER.clone(), this.cameraIndicator.position.clone());
    this.requestRender();
  }
  
  bindEvents() {
    const canvas = this.renderer.domElement;
    
    canvas.addEventListener('mousedown', (e) => this.onPointerDown(e));
    canvas.addEventListener('mousemove', (e) => this.onPointerMove(e));
    canvas.addEventListener('mouseup', () => this.onPointerUp());
    canvas.addEventListener('mouseleave', () => this.onPointerUp());
    
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.onPointerDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.onPointerMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    }, { passive: false });
    
    canvas.addEventListener('touchend', () => this.onPointerUp());
    canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    
    new ResizeObserver(() => this.onResize()).observe(this.canvasContainer);
  }
  
  getMousePos(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
  
  setHandleScale(handle, glow, scale) {
    handle.scale.setScalar(scale);
    if (glow) glow.scale.setScalar(scale);
  }
  
  onPointerDown(event) {
    this.getMousePos(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const handles = [
      { mesh: this.azimuthHandle, glow: this.azGlow, name: 'azimuth' },
      { mesh: this.elevationHandle, glow: this.elGlow, name: 'elevation' },
      { mesh: this.distanceHandle, glow: this.distGlow, name: 'distance' }
    ];
    
    for (const h of handles) {
      if (this.raycaster.intersectObject(h.mesh).length > 0) {
        this.isDragging = true;
        this.dragTarget = h.name;
        this.setHandleScale(h.mesh, h.glow, 1.3);
        this.renderer.domElement.style.cursor = 'grabbing';
        return;
      }
    }
  }
  
  onPointerMove(event) {
    this.getMousePos(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    if (!this.isDragging) {
      const handles = [
        { mesh: this.azimuthHandle, glow: this.azGlow, name: 'azimuth' },
        { mesh: this.elevationHandle, glow: this.elGlow, name: 'elevation' },
        { mesh: this.distanceHandle, glow: this.distGlow, name: 'distance' }
      ];
      
      let foundHover = null;
      for (const h of handles) {
        if (this.raycaster.intersectObject(h.mesh).length > 0) {
          foundHover = h;
          break;
        }
      }
      
      if (this.hoveredHandle && this.hoveredHandle !== foundHover) {
        this.setHandleScale(this.hoveredHandle.mesh, this.hoveredHandle.glow, 1.0);
      }
      
      if (foundHover) {
        this.setHandleScale(foundHover.mesh, foundHover.glow, 1.15);
        this.renderer.domElement.style.cursor = 'grab';
        this.hoveredHandle = foundHover;
      } else {
        this.renderer.domElement.style.cursor = 'default';
        this.hoveredHandle = null;
      }
      return;
    }
    
    const plane = new THREE.Plane();
    const intersect = new THREE.Vector3();
    
    if (this.dragTarget === 'azimuth') {
      plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0));
      if (this.raycaster.ray.intersectPlane(plane, intersect)) {
        let angle = Math.atan2(intersect.x, intersect.z) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        this.liveAzimuth = Math.max(0, Math.min(360, angle));
        this.state.azimuth = Math.round(this.liveAzimuth);
        this.updateDisplay();
        this.updateVisuals();
        this.notifyStateChange();
      }
    } else if (this.dragTarget === 'elevation') {
      const elevPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -this.ELEV_ARC_X);
      if (this.raycaster.ray.intersectPlane(elevPlane, intersect)) {
        const relY = intersect.y - this.CENTER.y;
        const relZ = intersect.z;
        let angle = Math.atan2(relY, relZ) * (180 / Math.PI);
        angle = Math.max(-60, Math.min(60, angle));
        this.liveElevation = angle;
        this.state.elevation = Math.round(this.liveElevation);
        this.updateDisplay();
        this.updateVisuals();
        this.notifyStateChange();
      }
    } else if (this.dragTarget === 'distance') {
      const newDist = 5 - this.mouse.y * 5;
      this.liveDistance = Math.max(0, Math.min(10, newDist));
      this.state.distance = Math.round(this.liveDistance * 10) / 10;
      this.updateDisplay();
      this.updateVisuals();
      this.notifyStateChange();
    }
  }
  
  onPointerUp() {
    if (this.isDragging) {
      const handles = [
        { mesh: this.azimuthHandle, glow: this.azGlow },
        { mesh: this.elevationHandle, glow: this.elGlow },
        { mesh: this.distanceHandle, glow: this.distGlow }
      ];
      handles.forEach(h => this.setHandleScale(h.mesh, h.glow, 1.0));
    }
    this.isDragging = false;
    this.dragTarget = null;
    this.renderer.domElement.style.cursor = 'default';
  }
  
  onWheel(event) {
    event.preventDefault();
    const sensitivity = 0.01;
    let newDistance = this.liveDistance - event.deltaY * sensitivity;
    newDistance = Math.max(0, Math.min(10, newDistance));
    this.liveDistance = newDistance;
    this.state.distance = Math.round(this.liveDistance * 10) / 10;
    this.updateVisuals();
    this.updateDisplay();
    this.notifyStateChange();
  }
  
  onResize() {
    const w = this.canvasContainer.clientWidth;
    const h = this.canvasContainer.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.requestRender();
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 1;
    if (this.needsRender || this.time % 30 === 0) {
      if (this.time % 30 === 0) {
        this.glowRing.rotation.z += 0.1;
      }
      this.renderer.render(this.scene, this.camera);
      this.needsRender = false;
    }
  }
  
  requestRender() {
    this.needsRender = true;
  }
  
  generatePrompt() {
    const hAngle = this.state.azimuth % 360;
    
    let hDirection;
    if (hAngle < 22.5 || hAngle >= 337.5) hDirection = "front view";
    else if (hAngle < 67.5) hDirection = "front-right quarter view";
    else if (hAngle < 112.5) hDirection = "right side view";
    else if (hAngle < 157.5) hDirection = "back-right quarter view";
    else if (hAngle < 202.5) hDirection = "back view";
    else if (hAngle < 247.5) hDirection = "back-left quarter view";
    else if (hAngle < 292.5) hDirection = "left side view";
    else hDirection = "front-left quarter view";
    
    let vDirection;
    if (this.state.elevation < -30) vDirection = "extreme low-angle shot";
    else if (this.state.elevation < -10) vDirection = "low-angle shot";
    else if (this.state.elevation < 10) vDirection = "eye-level shot";
    else if (this.state.elevation < 40) vDirection = "elevated shot";
    else vDirection = "high-angle shot";
    
    let distance;
    if (this.state.distance < 2) distance = "wide shot";
    else if (this.state.distance < 6) distance = "medium shot";
    else distance = "close-up";
    
    return `<sks> ${hDirection} ${vDirection} ${distance}`;
  }
  
  updateDisplay() {
    this.hValueEl.textContent = `${Math.round(this.state.azimuth)}°`;
    this.vValueEl.textContent = `${Math.round(this.state.elevation)}°`;
    this.zValueEl.textContent = this.state.distance.toFixed(1);
    this.promptEl.textContent = this.generatePrompt();
    this.syncDropdowns();
  }
  
  syncDropdowns() {
    this.azimuthSelect.value = this.findClosestOption(this.state.azimuth, this.AZIMUTH_OPTIONS, true).toString();
    this.elevationSelect.value = this.findClosestOption(this.state.elevation, this.ELEVATION_OPTIONS, false).toString();
    this.distanceSelect.value = this.findClosestDistanceOption(this.state.distance).toString();
  }
  
  findClosestOption(value, options, isAzimuth = false) {
    let closest = options[0].value;
    let minDiff = Math.abs(value - options[0].value);
    
    for (const opt of options) {
      let diff = Math.abs(value - opt.value);
      if (isAzimuth) {
        diff = Math.min(diff, Math.abs(value - opt.value - 360), Math.abs(value - opt.value + 360));
      }
      if (diff < minDiff) {
        minDiff = diff;
        closest = opt.value;
      }
    }
    return closest;
  }
  
  findClosestDistanceOption(distance) {
    if (distance < 2) return 1;
    if (distance < 6) return 4;
    return 8;
  }
  
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }
  
  resetToDefaults() {
    this.state.azimuth = 0;
    this.state.elevation = 0;
    this.state.distance = 5.0;
    this.liveAzimuth = 0;
    this.liveElevation = 0;
    this.liveDistance = 5.0;
    this.updateVisuals();
    this.updateDisplay();
    this.notifyStateChange();
  }
  
  async handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('overwrite', 'true');
      
      const response = await api.fetchApi('/upload/image', { method: 'POST', body: formData });
      
      if (response.ok) {
        const result = await response.json();
        const filename = result.name;
        const subfolder = result.subfolder || '';
        
        this.state.uploadedImageFile = subfolder ? `${subfolder}/${filename}` : filename;
        const imageUrl = api.apiURL(`/view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=input`);
        this.updateImage(imageUrl);
        this.notifyStateChange();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    
    event.target.value = '';
  }
  
  setState(newState) {
    if (newState.azimuth !== undefined) {
      this.state.azimuth = newState.azimuth;
      this.liveAzimuth = newState.azimuth;
    }
    if (newState.elevation !== undefined) {
      this.state.elevation = newState.elevation;
      this.liveElevation = newState.elevation;
    }
    if (newState.distance !== undefined) {
      this.state.distance = newState.distance;
      this.liveDistance = newState.distance;
    }
    if (newState.imageUrl !== undefined) {
      this.state.imageUrl = newState.imageUrl;
      this.updateImage(newState.imageUrl);
    }
    this.updateVisuals();
    this.updateDisplay();
  }
  
  getState() {
    return { ...this.state };
  }
  
  getPrompt() {
    return this.generatePrompt();
  }
  
  updateImage(url) {
    if (url) {
      const img = new Image();
      if (!url.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        if (this.planeMat.map) {
          this.planeMat.map.dispose();
        }
        const tex = new THREE.Texture(img);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        this.planeMat.map = tex;
        this.planeMat.color.set(0xffffff);
        this.planeMat.needsUpdate = true;
        
        const ar = img.width / img.height;
        const maxSize = 1.5;
        let scaleX, scaleY;
        if (ar > 1) {
          scaleX = maxSize;
          scaleY = maxSize / ar;
        } else {
          scaleY = maxSize;
          scaleX = maxSize * ar;
        }
        this.imagePlane.scale.set(scaleX, scaleY, 1);
        this.imageFrame.scale.set(scaleX, scaleY, 1);
        this.requestRender();
      };
      
      img.onerror = () => {
        this.planeMat.map = null;
        this.planeMat.color.set(0xE93D82);
        this.planeMat.needsUpdate = true;
        this.requestRender();
      };
      
      img.src = url;
    } else {
      this.planeMat.map = null;
      this.planeMat.color.set(0x3a3a4a);
      this.planeMat.needsUpdate = true;
      this.imagePlane.scale.set(1, 1, 1);
      this.imageFrame.scale.set(1, 1, 1);
      this.requestRender();
    }
  }
  
  dispose() {
    if (this.animationId !== null) {
      try { window.cancelAnimationFrame(this.animationId); } catch (e) {}
      this.animationId = null;
    }
    try { this.renderer.dispose(); } catch (e) {}
    try { this.scene.clear(); } catch (e) {}
  }
}

// ============== ComfyUI Integration ==============
const widgetInstances = new Map();

function createCameraWidget(node) {
  const container = document.createElement('div');
  container.id = `synvow-multiangle-widget-${node.id}`;
  container.style.cssText = 'width:100%;height:100%;min-height:350px';
  
  const getWidgetValue = (name, defaultValue) => {
    const widget = node.widgets?.find(w => w.name === name);
    return widget ? Number(widget.value) : defaultValue;
  };
  
  const initialState = {
    azimuth: getWidgetValue('horizontal_angle', 0),
    elevation: getWidgetValue('vertical_angle', 0),
    distance: getWidgetValue('zoom', 5.0)
  };
  
  const widget = node.addDOMWidget('camera_preview', 'synvow-multiangle', container, {
    getMinHeight: () => 370,
    hideOnZoom: false,
    serialize: false
  });
  
  const uploadedImageWidget = node.addWidget('hidden', 'uploaded_image', '', () => {});
  
  setTimeout(() => {
    const cameraWidget = new CameraWidget({
      node,
      container,
      initialState,
      onStateChange: (state) => {
        const hWidget = node.widgets?.find(w => w.name === 'horizontal_angle');
        const vWidget = node.widgets?.find(w => w.name === 'vertical_angle');
        const zWidget = node.widgets?.find(w => w.name === 'zoom');
        
        if (hWidget) hWidget.value = state.azimuth;
        if (vWidget) vWidget.value = state.elevation;
        if (zWidget) zWidget.value = state.distance;
        if (state.uploadedImageFile) uploadedImageWidget.value = state.uploadedImageFile;
        
        app.graph?.setDirtyCanvas(true, true);
      }
    });
    
    widgetInstances.set(node.id, cameraWidget);
    
    const setupWidgetSync = (widgetName, cam) => {
      const w = node.widgets?.find(widget => widget.name === widgetName);
      if (w) {
        const origCallback = w.callback;
        w.callback = (value) => {
          if (origCallback) origCallback.call(w, value);
          if (widgetName === 'horizontal_angle') cam.setState({ azimuth: Number(value) });
          else if (widgetName === 'vertical_angle') cam.setState({ elevation: Number(value) });
          else if (widgetName === 'zoom') cam.setState({ distance: Number(value) });
        };
      }
    };
    
    setupWidgetSync('horizontal_angle', cameraWidget);
    setupWidgetSync('vertical_angle', cameraWidget);
    setupWidgetSync('zoom', cameraWidget);
  }, 100);
  
  widget.onRemove = () => {
    const cameraWidget = widgetInstances.get(node.id);
    if (cameraWidget) {
      cameraWidget.dispose();
      widgetInstances.delete(node.id);
    }
  };
  
  return { widget };
}

app.registerExtension({
  name: 'ComfyUI.SynvowMultiangle',
  
  nodeCreated(node) {
    if (node.constructor?.comfyClass !== 'SynvowMultiangleCameraNode') return;
    
    const [oldWidth, oldHeight] = node.size;
    node.setSize([Math.max(oldWidth, 350), Math.max(oldHeight, 520)]);
    createCameraWidget(node);
  }
});

// Listen for node execution to update 3D preview
api.addEventListener('executed', (event) => {
  const detail = event.detail;
  if (!detail?.node || !detail?.output) return;
  
  const nodeId = parseInt(detail.node, 10);
  const cameraWidget = widgetInstances.get(nodeId);
  if (!cameraWidget) return;
  
  const previewImage = detail.output?.preview_image;
  if (previewImage?.length > 0 && previewImage[0]) {
    const p = previewImage[0];
    const url = api.apiURL(
      `/view?filename=${encodeURIComponent(p.filename)}&subfolder=${encodeURIComponent(p.subfolder || '')}&type=${encodeURIComponent(p.type || 'temp')}&t=${Date.now()}`
    );
    cameraWidget.updateImage(url);
  }
});

export { CameraWidget };
