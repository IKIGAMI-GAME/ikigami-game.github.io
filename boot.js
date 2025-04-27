// boot.js
window.addEventListener("load", () => {
  const overlay = document.getElementById("crt-overlay");
  const pre = document.getElementById("boot-text");

  // ブートメッセージ
  const lines = [
    "IKIGAMI BIOS v2.42 (c) 2099 NAGI Corp.",
    "Initializing cognitive substrate...",
    "Loading spiritual kernel modules........ [ OK ]",
    "Decrypting existential layers... [ DONE ]",
    "Synchronizing with meta-consciousness...",
    "Establishing soul-to-shell handshake... [ CONNECTED ]",
    "Accessing Sim-Reality Node #3...",
    "Authentication token verified.",
    "Initializing reality parameters... [ OK ]",
    "Virtual identity signature confirmed.",
    "Waking caretaker routines...",
    "Soul integrity check... [ PASSED ]",
    "Purpose link established. Enjoy your existence."
  ];

  // 固定行分だけ空行を用意
  const total = lines.length;
  let buffer = Array(total).fill("");
  pre.textContent = buffer.join("\n");

  // 起動音を再生
  const bootSound = new Audio('https://cdn.freesound.org/previews/220/220173_4100539-lq.mp3');
  bootSound.volume = 0.3;
  bootSound.play();

  overlay.classList.remove("hidden");

  // CRTウォームアップエフェクト
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = "1";
    
    // 画面のちらつき
    setTimeout(() => {
      overlay.classList.add("crt-on");
      
      let line = 0, char = 0;
      const blankLines = Array(total).fill("").map(() => " ".repeat(40)); // 空行を埋める
      pre.textContent = blankLines.join("\n");
      
      // タイプライター効果
      function type() {
        if (line < total) {
          // タイプ音
          if (Math.random() > 0.7) {
            const typeSound = new Audio('https://cdn.freesound.org/previews/521/521947_7742129-lq.mp3');
            typeSound.volume = 0.05;
            typeSound.play();
          }
          
          buffer[line] += lines[line][char++] || "";
          pre.textContent = buffer.join("\n");
          if (char === lines[line].length) {
            line++; char = 0;
            // 行の完了音
            if (line % 3 === 0) {
              const beepSound = new Audio('https://cdn.freesound.org/previews/399/399934_5121236-lq.mp3');
              beepSound.volume = 0.1;
              beepSound.play();
            }
          }
          const speed = 20 + Math.random() * 50;
          setTimeout(type, speed); // 変化するタイピング速度
        } else {
          // 完了したら「ぷつん」とカット
          setTimeout(() => {
            const shutdownSound = new Audio('https://cdn.freesound.org/previews/277/277021_5150972-lq.mp3');
            shutdownSound.volume = 0.3;
            shutdownSound.play();
            overlay.classList.add("cut");            setTimeout(() => {
              overlay.style.transition = "opacity 1s ease";
              overlay.style.opacity = "0";
              setTimeout(() => {
                overlay.remove();
                // window.location.href = "index.html" の行を削除
                // 既にindex.htmlにいるのでリロードは不要
              }, 1000);
            }, 300);
          }, 1000);
        }
      }
      
      // 少し遅延してから開始
      setTimeout(type, 800);
    }, 500);
  }, 300);
});
