// 抗衰人格测试 - 数据文件
// 所有题目、人格配置、匹配逻辑

// 30道五维测试题 + 1道隐藏人格判定题
// dim: S(Sleep) E(Energy) D(Diet) M(Mental) A(Action)
// 注意：所有题已经是正向题（高分=好习惯），无需反向
window.QUESTIONS = [
  // === S 睡眠维度 (Q1-Q6) ===
  { id: 1, dim: 'S', category: '睡眠', text: '通常几点睡觉？',
    options: [
      { label: 'A', text: '22:30前', score: 4 },
      { label: 'B', text: '23:00-24:00', score: 3 },
      { label: 'C', text: '24:00-1:00', score: 2 },
      { label: 'D', text: '1:00后', score: 1 }
    ]},
  { id: 2, dim: 'S', category: '睡眠', text: '起床状态？',
    options: [
      { label: 'A', text: '满血复活', score: 4 },
      { label: 'B', text: '精神不错', score: 3 },
      { label: 'C', text: '需要缓冲', score: 2 },
      { label: 'D', text: '灵魂出窍', score: 1 }
    ]},
  { id: 3, dim: 'S', category: '睡眠', text: '周末作息？',
    options: [
      { label: 'A', text: '规律', score: 4 },
      { label: 'B', text: '晚一点', score: 3 },
      { label: 'C', text: '补觉', score: 2 },
      { label: 'D', text: '通宵', score: 1 }
    ]},
  { id: 4, dim: 'S', category: '睡眠', text: '最近熬夜频率？',
    options: [
      { label: 'A', text: '几乎没有', score: 4 },
      { label: 'B', text: '偶尔', score: 3 },
      { label: 'C', text: '每周2-3次', score: 2 },
      { label: 'D', text: '经常', score: 1 }
    ]},
  { id: 5, dim: 'S', category: '睡眠', text: '睡前刷手机？',
    options: [
      { label: 'A', text: '不刷', score: 4 },
      { label: 'B', text: '看一会', score: 3 },
      { label: 'C', text: '刷到困', score: 2 },
      { label: 'D', text: '越刷越精神', score: 1 }
    ]},
  { id: 6, dim: 'S', category: '睡眠', text: '睡眠重要性？',
    options: [
      { label: 'A', text: '极其重要', score: 4 },
      { label: 'B', text: '比较重要', score: 3 },
      { label: 'C', text: '一般', score: 2 },
      { label: 'D', text: '无所谓', score: 1 }
    ]},

  // === E 能量维度 (Q7-Q12) ===
  { id: 7, dim: 'E', category: '能量', text: '连续工作一天后？',
    options: [
      { label: 'A', text: '还能继续', score: 4 },
      { label: 'B', text: '有点累', score: 3 },
      { label: 'C', text: '很累', score: 2 },
      { label: 'D', text: '只想躺', score: 1 }
    ]},
  { id: 8, dim: 'E', category: '能量', text: '朋友临时约饭？',
    options: [
      { label: 'A', text: '走', score: 4 },
      { label: 'B', text: '看情况', score: 3 },
      { label: 'C', text: '不太想', score: 2 },
      { label: 'D', text: '别烦我', score: 1 }
    ]},
  { id: 9, dim: 'E', category: '能量', text: '近期状态？',
    options: [
      { label: 'A', text: '永远满电', score: 4 },
      { label: 'B', text: '基本在线', score: 3 },
      { label: 'C', text: '经常疲劳', score: 2 },
      { label: 'D', text: '长期低电量', score: 1 }
    ]},
  { id: 10, dim: 'E', category: '能量', text: '恢复速度？',
    options: [
      { label: 'A', text: '非常快', score: 4 },
      { label: 'B', text: '正常', score: 3 },
      { label: 'C', text: '较慢', score: 2 },
      { label: 'D', text: '很慢', score: 1 }
    ]},
  { id: 11, dim: 'E', category: '能量', text: '下午三点状态？',
    options: [
      { label: 'A', text: '状态最佳', score: 4 },
      { label: 'B', text: '稳定', score: 3 },
      { label: 'C', text: '开始累', score: 2 },
      { label: 'D', text: '靠咖啡', score: 1 }
    ]},
  { id: 12, dim: 'E', category: '能量', text: '自评精力？',
    options: [
      { label: 'A', text: '旺盛', score: 4 },
      { label: 'B', text: '普通', score: 3 },
      { label: 'C', text: '容易累', score: 2 },
      { label: 'D', text: '非常容易累', score: 1 }
    ]},

  // === D 饮食维度 (Q13-Q18) ===
  { id: 13, dim: 'D', category: '饮食', text: '下午最容易想吃？',
    options: [
      { label: 'A', text: '水果', score: 4 },
      { label: 'B', text: '坚果', score: 3 },
      { label: 'C', text: '奶茶', score: 2 },
      { label: 'D', text: '甜品', score: 1 }
    ]},
  { id: 14, dim: 'D', category: '饮食', text: '新品奶茶？',
    options: [
      { label: 'A', text: '无感', score: 4 },
      { label: 'B', text: '看看', score: 3 },
      { label: 'C', text: '想试', score: 2 },
      { label: 'D', text: '已下单', score: 1 }
    ]},
  { id: 15, dim: 'D', category: '饮食', text: '聚餐选择？',
    options: [
      { label: 'A', text: '清淡', score: 4 },
      { label: 'B', text: '正常', score: 3 },
      { label: 'C', text: '火锅烧烤', score: 2 },
      { label: 'D', text: '重油重辣', score: 1 }
    ]},
  { id: 16, dim: 'D', category: '饮食', text: '含糖饮料频率？',
    options: [
      { label: 'A', text: '几乎不喝', score: 4 },
      { label: 'B', text: '偶尔', score: 3 },
      { label: 'C', text: '经常', score: 2 },
      { label: 'D', text: '每天', score: 1 }
    ]},
  { id: 17, dim: 'D', category: '饮食', text: '甜品态度？',
    options: [
      { label: 'A', text: '兴趣不大', score: 4 },
      { label: 'B', text: '偶尔', score: 3 },
      { label: 'C', text: '喜欢', score: 2 },
      { label: 'D', text: '无法拒绝', score: 1 }
    ]},
  { id: 18, dim: 'D', category: '饮食', text: '饮食与健康？',
    options: [
      { label: 'A', text: '强相关', score: 4 },
      { label: 'B', text: '有关系', score: 3 },
      { label: 'C', text: '一般', score: 2 },
      { label: 'D', text: '快乐最重要', score: 1 }
    ]},

  // === M 情绪维度 (Q19-Q24) ===
  { id: 19, dim: 'M', category: '情绪', text: '睡前状态？',
    options: [
      { label: 'A', text: '放空', score: 4 },
      { label: 'B', text: '看视频', score: 3 },
      { label: 'C', text: '复盘', score: 2 },
      { label: 'D', text: '预演未来', score: 1 }
    ]},
  { id: 20, dim: 'M', category: '情绪', text: '别人一句话影响？',
    options: [
      { label: 'A', text: '很快忘', score: 4 },
      { label: 'B', text: '偶尔想', score: 3 },
      { label: 'C', text: '想半天', score: 2 },
      { label: 'D', text: '记几天', score: 1 }
    ]},
  { id: 21, dim: 'M', category: '情绪', text: '压力处理？',
    options: [
      { label: 'A', text: '及时释放', score: 4 },
      { label: 'B', text: '调整一下', score: 3 },
      { label: 'C', text: '自己扛', score: 2 },
      { label: 'D', text: '一直压着', score: 1 }
    ]},
  { id: 22, dim: 'M', category: '情绪', text: '下班后？',
    options: [
      { label: 'A', text: '真下班', score: 4 },
      { label: 'B', text: '偶尔想工作', score: 3 },
      { label: 'C', text: '经常想', score: 2 },
      { label: 'D', text: '大脑开会', score: 1 }
    ]},
  { id: 23, dim: 'M', category: '情绪', text: '遇到问题？',
    options: [
      { label: 'A', text: '冷静处理', score: 4 },
      { label: 'B', text: '有点担心', score: 3 },
      { label: 'C', text: '比较焦虑', score: 2 },
      { label: 'D', text: '先想最坏结果', score: 1 }
    ]},
  { id: 24, dim: 'M', category: '情绪', text: '别人评价？',
    options: [
      { label: 'A', text: '情绪稳定', score: 4 },
      { label: 'B', text: '正常', score: 3 },
      { label: 'C', text: '敏感', score: 2 },
      { label: 'D', text: '想太多', score: 1 }
    ]},

  // === A 执行维度 (Q25-Q30) ===
  { id: 25, dim: 'A', category: '执行', text: '计划完成度？',
    options: [
      { label: 'A', text: '基本完成', score: 4 },
      { label: 'B', text: '完成大半', score: 3 },
      { label: 'C', text: '经常中断', score: 2 },
      { label: 'D', text: '经常放弃', score: 1 }
    ]},
  { id: 26, dim: 'A', category: '执行', text: '收藏养生内容？',
    options: [
      { label: 'A', text: '马上实践', score: 4 },
      { label: 'B', text: '会尝试', score: 3 },
      { label: 'C', text: '收藏吃灰', score: 2 },
      { label: 'D', text: '收藏即学会', score: 1 }
    ]},
  { id: 27, dim: 'A', category: '执行', text: '运动计划？',
    options: [
      { label: 'A', text: '长期坚持', score: 4 },
      { label: 'B', text: '偶尔坚持', score: 3 },
      { label: 'C', text: '想起来做', score: 2 },
      { label: 'D', text: '下周开始', score: 1 }
    ]},
  { id: 28, dim: 'A', category: '执行', text: '买补剂后？',
    options: [
      { label: 'A', text: '按时吃', score: 4 },
      { label: 'B', text: '大部分时候吃', score: 3 },
      { label: 'C', text: '经常忘', score: 2 },
      { label: 'D', text: '先买再说', score: 1 }
    ]},
  { id: 29, dim: 'A', category: '执行', text: '生活习惯？',
    options: [
      { label: 'A', text: '长期稳定', score: 4 },
      { label: 'B', text: '偶尔波动', score: 3 },
      { label: 'C', text: '经常变化', score: 2 },
      { label: 'D', text: '看心情', score: 1 }
    ]},
  { id: 30, dim: 'A', category: '执行', text: '健康管理？',
    options: [
      { label: 'A', text: '立即行动', score: 4 },
      { label: 'B', text: '逐步行动', score: 3 },
      { label: 'C', text: '研究很久', score: 2 },
      { label: 'D', text: '明天开始', score: 1 }
    ]},

  // === Q31 隐藏人格判定题 ===
  { id: 31, dim: 'H', category: '隐藏', text: '过去一年你的身体状态变化最符合：',
    isHidden: true,
    options: [
      { label: 'A', text: '一直很好', value: 1 },
      { label: 'B', text: '基本稳定', value: 2 },
      { label: 'C', text: '有明显改善', value: 3 },
      { label: 'D', text: '曾经很差，现在明显变好', value: 4 }
    ]}
];

// 21 种人格配置
// type: myth(神话) / hidden(隐藏) / regular(常规)
window.PERSONALITIES = {
  // ============ 神话人格 ============
  'time_void': {
    id: 'time_void',
    name: '时间漏洞者',
    title: '🕰 被岁月遗忘的人',
    type: 'myth',
    color: '#7B61FF',
    gradient: 'linear-gradient(135deg, #2D1B69 0%, #7B61FF 50%, #FFD700 100%)',
    icon: '🕰',
    tags: ['五维均衡发展', '极强恢复能力', '长期稳定自律', '情绪与生活节奏高度平衡'],
    comment: '时间好像忘记把你算进去。',
    desc: [
      '有些人在努力抗衰。',
      '有些人在拼命养生。',
      '而你似乎走的是另一条路。',
      '你并不一定是最卷的人。',
      '也不一定拥有最严格的作息。',
      '但你的身体仿佛找到了一种平衡。',
      '工作时全力投入。',
      '休息时彻底放松。',
      '面对压力时能够消化。',
      '面对诱惑时能够克制。',
      '你不是靠某一个优点赢。',
      '而是在所有维度上都没有明显短板。',
      '时间会公平地带走所有人的青春。',
      '但在你这里。',
      '它似乎走得慢了一些。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '真正的抗衰从来不是某一种方法。\n而是身体系统整体协同运作的结果。',
    coords: { S: 85, E: 85, D: 85, M: 85, A: 85 }
  },

  // ============ 隐藏人格 ============
  'panda_owl': {
    id: 'panda_owl',
    name: '熊猫型熬夜怪',
    title: '🐼 天赋型作死人',
    type: 'hidden',
    color: '#FF6B9D',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #FF6B9D 100%)',
    icon: '🐼',
    tags: ['长期熬夜', '精力仍然不错', '看起来状态在线', '对身体过度自信'],
    comment: '别高兴太早，账总要还的。',
    desc: [
      '你可能是朋友圈最让人羡慕的人。',
      '凌晨两点睡。',
      '早上照样上班。',
      '周末通宵。',
      '第二天还能聚会。',
      '很多人都在问：',
      '为什么你还没垮？',
      '其实答案很简单。',
      '你拥有不错的身体底子。',
      '但问题在于。',
      '你把这种天赋当成了护身符。',
      '身体允许你偶尔透支。',
      '不代表它愿意一直透支。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '年轻时透支的是精力。\n未来偿还的是恢复能力。',
    coords: { S: 30, E: 80, D: 50, M: 50, A: 50 }
  },
  'phoenix': {
    id: 'phoenix',
    name: '凤凰型重启者',
    title: '🔥 越挫越强的人',
    type: 'hidden',
    color: '#FF4757',
    gradient: 'linear-gradient(135deg, #2c1810 0%, #c0392b 50%, #e74c3c 100%)',
    icon: '🔥',
    tags: ['曾经历低谷', '自我修复能力强', '执行力惊人', '成长速度极快'],
    comment: '你最大的超能力是重启自己。',
    desc: [
      '你不是一路顺风顺水的人。',
      '甚至曾经长期熬夜。',
      '亚健康。',
      '焦虑。',
      '发胖。',
      '状态低迷。',
      '但与很多人不同的是。',
      '你没有认输。',
      '你经历过崩盘。',
      '也经历过重建。',
      '经历过放弃。',
      '也经历过重新开始。',
      '你比别人更懂身体的重要性。',
      '因为你曾经失去过。',
      '如今的每一次坚持。',
      '都是一次自我救赎。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '身体最大的奇迹不是年轻。\n而是恢复。',
    coords: { S: 50, E: 70, D: 50, M: 50, A: 75 }
  },
  'chosen_one': {
    id: 'chosen_one',
    name: '天选抗衰体',
    title: '✨ 老天追着喂饭的人',
    type: 'hidden',
    color: '#F9CA24',
    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #ffeaa7 100%)',
    icon: '✨',
    tags: ['身体底子优秀', '恢复能力强', '状态长期在线', '天赋型选手'],
    comment: '你拥有天赋，但别浪费它。',
    desc: [
      '有些人拼命保养。',
      '有些人疯狂运动。',
      '而你似乎天生就占了一些便宜。',
      '偶尔熬夜。',
      '偶尔放纵。',
      '偶尔不运动。',
      '状态却依然不错。',
      '朋友羡慕你。',
      '同龄人嫉妒你。',
      '但你自己知道。',
      '这些都来自天赋。',
      '而不是实力。',
      '真正聪明的人。',
      '不会消耗自己的天赋。',
      '而是利用天赋走得更远。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '天赋决定起点。\n习惯决定终点。',
    coords: { S: 70, E: 90, D: 70, M: 85, A: 70 }
  },

  // ============ 常规人格 ============
  'time_master': {
    id: 'time_master',
    name: '时间掌控者',
    title: '👑 被岁月偏爱的人',
    type: 'regular',
    color: '#6C5CE7',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '👑',
    tags: ['作息规律', '情绪稳定', '长期主义', '自律且有节奏'],
    comment: '别人和时间赛跑，你和时间合作。',
    desc: [
      '时间掌控者最大的特点不是努力，而是稳定。',
      '他们知道什么时候工作，什么时候休息，什么时候该认真，什么时候该放松。',
      '很多人总想寻找抗衰捷径。',
      '而时间掌控者相信：',
      '规律本身就是捷径。',
      '他们不会因为一时兴起疯狂运动。',
      '也不会因为一次放纵彻底摆烂。',
      '对他们来说。',
      '健康不是挑战。',
      '而是一种生活方式。',
      '他们很少熬夜。',
      '也很少透支自己。',
      '因为他们明白：',
      '真正厉害的人生不是拼命燃烧。',
      '而是持续发光。',
      '如果说衰老是一场马拉松。',
      '那么时间掌控者永远是最稳的那一批选手。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '身体已经拥有优秀的基础。\n只要持续保持。\n未来大概率会成为同龄人羡慕的对象。',
    coords: { S: 90, E: 75, D: 75, M: 90, A: 90 }
  },
  'anti_aging_king': {
    id: 'anti_aging_king',
    name: '抗衰卷王',
    title: '🏆 把抗衰当事业的人',
    type: 'regular',
    color: '#00B894',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    icon: '🏆',
    tags: ['运动', '营养', '睡眠', '一个不落'],
    comment: '别人养生靠想，\n你养生靠执行。',
    desc: [
      '你是朋友圈里最让人有压力的人。',
      '别人说减肥。',
      '你已经瘦了。',
      '别人说运动。',
      '你已经跑完五公里。',
      '别人说要开始养生。',
      '你已经坚持半年了。',
      '你的世界里没有"等以后"。',
      '只有"现在开始"。',
      '你相信所有的年轻状态背后。',
      '都有长期积累。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '身体的年轻从来不是天赋。\n而是长期选择的结果。\n\n只要学会适当放松。\n你会成为抗衰天花板。',
    coords: { S: 80, E: 75, D: 80, M: 70, A: 95 }
  },
  'nuclear_engine': {
    id: 'nuclear_engine',
    name: '核动力选手',
    title: '⚡ 永远满格电',
    type: 'regular',
    color: '#FDCB6E',
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    icon: '⚡',
    tags: ['精力旺盛', '行动力极强', '恢复速度快', '喜欢挑战'],
    comment: '别把天赋当资本。',
    desc: [
      '你身边总有人问：',
      '你怎么这么有精神？',
      '别人工作一天就累了。',
      '你还能继续安排第二场。',
      '第三场。',
      '第四场。',
      '你像拥有无限续航。',
      '但问题也在这里。',
      '当身体给出警告时。',
      '你总觉得：',
      '还能再撑一撑。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '精力不是无限资源。\n恢复能力才是核心竞争力。\n\n学会恢复比学会努力更重要。',
    coords: { S: 70, E: 95, D: 65, M: 65, A: 75 }
  },
  'longevity_seed': {
    id: 'longevity_seed',
    name: '长寿种子选手',
    title: '🌱 未来老得最慢的人',
    type: 'regular',
    color: '#55EFC4',
    gradient: 'linear-gradient(135deg, #55efc4 0%, #81ecec 100%)',
    icon: '🌱',
    tags: ['生活均衡', '风险较低', '作息稳定', '不走极端'],
    comment: '未来同学聚会，你负责证明岁月不公平。',
    desc: [
      '你的人生没有特别炸裂的高光。',
      '也没有特别夸张的翻车。',
      '你喜欢平衡。',
      '不极端减肥。',
      '不极端放纵。',
      '不疯狂养生。',
      '也不疯狂作死。',
      '这种看似普通的生活方式。',
      '反而最接近长寿模型。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '很多长寿秘诀其实都很普通。\n规律本身就是优势。\n\n只要稍微优化。\n状态就会非常稳定。',
    coords: { S: 75, E: 75, D: 75, M: 75, A: 75 }
  },
  'night_owl': {
    id: 'night_owl',
    name: '熬夜战神',
    title: '🌙 黑夜守护者',
    type: 'regular',
    color: '#2D3436',
    gradient: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    icon: '🌙',
    tags: ['晚睡', '熬夜'],
    comment: '凌晨两点的你，总觉得人生刚开始。',
    desc: [
      '晚上十点：',
      '好困。',
      '晚上十一点：',
      '精神一点了。',
      '晚上十二点：',
      '刷完这个就睡。',
      '凌晨一点：',
      '再看一个。',
      '凌晨两点：',
      '人生刚刚开始。',
      '你不是喜欢熬夜。',
      '你只是舍不得结束今天。',
      '对于你来说。',
      '睡觉是一种损失。',
      '娱乐才是人生。'
    ],
    potential: '⭐⭐⭐',
    truth: '深度睡眠是身体维修时间。\n很多修复工作都在夜间完成。',
    coords: { S: 20, E: 60, D: 60, M: 60, A: 50 }
  },
  'swing_health': {
    id: 'swing_health',
    name: '反复横跳养生家',
    title: '🎭 白天养生，晚上作死',
    type: 'regular',
    color: '#E17055',
    gradient: 'linear-gradient(135deg, #fab1a0 0%, #e17055 100%)',
    icon: '🎭',
    tags: ['保温杯泡枸杞', '夜宵烧烤不缺席', '收藏养生文章', '执行全靠心情'],
    comment: '身体和灵魂从来不在同一个群聊。',
    desc: [
      '你是健康知识界的百科全书。',
      '各种养生理念信手拈来。',
      '什么时候补充蛋白质。',
      '什么时候补充维生素。',
      '什么时候要抗糖。',
      '你都知道。',
      '但知道归知道。',
      '做到是另一回事。',
      '上午发朋友圈：',
      '健康生活从今天开始。',
      '晚上发朋友圈：',
      '人生得意须尽欢。',
      '你的身体常年处于：',
      '一边修复。',
      '一边破坏。',
      '一边努力。',
      '一边摆烂。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '抗衰最重要的从来不是极致。\n而是长期稳定。\n\n其实你并不缺知识。\n只要连续坚持30天。\n状态就会超过大多数人。',
    coords: { S: 50, E: 55, D: 60, M: 60, A: 35 }
  },
  'monday_restart': {
    id: 'monday_restart',
    name: '周一重启型',
    title: '🔋 永远在重新开始',
    type: 'regular',
    color: '#74B9FF',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #74b9ff 100%)',
    icon: '🔋',
    tags: ['经常疲劳', '计划很多', '执行断断续续'],
    comment: '你的充电速度赶不上放电速度。',
    desc: [
      '每个周一。',
      '都是你的新人生。',
      '新的目标。',
      '新的计划。',
      '新的决心。',
      '新的Flag。',
      '但到了周三。',
      '热情开始下降。',
      '到了周五。',
      '计划已经失踪。',
      '你最大的特点不是放弃。',
      '而是永远相信下一次一定成功。'
    ],
    potential: '⭐⭐⭐⭐',
    truth: '持续疲劳往往来自恢复不足。\n而不是工作太多。\n\n你的问题不是能力不足。\n而是恢复速度太慢。',
    coords: { S: 45, E: 40, D: 55, M: 55, A: 30 }
  },
  'milk_tea_machine': {
    id: 'milk_tea_machine',
    name: '奶茶永动机',
    title: '🧋 糖分信仰者',
    type: 'regular',
    color: '#FD79A8',
    gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%)',
    icon: '🧋',
    tags: ['奶茶续命'],
    comment: '快乐到账了。\n胶原蛋白下线了。',
    desc: [
      '你的快乐很简单。',
      '三分靠工资。',
      '七分靠奶茶。',
      '你可能记不住客户电话。',
      '但一定记得附近所有饮品店新品上市时间。',
      '对于别人来说。',
      '奶茶是奖励。',
      '对于你来说。',
      '奶茶是能源。'
    ],
    potential: '⭐⭐⭐',
    truth: '糖化会影响胶原蛋白状态。\n比变胖更值得关注。',
    coords: { S: 60, E: 65, D: 20, M: 70, A: 55 }
  },
  'collagen_blackhole': {
    id: 'collagen_blackhole',
    name: '胶原黑洞',
    title: '🍰 甜品终结者',
    type: 'regular',
    color: '#FF7675',
    gradient: 'linear-gradient(135deg, #ff7675 0%, #fdcb6e 100%)',
    icon: '🍰',
    tags: ['爱吃甜食', '甜不离手'],
    comment: '你吃的是蛋糕。\n岁月吃的是胶原蛋白。',
    desc: [
      '你可能不是特别爱喝奶茶。',
      '但一定拒绝不了蛋糕。',
      '冰淇淋。',
      '甜品。',
      '下午茶。',
      '对于你来说。',
      '生活已经很苦了。',
      '甜一点怎么了？'
    ],
    potential: '⭐⭐⭐',
    truth: '过量糖分可能增加糖化压力。\n胶原蛋白最怕长期高糖环境。',
    coords: { S: 65, E: 65, D: 25, M: 65, A: 60 }
  },
  'hotpot_cultivator': {
    id: 'hotpot_cultivator',
    name: '火锅修仙者',
    title: '🌶 辣味追随者',
    type: 'regular',
    color: '#D63031',
    gradient: 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)',
    icon: '🌶',
    tags: ['无辣不欢', '重油重盐', '聚餐达人', '社交属性强'],
    comment: '炎症见了你都想鼓掌。',
    desc: [
      '人生没有什么问题是一顿火锅解决不了的。',
      '如果有。',
      '那就两顿。',
      '你热爱麻辣鲜香。',
      '享受大汗淋漓。',
      '朋友约饭永远第一个响应。',
      '对于你来说。',
      '美食不仅是食物。',
      '更是快乐来源。'
    ],
    potential: '⭐⭐⭐⭐',
    truth: '长期高油高盐饮食会增加身体负担。\n偶尔快乐没问题。\n长期如此要小心。\n\n适当调整饮食结构。\n身体反馈会非常明显。',
    coords: { S: 60, E: 70, D: 30, M: 75, A: 55 }
  },
  'pleasure_seeker': {
    id: 'pleasure_seeker',
    name: '人生及时享乐家',
    title: '🍻 快乐优先',
    type: 'regular',
    color: '#FAB1A0',
    gradient: 'linear-gradient(135deg, #fab1a0 0%, #ffeaa7 100%)',
    icon: '🍻',
    tags: ['活在当下', '不喜欢约束', '享受生活', '乐观开朗'],
    comment: '未来的自己正在骂现在的自己。',
    desc: [
      '别人考虑十年后。',
      '你先考虑今晚吃什么。',
      '别人研究退休规划。',
      '你研究周末去哪玩。',
      '你相信：',
      '快乐要趁早。',
      '人生不能总为未来活着。',
      '这种心态让你活得轻松。',
      '但也容易忽略长期积累的重要性。'
    ],
    potential: '⭐⭐⭐⭐',
    truth: '享受生活很重要。\n但身体更喜欢有节奏的快乐。\n\n如果多一点规律。\n会拥有更好的状态。',
    coords: { S: 55, E: 70, D: 45, M: 75, A: 45 }
  },
  'overthinker': {
    id: 'overthinker',
    name: '内耗发动机',
    title: '🌀 精神加班大师',
    type: 'regular',
    color: '#A29BFE',
    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    icon: '🌀',
    tags: ['想太多', '高敏感', '容易反复思考'],
    comment: '别人加班8小时，你加班24小时。',
    desc: [
      '别人下班以后。',
      '大脑下班。',
      '你下班以后。',
      '大脑开会。',
      '已经发生的事情反复复盘。',
      '还没发生的事情提前预演。',
      '一句话能琢磨三天。',
      '一个决定能分析十遍。',
      '你的问题从来不是能力。',
      '而是消耗。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '长期压力会持续消耗身体修复资源。\n\n学会放过自己以后。\n你的恢复能力会迅速提升。',
    coords: { S: 55, E: 50, D: 65, M: 20, A: 60 }
  },
  'anxiety_prophet': {
    id: 'anxiety_prophet',
    name: '焦虑预言家',
    title: '🔮 未来灾难设计师',
    type: 'regular',
    color: '#636E72',
    gradient: 'linear-gradient(135deg, #b2bec3 0%, #636e72 100%)',
    icon: '🔮',
    tags: ['提前担忧', '风险敏感', '容易紧张', '想很多'],
    comment: '事情没开始，你先累了。',
    desc: [
      '你拥有超强预判能力。',
      '一个问题刚出现。',
      '你已经想到十种后果。',
      '一件事情还没发生。',
      '你已经设计好应急预案。',
      '这种能力帮你规避很多风险。',
      '也让你消耗很多能量。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '长期焦虑会让身体一直保持备战状态。\n影响恢复效率。\n\n你的问题从来不是能力。\n而是过度预警。',
    coords: { S: 55, E: 55, D: 65, M: 25, A: 65 }
  },
  'stress_eater': {
    id: 'stress_eater',
    name: '压力吞噬者',
    title: '🏔 什么都自己扛',
    type: 'regular',
    color: '#2D3436',
    gradient: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
    icon: '🏔',
    tags: ['不爱求助', '责任感强', '习惯独立', '报喜不报忧'],
    comment: '你很能扛，身体未必愿意。',
    desc: [
      '团队出问题。',
      '你顶上。',
      '家庭出问题。',
      '你顶上。',
      '朋友需要帮助。',
      '你还是顶上。',
      '久而久之。',
      '你成了所有人的依靠。',
      '却忘了自己也需要依靠。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '压力最怕积压。\n适当释放比硬扛更健康。\n\n学会求助不是软弱。\n而是成熟。',
    coords: { S: 60, E: 60, D: 70, M: 35, A: 75 }
  },
  'buddha_longevity': {
    id: 'buddha_longevity',
    name: '佛系长寿家',
    title: '☁ 懒得内耗的人',
    type: 'regular',
    color: '#DFE6E9',
    gradient: 'linear-gradient(135deg, #dfe6e9 0%, #74b9ff 100%)',
    icon: '☁',
    tags: ['不争不抢', '心态平稳', '随遇而安', '很少焦虑'],
    comment: '你最大的养生秘诀是懒得生气。',
    desc: [
      '别人因为一句话失眠。',
      '你睡得很香。',
      '别人因为一件事纠结三天。',
      '你已经翻篇。',
      '很多人觉得你佛系。',
      '其实你只是懂得取舍。',
      '不是所有事情都值得消耗自己。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '长期情绪稳定是天然的抗衰优势。\n\n如果增加一点执行力。\n你会非常接近理想状态。',
    coords: { S: 80, E: 70, D: 70, M: 95, A: 55 }
  },
  'turtle_anti_aging': {
    id: 'turtle_anti_aging',
    name: '海龟型抗衰者',
    title: '🐢 稳扎稳打',
    type: 'regular',
    color: '#00CEC9',
    gradient: 'linear-gradient(135deg, #81ecec 0%, #00cec9 100%)',
    icon: '🐢',
    tags: ['节奏平稳', '不追热点', '长期主义'],
    comment: '你不一定最快，但大概率最久。',
    desc: [
      '你的人生节奏可能让很多人着急。',
      '别人都在冲刺。',
      '你还在慢慢走。',
      '别人三天见效。',
      '你选择三个月坚持。',
      '你不喜欢极端。',
      '也不相信捷径。',
      '你的优势从来不是爆发。',
      '而是稳定。'
    ],
    potential: '⭐⭐⭐⭐⭐',
    truth: '健康最大的复利来自时间。\n\n长期坚持是你的天赋。',
    coords: { S: 80, E: 70, D: 75, M: 80, A: 75 }
  }
};

// 占比分布（人格类型库参考）
window.PERSONALITY_DISTRIBUTION = {
  'time_void': 0.5, 'chosen_one': 1, 'phoenix': 3, 'panda_owl': 4,
  'time_master': 5, 'anti_aging_king': 6, 'nuclear_engine': 5,
  'longevity_seed': 8, 'night_owl': 12, 'swing_health': 12,
  'monday_restart': 8, 'milk_tea_machine': 8, 'collagen_blackhole': 5,
  'hotpot_cultivator': 5, 'pleasure_seeker': 6, 'overthinker': 5,
  'anxiety_prophet': 3, 'stress_eater': 2, 'buddha_longevity': 1,
  'turtle_anti_aging': 1
};
