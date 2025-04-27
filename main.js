// main.js - Main website interactive functionality

document.addEventListener('DOMContentLoaded', () => {
  // ナビゲーションリンクのスムーススクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 特徴カードのホバーエフェクト
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.background = 'linear-gradient(45deg, #f9f9f9, #e0ffe9)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.background = '#f9f9f9';
    });
  });
  
  // ギャラリー画像のホバーエフェクト
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    const cyberImage = item.querySelector('.cyber-image');
    
    item.addEventListener('mouseenter', () => {
      cyberImage.style.transform = 'scale(1.1)';
    });
    
    item.addEventListener('mouseleave', () => {
      cyberImage.style.transform = 'scale(1)';
    });
  });
  
  // テキストグリッチエフェクト（ヒーローセクション）
  const heroTitle = document.querySelector('.hero-content h2');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    
    heroTitle.addEventListener('mouseenter', () => {
      let iterations = 0;
      
      const glitchEffect = setInterval(() => {
        heroTitle.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join('');
          
        if (iterations >= originalText.length) {
          clearInterval(glitchEffect);
          heroTitle.textContent = originalText;
        }
        
        iterations += 1/3;
      }, 30);
    });
  }
  
  // ダウンロードボタンのクリックイベント
  const downloadButtons = document.querySelectorAll('.download-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // モックの進行ダイアログを表示
      const platform = button.textContent;
      alert(`${platform}のダウンロードを開始します。これはデモサイトですので、実際のダウンロードは行われません。`);
      
      // ボタンをアクティブ状態に
      button.style.background = '#00ff6a';
      button.style.color = '#111';
      
      // 3秒後に元に戻す
      setTimeout(() => {
        button.style.background = 'rgba(0, 255, 106, 0.2)';
        button.style.color = '#00ff6a';
      }, 3000);
    });
  });
});
