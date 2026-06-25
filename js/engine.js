// 抗衰人格测试 - 匹配引擎
// 负责五维得分计算、人格匹配、匹配度计算

window.TestEngine = (function() {
  const DIMS = ['S', 'E', 'D', 'M', 'A'];
  const DIM_NAMES = { S: '睡眠', E: '能量', D: '饮食', M: '情绪', A: '执行' };

  /**
   * 计算五维得分 (0-100)
   * 公式：((实际得分-6)/18)*100，保留整数
   */
  function computeDimensions(answers) {
    // answers: { 1: {dim:'S', score:4}, ... }
    const sums = { S: 0, E: 0, D: 0, M: 0, A: 0 };

    Object.values(answers).forEach(a => {
      if (sums[a.dim] !== undefined) {
        sums[a.dim] += a.score;
      }
    });

    const result = {};
    DIMS.forEach(d => {
      const raw = sums[d]; // 6~24
      result[d] = Math.round(((raw - 6) / 18) * 100);
    });
    return result;
  }

  /**
   * 获取隐藏人格判定答案 (Q31 的 value)
   */
  function getHistoryStatus(answers) {
    const q31 = answers[31];
    if (!q31) return null;
    return q31.value;
  }

  /**
   * 计算欧氏距离
   */
  function distance(scores, coords) {
    let sum = 0;
    DIMS.forEach(d => {
      const diff = (scores[d] || 0) - (coords[d] || 0);
      sum += diff * diff;
    });
    return Math.sqrt(sum);
  }

  /**
   * 判断神话人格：时间漏洞者
   * 触发条件：S/E/D/M/A 全部 >= 85
   */
  function isMyth(scores) {
    return DIMS.every(d => scores[d] >= 85);
  }

  /**
   * 判断隐藏人格（按优先级）
   * 1. 凤凰型重启者：history_status=4 && A>=75 && E>=70
   * 2. 天选抗衰体：S<=70 && D<=70 && A<=70 && E>=90 && M>=85
   * 3. 熊猫型熬夜怪：S<=30 && E>=80
   */
  function getHiddenPersonality(scores, historyStatus) {
    // 凤凰型重启者
    if (historyStatus === 4 && scores.A >= 75 && scores.E >= 70) {
      return 'phoenix';
    }
    // 天选抗衰体
    if (scores.S <= 70 && scores.D <= 70 && scores.A <= 70 &&
        scores.E >= 90 && scores.M >= 85) {
      return 'chosen_one';
    }
    // 熊猫型熬夜怪
    if (scores.S <= 30 && scores.E >= 80) {
      return 'panda_owl';
    }
    return null;
  }

  /**
   * 常规人格匹配：欧氏距离最小
   */
  function matchRegular(scores) {
    const regularIds = Object.keys(window.PERSONALITIES).filter(
      id => window.PERSONALITIES[id].type === 'regular'
    );

    let bestId = null;
    let bestDist = Infinity;
    let maxDist = 0;

    regularIds.forEach(id => {
      const p = window.PERSONALITIES[id];
      const d = distance(scores, p.coords);
      if (d > maxDist) maxDist = d;
      if (d < bestDist) {
        bestDist = d;
        bestId = id;
      }
    });

    // 计算匹配度：100 - (当前距离 / 最大距离 * 100)
    // 距离越小，匹配度越高
    const matchScore = Math.round(100 - (bestDist / maxDist) * 100);

    return { id: bestId, distance: bestDist, matchScore: matchScore };
  }

  /**
   * 稀有度分级
   * - myth    : 神话 (< 1%)
   * - hidden  : 隐藏 (< 5%)
   * - rare    : 稀有 (< 15%)
   * - common  : 常规
   */
  function classifyRarity(personalityId, isHidden, isMyth) {
    if (isMyth) return 'myth';
    if (isHidden) return 'hidden';
    const dist = window.PERSONALITY_DISTRIBUTION[personalityId] || 5;
    if (dist < 2) return 'rare';
    if (dist < 5) return 'uncommon';
    return 'common';
  }

  /**
   * 主入口：分析答案，输出结果
   */
  function analyze(answers) {
    const scores = computeDimensions(answers);
    const historyStatus = getHistoryStatus(answers);

    let result = {
      scores: scores,
      historyStatus: historyStatus,
      isMyth: false,
      isHidden: false,
      personalityId: null,
      matchScore: 0,
      rarity: 'common'
    };

    // 优先级 1：神话人格
    if (isMyth(scores)) {
      result.personalityId = 'time_void';
      result.isMyth = true;
      result.matchScore = 100;
      result.rarity = 'myth';
      return result;
    }

    // 优先级 2：隐藏人格
    const hiddenId = getHiddenPersonality(scores, historyStatus);
    if (hiddenId) {
      result.personalityId = hiddenId;
      result.isHidden = true;
      // 隐藏人格也计算一个匹配度
      const p = window.PERSONALITIES[hiddenId];
      const d = distance(scores, p.coords);
      // 隐藏人格的匹配度固定较高
      result.matchScore = Math.round(95 - d * 0.3);
      result.rarity = 'hidden';
      return result;
    }

    // 优先级 3：常规人格（最近邻）
    const reg = matchRegular(scores);
    result.personalityId = reg.id;
    result.matchScore = reg.matchScore;
    result.rarity = classifyRarity(reg.id, false, false);
    return result;
  }

  /**
   * 取得五维中最低分维度
   */
  function getWeakestDim(scores) {
    let minD = 'S', minV = 100;
    DIMS.forEach(d => {
      if (scores[d] < minV) {
        minV = scores[d];
        minD = d;
      }
    });
    return { dim: minD, value: minV, name: DIM_NAMES[minD] };
  }

  return {
    computeDimensions: computeDimensions,
    analyze: analyze,
    getWeakestDim: getWeakestDim,
    DIMS: DIMS,
    DIM_NAMES: DIM_NAMES
  };
})();
