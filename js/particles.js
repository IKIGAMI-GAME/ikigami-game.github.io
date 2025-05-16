// パーティクルアニメーション
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
            connectWidth: 0.4
        }, options);
        
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        
        this.init();
        this.animate();
    }
    
    // パーティクルの初期化
    init() {
        for (let i = 0; i < this.options.count; i++) {
            const size = Math.random() * this.options.maxSize + 1;
            
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: size,
                speedX: Math.random() * this.options.speed * 2 - this.options.speed,
                speedY: Math.random() * this.options.speed * 2 - this.options.speed,
                color: this.options.color
            });
        }
    }
    
    // 描画ループ
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // パーティクルを描画
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
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
                    const opacity = 1 - (distance / this.options.connectDistance);
                    this.ctx.strokeStyle = this.options.color.replace('rgb', 'rgba').replace(')', `, ${opacity * this.options.connectWidth})`);
                    
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
    }
}
