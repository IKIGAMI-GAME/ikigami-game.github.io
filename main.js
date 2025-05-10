// ヒーローセクション Three.js パーティクル＋グロー
(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) {
    console.error("Canvas要素が見つかりません");
    return;
  }

  console.log("地球モデルの初期化開始");

  // サイズ設定
  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // 初期化時にも呼び出す

  // シーン・カメラ・レンダラー
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 16;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000510, 0.2); // より深い宇宙空間の色に変更
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // パフォーマンス向上のためにピクセル比を制限
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  
  // HDRレンダリングを有効化（より鮮明な画質）
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  
  // OrbitControls - インタラクティブな回転操作を追加
  let controls;
  try {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true; // アニメーションをスムーズにする
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 25;
    controls.autoRotate = false; // 自動回転はオフ（ユーザー操作優先）
    
    console.log("OrbitControls 初期化成功");
  } catch (e) {
    console.error("OrbitControls 初期化エラー:", e);
  }
  
  // テクスチャーローダーの準備
  const textureLoader = new THREE.TextureLoader();
  const texturePath = './assets/textures/';
  
  // テクスチャ読み込みのデバッグ情報
  console.log("テクスチャパス:", texturePath);

  // 背景に星空を追加（より綺麗な星空）
  const starCount = 8000; // 星の数を増やす
  const starsGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);
  const starColors = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // 星をランダムな位置に配置（球体の内側）
    const radius = 40 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi);
    
    // 星のサイズをランダムに（より多様なサイズ）
    starSizes[i] = Math.random() * 2.5 + 0.1;
    
    // 星の色をランダムに（青・白・黄色の色合い）
    const colorChoice = Math.random();
    if (colorChoice > 0.95) { // 青っぽい星（少数）
      starColors[i3] = 0.6 + Math.random() * 0.2;
      starColors[i3 + 1] = 0.7 + Math.random() * 0.3;
      starColors[i3 + 2] = 0.9 + Math.random() * 0.1;
    } else if (colorChoice > 0.9) { // 黄色っぽい星（少数）
      starColors[i3] = 0.9 + Math.random() * 0.1;
      starColors[i3 + 1] = 0.9 + Math.random() * 0.1;
      starColors[i3 + 2] = 0.6 + Math.random() * 0.2;
    } else { // 白っぽい星（多数）
      const brightness = 0.8 + Math.random() * 0.2;
      starColors[i3] = brightness;
      starColors[i3 + 1] = brightness;
      starColors[i3 + 2] = brightness + Math.random() * 0.1;
    }
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  
  // 星のシェーダーマテリアル - より美しいパーティクル表現のために
  const starsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: createCircleTexture() }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // カスタム円形テクスチャを作成（星用）
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    // 外側に行くほど透明になるグラデーション
    const gradient = context.createRadialGradient(
      32, 32, 0, 32, 32, 32
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.3)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // 環境マップの作成 - 地球表面での反射に使用
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
  cubeRenderTarget.texture.type = THREE.HalfFloatType;
  const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
  scene.add(cubeCamera);

  // 一時的なテクスチャを作成（実際のテクスチャがロードされるまで使用）
  const createTemporaryTexture = (color) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 2, 2);
    return new THREE.CanvasTexture(canvas);
  };

  // 地球本体（リアルな地球テクスチャを使用）
  const earthRadius = 3.2;
  // デフォルトのテクスチャ（ロード中に表示）
  const defaultEarthMap = createTemporaryTexture('#11336f'); // 暗めの青に変更
  const defaultNormalMap = createTemporaryTexture('#8888ff');
  const defaultSpecMap = createTemporaryTexture('#ffffff');
  const defaultCloudsMap = createTemporaryTexture('#ffffff');
  const defaultNightMap = createTemporaryTexture('#001133');

  // 地球マテリアル（高品質設定）
  const earthMat = new THREE.MeshPhysicalMaterial({ // MeshPhysicalMaterialに変更（より物理ベースのレンダリング）
    map: defaultEarthMap,
    normalMap: defaultNormalMap,
    normalScale: new THREE.Vector2(0.15, 0.15), // 凹凸をより強調
    specularMap: defaultSpecMap,
    specularIntensity: 0.3, // 海の反射を適度に
    roughness: 0.65, // 陸地を荒く、海を滑らかに
    metalness: 0.05, // 微小な金属感
    clearcoat: 0.2, // 薄いコーティング（海面効果）
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.6,
    bumpScale: 0.05, // 凹凸をより強調
  });
  
  const earthGeo = new THREE.SphereGeometry(earthRadius, 192, 192); // ポリゴン数を増加
  const earth = new THREE.Mesh(earthGeo, earthMat);
  earth.rotation.y = Math.PI;  // 初期の向き調整
  earth.rotation.z = THREE.MathUtils.degToRad(23.5); // 地球の公転軸を再現

  // 地球の位置を中心に設定
  earth.position.set(0, 0, 0);
  
  // 夜のライト用レイヤー
  const nightMat = new THREE.MeshBasicMaterial({
    map: defaultNightMap,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  const nightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius + 0.01, 192, 192), // ポリゴン数を増加
    nightMat
  );
  earth.add(nightSphere);

  // 雲レイヤー（半透明）
  const cloudMat = new THREE.MeshStandardMaterial({
    map: defaultCloudsMap,
    transparent: true,
    opacity: 0.6,
    blending: THREE.NormalBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    roughness: 0.9, // 雲の質感
    metalness: 0.0
  });
  
  const cloudGeo = new THREE.SphereGeometry(earthRadius * 1.02, 128, 128); // ポリゴン数を増加
  const clouds = new THREE.Mesh(cloudGeo, cloudMat);
  clouds.rotation.z = THREE.MathUtils.degToRad(23.5); // 地球の公転軸に合わせる

  // 大気のグロー効果（より美しく改良）
  const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.18, 128, 128);
  const atmosphereMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x5A8FDC) }, // より自然な青に変更
      viewVector: { value: camera.position },
      c: { value: 0.2 },
      p: { value: 3.8 }
    },
    vertexShader: `
      uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      varying float intensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        intensity = pow(c - dot(vNormal, vNormel), p);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() {
        vec3 glow = glowColor * intensity;
        gl_FragColor = vec4(glow, 1.0);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  
  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  atmosphere.rotation.z = THREE.MathUtils.degToRad(23.5); // 地球の公転軸に合わせる

  // テクスチャを順次ロード
  const loadTexture = (url, onLoad) => {
    if (!url) return null;
    
    return textureLoader.load(
      url, 
      texture => {
        console.log(`テクスチャ読み込み成功: ${url}`);
        if (onLoad) onLoad(texture);
      }, 
      // プログレスコールバック（ロード中）
      progress => {
        console.log(`テクスチャロード中 ${url}: ${Math.round(progress.loaded / progress.total * 100)}%`);
      }, 
      // エラーコールバック
      err => {
        console.error(`テクスチャ読み込み失敗 ${url}:`, err);
        // エラー時のフォールバック処理を追加
        if (url.includes('earth_daymap') && onLoad) {
          // 昼テクスチャが読み込めない場合のフォールバック処理
          console.log("昼テクスチャのフォールバック処理を実行");
          // 単色の青い地球を作成
          const fallbackTexture = createTemporaryTexture('#0066aa');
          onLoad(fallbackTexture);
        }
      }
    );
  };

  // 地球テクスチャを非同期にロード
  // デバッグ用に各ファイルの存在を確認
  console.log("読み込むテクスチャファイル:");
  console.log(" - Day Map: " + texturePath + 'earth_daymap.jpg');
  console.log(" - Night Map: " + texturePath + 'earth_nightmap.jpg');
  console.log(" - Clouds: " + texturePath + 'earth_clouds.png');
  console.log(" - Normal Map: " + texturePath + 'earth_normal.jpg');
  console.log(" - Specular Map: " + texturePath + 'earth_specular.jpg');

  // 地球テクスチャの読み込みカウンター
  let loadedTextureCount = 0;
  const totalTextures = 4; // 読み込むテクスチャの総数
  
  // 全テクスチャ読み込み完了時のコールバック
  const checkAllTexturesLoaded = () => {
    loadedTextureCount++;
    console.log(`テクスチャ読み込み進捗: ${loadedTextureCount}/${totalTextures}`);
    
    if (loadedTextureCount >= totalTextures) {
      console.log("全テクスチャの読み込みが完了しました");
      
      // 必要に応じて何か処理を行う
      // 例: ローディング表示を非表示にする
      const loadingScreen = document.querySelector('.loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('loaded');
      }
      
      // セッションストレージにフラグを保存（リロード時のフラッシュを防ぐ）
      try {
        sessionStorage.setItem('earthModelLoaded', 'true');
      } catch (e) {
        console.warn('セッションストレージへの保存に失敗:', e);
      }
    }
  };

  // Day Map (地球の昼テクスチャ)
  loadTexture(texturePath + 'earth_daymap.jpg', texture => {
    console.log("Day Map ロード成功");
    texture.colorSpace = THREE.SRGBColorSpace;
    // テクスチャ品質向上
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthMat.map = texture;
    earthMat.needsUpdate = true;
    checkAllTexturesLoaded();
  });

  // Normal Map (凹凸マップ) - 存在しない場合はスキップ
  try {
    loadTexture(texturePath + 'earth_normal.jpg', texture => {
      console.log("Normal Map ロード成功");
      // テクスチャ品質向上
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      earthMat.normalMap = texture;
      earthMat.needsUpdate = true;
      checkAllTexturesLoaded();
    });
  } catch (e) {
    console.log("Normal Map ロードをスキップ: ", e);
    checkAllTexturesLoaded(); // スキップしても読み込みカウントを増やす
  }

  // Specular Map (反射マップ) - 存在しない場合はスキップ
  try {
    loadTexture(texturePath + 'earth_specular.jpg', texture => {
      console.log("Specular Map ロード成功");
      // テクスチャ品質向上
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      earthMat.specularMap = texture;
      earthMat.needsUpdate = true;
      checkAllTexturesLoaded();
    });
  } catch (e) {
    console.log("Specular Map ロードをスキップ: ", e);
    
    // スペキュラーマップが存在しない場合、海と陸地の反射率を調整するための簡易マップを生成
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // デイマップからテクスチャを取得して青い部分（海）を検出し、反射率を設定
    if (earthMat.map && earthMat.map.image) {
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(earthMat.map.image, 0, 0, canvas.width, canvas.height);
        
        const imgData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const specData = ctx.createImageData(canvas.width, canvas.height);
        const specPixels = specData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          // 青みが強いピクセルを水域と判断
          const isWater = data[i + 2] > data[i] * 1.3 && data[i + 2] > data[i + 1] * 1.3;
          
          // 水域は反射率が高い（白）、陸地は反射率が低い（暗い）
          const value = isWater ? 220 : 40;
          specPixels[i] = specPixels[i + 1] = specPixels[i + 2] = value;
          specPixels[i + 3] = 255;
        }
        
        ctx.putImageData(specData, 0, 0);
        
        const specularMap = new THREE.CanvasTexture(canvas);
        specularMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
        earthMat.specularMap = specularMap;
        earthMat.needsUpdate = true;
        console.log("簡易スペキュラーマップを生成しました");
      } catch (err) {
        console.error("簡易スペキュラーマップの生成に失敗しました:", err);
      }
    }
    
    checkAllTexturesLoaded(); // 生成が成功しても失敗しても読み込みカウントを増やす
  }

  // Clouds (雲テクスチャ)
  loadTexture(texturePath + 'earth_clouds.png', texture => {
    console.log("Clouds ロード成功");
    // テクスチャ品質向上
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    cloudMat.map = texture;
    cloudMat.needsUpdate = true;
    checkAllTexturesLoaded();
  });

  // Night Map (夜のライトマップ)
  loadTexture(texturePath + 'earth_nightmap.jpg', texture => {
    console.log("Night Map ロード成功");
    // テクスチャ品質向上
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.colorSpace = THREE.SRGBColorSpace;
    nightMat.map = texture;
    nightMat.needsUpdate = true;
    // 夜のマップはオプションなのでカウントには含めない
  });

  // ライト設定
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2); // 太陽光を少し強く
  sunLight.position.set(5, 2, 5);
  sunLight.castShadow = true; // 影を有効化
  scene.add(sunLight);
  
  // 環境光（暗すぎないように）
  const ambientLight = new THREE.AmbientLight(0x404050, 0.5); // 青みがかった暗い光
  scene.add(ambientLight);
  
  // 夜側に微かな青い光を追加（より美しい夜側の演出）
  const nightLight = new THREE.DirectionalLight(0x103080, 0.15);
  nightLight.position.set(-5, -2, -5);
  scene.add(nightLight);

  // シーンに追加
  scene.add(earth);
  scene.add(clouds);
  scene.add(atmosphere);

  // Post-processing effects (グロー効果)
  let composer;
  try {
    composer = new THREE.EffectComposer(renderer);
    const renderScene = new THREE.RenderPass(scene, camera);
    
    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      0.6,  // strength - 少し控えめに
      0.4,  // radius - 広めに
      0.4   // threshold - 閾値を下げて広く
    );
    
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    console.log("ポストプロセスエフェクト初期化成功");
  } catch (e) {
    console.warn('Post-processing not available:', e);
    composer = null;
  }

  // マウスでカメラ回転 (OrbitControlsと併用しない場合のみ)
  let mouseX = 0, mouseY = 0;
  if (!controls) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
  }

  // アニメーション
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.0015;

    // OrbitControlsの更新
    if (controls) {
      controls.update();
    }

    // 地球の自転（少しスムーズに）
    earth.rotation.y += 0.0012;
    clouds.rotation.y += 0.0016; // 雲は地球より少し早く回転
    
    // 星の明滅効果
    if (Math.random() > 0.99) {
      const starIndex = Math.floor(Math.random() * starCount);
      if (starSizes.array) {
        starSizes.array[starIndex] = Math.random() * 3 + 0.5;
        starsGeometry.attributes.size.needsUpdate = true;
      }
    }
    
    // 昼と夜の切り替え効果
    // 太陽の方向を変更して昼夜の移り変わりを表現
    const sunAngle = time * 0.15; // 少しゆっくりに
    sunLight.position.set(
      Math.cos(sunAngle) * 5,
      2,
      Math.sin(sunAngle) * 5
    );
    
    // 夜のライトの透明度を太陽の位置に合わせて変更
    const nightSide = (1 - Math.sin(sunAngle)) * 0.5;
    nightMat.opacity = nightSide * 0.9; // 少し強めに
    
    // 反対側の光源も移動
    nightLight.position.set(
      -Math.cos(sunAngle) * 5,
      -2,
      -Math.sin(sunAngle) * 5
    );
    
    // OrbitControlsがない場合のみ、マウス追従カメラ
    if (!controls) {
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
    }

    // 環境キューブマップの更新
    cubeCamera.update(renderer, scene);
    
    // 大気のグロー効果を更新
    atmosphereMat.uniforms.viewVector.value = new THREE.Vector3().subVectors(
      camera.position,
      atmosphere.position
    );
    
    // レンダラーのサイズ更新
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      if (composer) {
        composer.setSize(canvas.clientWidth, canvas.clientHeight);
      }
    }
    
    // レンダリング
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }
  
  // アニメーション開始
  animate();
  
  console.log("地球モデルの初期化完了");
})();

// 特徴セクション 各feature-canvasに3Dエフェクト
function featureEffect(canvasId, type) {
  const container = document.getElementById(canvasId);
  if (!container) return;
  const width = container.clientWidth || 80;
  const height = container.clientHeight || 80;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10);
  camera.position.z = 2.5;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x181a20, 0.0);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  let mesh;
  if (type === 'cube') {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x3bbaff, metalness: 0.7, roughness: 0.3 });
    mesh = new THREE.Mesh(geometry, material);
  } else if (type === 'sphere') {
    const geometry = new THREE.SphereGeometry(0.7, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xff3b3b, metalness: 0.5, roughness: 0.4 });
    mesh = new THREE.Mesh(geometry, material);
  } else {
    const geometry = new THREE.TorusKnotGeometry(0.6, 0.18, 80, 12);
    const material = new THREE.MeshStandardMaterial({ color: 0x7fff7f, metalness: 0.6, roughness: 0.3 });
    mesh = new THREE.Mesh(geometry, material);
  }
  scene.add(mesh);

  // ライト
  const light1 = new THREE.PointLight(0xffffff, 0.8);
  light1.position.set(2, 2, 3);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xff3b3b, 0.5);
  light2.position.set(-2, -2, 2);
  scene.add(light2);

  // アニメーション
  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.012;
    mesh.rotation.y += 0.018;
    renderer.render(scene, camera);
  }
  animate();
}

window.addEventListener('DOMContentLoaded', () => {
  // Apple風スクロールアニメーション
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });
  reveals.forEach(el => observer.observe(el));

  featureEffect('feature1', 'cube');    // FPS/TPS切替
  featureEffect('feature2', 'sphere');  // 多彩なアクション
  featureEffect('feature3', 'torus');   // 成長とカスタマイズ
  
  // ページ内リンクのスムーススクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // ヘッダーの高さを考慮
          behavior: 'smooth'
        });
      }
    });
  });
});
