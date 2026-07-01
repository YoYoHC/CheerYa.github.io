/* 抗衰自测 · 主逻辑
   ------------------------------------------------------------------
   整体设计：
   - "信息收集" 与 "问卷" 走完全相同的交互：每屏只问一项
   - 选项/输入点完 → 350ms 后自动进入下一题（最后一题后生成报告）
   - 始终在屏幕底部留一个"返回上一题"按钮，方便修改
   - 删除了"下一步 / 开始答题"等按钮，避免割裂感
*/

const state = {
  /* profile: {gender, age, height, weight} */
  profile: {},
  /* answers[i] = 选项索引（null 表示未答） */
  answers: new Array(QUESTIONS.length).fill(null),
  /* 当前 step：0..3 是信息收集，4..23 是问卷，24 是结果 */
  step: 0,
  /* 自动跳转的 timer 句柄，便于取消 */
  _auto: null,
};

const STEPS = [
  ...PROFILE_STEPS,
  ...QUESTIONS.map(q=>({ kind: "choice", title: q.q, opts: q.opts.map(o=>({ t:o.t, s:o.s })) })),
];

/* =========================================================
   路由
   ========================================================= */
function show(id){
  ["page-home","page-session","page-loading","page-result"]
    .forEach(p=>document.getElementById(p).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  document.getElementById("stage").scrollTop = 0;
}

/* =========================================================
   启动
   ========================================================= */
function startSession(){
  // 重置状态
  state.profile = {};
  state.answers = new Array(QUESTIONS.length).fill(null);
  state.step = 0;
  clearTimeout(state._auto);
  state._auto = null;
  renderStep();
  show("page-session");
}

document.getElementById("btn-start").onclick = startSession;

/* =========================================================
   渲染当前 step
   ========================================================= */
function renderStep(){
  clearTimeout(state._auto);
  state._auto = null;

  const total = STEPS.length + 1; // +1 是结果页
  const cur = state.step + 1;
  document.getElementById("s-progress-text").textContent = `${cur} / ${total}`;
  document.getElementById("s-progress-bar").style.width = `${(cur/total)*100}%`;

  const s = STEPS[state.step];
  const card = document.getElementById("s-card");
  const prevBtn = document.getElementById("btn-prev");

  prevBtn.classList.toggle("hidden", state.step === 0);

  if (s.kind === "choice") {
    card.innerHTML = `
      <div class="title-md">${s.title}</div>
      ${s.hint ? `<div class="subtle" style="margin-bottom:14px">${s.hint}</div>` : ""}
      <div id="s-opts"></div>
    `;
    const wrap = card.querySelector("#s-opts");
    s.opts.forEach((o, i) => {
      const isSel = (s.key ? state.profile[s.key] === o.v : state.answers[state.step - PROFILE_STEPS.length] === i);
      const div = document.createElement("div");
      div.className = "opt" + (isSel ? " selected" : "");
      div.innerHTML = `<div class="dot"></div><div class="text">${escapeHtml(o.t)}</div>`;
      div.onclick = () => onChoose(s, i, o);
      wrap.appendChild(div);
    });
  } else if (s.kind === "input") {
    const cur = state.profile[s.key] || "";
    card.innerHTML = `
      <div class="title-md">${s.title}</div>
      <div class="subtle" style="margin-bottom:14px">${s.hint || ""}</div>
      <div class="input-wrap">
        <span class="input-icon">${s.icon || ""}</span>
        <input class="nice-input" id="s-input" type="${s.inputType||"text"}"
               inputmode="decimal"
               min="${s.min||0}" max="${s.max||9999}"
               placeholder="${s.placeholder||""}"
               value="${cur}" />
        <span class="input-suffix">${s.suffix||""}</span>
      </div>
      <div class="input-hint">输入完成后按 <b style="color:var(--purple-3)">完成</b> 或点击空白处</div>
    `;
    const inp = card.querySelector("#s-input");
    // 自动聚焦
    setTimeout(()=>{ try{ inp.focus(); inp.select(); }catch(e){} }, 60);
    inp.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); inp.blur(); tryAdvanceInput(s, inp); }
    });
    inp.addEventListener("input", () => {
      const v = parseFloat(inp.value);
      const ok = v && v >= (s.min||0) && v <= (s.max||99999);
      if (ok) {
        // 输入合法时，每次重置 700ms 计时（防误输入）
        clearTimeout(state._auto);
        state._auto = setTimeout(() => tryAdvanceInput(s, inp, true), 700);
      } else {
        clearTimeout(state._auto);
        state._auto = null;
      }
    });
  }
}

function onChoose(s, i, o){
  // 1. 记录
  if (s.key) {
    state.profile[s.key] = o.v ?? o.t;
  } else {
    const qIdx = state.step - PROFILE_STEPS.length;
    state.answers[qIdx] = i;
  }
  // 2. 重绘（让选中态可见）
  renderStep();
  // 3. 350ms 后自动进入下一步
  clearTimeout(state._auto);
  state._auto = setTimeout(advance, 350);
}

function tryAdvanceInput(s, inp, fromTimer){
  const v = parseFloat(inp.value);
  if (!v || v < (s.min||0) || v > (s.max||99999)) {
    toast(`请输入 ${s.min||0} - ${s.max||99999} 之间的数字`);
    inp.dataset.locked = "";
    return;
  }
  state.profile[s.key] = v;
  clearTimeout(state._auto);
  if (fromTimer) return advance();
  // 用户按"完成"：给个视觉缓冲再推进
  state._auto = setTimeout(advance, 200);
}

function advance(){
  clearTimeout(state._auto);
  state._auto = null;
  if (state.step < STEPS.length - 1) {
    state.step++;
    renderStep();
  } else {
    generateResult();
  }
}

document.getElementById("btn-prev").onclick = () => {
  if (state.step > 0) {
    state.step--;
    renderStep();
  }
};

/* =========================================================
   Toast
   ========================================================= */
let toastTimer = null;
function toast(msg){
  let el = document.getElementById("_toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "_toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.style.opacity = "0"; }, 1800);
}

/* =========================================================
   工具：HTML 转义
   ========================================================= */
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

/* =========================================================
   结果生成
   ========================================================= */
function generateResult(){
  show("page-loading");
  runAnalyzeProgress().then(() => {
    renderResult();
    show("page-result");
  });
}

/* 5 阶段分析进度：环形进度条 + 阶段状态 + 数据流文字
   总时长 ~2.4s，然后进入结果页 */
function runAnalyzeProgress(){
  return new Promise(resolve => {
    const ringFg = document.getElementById("ring-fg");
    const ringPct = document.getElementById("ring-pct");
    const ringLabel = document.getElementById("ring-label");
    const streamEl = document.getElementById("data-stream");
    const C = 326.7; // 圆周

    const dimOrder = ["energy", "oxy", "inflam", "brain", "act"];
    const dimPhases = [
      { dim:"energy", label:"能量维度", streams:["采集能量值...", "计算ATP生成效率...", "检测线粒体状态...", "评估细胞能量储备..."] },
      { dim:"oxy",    label:"氧化维度", streams:["扫描糖化水平...", "检测自由基指标...", "评估皮肤氧化损伤...", "分析胶原蛋白状态..."] },
      { dim:"inflam", label:"慢性炎症", streams:["检测炎症因子...", "评估免疫状态...", "分析肠漏风险...", "计算慢性炎性水平..."] },
      { dim:"brain",  label:"脑力维度", streams:["扫描神经递质...", "评估睡眠质量...", "检测脑雾频率...", "分析压力负载..."] },
      { dim:"act",    label:"执行维度", streams:["评估吸收体质...", "扫描执行力指数...", "匹配干预策略...", "生成报告..."] },
    ];

    let pct = 0;
    let currentStream = 0;

    function setRing(p){
      pct = Math.max(0, Math.min(100, p));
      const offset = C * (1 - pct/100);
      ringFg.style.strokeDashoffset = offset;
      ringPct.textContent = Math.floor(pct) + "%";
    }

    function setStepStatus(dim, status){
      const el = document.querySelector(`.a-step[data-dim="${dim}"]`);
      if (!el) return;
      el.classList.remove("running","done");
      if (status) el.classList.add(status);
      el.querySelector(".a-status").textContent =
        status === "done" ? "完成" :
        status === "running" ? "分析中" : "等待中";
    }

    function nextStream(phase){
      const list = phase.streams;
      if (currentStream >= list.length) return;
      const text = list[currentStream++];
      streamEl.innerHTML = "";
      const span = document.createElement("span");
      span.textContent = text;
      streamEl.appendChild(span);
    }

    // 初始状态
    setRing(0);
    ringLabel.textContent = "初始化";
    setStepStatus("energy", "running");
    nextStream(dimPhases[0]);

    // 每个阶段 6 步 80ms = 480ms；中间 5 个阶段 = 2400ms
    let phaseIdx = 0;
    let stepInPhase = 0;
    const STEPS_PER_PHASE = 5;
    const STEP_MS = 90;
    const PHASE_TOTAL = STEPS_PER_PHASE * STEP_MS; // 450ms / 阶段
    const TOTAL_PHASES = dimPhases.length;

    const tick = setInterval(() => {
      stepInPhase++;
      const phasePct = (stepInPhase / STEPS_PER_PHASE) * (100 / TOTAL_PHASES);
      const overallPct = (phaseIdx / TOTAL_PHASES) * 100 + phasePct;
      setRing(overallPct);

      // 阶段中的文字流
      if (stepInPhase % 2 === 0) nextStream(dimPhases[phaseIdx]);

      // 阶段推进
      if (stepInPhase >= STEPS_PER_PHASE) {
        // 完成当前阶段
        setStepStatus(dimPhases[phaseIdx].dim, "done");
        phaseIdx++;
        stepInPhase = 0;
        if (phaseIdx >= TOTAL_PHASES) {
          // 全部完成
          clearInterval(tick);
          setRing(100);
          ringLabel.textContent = "报告生成完成";
          streamEl.innerHTML = '<span>报告生成完成 ✓</span>';
          setTimeout(resolve, 400);
        } else {
          // 进入下一阶段
          ringLabel.textContent = dimPhases[phaseIdx].label;
          setStepStatus(dimPhases[phaseIdx].dim, "running");
          currentStream = 0;
          nextStream(dimPhases[phaseIdx]);
        }
      }
    }, STEP_MS);
  });
}

function calcResults(){
  const buckets = { energy:0, oxy:0, inflam:0, brain:0, act:0 };
  QUESTIONS.forEach((q, i) => {
    const a = state.answers[i];
    if (a !== null) buckets[q.dim] += q.opts[a].s;
  });
  const out = {};
  Object.keys(buckets).forEach(k => {
    const raw = buckets[k];
    out[k] = { raw, normalized: Math.round(((raw - 4) / 12) * 100) };
  });
  return out;
}

function statusOf(score){
  if (score >= 85) return { label: "状态良好", cls: "badge-good", tier: "good" };
  if (score >= 70) return { label: "轻度不足", cls: "badge-info", tier: "info" };
  if (score >= 50) return { label: "明显受损", cls: "badge-warn", tier: "warn" };
  return { label: "高风险", cls: "badge-bad", tier: "bad" };
}

function renderResult(){
  const r = calcResults();

  // 总分
  const totalNorm = Math.round(Object.values(r).reduce((a,b)=>a+b.normalized,0) / 5);
  document.getElementById("r-total").textContent = totalNorm;
  document.getElementById("r-total-label").textContent =
    totalNorm >= 85 ? "细胞活力处于优秀状态" :
    totalNorm >= 70 ? "整体状态良好，存在局部短板" :
    totalNorm >= 50 ? "多维防线受损，建议系统干预" :
    "高风险预警，需要全面抗衰修复";

  // BMI
  const h = state.profile.height, w = state.profile.weight;
  const bmi = w / Math.pow(h/100, 2);
  const bmiAlert = document.getElementById("r-bmi-alert");
  if (bmi >= 24) {
    bmiAlert.classList.remove("hidden");
    document.getElementById("r-bmi-text").innerHTML =
      `<b>BMI ${bmi.toFixed(1)} 提示体重偏高</b>。体内多余的脂肪细胞更容易引发全身性的慢性炎症反应，这不仅是导致日常疲惫的原因之一，也会加速机体老化。`;
  } else {
    bmiAlert.classList.add("hidden");
  }

  // 雷达图
  drawRadar(r);

  // 维度列表
  const list = document.getElementById("r-dim-list");
  list.innerHTML = "";
  Object.keys(DIM_META).forEach(k => {
    const m = DIM_META[k], v = r[k], s = statusOf(v.normalized);
    const card = document.createElement("div");
    card.className = "dim-card";
    card.innerHTML = `
      <div class="dim-row">
        <div class="dim-name">${m.name}</div>
        <div><span class="dim-score">${v.normalized}</span>
          <span class="badge ${s.cls}" style="margin-left:8px">${s.label}</span>
        </div>
      </div>
      <div class="bar" data-tier="${s.tier}"><div style="width:${v.normalized}%"></div></div>
      <div class="muted" style="font-size:11.5px;margin-top:6px">${m.desc}</div>
    `;
    list.appendChild(card);
  });

  // 干预建议
  renderInsight(r);
}

function renderInsight(r){
  const wrap = document.getElementById("r-insight");
  wrap.innerHTML = "";
  const dims = Object.keys(DIM_META).map(k => ({ k, score: r[k].normalized }));
  // 阈值统一为 70：< 70 视为需要重点关注（薄弱），>= 70 视为合格（不再细分轻度）
  const weak = dims.filter(d => d.score < 85).sort((a,b)=>a.score-b.score);
  const allGood = dims.every(d => d.score >= 85);

  if (allGood) {
    wrap.innerHTML = `
      <div class="insight">
        <h3>综合评估：健康基础良好</h3>
        <p>您的测评结果显示，目前在精力状态、代谢水平、生活自律性等方面均表现不错，细胞层面的损耗速度低于同龄人平均水平。这与您长期保持的良好生活习惯密不可分。</p>
        
        <ul>
          <li>日常精力与情绪状态相对稳定</li>
          <li>代谢与皮肤状态维持在较好水平</li>
          <li>具备较强的健康管理意识与行动力</li>
        </ul>

        <div class="risk">
          <b>需要客观看待的规律是：</b>细胞层面的衰老并非只在“状态变差”时才发生。人体内线粒体的数量与功能大约从30岁开始逐年下降，内源性抗氧化系统（如谷胱甘肽、SOD）的合成能力也会随年龄增长而递减。这意味着，即使生活方式无可挑剔，细胞也在经历持续的低度损耗——只是这种损耗暂时还没有越过“感受阈值”，让你明显察觉。
        </div>

        <p style="margin-top:12px"><b>这个阶段的策略建议：</b></p>
        <p>目前你的基础很好，不需要复杂的“修复型”方案，但如果希望在下一个5-10年继续保持当前优势，可以提前关注一些针对细胞层面的前沿营养素。例如：</p>

        <ul style="list-style:none;padding-left:0;">
          <li>🔬 <b>线粒体支持：</b>PQQ 被研究发现可促进线粒体生物合成，AKG 参与三羧酸循环的能量代谢</li>
          <li>🛡️ <b>细胞保护：</b>麦角硫因可进入细胞核与线粒体发挥靶向抗氧化作用，葡萄籽提取物富含原花青素</li>
          <li>🔥 <b>炎性衰老预防：</b>姜黄素在多项研究中显示出对慢性低度炎症的调节潜力</li>
        </ul>
      </div>
    `;
    bindNutrientCarousels(wrap);
    return;
  }

  // 薄弱分支：有 < 70 的维度
  //   规则：
  //     - 总数 ≤ 2：全部展开，不折叠
  //     - 总数 > 2：默认显示前 2 个 + “展开剩余 N 个”按钮，点击后全部展开
  const SHOW_N = 2;
  const head = weak.slice(0, SHOW_N);
  const tail = weak.slice(SHOW_N);

  let body = `<div class="subtle" style="margin-bottom:10px">检测到您有 <b style="color:var(--purple-3)">${weak.length}</b> 个不足的维度，按分数高低依次展开：</div>`;

  // 头部：默认显示
  body += `<div class="low-head-list">`;
  head.forEach(d => { body += renderLowInsight(d.k, d.score); });
  body += `</div>`;

  // 尾部：先隐藏，点展开按钮才显示
  if (tail.length) {
    body += `<div class="insight-fold" id="insight-fold">`;
    tail.forEach(d => { body += renderLowInsight(d.k, d.score); });
    body += `</div>`;
    body += `<button class="btn btn-ghost btn-fold" id="btn-fold-toggle" type="button">展开剩余 ${tail.length} 个维度 ▾</button>`;
  }

  wrap.innerHTML = `<div class="insight">${body}</div>`;
  bindNutrientCarousels(wrap);
  bindProductButtons(wrap);
  if (tail.length) bindFoldToggle(wrap);
}

function renderLowInsight(dim, score){
  const d = LOW_INSIGHT[dim];
  const nutrients = getNutrients(dim);
  // 三明治结构：日常习惯调整（基础）→ 基础营养支持（常规）→ 前沿靶向干预（产品原料）
  const lifestyleHtml = d.lifestyle ? `
    <div class="low-sandwich layer-life">
      <div class="layer-icon">🌿</div>
      <div class="layer-body">
        <div class="layer-label">日常习惯调整（基础）</div>
        <p>${d.lifestyle}</p>
      </div>
    </div>` : "";
  const basicHtml = d.basic ? `
    <div class="low-sandwich layer-basic">
      <div class="layer-icon">🧬</div>
      <div class="layer-body">
        <div class="layer-label">基础营养支持（常规）</div>
        <p>${d.basic}</p>
      </div>
    </div>` : "";
  const frontierHtml = (nutrients && nutrients.length) ? `
    <div class="low-sandwich layer-frontier">
      <div class="layer-icon">✨</div>
      <div class="layer-body">
        <div class="layer-label">前沿靶向干预</div>
        <p class="layer-sub">针对该维度深层机制的细胞级营养素，可左右滑动查看。</p>
        ${nutrientCarouselHtml(nutrients)}
        ${productButtonHtml(dim, "查看产品详情")}
      </div>
    </div>` : "";
  return `
    <div class="low-block" data-dim="${dim}">
      <div class="low-head">
        <div class="title-md" style="margin:0">${d.title}</div>
        <span class="badge badge-bad">${score} 分</span>
      </div>
      <div class="low-section">
        <div class="low-label">状态解读</div>
        <p>${d.state}</p>
      </div>
      <div class="low-section">
        <div class="low-label">典型表现</div>
        <ul>${d.symptoms.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
      <div class="low-section">
        <div class="low-label">风险趋势</div>
        <div class="risk">${d.risk}</div>
      </div>
      <div class="low-section">
        <div class="low-label">干预建议</div>
        <div class="sandwich-stack">
          ${lifestyleHtml}
          ${basicHtml}
          ${frontierHtml}
        </div>
      </div>
    </div>
  `;
}

/* 维度下"查看产品详情"按钮：打开产品弹窗 */
function productButtonHtml(dim, label){
  return `<button class="product-btn" data-dim="${dim}">${label || "查看产品详情"}</button>`;
}

/* =========================================================
   营养素轮播（左右滑动，一次一个）
   营养素 = 产品原料，轮播展示多张营养素卡片
   ========================================================= */
function nutrientImgHtml(n){
  // 不再展示产品图，直接以渐变背景 + 名称缩写作为占位
  const name = (n.name || "").trim();
  // 优先级：
  //  1) 开头连续大写字母（AKG / PQQ）
  //  2) 括号内连续大写字母（葡萄籽提取物（OPC））
  //  3) 字符串中任一连续大写字母（2 字母以上）
  //  4) 第一个英文字母
  //  5) 中文前 4 字
  let ph = "";
  let m = name.match(/^[A-Z]+/);
  if (m) ph = m[0];
  if (!ph) m = name.match(/[（(]([A-Z]{2,})[）)]/);
  if (!ph && m) ph = m[1];
  if (!ph) m = name.match(/[A-Z]{2,}/);
  if (!ph && m) ph = m[0];
  if (!ph) m = name.match(/[A-Za-z]/);
  if (!ph && m) ph = m[0].toUpperCase();
  if (!ph) ph = name.length <= 4 ? name : name.substring(0, 4);
  return `<div class="ph ph-name"><span class="ph-fallback">${escapeHtml(ph)}</span></div>`;
}

function nutrientCardHtml(n){
  return `
    <div class="nutrient-card">
      ${nutrientImgHtml(n)}
      <div class="pn">${escapeHtml(n.name)}</div>
      <div class="pd">${escapeHtml(n.desc)}</div>
      <div class="tag-row">${n.tags.map(t=>`<span class="t">${escapeHtml(t)}</span>`).join("")}</div>
    </div>
  `;
}

function nutrientCarouselHtml(nutrients){
  if (!nutrients || !nutrients.length) return "";
  const id = "nc_" + Math.random().toString(36).slice(2,8);
  const slides = nutrients.map(n => `<div class="slide">${nutrientCardHtml(n)}</div>`).join("");
  const dots = nutrients.map((_,i)=>`<span class="d ${i===0?"on":""}"></span>`).join("");
  const showNav = nutrients.length > 1;
  return `
    <div class="ncarousel" id="${id}" data-count="${nutrients.length}" data-idx="0">
      ${showNav ? `<div class="pnav prev" data-dir="-1">‹</div><div class="pnav next" data-dir="1">›</div>` : ""}
      <div class="track" style="transform:translateX(0%)">${slides}</div>
      ${showNav ? `<div class="dots">${dots}</div>` : ""}
    </div>
  `;
}

function bindNutrientCarousels(root){
  bindCarouselsGeneric(root, ".ncarousel");
}

/* =========================================================
   产品弹窗（营养素下方“查看产品详情”点击后弹出）
   产品 = 成品，1 个维度对应 1 个。弹窗只展示产品图片
   ========================================================= */
function openProductModalByDim(dim){
  const product = PRODUCTS[dim];
  if (!product) return;
  const items = [product];
  openImgViewer(items, 0);
}

/* “查看产品详情”按钮：点击后弹出该维度的产品介绍 */
function bindProductButtons(root){
  root.querySelectorAll(".product-btn[data-dim]").forEach(btn => {
    btn.onclick = () => openProductModalByDim(btn.dataset.dim);
  });
}

/* 复用：轮播通用逻辑，同时作用于营养素轮播、顶留扩展 */
function bindCarouselsGeneric(root, sel){
  root.querySelectorAll(sel).forEach(c => {
    const track = c.querySelector(".track");
    const count = parseInt(c.dataset.count, 10);
    let idx = 0;
    function go(n){
      idx = Math.max(0, Math.min(count-1, n));
      track.style.transform = `translateX(-${idx*100}%)`;
      c.dataset.idx = idx;
      c.querySelectorAll(".dots .d").forEach((d,i)=>d.classList.toggle("on", i===idx));
      const prev = c.querySelector(".pnav.prev");
      const next = c.querySelector(".pnav.next");
      if (prev) prev.toggleAttribute("disabled", idx===0);
      if (next) next.toggleAttribute("disabled", idx===count-1);
    }
    c.querySelectorAll(".pnav").forEach(btn => {
      btn.onclick = (e) => { e.stopPropagation(); go(idx + parseInt(btn.dataset.dir, 10)); };
    });
    // 触屏滑动
    let startX=null, dx=0, dragging=false;
    c.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX; dx = 0; dragging = true;
      track.style.transition = "none";
    }, { passive: true });
    c.addEventListener("touchmove", (e) => {
      if (!dragging || startX===null) return;
      dx = e.touches[0].clientX - startX;
      const pct = (-idx*100) + (dx / c.clientWidth * 100);
      track.style.transform = `translateX(${pct}%)`;
    }, { passive: true });
    c.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = "";
      const threshold = c.clientWidth * 0.18;
      if (dx < -threshold && idx < count-1) go(idx+1);
      else if (dx > threshold && idx > 0) go(idx-1);
      else go(idx);
      startX = null; dx = 0;
    });
    go(0);
  });
}

/* =========================================================
   折叠/展开剩余低分维度：max-height 过渡
   ========================================================= */
function bindFoldToggle(root){
  const btn = root.querySelector("#btn-fold-toggle");
  const fold = root.querySelector("#insight-fold");
  if (!btn || !fold) return;
  // 初始隐藏，保留占位以触发过渡
  fold.style.maxHeight = "0px";
  fold.style.opacity = "0";
  fold.style.overflow = "hidden";
  fold.style.transition = "max-height .4s cubic-bezier(.2,.7,.2,1), opacity .3s ease, margin .3s ease";
  fold.style.marginTop = "0px";

  btn.onclick = () => {
    const open = fold.classList.contains("expanded");
    if (open) {
      fold.style.maxHeight = fold.scrollHeight + "px";
      fold.offsetHeight; // force reflow
      fold.classList.remove("expanded");
      fold.style.maxHeight = "0px";
      fold.style.opacity = "0";
      fold.style.marginTop = "0px";
      btn.textContent = `展开剩余 ${fold.children.length} 个维度 ▾`;
    } else {
      fold.style.maxHeight = fold.scrollHeight + "px";
      fold.classList.add("expanded");
      fold.style.opacity = "1";
      fold.style.marginTop = "14px";
      btn.textContent = `收起 ▴`;
      setTimeout(() => {
        if (fold.classList.contains("expanded")) fold.style.maxHeight = "none";
      }, 450);
    }
  };
}

/* =========================================================
   全屏图片查看器：纯黑背景 + 原图自适应 + 缩放支持 + 左右切换
   items: [{ name, img, ... }]，startIdx 起始索引
   ========================================================= */
const _imgViewer = {
  el: null, stage: null, counter: null, prevBtn: null, nextBtn: null,
  closeBtn: null,
  items: [], idx: 0, scale: 1,
  open(items, startIdx){
    this.items = items;
    this.idx = Math.max(0, Math.min(items.length - 1, startIdx || 0));
    this.scale = 1;
    if (!this.el){
      this.el = document.getElementById("imgviewer");
      this.stage = document.getElementById("imgviewer-stage");
      this.counter = document.getElementById("imgviewer-counter");
      this.prevBtn = document.querySelector(".imgviewer-prev");
      this.nextBtn = document.querySelector(".imgviewer-next");
      this.closeBtn = document.querySelector(".imgviewer-close");
      // 关闭
      this.closeBtn.onclick = () => this.close();
      this.el.addEventListener("click", (e) => {
        if (e.target === this.el) this.close();
      });
      // 切换
      this.prevBtn.onclick = (e) => { e.stopPropagation(); this.nav(-1); };
      this.nextBtn.onclick = (e) => { e.stopPropagation(); this.nav(1); };
      // 键盘
      document.addEventListener("keydown", (e) => {
        if (this.el.hidden) return;
        if (e.key === "Escape") this.close();
        else if (e.key === "ArrowLeft") this.nav(-1);
        else if (e.key === "ArrowRight") this.nav(1);
      });
      // 双击放大
      this.stage.addEventListener("dblclick", (e) => { e.stopPropagation(); this.toggleZoom(); });
      // 触屏双指缩放（简化版）
      let lastDist = 0;
      this.stage.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
          const [a, b] = e.touches;
          lastDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        }
      }, { passive: true });
      this.stage.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2) {
          const [a, b] = e.touches;
          const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          if (lastDist > 0) {
            const ratio = d / lastDist;
            this.scale = Math.max(1, Math.min(4, this.scale * ratio));
            this.applyZoom();
            lastDist = d;
          }
        }
      }, { passive: true });
    }
    this.el.hidden = false;
    document.body.style.overflow = "hidden";
    this.render();
  },
  close(){
    this.el.hidden = true;
    document.body.style.overflow = "";
    this.scale = 1;
    this.applyZoom();
  },
  nav(dir){
    const n = this.items.length;
    if (n <= 1) return;
    this.idx = (this.idx + dir + n) % n;
    this.render();
  },
  render(){
    const p = this.items[this.idx];
    const src = (NUTRIENT_IMG_DIR || "./images/") + p.img;
    // 占位文字：中文取名字本身（≤2字），英文取首字母
    const _name = (p.name || "").trim();
    let initial;
    if (/^[\u4e00-\u9fa5]/.test(_name)) {
      initial = _name.length <= 2 ? _name : _name.substring(0, 2);
    } else {
      initial = (_name.charAt(0) || "?").toUpperCase();
    }
    this.stage.innerHTML = `
      <img id="iv-img" src="${src}" alt="${(p.name||'').replace(/"/g,'&quot;')}"
        style="transform:scale(${this.scale})"
        onerror="this.style.display='none';var f=this.nextElementSibling;if(f)f.style.display='flex'" />
      <div class="ph-fallback" style="display:none"><span>${initial}</span></div>
    `;
    // 单图时彻底隐藏 counter，多图时也只显示分页（不带产品名）
    if (this.items.length > 1) {
      this.counter.textContent = `${this.idx+1} / ${this.items.length}`;
      this.counter.style.display = "";
    } else {
      this.counter.style.display = "none";
    }
    const multi = this.items.length > 1;
    this.prevBtn.style.display = multi ? "" : "none";
    this.nextBtn.style.display = multi ? "" : "none";
    // 单图时关闭按钮居中放大，更易点
    if (!multi) {
      this.closeBtn.style.top = "max(16px, env(safe-area-inset-top, 16px))";
      this.closeBtn.style.right = "16px";
    }
  },
  toggleZoom(){
    this.scale = this.scale > 1 ? 1 : 2;
    this.applyZoom();
  },
  applyZoom(){
    const img = document.getElementById("iv-img");
    if (img) img.style.transform = `scale(${this.scale})`;
  },
};

function openImgViewer(items, startIdx){
  _imgViewer.open(items, startIdx);
}


/* =========================================================
   雷达图（纯 SVG）
   ========================================================= */
function drawRadar(r){
  const wrap = document.getElementById("r-radar");
  const order = ["energy", "oxy", "inflam", "brain", "act"];
  const labels = order.map(k => DIM_META[k]);
  const values = order.map(k => r[k].normalized);
  const W = 360, H = 340, cx = W/2, cy = H/2;
  const R = 100;
  const N = order.length;
  const angleOf = (i) => -Math.PI/2 + i * (2*Math.PI / N);
  const point = (i, ratio) => {
    const a = angleOf(i);
    return [cx + Math.cos(a) * R * ratio, cy + Math.sin(a) * R * ratio];
  };

  // 网格
  const gridLines = [0.25, 0.5, 0.75, 1.0].map(t => {
    const pts = order.map((_, i) => point(i, t).join(",")).join(" ");
    return `<polygon points="${pts}" fill="none" style="stroke:var(--radar-grid)" stroke-width="1" />`;
  }).join("");

  // 轴线
  const axes = order.map((_, i) => {
    const [x, y] = point(i, 1);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" style="stroke:var(--radar-grid)" stroke-width="1" />`;
  }).join("");

  // 数据多边形
  const dataPts = order.map((_, i) => point(i, values[i]/100));
  const dataPoly = `<polygon points="${dataPts.map(p=>p.join(",")).join(" ")}"
    fill="url(#radarGrad)" style="stroke:var(--radar-stroke)" stroke-width="2" />`;
  const dataDots = dataPts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" style="fill:var(--radar-dot-fill);stroke:var(--radar-dot-stroke)" stroke-width="2" />`).join("");

  // 标签：推到更外侧（1.32），左右按角度设 text-anchor；顶部维度（i=0）下移避开数字
  const labelPts = order.map((_, i) => {
    const a = angleOf(i);
    const [x, y] = point(i, 1.32);
    const cosA = Math.cos(a);
    const anchor = cosA > 0.3 ? "start" : (cosA < -0.3 ? "end" : "middle");
    const dx = cosA > 0.3 ? 4 : (cosA < -0.3 ? -4 : 0);
    // 顶部 i=0 时 y 已经较靠上，再下移 14px 避开数据点上的数值
    const dy = (i === 0) ? 14 : 0;
    // 底部 i=2（脑力维度）和 i=3（慢性炎症维度）y 偏下，标签也下移避免贴边
    const dyBot = (i === 2 || i === 3) ? 2 : 0;
    return `<text x="${x + dx}" y="${y + dy + dyBot}" text-anchor="${anchor}" dominant-baseline="middle"
      font-size="13" style="fill:var(--radar-label)" font-weight="500">${labels[i].name}</text>`;
  }).join("");

  // 数值小字：固定在数据点内上方 12px，并加半透白底圆角底，避免和网格/标签撞
  const valPts = dataPts.map((p, i) =>
    `<g><rect x="${p[0]-15}" y="${p[1]-22}" width="30" height="14" rx="3" ry="3"
      style="fill:rgba(255,255,255,0.85)" />
     <text x="${p[0]}" y="${p[1]-12}" text-anchor="middle" font-size="10" style="fill:#7c3aed" font-weight="700">${values[i]}</text></g>`
  ).join("");

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:var(--radar-fill-1)" />
          <stop offset="100%" style="stop-color:var(--radar-fill-2)" />
        </radialGradient>
      </defs>
      ${gridLines}
      ${axes}
      ${dataPoly}
      ${dataDots}
      ${valPts}
      ${labelPts}
    </svg>
  `;
}

/* 重新测评 */
document.getElementById("btn-restart").addEventListener("click", () => {
  startSession();
});

/* =========================================================
   分享报告：读取 ./share_url.txt 作为分享链接，复制到剪贴板
   ------------------------------------------------------------------
   你可以打开同目录下的 share_url.txt，把想要分享的链接写进去
   （一行即可，例如 https://example.com/your-landing）
   未提供 .txt 时使用默认
   ========================================================= */
const SHARE_URL_FALLBACK = "https://example.com/anti-aging-report";
let _shareUrlCache = null;

async function loadShareUrl(){
  if (_shareUrlCache) return _shareUrlCache;
  try {
    const res = await fetch("./share_url.txt", { cache: "no-store" });
    if (res.ok) {
      const txt = (await res.text()).trim();
      if (txt) { _shareUrlCache = txt; return txt; }
    }
  } catch(e) {}
  _shareUrlCache = SHARE_URL_FALLBACK;
  return _shareUrlCache;
}

async function copyText(text){
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch(e) {}
  // 降级：临时 textarea
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch(e) { return false; }
}

document.getElementById("btn-share").addEventListener("click", async () => {
  const url = await loadShareUrl();
  const ok = await copyText(url);
  if (ok) {
    toast("链接已复制 · 粘贴给朋友吧");
  } else {
    toast("复制失败 · 请手动复制：" + url);
  }
});
