// 雷达图绘制（纯 Canvas，不依赖第三方库）
window.RadarChart = (function() {
  /**
   * 绘制五维雷达图
   * @param {HTMLCanvasElement} canvas
   * @param {Object} scores  {S, E, D, M, A} 0-100
   * @param {Object} options
   */
  function draw(canvas, scores, options) {
    options = options || {};
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // 适配高分屏
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    const W = cssW, H = cssH;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) / 2 - 38;

    ctx.clearRect(0, 0, W, H);

    const dims = ['S', 'E', 'D', 'M', 'A'];
    const dimLabels = options.dimLabels || {
      S: '睡眠', E: '能量', D: '饮食', M: '情绪', A: '执行'
    };
    const n = dims.length;
    const angleStep = (Math.PI * 2) / n;
    // 起始角：从正上方开始
    const startAngle = -Math.PI / 2;

    const color = options.color || '#7B61FF';
    const gradient = options.gradient || null;

    // 绘制网格圆环 (5 圈)
    ctx.strokeStyle = 'rgba(180, 180, 200, 0.18)';
    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      const r = (radius * level) / 5;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = startAngle + i * angleStep;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 绘制轴线
    ctx.strokeStyle = 'rgba(180, 180, 200, 0.22)';
    for (let i = 0; i < n; i++) {
      const a = startAngle + i * angleStep;
      const x = cx + radius * Math.cos(a);
      const y = cy + radius * Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // 绘制数据多边形
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const dim = dims[i];
      const val = (scores[dim] || 0) / 100; // 0~1
      const r = radius * val;
      const a = startAngle + i * angleStep;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // 填充渐变
    if (gradient) {
      ctx.fillStyle = gradient;
    } else {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, hexToRgba(color, 0.35));
      grad.addColorStop(1, hexToRgba(color, 0.08));
      ctx.fillStyle = grad;
    }
    ctx.fill();

    // 描边
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制数据点
    for (let i = 0; i < n; i++) {
      const dim = dims[i];
      const val = (scores[dim] || 0) / 100;
      const r = radius * val;
      const a = startAngle + i * angleStep;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 绘制维度标签和分数
    ctx.fillStyle = '#444';
    ctx.font = '600 13px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < n; i++) {
      const dim = dims[i];
      const a = startAngle + i * angleStep;
      const labelR = radius + 22;
      const lx = cx + labelR * Math.cos(a);
      const ly = cy + labelR * Math.sin(a);

      // 维度名
      ctx.fillStyle = '#333';
      ctx.fillText(dimLabels[dim], lx, ly - 8);

      // 分数
      ctx.fillStyle = color;
      ctx.font = '700 14px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillText(scores[dim] || 0, lx, ly + 9);
      ctx.font = '600 13px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    }
  }

  function hexToRgba(hex, alpha) {
    // 支持 #RRGGBB
    if (hex.startsWith('rgb')) return hex;
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return { draw: draw };
})();
