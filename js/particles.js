// 拡張パーティクルアニメーション
class Particle {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // オプションをデフォルト値とマージ
        this.options = Object.assign({
            count: 100,
            color: '#6c63ff',
            maxSize: 5,
            speed: 0.5,
            connectDistance: 150,
            connectWidth: 0.4,
            interactive: false
        }, options);
        
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        // テーマカラーマップ (Enhanced Modern Pastels)
        this.themeColors = {
            blue: 'rgba(139, 92, 246, 0.7)',
            cyan: 'rgba(59, 130, 246, 0.7)',
            purple: 'rgba(168, 85, 247, 0.7)',
            green: 'rgba(16, 185, 129, 0.7)',
            pink: 'rgba(236, 72, 153, 0.7)',
            orange: 'rgba(249, 115, 22, 0.7)',
            violet: 'rgba(196, 181, 253, 0.7)',
            emerald: 'rgba(110, 231, 183, 0.7)',
            red: 'rgba(248, 113, 113, 0.7)'
        };
        
        this.init();
        this.setupMouseInteraction();
        this.animate();
    }
    
    // マウスインタラクションの設定
    setupMouseInteraction() {
        if (this.options.interactive) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
        }
    }
    
    // テーマ変更機能
    updateTheme(themeName) {
        const newColor = this.themeColors[themeName] || this.options.color;
        this.particles.forEach(particle => {
            particle.color = newColor;
        });
        this.options.color = newColor;
    }
    
    // パーティクルの初期化
    init() {
        this.particles = []; // Reset particles
        for (let i = 0; i < this.options.count; i++) {
            const size = Math.random() * this.options.maxSize + 1;
            
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: size,
                originalSize: size,
                speedX: Math.random() * this.options.speed * 2 - this.options.speed,
                speedY: Math.random() * this.options.speed * 2 - this.options.speed,
                color: this.options.color,
                alpha: 0.8
            });
        }
    }
    
    // 描画ループ
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // パーティクルを描画
        this.particles.forEach(particle => {
            // マウスインタラクション
            if (this.options.interactive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    // マウスに近いパーティクルを大きくする
                    particle.size = particle.originalSize * (1 + (100 - distance) / 100);
                    particle.alpha = Math.min(1, 0.8 + (100 - distance) / 200);
                } else {
                    particle.size = particle.originalSize;
                    particle.alpha = 0.8;
                }
            }
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // アルファ値を考慮した色設定
            const color = particle.color.replace(/[\d\.]+\)$/g, `${particle.alpha})`);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            // グロー効果
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // パーティクルを移動
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 画面外に出たら反対側から再登場
            if (particle.x > this.width) particle.x = 0;
            else if (particle.x < 0) particle.x = this.width;
            
            if (particle.y > this.height) particle.y = 0;
            else if (particle.y < 0) particle.y = this.height;
        });
        
        // パーティクル同士を線で接続
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    
                    // 距離に応じて透明度を調整
                    const opacity = (1 - (distance / this.options.connectDistance)) * this.options.connectWidth;
                    const connectColor = this.options.color.replace(/[\d\.]+\)$/g, `${opacity})`);
                    this.ctx.strokeStyle = connectColor;
                    
                    this.ctx.lineWidth = this.options.connectWidth;
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(this.animate.bind(this));
    }
    
    // キャンバスのリサイズ
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.init(); // Reinitialize particles for new dimensions
    }
}
