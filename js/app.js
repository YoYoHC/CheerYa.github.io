// 抗衰人格测试 - 主控制器
// 屏幕状态机：welcome → quiz → result → detail
// 5 个 step 容器，对应 4 个页面

(function() {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  // 应用状态
  const state = {
    currentQ: 0,           // 当前题目索引 (0-30)
    answers: {},           // {qid: {dim, score, value}}
    result: null,          // 分析结果
    busy: false            // 防止自动推进中的快速连点
  };

  // 3D 悬浮 tilt：鼠标在卡牌上移动，旋转角跟随
  function attachTilt(el) {
    const max = 10; // 度
    function onMove(e) {
      if (el.classList.contains('flipping')) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0..1
      const y = (e.clientY - rect.top) / rect.height;  // 0..1
      const rx = (0.5 - y) * max;  // 上下倾斜
      const ry = (x - 0.5) * max;  // 左右倾斜
      el.style.setProperty('--tilt-x', rx.toFixed(2) + 'deg');
      el.style.setProperty('--tilt-y', ry.toFixed(2) + 'deg');
    }
    function onLeave() {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    // 触摸设备：用 gyroscope-like 中心点轻动
    el.addEventListener('touchstart', onMove, { passive: true });
  }

  // Fisher-Yates 洗牌：用于随机选项顺序
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 题目顺序：Q1-Q30 + Q31
  // 默认顺序，但 Q31 在选择 Q30 后才"显现"

  // =================== 屏幕切换 ===================
  function showScreen(name) {
    $$('.screen').forEach(el => el.classList.remove('active'));
    const target = $('.screen[data-screen="' + name + '"]');
    if (target) target.classList.add('active');
    // 滚动到顶
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // =================== 欢迎页 ===================
  function bindWelcome() {
    $('#btn-start').addEventListener('click', () => {
      state.currentQ = 0;
      state.answers = {};
      state.result = null;
      // 重新生成所有题的选项随机顺序（反作弊 / 防选项位置偏差）
      // 注意：标签 A/B/C/D 固定到位置（位置感强），只打乱选项内容
      state.shuffled = {};
      window.QUESTIONS.forEach(q => {
        const shuffled = shuffle(q.options);
        shuffled.forEach((o, i) => { o.label = String.fromCharCode(65 + i); });
        state.shuffled[q.id] = shuffled;
      });
      renderQuestion();
      showScreen('quiz');
    });
  }

  // =================== 翻牌光效 ===================
  function triggerRevealBurst(rarity) {
    const burst = document.createElement('div');
    burst.className = 'reveal-burst';
    if (rarity === 'myth') {
      burst.classList.add('gold');
      // 加金色粒子
      const partWrap = document.createElement('div');
      partWrap.className = 'reveal-particles';
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'p';
        p.style.left = (40 + Math.random() * 20) + '%';
        p.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
        p.style.animationDelay = (Math.random() * 0.3) + 's';
        partWrap.appendChild(p);
      }
      document.body.appendChild(partWrap);
      setTimeout(() => partWrap.remove(), 2200);
    } else if (rarity === 'hidden') {
      burst.classList.add('purple');
    } else {
      burst.classList.add('white');
    }
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1500);
  }

    // =================== 测试题 ===================
  function renderQuestion() {
    const idx = state.currentQ;
    // Q31 是隐藏题，序号显示为「隐藏题」+ 小红点
    const isHidden = idx === 30; // 第 31 题
    const q = window.QUESTIONS[idx];
    const total = 30; // 用户感知总题数
    const displayNum = isHidden ? '?' : (idx + 1);

    // 进度
    const answeredCount = Object.keys(state.answers).filter(k => k !== '31').length;
    const progressPct = (answeredCount / total) * 100;
    $('#progress-bar').style.width = progressPct + '%';
    $('#progress-text').textContent = isHidden
      ? '最后一道隐藏题'
      : `第 ${displayNum} / ${total} 题`;

    // 渲染题目
    $('#q-category').textContent = isHidden ? '✨ 隐藏判定' : q.category;
    $('#q-category').className = 'q-category' + (isHidden ? ' is-hidden' : '');
    $('#q-text').textContent = q.text;

    // 选项（使用预打乱顺序：同一次测试一致，重复测试会重洗，反作弊）
    const list = $('#q-options');
    list.innerHTML = '';
    const opts = state.shuffled[q.id] || q.options;
    const prevAnswer = state.answers[q.id];
    // 找到已选答案在 opts 里的位置（用 score 或 value 匹配）
    let selectedIdx = -1;
    if (prevAnswer) {
      selectedIdx = opts.findIndex(o => {
        if (q.isHidden) return o.value === prevAnswer.value;
        return o.score === prevAnswer.score;
      });
      // 兜底：按 label 匹配
      if (selectedIdx < 0 && prevAnswer.label) {
        selectedIdx = opts.findIndex(o => o.label === prevAnswer.label);
      }
    }
    opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.type = 'button';
      btn.style.animationDelay = (i * 0.05) + 's';
      if (i === selectedIdx) btn.classList.add('selected');
      btn.innerHTML = `
        <span class="opt-label">${opt.label}</span>
        <span class="opt-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => onSelectOption(opt, btn));
      list.appendChild(btn);
    });

    // 控制"上一题"按钮：Q1 不显示
    const prevBtn = $('#btn-prev');
    prevBtn.style.display = state.currentQ > 0 ? 'inline-flex' : 'none';
  }

  function onSelectOption(opt, btn) {
    // 拒绝重复点击
    if (state.busy) return;
    state.busy = true;

    // 高亮当前选项
    document.querySelectorAll('#q-options .option-btn').forEach(b => {
      b.classList.remove('selected');
    });
    btn.classList.add('selected');

    const q = window.QUESTIONS[state.currentQ];
    if (!q) return;
    const answer = q.isHidden
      ? { dim: q.dim, value: opt.value, label: opt.label }
      : { dim: q.dim, score: opt.score, label: opt.label };
    state.answers[q.id] = answer;

    // 选完短暂停顿 → 自动进入下一题（最后一题直接出结果）
    setTimeout(() => {
      state.busy = false;
      state.currentQ++;
      if (state.currentQ >= window.QUESTIONS.length) {
        finishTest();
      } else {
        renderQuestion();
      }
    }, 280);
  }

  function goPrev() {
    if (state.busy) return;
    if (state.currentQ <= 0) return;
    state.currentQ--;
    renderQuestion();
  }

  function finishTest() {
    state.result = window.TestEngine.analyze(state.answers);
    // 直接进结果页
    renderResult();
    showScreen('result');
  }

  // =================== 结果页（一级） ===================
  function renderResult() {
    const r = state.result;
    const p = window.PERSONALITIES[r.personalityId];

    // 主题色应用到容器
    const root = $('#screen-result');
    root.style.setProperty('--p-color', p.color);
    root.style.setProperty('--p-gradient', p.gradient);

    // 类型徽章：翻牌前不暴露稀有度，统一显示
    const badge = $('#result-badge');
    badge.className = 'badge badge-sealed';
    badge.innerHTML = '✦ 翻卡揭晓你的人格';
    state.badgeText = r.isMyth
      ? '👑 恭喜解锁神话人格'
      : r.isHidden
        ? '🎉 恭喜解锁隐藏人格'
        : '✦ 解锁你的抗衰人格';
    state.badgeClass = r.isMyth
      ? 'badge badge-myth'
      : r.isHidden
        ? 'badge badge-hidden'
        : 'badge badge-regular';

    // 大图标 + 名称
    $('#result-icon').textContent = p.icon;
    $('#result-name').textContent = p.name;
    $('#result-title').textContent = p.title;
    $('#result-comment').textContent = p.comment;

    // 匹配度
    $('#result-match').textContent = r.matchScore + '%';
    $('#result-match-label').textContent = r.isMyth ? '神话降临' : (r.isHidden ? '隐藏达成' : '人格匹配度');

    // 标签
    const tags = $('#result-tags');
    tags.innerHTML = '';
    p.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });

    // 启动入口：点击卡片
    const cardEl = $('#card-entry');
    cardEl.classList.remove('is-flipped', 'is-myth', 'is-hidden', 'flipping');
    if (r.rarity === 'myth') cardEl.classList.add('is-myth');
    else if (r.rarity === 'hidden') cardEl.classList.add('is-hidden');

    // 绑定 3D tilt
    attachTilt(cardEl);

    // 点击逻辑：
    //   卡背状态 → 翻牌
    //   卡正状态 → 进详情
    cardEl.onclick = () => {
      if (cardEl.classList.contains('flipping')) return;
      if (!cardEl.classList.contains('is-flipped')) {
        // 翻牌：移除 tilt 效果（避免悬浮时翻牌抖），重置为水平
        cardEl.style.setProperty('--tilt-x', '0deg');
        cardEl.style.setProperty('--tilt-y', '0deg');
        cardEl.classList.add('flipping');
        cardEl.classList.add('is-flipped');
        // 翻牌瞬间：徽章才揭晓稀有度
        if (state.badgeText) {
          badge.className = state.badgeClass;
          badge.innerHTML = state.badgeText;
        }
        // 翻牌瞬间按稀有度触发全屏光效
        triggerRevealBurst(r.rarity);
        setTimeout(() => cardEl.classList.remove('flipping'), 950);
        return;
      }
      // 已翻牌：进详情
      renderDetail();
      showScreen('detail');
    };

    // 抽卡不动效：等用户点击卡背才开始翻转
  }

  // =================== 详情页（二级） ===================
  function renderDetail() {
    const r = state.result;
    const p = window.PERSONALITIES[r.personalityId];

    const root = $('#screen-detail');
    root.style.setProperty('--p-color', p.color);
    root.style.setProperty('--p-gradient', p.gradient);

    // Hero
    $('#detail-icon').textContent = p.icon;
    $('#detail-name').textContent = p.name;
    $('#detail-title').textContent = p.title;

    // 模块 1: 人格描述
    const descEl = $('#detail-desc');
    descEl.innerHTML = p.desc.map(line => `<p>${escapeHtml(line)}</p>`).join('');

    // 模块 2: 抗衰潜力
    $('#detail-potential-stars').textContent = p.potential;
    $('#detail-potential-text').innerHTML = p.truth
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `<p>${escapeHtml(line)}</p>`)
      .join('');

    // 模块 3: 数据页（默认折叠）
    renderData();

    // 重绑按钮
    $('#btn-data-toggle').onclick = () => {
      const panel = $('#data-panel');
      const expanded = panel.classList.toggle('open');
      $('#btn-data-toggle').classList.toggle('open', expanded);
      if (expanded) {
        // 重新画雷达图（确保尺寸已稳定）
        setTimeout(() => drawRadar(), 50);
      }
    };

    $('#btn-restart').onclick = () => {
      showScreen('welcome');
    };
  }

  // =================== 数据页（三级） ===================
  function renderData() {
    const r = state.result;
    const p = window.PERSONALITIES[r.personalityId];

    // 维度列表
    const list = $('#data-dim-list');
    list.innerHTML = '';
    ['S', 'E', 'D', 'M', 'A'].forEach(d => {
      const score = r.scores[d];
      const name = window.TestEngine.DIM_NAMES[d];
      const row = document.createElement('div');
      row.className = 'dim-row';
      row.innerHTML = `
        <div class="dim-row-label">${name}</div>
        <div class="dim-row-bar"><div class="dim-row-fill" style="width:0%; background:${p.color}"></div></div>
        <div class="dim-row-score">${score}</div>
      `;
      list.appendChild(row);
      // 动画
      requestAnimationFrame(() => {
        setTimeout(() => {
          row.querySelector('.dim-row-fill').style.width = score + '%';
        }, 50);
      });
    });

    // 占比
    const dist = window.PERSONALITY_DISTRIBUTION[r.personalityId] || 0;
    $('#data-distribution').textContent = dist + '%';
  }

  function drawRadar() {
    const r = state.result;
    const p = window.PERSONALITIES[r.personalityId];
    const canvas = $('#radar-canvas');
    if (!canvas) return;
    // 确保 canvas 父元素有宽度
    canvas.style.width = '100%';
    canvas.style.height = '320px';
    canvas.clientWidth = canvas.parentElement.clientWidth;
    canvas.clientHeight = 320;

    // 生成渐变填充
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, canvas.clientWidth, canvas.clientHeight);
    grad.addColorStop(0, p.color + '55');
    grad.addColorStop(1, p.color + '11');

    window.RadarChart.draw(canvas, r.scores, {
      color: p.color,
      gradient: grad,
      dimLabels: window.TestEngine.DIM_NAMES
    });
  }

  // =================== 工具 ===================
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // =================== 启动 ===================
  document.addEventListener('DOMContentLoaded', () => {
    bindWelcome();
    // 绑定测试题页"上一题"按钮
    const prevBtn = $('#btn-prev');
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    showScreen('welcome');
  });

  // 暴露给外部（可选）
  window.__app = { state, showScreen };
})();
