/**
 * =========================================================
 * TRANSFORMERS: TAIWAN MONOPOLY (變形金剛：台灣大富翁)
 * Core Game Engine & Audio Synthesizer
 * =========================================================
 */

// --- Audio Synthesizer (Web Audio API) ---
class SoundSystem {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  playDiceRoll() {
    if (!this.enabled) return;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playTone(180 + Math.random() * 120, 'square', 0.05, 0.15);
      }, i * 70);
    }
  }

  playStep() {
    this.playTone(280, 'triangle', 0.06, 0.1);
  }

  playBuy() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.1, 0.15), idx * 60);
    });
  }

  playRent() {
    if (!this.enabled) return;
    this.init();
    const notes = [400, 320, 240];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.12, 0.15), idx * 80);
    });
  }

  playUpgrade() {
    if (!this.enabled) return;
    this.init();
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'square', 0.09, 0.12), idx * 50);
    });
  }

  playCard() {
    if (!this.enabled) return;
    this.init();
    this.playTone(700, 'sine', 0.2, 0.15);
    setTimeout(() => this.playTone(1050, 'sine', 0.25, 0.15), 100);
  }

  playJail() {
    if (!this.enabled) return;
    this.init();
    this.playTone(300, 'sawtooth', 0.3, 0.2);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.4, 0.2), 200);
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    const notes = [392, 523, 659, 784, 1046, 1318];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.2), idx * 110);
    });
  }
}

// --- Internationalization (i18n) Dictionary ---
const I18N = {
  zh: {
    langBtn: "English",
    title: "TRANSFORMERS: 台灣大富翁",
    brandSubtitle: "台灣大富翁 ‧ TAIWAN MONOPOLY",
    turnLabel: "當前回合：",
    rules: "規則",
    audioOn: "音效: 開",
    audioOff: "音效: 關",
    speedPrefix: "速度:",
    speedNormal: "正常",
    speedFast: "快節奏",
    recover: "恢復",
    newGame: "重開局",
    newGameConfirm: "確定要重新開始新的一局大富翁嗎？",
    playersTitle: "參戰金剛名冊 (PLAYERS)",
    portfolioTitle: "地產總覽",
    portfolioHint: "點選任意地產格可查看地契與升級",
    noPropertiesYet: "目前尚未持有任何地產",
    logTitle: "戰局記錄 (EVENT LOG)",
    clearLog: "清除記錄",
    radarCenterSubtitle: "CYBERTRON × TAIWAN",
    radarCenterTitle: "能量爭奪戰",
    diceReady: "點擊擲骰開始移動",
    diceRolled: (d1, d2, sum, isDoubles) => `擲出 ${d1} + ${d2} = ${sum} 點！${isDoubles ? ' (雙骰 Double!)' : ''}`,
    btnRoll: "🎲 擲骰子 (ROLL)",
    btnBuild: "🏗️ 升級能量站 (BUILD)",
    btnEnd: "⏭️ 結束回合 (END)",
    fateDeck: "命運 FATE",
    chanceDeck: "機會 CHANCE",
    bannerWelcome: "歡迎來到台灣大富翁！請擲骰子展開征途。",
    bannerTurn: (name) => `輪到 【${name}】 的行動回合。請點擊「擲骰子」（或點擊骰子區）！`,
    bannerDoubles: (name, d1, d2) => `【${name}】 擲出雙骰 (${d1}, ${d2})！獲得再一次擲骰機會！`,
    bannerDone: (name) => `【${name}】行動完成！請點擊「結束回合」換下一位玩家（或按空白鍵/點擊骰子）。`,
    bannerLanded: (name, tileName) => `【${name}】 抵達了 【${tileName}】！`,
    bannerJailWaiting: (name) => `【${name}】 正在賽博坦維修所中等待重啟！`,
    bannerJailFailed: "越獄失敗！請點擊「結束回合」換下一位玩家。",
    bannerCooldown: (name) => `${name} 核心冷卻中，跳過本回合行動。`,
    // Setup modal
    setupTitle: "TRANSFORMERS 台灣大富翁 ‧ 初始設定",
    setupPlayersCountLabel: "🎮 選擇參賽玩家人數：",
    setupPlayersCount: (n) => `${n} 位金剛`,
    setupCashLabel: "💰 初始能量儲備 (起始資金)：",
    setupCashFast: "$10,000 (速戰)",
    setupCashStandard: "$15,000 (標準)",
    setupCashRich: "$20,000 (富裕)",
    setupSlotsLabel: "🤖 金剛角色與控制權指派：",
    setupHuman: "玩家",
    setupAI: "電腦 AI",
    setupStartBtn: "🚀 啟動太空橋，開始遊戲！",
    // Deed modal & Buy Prompt
    buyPromptBadge: "🏢 無人佔領領地",
    buyPromptTitle: (name, tile) => `是否收購【${tile}】？`,
    inspectPromptBadge: "📜 領地地契",
    inspectPromptTitle: "領地地契預覽",
    balanceLabel: "金剛能量：",
    deedPriceLabel: "地產售價",
    deedBaseRent: "基礎過路費",
    deedRent1: "建造 1 座能量站",
    deedRent2: "建造 2 座能量站",
    deedRent3: "建造 3 座能量站",
    deedRent4: "建造 4 座能量站",
    deedRentHotel: "建造 賽博坦要塞",
    deedHouseCostLabel: "每座能量站/要塞造價：",
    deedCannotBuild: "不可建造",
    deedRail1: "擁有 1 座高鐵站過路費",
    deedRail2: "擁有 2 座高鐵站過路費",
    deedRail3: "擁有 3 座高鐵站過路費",
    deedRail4: "擁有 4 座高鐵站過路費",
    deedUtil1: "擁有 1 座事業：骰子點數 × 40",
    deedUtil2: "擁有 2 座事業：骰子點數 × 100",
    btnBuy: (price) => `購買此地 (${price})`,
    btnBuyDisabled: (price) => `能量不足 (${price})`,
    btnPass: "放棄不買",
    btnCloseDeed: "關閉地契預覽",
    // Build House Modal (Landing on own property)
    buildHouseBadge: "🏗️ 巡視自家領地",
    buildHouseTitle: (name, tile) => `是否在【${tile}】建造升級？`,
    buildCurrentLabel: "當前狀態",
    buildNextLabel: "升級目標",
    buildCostLabel: "建造費用：",
    buildRentChangeLabel: "過路費提升：",
    statusUnbuiltShort: "未開發 (Lv 0)",
    btnBuildHouse: (name, cost) => `建造 ${name} ($${cost})`,
    btnBuildHouseDisabled: (cost) => `能量不足 ($${cost})`,
    btnPassBuild: "暫不建造",
    // Jail modal
    jailStatusTag: "🚨 拘留維修狀態",
    jailTitle: "被困在賽博坦拘留所！",
    jailDesc: (turns) => `你被巡邏隊捕獲，正在維修室中接受系統整頓（剩餘等待回合：${turns}）。`,
    btnJailPay: "💵 支付維修保釋金 $500",
    btnJailCard: "🎫 使用「出獄特赦令」卡",
    btnJailRoll: "🎲 嘗試擲出雙骰 (Double)",
    // Upgrade modal
    upgradeTitle: "🏗️ 領地能量升級",
    upgradeSubtitle: "建造能量站與賽博坦要塞",
    upgradeHint: "當你集齊同色系所有地產（壟斷），即可投入能量建造升級！",
    upgradeNoMonopoly: "你目前尚未集齊任何同色系全部地產，無法建造升級！",
    upgradeMax: "已達最高級",
    upgradeBuildBtn: (name, cost) => `建造 ${name} ($${cost})`,
    podName: (level) => `能量站 (${level}/4)`,
    fortressName: "賽博坦要塞",
    currentStatusUnbuilt: "目前狀態：無建築",
    currentStatusBuilt: (level) => `目前狀態：${level} 座能量站`,
    currentStatusFortress: "目前狀態：🏰 賽博坦要塞",
    // Victory modal
    victoryTitle: (name) => `🏆 ${name} 稱霸全台！`,
    victorySubtitle: (faction) => `全台灣土地與賽博坦能源核心已被 ${faction} 完整接管！`,
    victoryCash: "最終持有能量金：",
    victoryProps: "掌控地產數量：",
    victoryRestart: "🔄 開啟新的一局",
    // Status badges
    inJailBadge: "拘留中",
    bankruptBadge: "破產",
    portfolioInspectTitle: (tile) => `點擊查看【${tile}】地契預覽`,
    // Common logs
    logGameStart: (count, cash) => `🚀 遊戲正式啟動！【${count} 位變形金剛】抵達台灣，起始資金 $${cash.toLocaleString()}。`,
    logPassGO: (name, amt = 2000, totalCash = null) => totalCash !== null
      ? `🚀 ${name} 越過起點 (GO)，獲得能量補給 <span class="log-amt-gain">+$${amt.toLocaleString()}</span>！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`
      : `🚀 ${name} 越過起點 (GO)，獲得能量補給 <span class="log-amt-gain">+$${amt.toLocaleString()}</span>！`,
    logLandGO: (name) => `🚀 ${name} 停留於起點充電站休整。`,
    logBuyProp: (name, prop, price, remainCash = null) => remainCash !== null
      ? `🏢 ${name} 購買了【${prop}】(花費 <span class="log-amt-loss">-$${price.toLocaleString()}</span>，剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>)！`
      : `🏢 ${name} 購買了【${prop}】(花費 <span class="log-amt-loss">-$${price.toLocaleString()}</span>)！`,
    logAIPass: (name, prop) => `🤔 ${name} (AI) 選擇保留儲備，放棄購買【${prop}】。`,
    logVisitSelf: (name, prop) => `🏠 ${name} 巡視自己的領地【${prop}】。`,
    logVisitSelfMax: (name, prop) => `🛡️ ${name} 巡視自己的領地【${prop}】（已達最高階賽博坦要塞！）。`,
    logAIPassBuild: (name, prop) => `🤔 ${name} (AI) 巡視自己的【${prop}】，決定保留能量暫不擴建。`,
    logPayRent: (name, prop, owner, rent) => `💸 ${name} 踩到【${prop}】，向 ${owner} 支付過路費 <span class="log-amt-loss">-$${rent.toLocaleString()}</span>！`,
    logPayRentLoss: (name, prop, owner, rent, remainCash) => `💸 ${name} 踩到【${prop}】，賠付過路費 <span class="log-amt-loss">-$${rent.toLocaleString()}</span> 給 ${owner}！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`,
    logPayRentGain: (owner, prop, name, rent, totalCash) => `💰 ${owner} 收取【${prop}】過路費 <span class="log-amt-gain">+$${rent.toLocaleString()}</span> (來自 ${name})！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`,
    logTax: (name, taxName, amt, remainCash = null) => remainCash !== null
      ? `💸 ${name} 繳納 ${taxName} <span class="log-amt-loss">-$${amt.toLocaleString()}</span>！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`
      : `💸 ${name} 繳納 ${taxName} <span class="log-amt-loss">-$${amt.toLocaleString()}</span>。`,
    logJailSent: (name) => `🔒 ${name} 被關押入賽博坦維修所！`,
    logJailBail: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `💵 ${name} 支付保釋維修金 <span class="log-amt-loss">-$${amt.toLocaleString()}</span>，順利脫困！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`
      : `💵 ${name} 支付 $${amt.toLocaleString()} 保釋維修金，順利脫困！`,
    logJailPardon: (name) => `🎫 ${name} 使用【出獄特赦令】，立即重獲自由！`,
    logJailDoubles: (name, d1, d2) => `🎲 ${name} 成功擲出雙骰 (${d1}, ${d2})！成功脫困越獄！`,
    logJailFail: (name, d1, d2, left) => `🔒 ${name} 擲出 (${d1}, ${d2})，越獄失敗！剩餘等待回合：${left}`,
    logJailForce: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `⏰ ${name} 期限已滿，強制繳納保釋金 <span class="log-amt-loss">-$${amt.toLocaleString()}</span> 出獄！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`
      : `⏰ ${name} 期限已滿，強制繳納 $${amt.toLocaleString()} 保釋金出獄。`,
    logUpgrade: (name, prop, bName, cost = null, remainCash = null) => cost !== null && remainCash !== null
      ? `🏗️ ${name} 在【${prop}】進行建設，升級為 ${bName} (花費 <span class="log-amt-loss">-$${cost.toLocaleString()}</span>，剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>)！`
      : `🏗️ ${name} 在【${prop}】建造了 ${bName}！`,
    logBankrupt: (name) => `💀 【${name}】 宣告破產出局！`,
    logBumblebeeDouble: (name, amt = 200, totalCash = null) => totalCash !== null
      ? `⚡ ${name} 觸發【超速偵查】雙骰獎勵，獲得巡航補貼 <span class="log-amt-gain">+$${amt.toLocaleString()}</span>！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`
      : `⚡ 大黃蜂觸發【超速偵查】擲出雙骰，獲得 $200 巡航補貼！`,
    logStarscreamEvade: (prop) => `🚀 天王星啟動【超音速匿蹤】，成功躲避支付【${prop}】的過路費！`,
    logIronhideArmor: (amt) => `🛡️ 鐵皮發動【重裝裝甲】，稅金減免 20%！實付 $${amt.toLocaleString()}。`,
    logSoundwaveUtility: "📡 聲波啟動【能量監控網絡】，公共事業收益提升 50%！",
    logRecoverManual: (name) => `🛠️ 已手動重整 ${name} 的控制按鈕。`,
    logRecoverAuto: "⚙️ 偵測到操作暫停，系統已自動重整行動狀態。",
    logCooldown: (name) => `💤 ${name} 本回合核心冷卻中，跳過行動！`,
    log3DoublesJail: (name) => `🚨 ${name} 連續擲出 3 次雙骰超速狂飆！直接移送維修所拘留！`,
    logRolled: (name, sum, d1, d2) => `🎲 ${name} 擲出了 ${sum} 點 (${d1}, ${d2})。`,
    logGoToJailTile: (name) => `🚨 ${name} 踩中巡邏警戒區！被押送前往賽博坦維修所！`,
    logTSMCPaid: (payer, recipient, amt, remainCash) => `💸 ${payer} 向 ${recipient} 支付晶片分紅 <span class="log-amt-loss">-$${amt.toLocaleString()}</span>！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`,
    logTSMCDividend: (name, total, totalCash) => `💰 ${name} 獲得台積電晶片分紅共 <span class="log-amt-gain">+$${total.toLocaleString()}</span>！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`,
    logGetPardonCard: (name) => `🎫 ${name} 獲得一張【出獄特赦令】！`,
    logSpeedFine: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `⚠️ ${name} 超速狂飆，繳納交通罰金 <span class="log-amt-loss">-$${amt.toLocaleString()}</span>！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`
      : `⚠️ ${name} 超速狂飆，繳納交通罰金 $${amt.toLocaleString()}。`,
    logEnergonFound: (name, amt = 1500, totalCash = null) => totalCash !== null
      ? `💎 ${name} 探測到古代能量礦，獲得獎勵金 <span class="log-amt-gain">+$${amt.toLocaleString()}</span>！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`
      : `💎 ${name} 探測到古代能量礦，獲得 $${amt.toLocaleString()} 獎勵金！`,
    logBaseRepair: (name, cost, houses, hotels, remainCash = null) => remainCash !== null
      ? `🛠️ ${name} 進行防空檢修 (${houses} 座能量站, ${hotels} 座要塞)，支付維修費 <span class="log-amt-loss">-$${cost.toLocaleString()}</span>！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`
      : `🛠️ ${name} 進行防空檢修 (${houses} 座能量站, ${hotels} 座要塞)，支付維修費 $${cost.toLocaleString()}。`,
    logFoodAward: (name, amt = 1000, totalCash = null) => totalCash !== null
      ? `🍲 ${name} 擔任台南美食大使，獲得觀光局獎金 <span class="log-amt-gain">+$${amt.toLocaleString()}</span>！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`
      : `🍲 ${name} 擔任台南美食大使，獲得觀光局獎金 $${amt.toLocaleString()}！`,
    logStandbyTurn: (name) => `💤 ${name} 核心冷卻休整，下回合暫停行動一次。`,
    logPatentFee: (name, amt = 1200, totalCash = null) => totalCash !== null
      ? `📜 ${name} 授權賽博坦合金專利，收取權利金 <span class="log-amt-gain">+$${amt.toLocaleString()}</span>！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`
      : `📜 ${name} 授權賽博坦合金專利，收取權利金 $${amt.toLocaleString()}！`,
    logCharityDonate: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `🎁 ${name} 贊助博派愛心園遊會，捐款 <span class="log-amt-loss">-$${amt.toLocaleString()}</span>！（剩餘資金: <span class="log-bal">$${remainCash.toLocaleString()}</span>）`
      : `🎁 ${name} 贊助博派愛心園遊會，捐款 $${amt.toLocaleString()}。`,
    logWaterSubsidy: (name, amt = 800, totalCash = null) => totalCash !== null
      ? `💧 ${name} 協助水庫人工造雨，獲得乾旱補助 <span class="log-amt-gain">+$${amt.toLocaleString()}</span>！（目前資金: <span class="log-bal">$${totalCash.toLocaleString()}</span>）`
      : `💧 ${name} 協助水庫人工造雨，獲得乾旱補助 $${amt.toLocaleString()}！`,
    ruleModalBadge: "📖 遊戲指南",
    ruleModalTitle: "變形金剛：台灣大富翁 遊戲規則",
    closeCardModal: "確認執行",
    closeCardPreview: "關閉預覽",
    cardPreviewSuffix: " (牌庫預覽)"
  },
  en: {
    langBtn: "繁體中文",
    title: "TRANSFORMERS: TAIWAN MONOPOLY",
    brandSubtitle: "TAIWAN MONOPOLY ‧ ENERGON WARS",
    turnLabel: "Current Turn: ",
    rules: "Rules",
    audioOn: "Audio: On",
    audioOff: "Audio: Off",
    speedPrefix: "Speed:",
    speedNormal: "Normal",
    speedFast: "Fast",
    recover: "Recover",
    newGame: "New Game",
    newGameConfirm: "Start a new Monopoly game? Current progress will be reset.",
    playersTitle: "TRANSFORMERS ROSTER",
    portfolioTitle: "PROPERTY PORTFOLIO",
    portfolioHint: "Click any property on board to inspect deed & upgrades",
    noPropertiesYet: "Currently holds no properties",
    logTitle: "BATTLE LOG",
    clearLog: "Clear Log",
    radarCenterSubtitle: "CYBERTRON × TAIWAN",
    radarCenterTitle: "ENERGON CONQUEST",
    diceReady: "Click Roll Dice to move",
    diceRolled: (d1, d2, sum, isDoubles) => `Rolled ${d1} + ${d2} = ${sum}!${isDoubles ? ' (Doubles!)' : ''}`,
    btnRoll: "🎲 ROLL DICE",
    btnBuild: "🏗️ UPGRADE BASE",
    btnEnd: "⏭️ END TURN",
    fateDeck: "FATE DECK",
    chanceDeck: "CHANCE DECK",
    bannerWelcome: "Welcome to Taiwan Monopoly! Roll dice to begin.",
    bannerTurn: (name) => `It is 【${name}】's turn. Click "ROLL DICE" (or click the dice arena)!`,
    bannerDoubles: (name, d1, d2) => `【${name}】 rolled Doubles (${d1}, ${d2})! Roll again!`,
    bannerDone: (name) => `【${name}】's move complete! Click "END TURN" (or press Space/click dice).`,
    bannerLanded: (name, tileName) => `【${name}】 arrived at 【${tileName}】!`,
    bannerJailWaiting: (name) => `【${name}】 is detained in Cybertron Repair Bay!`,
    bannerJailFailed: "Escape failed! Click 'END TURN' to proceed.",
    bannerCooldown: (name) => `${name} core cooling down, turn skipped.`,
    // Setup modal
    setupTitle: "TRANSFORMERS: Taiwan Monopoly - Setup",
    setupPlayersCountLabel: "🎮 Select Number of Players:",
    setupPlayersCount: (n) => `${n} Players`,
    setupCashLabel: "💰 Starting Energon Reserves:",
    setupCashFast: "$10,000 (Fast)",
    setupCashStandard: "$15,000 (Standard)",
    setupCashRich: "$20,000 (Rich)",
    setupSlotsLabel: "🤖 Character & Control Assignment:",
    setupHuman: "Human",
    setupAI: "AI Bot",
    setupStartBtn: "🚀 Launch Space Bridge, Start Game!",
    // Deed modal & Buy Prompt
    buyPromptBadge: "🏢 UNOWNED TERRITORY",
    buyPromptTitle: (name, tile) => `Purchase 【${tile}】?`,
    inspectPromptBadge: "📜 PROPERTY DEED",
    inspectPromptTitle: "Deed Preview",
    balanceLabel: "Energon Reserve:",
    deedPriceLabel: "Property Price",
    deedBaseRent: "Base Rent",
    deedRent1: "Rent with 1 Energon Pod",
    deedRent2: "Rent with 2 Energon Pods",
    deedRent3: "Rent with 3 Energon Pods",
    deedRent4: "Rent with 4 Energon Pods",
    deedRentHotel: "Rent with Cybertron Fortress",
    deedHouseCostLabel: "Cost per Pod / Fortress:",
    deedCannotBuild: "Cannot Build",
    deedRail1: "Rent with 1 Station",
    deedRail2: "Rent with 2 Stations",
    deedRail3: "Rent with 3 Stations",
    deedRail4: "Rent with 4 Stations",
    deedUtil1: "Rent with 1 Utility: Dice Roll × 40",
    deedUtil2: "Rent with 2 Utilities: Dice Roll × 100",
    btnBuy: (price) => `Buy Property (${price})`,
    btnBuyDisabled: (price) => `Insufficient Funds (${price})`,
    btnPass: "Pass",
    btnCloseDeed: "Close Deed Preview",
    // Build House Modal (Landing on own property)
    buildHouseBadge: "🏗️ PATROL OWN BASE",
    buildHouseTitle: (name, tile) => `Construct upgrade on 【${tile}】?`,
    buildCurrentLabel: "Current Status",
    buildNextLabel: "Upgrade Target",
    buildCostLabel: "Construction Cost:",
    buildRentChangeLabel: "Rent Boost:",
    statusUnbuiltShort: "Unimproved (Lv 0)",
    btnBuildHouse: (name, cost) => `Build ${name} ($${cost})`,
    btnBuildHouseDisabled: (cost) => `Insufficient Funds ($${cost})`,
    btnPassBuild: "Skip / Pass",
    // Jail modal
    jailStatusTag: "🚨 DETAINED / REPAIR BAY",
    jailTitle: "Trapped in Cybertron Detention Bay!",
    jailDesc: (turns) => `Captured by patrol units, systems undergoing diagnostic lock (Turns remaining: ${turns}).`,
    btnJailPay: "💵 Pay $500 Bail / Repair Fee",
    btnJailCard: "🎫 Use 'Get Out of Jail Free' Card",
    btnJailRoll: "🎲 Attempt to Roll Doubles",
    // Upgrade modal
    upgradeTitle: "🏗️ TERRITORY ENERGON UPGRADE",
    upgradeSubtitle: "Construct Energon Pods & Cybertronian Fortresses",
    upgradeHint: "When you own all properties in a color group (Monopoly), upgrade your bases!",
    upgradeNoMonopoly: "You do not own any complete color monopolies yet!",
    upgradeMax: "MAX LEVEL",
    upgradeBuildBtn: (name, cost) => `Build ${name} ($${cost})`,
    podName: (level) => `Energon Pod (${level}/4)`,
    fortressName: "Cybertron Fortress",
    currentStatusUnbuilt: "Status: Unimproved",
    currentStatusBuilt: (level) => `Status: ${level} Energon Pods`,
    currentStatusFortress: "Status: 🏰 Cybertron Fortress",
    // Victory modal
    victoryTitle: (name) => `🏆 ${name} Conquers Taiwan!`,
    victorySubtitle: (faction) => `All land and Energon across Taiwan is now secured under ${faction}!`,
    victoryCash: "Final Energon Reserves: ",
    victoryProps: "Controlled Properties: ",
    victoryRestart: "🔄 Start New Game",
    // Status badges
    inJailBadge: "In Jail",
    bankruptBadge: "Bankrupt",
    portfolioInspectTitle: (tile) => `Click to inspect deed for 【${tile}】`,
    // Common logs
    logGameStart: (count, cash) => `🚀 Game started! 【${count} Transformers】 arrive in Taiwan with $${cash.toLocaleString()} starting energon.`,
    logPassGO: (name, amt = 2000, totalCash = null) => totalCash !== null
      ? `🚀 ${name} passed START (GO) and received <span class="log-amt-gain">+$${amt.toLocaleString()}</span> allowance! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`
      : `🚀 ${name} passed START (GO) and collected $${amt.toLocaleString()} allowance!`,
    logLandGO: (name) => `🚀 ${name} rests at the Start Recharge Station.`,
    logBuyProp: (name, prop, price, remainCash = null) => remainCash !== null
      ? `🏢 ${name} bought 【${prop}】 (Cost <span class="log-amt-loss">-$${price.toLocaleString()}</span>, Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)!`
      : `🏢 ${name} bought 【${prop}】 for $${price.toLocaleString()}!`,
    logAIPass: (name, prop) => `🤔 ${name} (AI) decided to pass on 【${prop}】.`,
    logVisitSelf: (name, prop) => `🏠 ${name} inspected their property 【${prop}】.`,
    logVisitSelfMax: (name, prop) => `🛡️ ${name} inspected their territory 【${prop}】 (MAX Cybertron Fortress!).`,
    logAIPassBuild: (name, prop) => `🤔 ${name} (AI) inspected 【${prop}】 and saved Energon, skipping upgrade.`,
    logPayRent: (name, prop, owner, rent) => `💸 ${name} landed on 【${prop}】 and paid rent <span class="log-amt-loss">-$${rent.toLocaleString()}</span> to ${owner}!`,
    logPayRentLoss: (name, prop, owner, rent, remainCash) => `💸 ${name} landed on 【${prop}】 and paid rent <span class="log-amt-loss">-$${rent.toLocaleString()}</span> to ${owner}! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`,
    logPayRentGain: (owner, prop, name, rent, totalCash) => `💰 ${owner} collected <span class="log-amt-gain">+$${rent.toLocaleString()}</span> rent on 【${prop}】 from ${name}! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`,
    logTax: (name, taxName, amt, remainCash = null) => remainCash !== null
      ? `💸 ${name} paid ${taxName} <span class="log-amt-loss">-$${amt.toLocaleString()}</span>! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`
      : `💸 ${name} paid ${taxName} $${amt.toLocaleString()}.`,
    logJailSent: (name) => `🔒 ${name} was sent to Cybertron Detention Bay!`,
    logJailBail: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `💵 ${name} paid <span class="log-amt-loss">-$${amt.toLocaleString()}</span> bail to exit detention! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`
      : `💵 ${name} paid $${amt.toLocaleString()} bail to exit detention!`,
    logJailPardon: (name) => `🎫 ${name} used a Pardon card and regained freedom!`,
    logJailDoubles: (name, d1, d2) => `🎲 ${name} rolled doubles (${d1}, ${d2}) and broke out of detention!`,
    logJailFail: (name, d1, d2, left) => `🔒 ${name} rolled (${d1}, ${d2}), failed to escape! Turns left: ${left}`,
    logJailForce: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `⏰ ${name} detention time expired; forced bail <span class="log-amt-loss">-$${amt.toLocaleString()}</span>! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`
      : `⏰ ${name} detention time expired; paid $${amt.toLocaleString()} release fee.`,
    logUpgrade: (name, prop, bName, cost = null, remainCash = null) => cost !== null && remainCash !== null
      ? `🏗️ ${name} constructed upgrade on 【${prop}】: ${bName} (Cost <span class="log-amt-loss">-$${cost.toLocaleString()}</span>, Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)!`
      : `🏗️ ${name} upgraded 【${prop}】 with ${bName}!`,
    logBankrupt: (name) => `💀 【${name}】 declared BANKRUPTCY and is eliminated!`,
    logBumblebeeDouble: (name, amt = 200, totalCash = null) => totalCash !== null
      ? `⚡ ${name} triggered 【Speed Scout】 doubles, earning <span class="log-amt-gain">+$${amt.toLocaleString()}</span>! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`
      : `⚡ Bumblebee triggered 【Speed Scout】 with doubles, earning +$200 bonus!`,
    logStarscreamEvade: (prop) => `🚀 Starscream activated 【Supersonic Stealth】 and evaded paying rent on 【${prop}】!`,
    logIronhideArmor: (amt) => `🛡️ Ironhide activated 【Heavy Armor】, reducing tax by 20% to $${amt.toLocaleString()}.`,
    logSoundwaveUtility: "📡 Soundwave boosted utility revenues by 50% via 【Network Surveillance】!",
    logRecoverManual: (name) => `🛠️ Manually recovered controls for ${name}.`,
    logRecoverAuto: "⚙️ Automated watchdog recovered stalled turn state.",
    logCooldown: (name) => `💤 ${name}'s core is cooling down, turn skipped!`,
    log3DoublesJail: (name) => `🚨 ${name} rolled 3 consecutive Doubles (speeding)! Sent to Detention Bay!`,
    logRolled: (name, sum, d1, d2) => `🎲 ${name} rolled ${sum} (${d1}, ${d2}).`,
    logGoToJailTile: (name) => `🚨 ${name} entered the patrol warning zone! Sent to Detention Bay!`,
    logTSMCPaid: (payer, recipient, amt, remainCash) => `💸 ${payer} paid chip dividend <span class="log-amt-loss">-$${amt.toLocaleString()}</span> to ${recipient}! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`,
    logTSMCDividend: (name, total, totalCash) => `💰 ${name} collected TSMC chip dividends totaling <span class="log-amt-gain">+$${total.toLocaleString()}</span>! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`,
    logGetPardonCard: (name) => `🎫 ${name} received a 'Get Out of Jail Free' pardon card!`,
    logSpeedFine: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `⚠️ ${name} was fined <span class="log-amt-loss">-$${amt.toLocaleString()}</span> for speeding! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`
      : `⚠️ ${name} was fined $${amt.toLocaleString()} for high-speed navigation.`,
    logEnergonFound: (name, amt = 1500, totalCash = null) => totalCash !== null
      ? `💎 ${name} discovered an Energon seam and collected <span class="log-amt-gain">+$${amt.toLocaleString()}</span>! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`
      : `💎 ${name} discovered an Energon seam and collected $${amt.toLocaleString()}!`,
    logBaseRepair: (name, cost, houses, hotels, remainCash = null) => remainCash !== null
      ? `🛠️ ${name} paid <span class="log-amt-loss">-$${cost.toLocaleString()}</span> repair fees (${houses} pods, ${hotels} fortresses)! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`
      : `🛠️ ${name} paid $${cost.toLocaleString()} territory repair fees (${houses} pods, ${hotels} fortresses).`,
    logFoodAward: (name, amt = 1000, totalCash = null) => totalCash !== null
      ? `🍲 ${name} promoted Tainan food festival, awarded <span class="log-amt-gain">+$${amt.toLocaleString()}</span>! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`
      : `🍲 ${name} promoted Tainan food festival and received $${amt.toLocaleString()}!`,
    logStandbyTurn: (name) => `💤 ${name}'s core entered standby cooling mode, skipping next turn.`,
    logPatentFee: (name, amt = 1200, totalCash = null) => totalCash !== null
      ? `📜 ${name} collected <span class="log-amt-gain">+$${amt.toLocaleString()}</span> in tech royalties! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`
      : `📜 ${name} collected $${amt.toLocaleString()} in Cybertronian tech royalties!`,
    logCharityDonate: (name, amt = 500, remainCash = null) => remainCash !== null
      ? `🎁 ${name} donated <span class="log-amt-loss">-$${amt.toLocaleString()}</span> to charity fair! (Remaining: <span class="log-bal">$${remainCash.toLocaleString()}</span>)`
      : `🎁 ${name} donated $${amt.toLocaleString()} to the Autobots charity fair.`,
    logWaterSubsidy: (name, amt = 800, totalCash = null) => totalCash !== null
      ? `💧 ${name} received <span class="log-amt-gain">+$${amt.toLocaleString()}</span> rainmaking grant! (Balance: <span class="log-bal">$${totalCash.toLocaleString()}</span>)`
      : `💧 ${name} received an $${amt.toLocaleString()} reservoir rainmaking grant!`,
    ruleModalBadge: "📖 GAME MANUAL",
    ruleModalTitle: "TRANSFORMERS: TAIWAN MONOPOLY RULES",
    closeCardModal: "Confirm Action",
    closeCardPreview: "Close Preview",
    cardPreviewSuffix: " (Deck Preview)"
  }
};

// --- Transformers Characters Roster ---
const CHARACTERS = {
  optimus: {
    id: 'optimus',
    name: '柯博文',
    enName: 'Optimus Prime',
    faction: '博派領袖 (Autobots)',
    enFaction: 'Autobots Leader',
    icon: '🚛',
    avatar: 'assets/optimus_prime.png',
    color: '#0077ff',
    badgeClass: 'autobot',
    traitName: '領導母體加護',
    enTraitName: 'Matrix of Leadership',
    traitDesc: '起始額外獲得 $500 能量儲備。',
    enTraitDesc: 'Starts with an extra +$500 Energon reserve.',
    bonusStartCash: 500
  },
  bumblebee: {
    id: 'bumblebee',
    name: '大黃蜂',
    enName: 'Bumblebee',
    faction: '博派先鋒 (Autobots)',
    enFaction: 'Autobots Scout',
    icon: '⚡',
    avatar: 'assets/bumblebee.png',
    color: '#f59e0b',
    badgeClass: 'autobot',
    traitName: '超速偵查',
    enTraitName: 'Speed Scout',
    traitDesc: '若擲出雙骰 (Double)，額外獎勵 $200 巡航補貼。',
    enTraitDesc: 'Earns +$200 bonus speed allowance when rolling Doubles.',
    doubleBonus: 200
  },
  megatron: {
    id: 'megatron',
    name: '密卡登',
    enName: 'Megatron',
    faction: '狂派霸主 (Decepticons)',
    enFaction: 'Decepticons Emperor',
    icon: '💥',
    avatar: 'assets/megatron.png',
    color: '#9b51e0',
    badgeClass: 'decepticon',
    traitName: '霸王威壓',
    enTraitName: 'Tyrant Dominance',
    traitDesc: '購買未擁有地產享 10% 折扣優惠。',
    enTraitDesc: '10% discount on all unowned property purchases.',
    discount: 0.10
  },
  starscream: {
    id: 'starscream',
    name: '天王星',
    enName: 'Starscream',
    faction: '狂派指揮官 (Decepticons)',
    enFaction: 'Decepticons Air Commander',
    icon: '🚀',
    color: '#06b6d4',
    badgeClass: 'decepticon',
    traitName: '超音速匿蹤',
    enTraitName: 'Supersonic Stealth',
    traitDesc: '停在他人無建築地產有 20% 機率匿蹤免付過路費。',
    enTraitDesc: '20% chance to evade rent on unbuilt properties.',
    rentEvadeChance: 0.20
  },
  ironhide: {
    id: 'ironhide',
    name: '鐵皮',
    enName: 'Ironhide',
    faction: '博派武器官 (Autobots)',
    enFaction: 'Autobots Weapons Specialist',
    icon: '🛡️',
    color: '#ef4444',
    badgeClass: 'autobot',
    traitName: '重裝裝甲',
    enTraitName: 'Heavy Armor',
    traitDesc: '繳納各項稅金減免 20%。',
    enTraitDesc: 'Reduces all tax payments by 20%.',
    taxDiscount: 0.20
  },
  soundwave: {
    id: 'soundwave',
    name: '聲波',
    enName: 'Soundwave',
    faction: '狂派情報官 (Decepticons)',
    enFaction: 'Decepticons Communications Officer',
    icon: '📡',
    color: '#6366f1',
    badgeClass: 'decepticon',
    traitName: '能量監控網絡',
    enTraitName: 'Network Surveillance',
    traitDesc: '公共事業（電廠/水庫）過路費收益提高 50%。',
    enTraitDesc: 'Boosts public utility revenues by 50%.',
    utilityBonus: 1.5
  }
};

// --- Taiwan Monopoly Board Spaces (40 Tiles) ---
const BOARD_TILES = [
  // Bottom Row: Right to Left (0 -> 10)
  { id: 0, name: "起點 (GO)", enName: "START (GO)", type: "corner", icon: "🚀", sub: "經過領 $2,000", enSub: "Collect $2,000" },
  { id: 1, name: "屏東墾丁", enName: "Kenting", type: "street", group: "brown", price: 600, rent: [20, 100, 300, 900, 1600, 2500], houseCost: 500, icon: "🏖️" },
  { id: 2, name: "命運", enName: "Fate", type: "fate", icon: "🔮" },
  { id: 3, name: "屏東恆春", enName: "Hengchun", type: "street", group: "brown", price: 600, rent: [40, 200, 600, 1800, 3200, 4500], houseCost: 500, icon: "🏯" },
  { id: 4, name: "綜合所得稅", enName: "Income Tax", type: "tax", amount: 2000, icon: "💸" },
  { id: 5, name: "高鐵 台北站", enName: "THSR Taipei", type: "railroad", price: 2000, icon: "🚄" },
  { id: 6, name: "台東知本溫泉", enName: "Zhiben Springs", type: "street", group: "lightblue", price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], houseCost: 500, icon: "♨️" },
  { id: 7, name: "機會", enName: "Chance", type: "chance", icon: "⚡" },
  { id: 8, name: "台東伯朗大道", enName: "Mr. Brown Ave", type: "street", group: "lightblue", price: 1000, rent: [60, 300, 900, 2700, 4000, 5500], houseCost: 500, icon: "🌾" },
  { id: 9, name: "花蓮太魯閣", enName: "Taroko Gorge", type: "street", group: "lightblue", price: 1200, rent: [80, 400, 1000, 3000, 4500, 6000], houseCost: 500, icon: "⛰️" },
  
  // Left Column: Bottom to Top (10 -> 20)
  { id: 10, name: "維修基地 / 監獄", enName: "Detention / Jail", type: "corner", icon: "🔒", sub: "暫時拘留 / 探監", enSub: "Visiting / In Jail" },
  { id: 11, name: "宜蘭礁溪溫泉", enName: "Jiaoxi Springs", type: "street", group: "pink", price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], houseCost: 1000, icon: "♨️" },
  { id: 12, name: "台電能量電廠", enName: "Taipower Grid", type: "utility", price: 1500, icon: "⚡" },
  { id: 13, name: "宜蘭羅東夜市", enName: "Luodong Market", type: "street", group: "pink", price: 1400, rent: [100, 500, 1500, 4500, 6250, 7500], houseCost: 1000, icon: "🍢" },
  { id: 14, name: "基隆廟口夜市", enName: "Keelung Miaokou", type: "street", group: "pink", price: 1600, rent: [120, 600, 1800, 5000, 7000, 9000], houseCost: 1000, icon: "🏮" },
  { id: 15, name: "高鐵 台中站", enName: "THSR Taichung", type: "railroad", price: 2000, icon: "🚄" },
  { id: 16, name: "新竹城隍廟", enName: "Hsinchu Temple", type: "street", group: "orange", price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], houseCost: 1000, icon: "⛩️" },
  { id: 17, name: "命運", enName: "Fate", type: "fate", icon: "🔮" },
  { id: 18, name: "新竹科學園區", enName: "Hsinchu Science Park", type: "street", group: "orange", price: 1800, rent: [140, 700, 2000, 5500, 7500, 9500], houseCost: 1000, icon: "🔬" },
  { id: 19, name: "苗栗三義木雕", enName: "Miaoli Sanyi", type: "street", group: "orange", price: 2000, rent: [160, 800, 2200, 6000, 8000, 10000], houseCost: 1000, icon: "🪵" },

  // Top Row: Left to Right (20 -> 30)
  { id: 20, name: "日月潭度假基地", enName: "Sun Moon Lake", type: "corner", icon: "🏞️", sub: "免費休息充能", enSub: "Free Rest Parking" },
  { id: 21, name: "彰化鹿港老街", enName: "Lukang Old St.", type: "street", group: "red", price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], houseCost: 1500, icon: "🏮" },
  { id: 22, name: "機會", enName: "Chance", type: "chance", icon: "⚡" },
  { id: 23, name: "台中逢甲夜市", enName: "Fengjia Market", type: "street", group: "red", price: 2200, rent: [180, 900, 2500, 7000, 8750, 10500], houseCost: 1500, icon: "🍗" },
  { id: 24, name: "台中國家歌劇院", enName: "Taichung Theater", type: "street", group: "red", price: 2400, rent: [200, 1000, 3000, 7500, 9250, 11000], houseCost: 1500, icon: "🎭" },
  { id: 25, name: "高鐵 台南站", enName: "THSR Tainan", type: "railroad", price: 2000, icon: "🚄" },
  { id: 26, name: "雲林北港朝天宮", enName: "Beigang Temple", type: "street", group: "yellow", price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], houseCost: 1500, icon: "🏛️" },
  { id: 27, name: "嘉義阿里山森林", enName: "Alishan Forest", type: "street", group: "yellow", price: 2600, rent: [220, 1100, 3300, 8000, 9750, 11500], houseCost: 1500, icon: "🌲" },
  { id: 28, name: "台灣水資源水庫", enName: "Water Reservoir", type: "utility", price: 1500, icon: "💧" },
  { id: 29, name: "台南安平古堡", enName: "Anping Fort", type: "street", group: "yellow", price: 2800, rent: [240, 1200, 3600, 8500, 10250, 12000], houseCost: 1500, icon: "🏰" },

  // Right Column: Top to Bottom (30 -> 39)
  { id: 30, name: "拘留警戒！", enName: "Go To Jail!", type: "corner", icon: "🚨", sub: "押送前往維修基地", enSub: "Sent to Detention" },
  { id: 31, name: "台南赤崁樓", enName: "Chihkan Tower", type: "street", group: "green", price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], houseCost: 2000, icon: "🏯" },
  { id: 32, name: "高雄駁二特區", enName: "Pier-2 Center", type: "street", group: "green", price: 3000, rent: [260, 1300, 3900, 9000, 11000, 12750], houseCost: 2000, icon: "🎨" },
  { id: 33, name: "命運", enName: "Fate", type: "fate", icon: "🔮" },
  { id: 34, name: "高雄愛河灣", enName: "Love River Bay", type: "street", group: "green", price: 3200, rent: [280, 1500, 4500, 10000, 12000, 14000], houseCost: 2000, icon: "⛵" },
  { id: 35, name: "高鐵 左營站", enName: "THSR Zuoying", type: "railroad", price: 2000, icon: "🚄" },
  { id: 36, name: "機會", enName: "Chance", type: "chance", icon: "⚡" },
  { id: 37, name: "新北淡水漁人碼頭", enName: "Tamsui Wharf", type: "street", group: "darkblue", price: 3500, rent: [350, 1750, 5000, 11000, 13000, 15000], houseCost: 2000, icon: "🌉" },
  { id: 38, name: "能源科技奢侈稅", enName: "Luxury Tech Tax", type: "tax", amount: 1000, icon: "💎" },
  { id: 39, name: "台北101摩天大樓", enName: "Taipei 101", type: "street", group: "darkblue", price: 4000, rent: [500, 2000, 6000, 14000, 17000, 20000], houseCost: 2000, icon: "🏙️" }
];

// Color Group mappings for Monopoly checks
const COLOR_GROUPS = {
  brown: [1, 3],
  lightblue: [6, 8, 9],
  pink: [11, 13, 14],
  orange: [16, 18, 19],
  red: [21, 23, 24],
  yellow: [26, 27, 29],
  green: [31, 32, 34],
  darkblue: [37, 39]
};

// --- Chance & Fate Card Decks ---
const CHANCE_CARDS = [
  {
    title: "太空橋超速跳躍",
    enTitle: "Space Bridge Hyper Jump",
    icon: "🛸",
    desc: "太空橋通道短暫開啟！立即傳送直達【台北101】。若經過起點，照常領取 $2,000 能量金！",
    enDesc: "Space Bridge overload! Teleport directly to 【Taipei 101】. Collect $2,000 if passing Start!",
    reward: "+ 前進至台北101",
    enReward: "+ Advance to Taipei 101",
    action: (player, game) => game.movePlayerTo(player, 39)
  },
  {
    title: "高鐵超導推進",
    enTitle: "THSR Superconducting Boost",
    icon: "🚄",
    desc: "搭乘台灣高鐵超導列車，立即前往【高鐵 台中站】(15號)。若經過起點可領取 $2,000！",
    enDesc: "Board the high-speed maglev! Advance directly to 【THSR Taichung Station】. Collect $2,000 if passing Start!",
    reward: "+ 前進至高鐵台中站",
    enReward: "+ Advance to THSR Taichung",
    action: (player, game) => game.movePlayerTo(player, 15)
  },
  {
    title: "台積電晶片分紅",
    enTitle: "TSMC Chip Dividend",
    icon: "💰",
    desc: "你在新竹科學園區投資的奈米晶片大獲成功！向每位對手金剛收取 $500 能量金！",
    enDesc: "Semiconductor yields hit record highs! Collect $500 Energon from every rival Transformer!",
    reward: "+ 每人支付你 $500",
    enReward: "+ Collect $500 from each player",
    action: (player, game) => {
      let total = 0;
      const recipientName = game.getPlayerName(player);
      game.players.forEach(p => {
        if (p.id !== player.id && !p.isBankrupt) {
          const amt = Math.max(0, Math.min(p.cash, 500));
          p.cash -= amt;
          total += amt;
          game.log(game.t('logTSMCPaid', game.getPlayerName(p), recipientName, amt, p.cash), 'rent');
        }
      });
      player.cash += total;
      game.log(game.t('logTSMCDividend', recipientName, total, player.cash), 'gain');
      game.updatePlayerScoreCards();
    }
  },
  {
    title: "博派特赦令",
    enTitle: "Autobots Pardon Decree",
    icon: "🎫",
    desc: "柯博文發送特赦加密通訊！獲得一張【出獄特赦卡】，可保留隨時使用或折抵保釋金。",
    enDesc: "Encrypted clearance received! Keep this 'Get Out of Jail Free' card to escape detention anytime.",
    reward: "+ 獲得特赦卡一張",
    enReward: "+ Receive 1 Pardon Card",
    action: (player, game) => {
      player.hasGetOutOfJailCard = true;
      game.log(game.t('logGetPardonCard', game.getPlayerName(player)), 'chance');
    }
  },
  {
    title: "環島雷達故障退後",
    enTitle: "Radar Glitch: Step Back",
    icon: "↩️",
    desc: "受到強烈地磁風暴干擾，導航系統錯亂！倒退 3 格並觸發目標格事件！",
    enDesc: "Geomagnetic interference disrupts navigation! Move backwards 3 spaces immediately!",
    reward: "- 倒退 3 格",
    enReward: "- Step back 3 spaces",
    action: (player, game) => {
      let target = (player.position - 3 + 40) % 40;
      game.teleportPlayer(player, target);
    }
  },
  {
    title: "高鐵超速罰單",
    enTitle: "Highway Speeding Fine",
    icon: "⚠️",
    desc: "你在國道或高鐵軌道上超速變形，被台灣交通巡邏隊開立罰單，繳納 $500 罰金。",
    enDesc: "Highway patrol flagged your vehicle speed! Pay a $500 traffic violation fine.",
    reward: "- 繳納罰金 $500",
    enReward: "- Pay $500 fine",
    action: (player, game) => {
      player.cash -= 500;
      game.log(game.t('logSpeedFine', game.getPlayerName(player), 500, player.cash), 'rent');
      game.updatePlayerScoreCards();
      game.checkBankruptcy(player);
    }
  },
  {
    title: "能量晶礦大豐收",
    enTitle: "Energon Seam Discovered",
    icon: "💎",
    desc: "在花東縱谷探測到隱藏的古代賽博坦能量源！直接領取 $1,500 獎勵金！",
    enDesc: "Ancient Energon vein discovered in East Rift Valley! Collect $1,500 bonus Energon!",
    reward: "+ 獲得 $1,500",
    enReward: "+ Collect $1,500",
    action: (player, game) => {
      player.cash += 1500;
      game.log(game.t('logEnergonFound', game.getPlayerName(player), 1500, player.cash), 'gain');
      game.updatePlayerScoreCards();
    }
  },
  {
    title: "狂派突襲搜捕",
    enTitle: "Decepticon Interception",
    icon: "🚨",
    desc: "狂派雷達鎖定了你的行蹤！立即被押解送往【維修基地 / 拘留所】，途中經過起點不得領取獎勵！",
    enDesc: "Locked by enemy radar! Immediately sent to Detention Bay. Do not pass GO, do not collect $2,000!",
    reward: "🚨 前往監獄",
    enReward: "🚨 Go directly to Jail",
    action: (player, game) => game.sendToJail(player)
  }
];

const FATE_CARDS = [
  {
    title: "環島能量巡邏",
    enTitle: "Island-wide Patrol",
    icon: "🚀",
    desc: "執行台灣環島全境巡邏，直接前進至【起點 (GO)】並領取 $2,000 能量補充！",
    enDesc: "Complete island patrol mission! Advance directly to START (GO) and collect $2,000 Energon!",
    reward: "+ 直達起點領 $2,000",
    enReward: "+ Advance to START (GO)",
    action: (player, game) => game.movePlayerTo(player, 0)
  },
  {
    title: "防空基地大檢修",
    enTitle: "Base Defense Inspection",
    icon: "🛠️",
    desc: "台灣全島進行防空演習與建築巡檢！每座能量站需支付 $200 維修費，每座要塞需支付 $800！",
    enDesc: "Territory defense drill! Pay $200 maintenance per Energon Pod, and $800 per Fortress!",
    reward: "- 繳交建築維護費",
    enReward: "- Pay building repair fees",
    action: (player, game) => {
      let houses = 0;
      let hotels = 0;
      Object.values(game.properties).forEach(prop => {
        if (prop.owner === player.id) {
          if (prop.level >= 1 && prop.level <= 4) houses += prop.level;
          if (prop.level === 5) hotels += 1;
        }
      });
      const cost = houses * 200 + hotels * 800;
      player.cash -= cost;
      game.log(game.t('logBaseRepair', game.getPlayerName(player), cost, houses, hotels, player.cash), 'rent');
      game.updatePlayerScoreCards();
      game.checkBankruptcy(player);
    }
  },
  {
    title: "台南美食觀光節",
    enTitle: "Tainan Food Festival",
    icon: "🍲",
    desc: "擔任台南美食宣傳大使，品嚐牛肉湯與安平豆花，獲得觀光局獎金 $1,000！",
    enDesc: "Honored as Tainan Culinary Ambassador! Tourism bureau awards you $1,000 bonus!",
    reward: "+ 獲得獎金 $1,000",
    enReward: "+ Collect $1,000",
    action: (player, game) => {
      player.cash += 1000;
      game.log(game.t('logFoodAward', game.getPlayerName(player), 1000, player.cash), 'gain');
      game.updatePlayerScoreCards();
    }
  },
  {
    title: "太空橋冷卻休整",
    enTitle: "Space Bridge Cool Down",
    icon: "💤",
    desc: "日月潭能量水氣過於舒適，核心進入省電冷卻模式，暫停一回合（下次跳過擲骰）！",
    enDesc: "Relaxing by Sun Moon Lake! Core entering standby recharge mode, skip your next turn!",
    reward: "💤 暫停行動一回合",
    enReward: "💤 Skip next turn",
    action: (player, game) => {
      player.skipNextTurn = true;
      game.log(game.t('logStandbyTurn', game.getPlayerName(player)), 'fate');
    }
  },
  {
    title: "賽博坦科技專利費",
    enTitle: "Cybertron Patent Royalties",
    icon: "📜",
    desc: "你授權台灣半導體廠使用賽博坦合金技術，收取專利權利金 $1,200！",
    enDesc: "Licensed Cybertronian shape-memory alloys to local tech labs! Collect $1,200 royalties!",
    reward: "+ 領取專利費 $1,200",
    enReward: "+ Collect $1,200",
    action: (player, game) => {
      player.cash += 1200;
      game.log(game.t('logPatentFee', game.getPlayerName(player), 1200, player.cash), 'gain');
      game.updatePlayerScoreCards();
    }
  },
  {
    title: "拘留所安全抽查",
    enTitle: "Detention Safety Audit",
    icon: "🚨",
    desc: "檢察官認定你的變形載具具有高度危險性！直接移送【賽博坦維修所 / 監獄】！",
    enDesc: "Vehicle classification inspected by security! Immediately sent to Detention Bay / Jail!",
    reward: "🚨 移送拘留所",
    enReward: "🚨 Sent to Detention Bay",
    action: (player, game) => game.sendToJail(player)
  },
  {
    title: "博派愛心園遊會",
    enTitle: "Autobots Charity Fair",
    icon: "🎁",
    desc: "舉辦慈善公益園遊會，資助偏鄉科技教育，支付能量贊助款 $500。",
    enDesc: "Sponsored youth robotics and education! Donate $500 Energon to community charity.",
    reward: "- 贊助捐款 $500",
    enReward: "- Donate $500",
    action: (player, game) => {
      player.cash -= 500;
      game.log(game.t('logCharityDonate', game.getPlayerName(player), 500, player.cash), 'rent');
      game.updatePlayerScoreCards();
      game.checkBankruptcy(player);
    }
  },
  {
    title: "全島水庫乾旱補貼",
    enTitle: "Reservoir Rainmaking Grant",
    icon: "💧",
    desc: "協助台灣水資源水庫進行人工造雨人工充能，獲得特別補助 $800！",
    enDesc: "Assisted atmospheric rainmaking across reservoirs! Receive an $800 climate grant!",
    reward: "+ 獲得補助 $800",
    enReward: "+ Receive $800 grant",
    action: (player, game) => {
      player.cash += 800;
      game.log(game.t('logWaterSubsidy', game.getPlayerName(player), 800, player.cash), 'gain');
      game.updatePlayerScoreCards();
    }
  }
];

// --- Main Game State Management ---
class MonopolyGame {
  constructor() {
    this.sound = new SoundSystem();
    this.players = [];
    this.properties = {}; // key: tileId -> { owner: playerId, level: 0..5 } (0: unimproved, 1-4: houses, 5: fortress)
    this.currentTurnIndex = 0;
    this.dice = [1, 1];
    this.doublesCount = 0;
    this.hasRolled = false;
    this.gameSpeed = 1; // 1 = normal, 2 = fast
    this.speedNames = { 1: "正常", 2: "快節奏" };
    this.isProcessing = false;
    this.selectedDeedTile = null;
    this.lang = localStorage.getItem('tf_monopoly_lang') || 'zh';

    this.initBoardData();
    this.cacheDomElements();
    this.setupEventListeners();
    this.applyLanguageUI();
    this.startWatchdog();
  }

  t(key, ...args) {
    const dict = I18N[this.lang] || I18N['zh'];
    const val = dict[key];
    if (typeof val === 'function') {
      return val(...args);
    }
    return val !== undefined ? val : (I18N['zh'][key] !== undefined ? I18N['zh'][key] : key);
  }

  toggleLanguage() {
    this.setLanguage(this.lang === 'zh' ? 'en' : 'zh');
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('tf_monopoly_lang', lang);
    this.applyLanguageUI();
    this.renderBoardTiles();
    this.updateAllTokens();
    this.renderPlayersList();
    this.updateBoardUI();
    this.updateTurnIndicator();

    const p = this.getCurrentPlayer();
    if (p) {
      const pName = this.getPlayerName(p);
      if (p.inJail) {
        this.setBanner(this.t('bannerJailWaiting', pName));
      } else if (!this.hasRolled) {
        this.setBanner(this.t('bannerTurn', pName));
      } else {
        this.setBanner(this.t('bannerDone', pName));
      }
    }

    if (!this.setupModal.classList.contains('hidden')) {
      const activeCountBtn = document.querySelector('.count-pill.active');
      const count = parseInt(activeCountBtn ? activeCountBtn.dataset.count : 3);
      this.renderSetupCharacterSlots(count);
    }
  }

  applyLanguageUI() {
    const isEn = this.lang === 'en';
    document.title = this.t('title');

    const brandSub = document.querySelector('.brand-text .subtitle');
    if (brandSub) brandSub.textContent = this.t('brandSubtitle');

    // Language toggle button
    const langLabelEl = document.getElementById('langLabel');
    if (langLabelEl) langLabelEl.textContent = this.t('langBtn');

    // Header buttons
    const helpBtn = document.getElementById('helpBtnLabel');
    if (helpBtn) helpBtn.textContent = this.t('rules');

    const audioBtn = document.getElementById('audioBtnLabel');
    if (audioBtn) audioBtn.textContent = this.sound.enabled ? this.t('audioOn') : this.t('audioOff');

    const speedPrefix = document.getElementById('speedBtnPrefix');
    if (speedPrefix) speedPrefix.textContent = this.t('speedPrefix');

    const speedLabel = document.getElementById('speedLabel');
    if (speedLabel) speedLabel.textContent = this.gameSpeed === 2 ? this.t('speedFast') : this.t('speedNormal');

    const recoverBtn = document.getElementById('recoverBtnLabel');
    if (recoverBtn) recoverBtn.textContent = this.t('recover');

    const newGameBtn = document.getElementById('newGameBtnLabel');
    if (newGameBtn) newGameBtn.textContent = this.t('newGame');

    const turnLabelEl = document.querySelector('.status-turn-label');
    if (turnLabelEl) turnLabelEl.textContent = this.t('turnLabel');

    // Left sidebar titles
    const playersTitleEl = document.querySelector('.sidebar-players .section-title');
    if (playersTitleEl) playersTitleEl.innerHTML = `<span class="icon">🤖</span> ${this.t('playersTitle')}`;

    const portfolioTitleEl = document.querySelector('.portfolio-panel .section-title');
    if (portfolioTitleEl) portfolioTitleEl.innerHTML = `<span class="icon">🏢</span> ${this.t('portfolioTitle')}`;

    // Right sidebar
    const logTitleEl = document.querySelector('.sidebar-log .section-title');
    if (logTitleEl) logTitleEl.innerHTML = `<span class="icon">📜</span> ${this.t('logTitle')}`;

    const clearLogBtn = document.getElementById('btnClearLog');
    if (clearLogBtn) clearLogBtn.textContent = this.t('clearLog');

    // Board center elements
    const radarSub = document.querySelector('.center-title-badge .cyber-glow');
    if (radarSub) radarSub.textContent = this.t('radarCenterSubtitle');

    const radarH2 = document.querySelector('.center-title-badge h2');
    if (radarH2) radarH2.textContent = this.t('radarCenterTitle');

    const btnRoll = document.getElementById('btnRollDice');
    if (btnRoll) btnRoll.innerHTML = `<span class="icon">🎲</span> ${this.t('btnRoll')}`;

    const btnBuild = document.getElementById('btnBuildUpgrade');
    if (btnBuild) btnBuild.innerHTML = `<span class="icon">🏗️</span> ${this.t('btnBuild')}`;

    const btnEnd = document.getElementById('btnEndTurn');
    if (btnEnd) btnEnd.innerHTML = `<span class="icon">⏭️</span> ${this.t('btnEnd')}`;

    const fateDeckLabel = document.querySelector('#fateDeckVisual .deck-label');
    if (fateDeckLabel) fateDeckLabel.textContent = this.t('fateDeck');

    const chanceDeckLabel = document.querySelector('#chanceDeckVisual .deck-label');
    if (chanceDeckLabel) chanceDeckLabel.textContent = this.t('chanceDeck');

    // Setup modal elements
    const setupTitle = document.querySelector('#setupModal .modal-title h3');
    if (setupTitle) setupTitle.textContent = isEn ? "Taiwan Monopoly · Setup" : "台灣大富翁 ‧ 初始設定";
    const setupLabels = document.querySelectorAll('#setupModal .setup-label');
    if (setupLabels[0]) setupLabels[0].textContent = this.t('setupPlayersCountLabel');
    if (setupLabels[1]) setupLabels[1].textContent = this.t('setupCashLabel');
    if (setupLabels[2]) setupLabels[2].textContent = this.t('setupSlotsLabel');

    document.querySelectorAll('.count-pill').forEach(pill => {
      pill.textContent = this.t('setupPlayersCount', pill.dataset.count);
    });
    const cashPills = document.querySelectorAll('.cash-pill');
    if (cashPills[0]) cashPills.textContent = this.t('setupCashFast');
    if (cashPills[1]) cashPills.textContent = this.t('setupCashStandard');
    if (cashPills[2]) cashPills.textContent = this.t('setupCashRich');

    const btnStart = document.getElementById('btnStartGame');
    if (btnStart) btnStart.innerHTML = `<span class="icon">🚀</span> ${this.t('setupStartBtn')}`;

    // Rule modal elements
    const helpBadge = document.querySelector('#helpModal .modal-title span');
    if (helpBadge) helpBadge.textContent = this.t('ruleModalBadge');
    const helpTitle = document.querySelector('#helpModal .modal-title h3');
    if (helpTitle) helpTitle.textContent = this.t('ruleModalTitle');

    // Rule book sync
    const ruleZh = document.getElementById('ruleBookZh');
    const ruleEn = document.getElementById('ruleBookEn');
    const btnRuleZh = document.getElementById('btnRuleZh');
    const btnRuleEn = document.getElementById('btnRuleEn');
    if (ruleZh && ruleEn && btnRuleZh && btnRuleEn) {
      if (isEn) {
        btnRuleZh.classList.remove('active');
        btnRuleEn.classList.add('active');
        ruleZh.style.display = 'none';
        ruleEn.style.display = 'block';
      } else {
        btnRuleZh.classList.add('active');
        btnRuleEn.classList.remove('active');
        ruleZh.style.display = 'block';
        ruleEn.style.display = 'none';
      }
    }

    // Default buttons in modals
    const passPropBtn = document.getElementById('btnPassProperty');
    if (passPropBtn) passPropBtn.innerHTML = `<span class="icon">❌</span> ${this.t('btnPass')}`;
    const closeInspectBtn = document.getElementById('btnCloseInspectProperty');
    if (closeInspectBtn) closeInspectBtn.innerHTML = `<span class="icon">✖️</span> ${this.t('btnCloseDeed')}`;
    const passBuildBtn = document.getElementById('btnPassBuildHouse');
    if (passBuildBtn) passBuildBtn.innerHTML = `<span class="icon">❌</span> ${this.t('btnPassBuild')}`;

    const jailDangerTag = document.querySelector('#jailModal .danger-tag');
    if (jailDangerTag) jailDangerTag.textContent = this.t('jailStatusTag');
    const jailTitle = document.getElementById('jailTitle');
    if (jailTitle) jailTitle.textContent = this.t('jailTitle');
    const btnJailPay = document.getElementById('btnJailPay');
    if (btnJailPay) btnJailPay.innerHTML = `<span class="icon">💵</span> ${this.t('btnJailPay')}`;
    const btnJailCard = document.getElementById('btnJailCard');
    if (btnJailCard) btnJailCard.innerHTML = `<span class="icon">🎫</span> ${this.t('btnJailCard')}`;
    const btnJailRoll = document.getElementById('btnJailRoll');
    if (btnJailRoll) btnJailRoll.innerHTML = `<span class="icon">🎲</span> ${this.t('btnJailRoll')}`;

    const upgradeTitle = document.querySelector('#upgradeModal .modal-title span');
    if (upgradeTitle) upgradeTitle.textContent = this.t('upgradeTitle');
    const upgradeSub = document.querySelector('#upgradeModal .modal-title h3');
    if (upgradeSub) upgradeSub.textContent = this.t('upgradeSubtitle');
    const upgradeHint = document.querySelector('#upgradeModal .hint-text');
    if (upgradeHint) upgradeHint.textContent = this.t('upgradeHint');

    const restartBtn = document.getElementById('btnRestartGame');
    if (restartBtn) restartBtn.innerHTML = `<span class="icon">🔄</span> ${this.t('victoryRestart')}`;
  }

  initBoardData() {
    BOARD_TILES.forEach(t => {
      if (t.type === 'street' || t.type === 'railroad' || t.type === 'utility') {
        this.properties[t.id] = { owner: null, level: 0 };
      }
    });
  }

  cacheDomElements() {
    this.boardEl = document.getElementById('monopolyBoard');
    this.btnRollDice = document.getElementById('btnRollDice');
    this.btnBuildUpgrade = document.getElementById('btnBuildUpgrade');
    this.btnEndTurn = document.getElementById('btnEndTurn');
    this.die1El = document.getElementById('die1');
    this.die2El = document.getElementById('die2');
    this.diceResultText = document.getElementById('diceResultText');
    this.bannerMessage = document.getElementById('bannerMessage');
    this.playersListContainer = document.getElementById('playersListContainer');
    this.logContainer = document.getElementById('logContainer');
    this.currentTurnName = document.getElementById('currentTurnName');
    
    // Modals
    this.setupModal = document.getElementById('setupModal');
    this.propertyModal = document.getElementById('propertyModal');
    this.buildHouseModal = document.getElementById('buildHouseModal');
    this.cardModal = document.getElementById('cardModal');
    this.jailModal = document.getElementById('jailModal');
    this.upgradeModal = document.getElementById('upgradeModal');
    this.victoryModal = document.getElementById('victoryModal');
    this.helpModal = document.getElementById('helpModal');
  }

  setupEventListeners() {
    // Header Buttons
    const langBtn = document.getElementById('btnLangToggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.toggleLanguage();
      });
    }

    document.getElementById('btnAudioToggle').addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      document.getElementById('audioIcon').textContent = this.sound.enabled ? '🔊' : '🔇';
      const audioBtn = document.getElementById('audioBtnLabel');
      if (audioBtn) audioBtn.textContent = this.sound.enabled ? this.t('audioOn') : this.t('audioOff');
    });

    document.getElementById('btnGameSpeed').addEventListener('click', () => {
      this.gameSpeed = this.gameSpeed === 1 ? 2 : 1;
      document.getElementById('speedLabel').textContent = this.gameSpeed === 2 ? this.t('speedFast') : this.t('speedNormal');
    });

    document.getElementById('btnRecover').addEventListener('click', () => {
      this.forceRecoverTurn();
    });

    document.getElementById('btnHelp').addEventListener('click', () => {
      this.helpModal.classList.remove('hidden');
    });
    document.getElementById('btnCloseHelpModal').addEventListener('click', () => {
      this.helpModal.classList.add('hidden');
    });

    const btnRuleZh = document.getElementById('btnRuleZh');
    const btnRuleEn = document.getElementById('btnRuleEn');
    if (btnRuleZh && btnRuleEn) {
      btnRuleZh.addEventListener('click', () => {
        btnRuleZh.classList.add('active');
        btnRuleEn.classList.remove('active');
        document.getElementById('ruleBookZh').style.display = 'block';
        document.getElementById('ruleBookEn').style.display = 'none';
      });
      btnRuleEn.addEventListener('click', () => {
        btnRuleEn.classList.add('active');
        btnRuleZh.classList.remove('active');
        document.getElementById('ruleBookEn').style.display = 'block';
        document.getElementById('ruleBookZh').style.display = 'none';
      });
    }

    document.getElementById('btnNewGame').addEventListener('click', () => {
      if (confirm(this.t('newGameConfirm'))) {
        this.openSetupModal();
      }
    });

    document.getElementById('btnClearLog').addEventListener('click', () => {
      this.logContainer.innerHTML = '';
    });

    // Setup Modal buttons
    document.querySelectorAll('.count-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.count-pill').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.renderSetupCharacterSlots(parseInt(e.target.dataset.count));
      });
    });

    document.querySelectorAll('.cash-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cash-pill').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    document.getElementById('btnStartGame').addEventListener('click', () => {
      this.startGameFromSetup();
    });

    // Turn Actions
    this.btnRollDice.addEventListener('click', () => this.handleRollDice());
    this.btnEndTurn.addEventListener('click', () => this.handleEndTurn());
    this.btnBuildUpgrade.addEventListener('click', () => this.openUpgradeModal());
    document.getElementById('btnCloseUpgradeModal').addEventListener('click', () => {
      this.upgradeModal.classList.add('hidden');
    });

    // Click on dice arena also triggers roll or end turn
    const diceArenaEl = document.querySelector('.dice-arena');
    if (diceArenaEl) {
      diceArenaEl.addEventListener('click', () => {
        const p = this.getCurrentPlayer();
        if (!p || p.isAI || this.isProcessing) return;

        if (!this.hasRolled) {
          this.handleRollDice();
        } else if (this.btnEndTurn.style.display !== 'none') {
          this.handleEndTurn();
        }
      });
    }

    // Space / Enter keyboard shortcut
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        const openModal = document.querySelector('.modal-overlay:not(.hidden)');
        if (openModal) {
          const primaryBtn = openModal.querySelector('.primary-btn');
          if (primaryBtn) {
            e.preventDefault();
            primaryBtn.click();
          }
          return;
        }

        const p = this.getCurrentPlayer();
        if (!p || p.isAI || this.isProcessing) return;

        if (!this.hasRolled) {
          e.preventDefault();
          this.handleRollDice();
        } else if (this.btnEndTurn.style.display !== 'none') {
          e.preventDefault();
          this.handleEndTurn();
        }
      }
    });

    // Property modal actions
    document.getElementById('btnBuyProperty').addEventListener('click', () => this.confirmBuyProperty());
    document.getElementById('btnPassProperty').addEventListener('click', () => {
      this.propertyModal.classList.add('hidden');
      this.completeTurnAction();
    });
    document.getElementById('btnCloseInspectProperty').addEventListener('click', () => {
      this.propertyModal.classList.add('hidden');
    });

    // Build House modal actions
    const btnConfirmBuild = document.getElementById('btnConfirmBuildHouse');
    if (btnConfirmBuild) {
      btnConfirmBuild.addEventListener('click', () => this.confirmBuildHouse());
    }
    const btnPassBuild = document.getElementById('btnPassBuildHouse');
    if (btnPassBuild) {
      btnPassBuild.addEventListener('click', () => this.passBuildHouse());
    }

    // Card modal action
    document.getElementById('btnCloseCardModal').addEventListener('click', () => {
      this.cardModal.classList.add('hidden');
      if (this.pendingCardAction) {
        const action = this.pendingCardAction;
        this.pendingCardAction = null;
        action();
      }
    });

    // Jail modal actions
    document.getElementById('btnJailPay').addEventListener('click', () => this.payJailBail());
    document.getElementById('btnJailCard').addEventListener('click', () => this.useJailCard());
    document.getElementById('btnJailRoll').addEventListener('click', () => this.attemptJailDoubles());

    // Restart button in Victory modal
    document.getElementById('btnRestartGame').addEventListener('click', () => {
      this.victoryModal.classList.add('hidden');
      this.openSetupModal();
    });

    // Chance & Fate visual decks click (preview mode)
    document.getElementById('chanceDeckVisual').addEventListener('click', () => {
      const p = this.getCurrentPlayer();
      this.drawChanceCard(p, true);
    });
    document.getElementById('fateDeckVisual').addEventListener('click', () => {
      const p = this.getCurrentPlayer();
      this.drawFateCard(p, true);
    });
  }

  // --- Board Layout Rendering (11x11 Grid) ---
  renderBoardTiles() {
    // Clear any previous tiles
    const existingTiles = this.boardEl.querySelectorAll('.tile');
    existingTiles.forEach(t => t.remove());

    BOARD_TILES.forEach((tile, index) => {
      const tileEl = document.createElement('div');
      tileEl.className = `tile tile-${tile.id}`;
      tileEl.dataset.id = tile.id;

      // Assign CSS Grid row & col based on Monopoly perimeter
      const { row, col, edgeClass } = this.getGridPosition(index);
      tileEl.style.gridRow = row;
      tileEl.style.gridColumn = col;
      tileEl.classList.add(edgeClass);

      const isEn = this.lang === 'en';
      const mainName = isEn ? (tile.enName || tile.name) : tile.name;
      const subName = isEn ? tile.name : (tile.enName || '');

      if (tile.type === 'corner') {
        tileEl.classList.add('corner');
        const mainSub = isEn ? (tile.enSub || tile.sub || '') : (tile.sub || '');
        tileEl.innerHTML = `
          <div class="corner-icon">${tile.icon}</div>
          <div class="corner-name">
            <span class="corner-name-main">${mainName}</span>
            ${subName && subName !== mainName ? `<span class="corner-name-sub">${subName}</span>` : ''}
          </div>
          ${mainSub ? `<div class="corner-sub">${mainSub}</div>` : ''}
          <div class="tile-tokens-container" id="tokens-tile-${tile.id}"></div>
        `;
      } else {
        let colorBarHtml = '';
        if (tile.group) {
          const hex = this.getGroupColor(tile.group);
          colorBarHtml = `<div class="tile-color-bar" style="background-color: ${hex};"></div>`;
        }

        tileEl.innerHTML = `
          ${colorBarHtml}
          <div class="tile-buildings" id="buildings-tile-${tile.id}"></div>
          <div class="tile-content">
            <div class="tile-icon">${tile.icon || '📍'}</div>
            <div class="tile-name">
              <span class="tile-name-main">${mainName}</span>
              ${subName && subName !== mainName ? `<span class="tile-name-sub">${subName}</span>` : ''}
            </div>
            ${tile.price ? `<div class="tile-price">$${tile.price}</div>` : ''}
            ${tile.amount ? `<div class="tile-price">-$${tile.amount}</div>` : ''}
          </div>
          <div class="tile-owner-indicator" id="owner-tile-${tile.id}"></div>
          <div class="tile-tokens-container" id="tokens-tile-${tile.id}"></div>
        `;
      }

      // Click to inspect deed card
      tileEl.addEventListener('click', () => this.inspectTile(tile));
      this.boardEl.appendChild(tileEl);
    });
  }

  getGridPosition(idx) {
    // 0: Bottom-Right (row 11, col 11)
    // 1-9: Bottom row (row 11, col 10 down to 2)
    // 10: Bottom-Left (row 11, col 1)
    // 11-19: Left col (row 10 down to 2, col 1)
    // 20: Top-Left (row 1, col 1)
    // 21-29: Top row (row 1, col 2 to 10)
    // 30: Top-Right (row 1, col 11)
    // 31-39: Right col (row 2 to 10, col 11)

    if (idx === 0) return { row: 11, col: 11, edgeClass: 'corner-bottom-right' };
    if (idx >= 1 && idx <= 9) return { row: 11, col: 11 - idx, edgeClass: 'edge-bottom' };
    if (idx === 10) return { row: 11, col: 1, edgeClass: 'corner-bottom-left' };
    if (idx >= 11 && idx <= 19) return { row: 11 - (idx - 10), col: 1, edgeClass: 'edge-left' };
    if (idx === 20) return { row: 1, col: 1, edgeClass: 'corner-top-left' };
    if (idx >= 21 && idx <= 29) return { row: 1, col: 1 + (idx - 20), edgeClass: 'edge-top' };
    if (idx === 30) return { row: 1, col: 11, edgeClass: 'corner-top-right' };
    if (idx >= 31 && idx <= 39) return { row: 1 + (idx - 30), col: 11, edgeClass: 'edge-right' };
    return { row: 1, col: 1, edgeClass: 'unknown' };
  }

  getGroupColor(group) {
    const map = {
      brown: '#a0522d',
      lightblue: '#00b4d8',
      pink: '#d946ef',
      orange: '#f97316',
      red: '#ef4444',
      yellow: '#eab308',
      green: '#10b981',
      darkblue: '#2563eb'
    };
    return map[group] || '#64748b';
  }

  // --- Game Setup UI & Start ---
  openSetupModal() {
    this.renderSetupCharacterSlots(3); // default 3 players
    this.setupModal.classList.remove('hidden');
  }

  renderSetupCharacterSlots(count) {
    const container = document.getElementById('characterConfigGrid');
    container.innerHTML = '';

    const defaultChars = ['optimus', 'megatron', 'bumblebee', 'starscream'];

    for (let i = 0; i < count; i++) {
      const slotEl = document.createElement('div');
      slotEl.className = 'slot-card';

      const charKeys = Object.keys(CHARACTERS);
      const selectedKey = defaultChars[i] || charKeys[i % charKeys.length];
      const initialChar = CHARACTERS[selectedKey];

      let optionsHtml = '';
      charKeys.forEach(key => {
        const c = CHARACTERS[key];
        const cName = this.lang === 'en' ? (c.enName || c.name) : c.name;
        const cFaction = this.lang === 'en' ? (c.enFaction || c.faction) : c.faction;
        optionsHtml += `<option value="${key}" ${key === selectedKey ? 'selected' : ''}>${c.icon} ${cName} (${cFaction})</option>`;
      });

      const isFirstHuman = (i === 0);

      slotEl.innerHTML = `
        <div class="slot-idx">P${i + 1}</div>
        <div class="slot-avatar-preview" id="slotAvatarPreview_${i}" style="border-color:${initialChar.color};">
          ${initialChar.avatar ? `<img src="${initialChar.avatar}" alt="${initialChar.name}" class="slot-avatar-img">` : `<span>${initialChar.icon}</span>`}
        </div>
        <select class="slot-character-select" id="slotChar_${i}">
          ${optionsHtml}
        </select>
        <div class="slot-type-toggle">
          <button type="button" class="type-toggle-btn ${isFirstHuman ? 'active' : ''}" data-type="human" onclick="window.game.toggleSlotType(${i}, 'human')">${this.t('setupHuman')}</button>
          <button type="button" class="type-toggle-btn ${!isFirstHuman ? 'active' : ''}" data-type="ai" onclick="window.game.toggleSlotType(${i}, 'ai')">${this.t('setupAI')}</button>
        </div>
      `;
      container.appendChild(slotEl);

      const selectEl = slotEl.querySelector(`#slotChar_${i}`);
      if (selectEl) {
        selectEl.addEventListener('change', (e) => {
          const chosen = CHARACTERS[e.target.value];
          const preview = document.getElementById(`slotAvatarPreview_${i}`);
          if (preview && chosen) {
            preview.style.borderColor = chosen.color;
            preview.innerHTML = chosen.avatar
              ? `<img src="${chosen.avatar}" alt="${chosen.name}" class="slot-avatar-img">`
              : `<span>${chosen.icon}</span>`;
          }
        });
      }
    }
  }

  toggleSlotType(slotIdx, type) {
    const slotCard = document.querySelectorAll('.slot-card')[slotIdx];
    if (!slotCard) return;
    const btns = slotCard.querySelectorAll('.type-toggle-btn');
    btns.forEach(b => {
      if (b.dataset.type === type) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  startGameFromSetup() {
    const activeCountBtn = document.querySelector('.count-pill.active');
    const count = parseInt(activeCountBtn ? activeCountBtn.dataset.count : 3);

    const activeCashBtn = document.querySelector('.cash-pill.active');
    const startCash = parseInt(activeCashBtn ? activeCashBtn.dataset.cash : 15000);

    this.players = [];
    this.initBoardData();

    for (let i = 0; i < count; i++) {
      const selectEl = document.getElementById(`slotChar_${i}`);
      const charKey = selectEl ? selectEl.value : Object.keys(CHARACTERS)[i];
      const charData = CHARACTERS[charKey];

      const slotCard = document.querySelectorAll('.slot-card')[i];
      const activeTypeBtn = slotCard.querySelector('.type-toggle-btn.active');
      const isAI = activeTypeBtn ? (activeTypeBtn.dataset.type === 'ai') : (i > 0);

      const bonus = charData.bonusStartCash || 0;

      this.players.push({
        id: `player_${i}`,
        index: i,
        charKey: charKey,
        name: charData.name,
        enName: charData.enName,
        faction: charData.faction,
        enFaction: charData.enFaction,
        icon: charData.icon,
        avatar: charData.avatar || null,
        color: charData.color,
        isAI: isAI,
        cash: startCash + bonus,
        position: 0,
        inJail: false,
        jailTurns: 0,
        hasGetOutOfJailCard: false,
        isBankrupt: false,
        skipNextTurn: false
      });
    }

    this.currentTurnIndex = 0;
    this.doublesCount = 0;
    this.hasRolled = false;
    this.isProcessing = false;

    this.setupModal.classList.add('hidden');
    this.renderBoardTiles();
    this.updateAllTokens();
    this.renderPlayersList();
    this.updateBoardUI();

    this.log(this.t('logGameStart', count, startCash));
    this.sound.playUpgrade();

    // Start first turn
    this.beginTurn();
  }

  // --- Helper Getters for i18n Entity Names ---
  getPlayerName(player) {
    if (!player) return '';
    return (this.lang === 'en' && player.enName) ? player.enName : player.name;
  }

  getPlayerFaction(player) {
    if (!player) return '';
    return (this.lang === 'en' && player.enFaction) ? player.enFaction : player.faction;
  }

  getTileName(tile) {
    if (!tile) return '';
    return (this.lang === 'en' && tile.enName) ? tile.enName : tile.name;
  }

  // --- Turn Management ---
  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  beginTurn() {
    const p = this.getCurrentPlayer();
    if (!p) return;

    this.isProcessing = false;
    this.hasRolled = false;
    this.doublesCount = 0;

    // Check if player is bankrupt
    if (p.isBankrupt) {
      this.advanceTurn();
      return;
    }

    this.updateTurnIndicator();
    this.updateBoardUI();

    // Check skip turn condition
    if (p.skipNextTurn) {
      p.skipNextTurn = false;
      const pName = this.getPlayerName(p);
      this.log(this.t('logCooldown', pName));
      this.setBanner(this.t('bannerCooldown', pName));
      setTimeout(() => this.advanceTurn(), this.getDelay(1000));
      return;
    }

    // Check jail condition
    if (p.inJail) {
      this.handleJailTurn(p);
      return;
    }

    this.setBanner(this.t('bannerTurn', this.getPlayerName(p)));

    if (p.isAI) {
      this.btnRollDice.style.display = 'none';
      this.btnEndTurn.style.display = 'none';
      this.btnBuildUpgrade.style.display = 'none';
      setTimeout(() => this.aiDecideTurn(), this.getDelay(800));
    } else {
      this.btnRollDice.style.display = 'inline-flex';
      this.btnRollDice.disabled = false;
      this.btnRollDice.classList.add('pulse-glow');
      this.btnEndTurn.style.display = 'none';
      this.btnEndTurn.classList.remove('pulse-glow');
      this.checkUpgradeButtonVisibility();
    }
  }

  handleRollDice() {
    if (this.hasRolled || this.isProcessing) return;
    const p = this.getCurrentPlayer();
    if (p.isAI) return;

    this.executeDiceRoll(p);
  }

  executeDiceRoll(player) {
    this.isProcessing = true;
    this.sound.playDiceRoll();

    // Dice animation
    this.die1El.classList.add('rolling');
    this.die2El.classList.add('rolling');

    setTimeout(() => {
      this.die1El.classList.remove('rolling');
      this.die2El.classList.remove('rolling');

      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      this.dice = [d1, d2];
      const sum = d1 + d2;
      const isDoubles = (d1 === d2);

      this.renderDieFace(this.die1El, d1);
      this.renderDieFace(this.die2El, d2);

      this.diceResultText.textContent = this.t('diceRolled', d1, d2, sum, isDoubles);
      this.hasRolled = true;

      // Double bonus for Bumblebee
      if (isDoubles && player.charKey === 'bumblebee') {
        player.cash += 200;
        this.log(this.t('logBumblebeeDouble', this.getPlayerName(player), 200, player.cash), 'gain');
        this.updatePlayerScoreCards();
      }

      // Check 3 doubles in a row -> Jail
      if (isDoubles) {
        this.doublesCount++;
        if (this.doublesCount >= 3) {
          this.log(this.t('log3DoublesJail', this.getPlayerName(player)));
          this.sendToJail(player);
          this.isProcessing = false;
          return;
        }
      } else {
        this.doublesCount = 0;
      }

      this.log(this.t('logRolled', this.getPlayerName(player), sum, d1, d2));
      this.movePlayerSteps(player, sum, () => {
        this.landOnTile(player, player.position);
      });
    }, this.getDelay(450));
  }

  renderDieFace(dieEl, value) {
    dieEl.dataset.val = value;
    const faceEl = dieEl.querySelector('.die-face');
    faceEl.className = `die-face face-${value}`;
    faceEl.innerHTML = '';

    const dotPatterns = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]]
    };

    const pattern = dotPatterns[value] || dotPatterns[1];
    pattern.forEach(([r, c]) => {
      const pip = document.createElement('span');
      pip.className = 'pip';
      pip.style.gridRow = r;
      pip.style.gridColumn = c;
      faceEl.appendChild(pip);
    });
  }

  // --- Player Pawn Movement Animation ---
  movePlayerSteps(player, steps, callback) {
    let remaining = steps;

    const stepInterval = setInterval(() => {
      if (remaining <= 0) {
        clearInterval(stepInterval);
        callback();
        return;
      }

      const prevPos = player.position;
      player.position = (player.position + 1) % 40;
      remaining--;

      this.sound.playStep();

      // Check Pass GO (wrapping around board index 39 -> 0)
      if (prevPos > player.position) {
        player.cash += 2000;
        this.sound.playBuy();
        this.log(this.t('logPassGO', this.getPlayerName(player), 2000, player.cash), 'gain');
      }

      this.updateAllTokens();
      this.updatePlayerScoreCards();
    }, this.getDelay(160));
  }

  teleportPlayer(player, targetIndex) {
    player.position = targetIndex;
    this.updateAllTokens();
    this.landOnTile(player, targetIndex);
  }

  movePlayerTo(player, targetIndex) {
    // If targetIndex is behind, player passed GO!
    if (targetIndex < player.position) {
      player.cash += 2000;
      this.sound.playBuy();
      this.log(this.t('logPassGO', this.getPlayerName(player), 2000, player.cash), 'gain');
    }
    player.position = targetIndex;
    this.updateAllTokens();
    this.landOnTile(player, targetIndex);
  }

  // --- Landing Logic on Spaces ---
  landOnTile(player, tileId) {
    const tile = BOARD_TILES[tileId];
    const pName = this.getPlayerName(player);
    const tileName = this.getTileName(tile);
    this.setBanner(this.t('bannerLanded', pName, tileName));

    switch (tile.type) {
      case 'corner':
        if (tileId === 0) {
          // Exactly on GO (already rewarded when stepping to 0)
          this.log(this.t('logLandGO', pName));
        } else if (tileId === 30) {
          // Go To Jail
          this.log(this.t('logGoToJailTile', pName));
          this.sendToJail(player);
          return;
        }
        this.completeTurnAction();
        break;

      case 'tax':
        let taxAmt = tile.amount;
        if (player.charKey === 'ironhide') {
          taxAmt = Math.round(taxAmt * 0.8);
          this.log(this.t('logIronhideArmor', taxAmt));
        }
        player.cash -= taxAmt;
        this.sound.playRent();
        this.log(this.t('logTax', pName, tileName, taxAmt, player.cash), 'rent');
        this.updatePlayerScoreCards();
        this.checkBankruptcy(player);
        this.completeTurnAction();
        break;

      case 'chance':
        this.drawChanceCard(player);
        break;

      case 'fate':
        this.drawFateCard(player);
        break;

      case 'street':
      case 'railroad':
      case 'utility':
        this.handlePropertyLand(player, tile);
        break;

      default:
        this.completeTurnAction();
        break;
    }
  }

  // --- Property Interactions (Buy & Rent) ---
  handlePropertyLand(player, tile) {
    const prop = this.properties[tile.id];
    const pName = this.getPlayerName(player);
    const tileName = this.getTileName(tile);

    if (!prop.owner) {
      // Unowned land -> Prompt to Buy
      let price = tile.price;
      if (player.charKey === 'megatron') {
        price = Math.round(price * 0.9); // 10% discount
      }

      if (player.isAI) {
        // AI buying decision
        if (player.cash >= price + 1000) {
          this.buyProperty(player, tile.id, price);
        } else {
          this.log(this.t('logAIPass', pName, tileName));
        }
        this.completeTurnAction();
      } else {
        // Human player modal: Show prompt asking whether to buy
        this.showBuyPropertyModal(tile, price);
      }
    } else if (prop.owner === player.id) {
      // Land owned by self -> Prompt to build house / upgrade if street and not max level
      if (tile.type === 'street' && prop.level < 5) {
        if (player.isAI) {
          if (player.cash >= tile.houseCost + 1500) {
            this.buildPropertyUpgradeOnLand(player, tile, prop);
          } else {
            this.log(this.t('logAIPassBuild', pName, tileName));
            this.completeTurnAction();
          }
        } else {
          // Human player: Show prompt asking whether to build a house / upgrade
          this.showBuildHouseModal(tile, prop);
        }
      } else {
        if (tile.type === 'street' && prop.level >= 5) {
          this.log(this.t('logVisitSelfMax', pName, tileName));
        } else {
          this.log(this.t('logVisitSelf', pName, tileName));
        }
        this.completeTurnAction();
      }
    } else {
      // Land owned by opponent -> Pay Rent!
      const owner = this.players.find(p => p.id === prop.owner);
      if (owner && !owner.isBankrupt) {
        this.calculateAndPayRent(player, owner, tile, prop);
      } else {
        this.completeTurnAction();
      }
    }
  }

  showBuyPropertyModal(tile, actualPrice, isInspectMode = false) {
    this.selectedDeedTile = tile;
    const isEn = this.lang === 'en';
    const mainTitle = isEn ? (tile.enName || tile.name) : tile.name;
    const subTitle = isEn ? tile.name : (tile.enName || '');
    const p = this.getCurrentPlayer();

    // Prompt Header
    const promptBadge = document.getElementById('propertyPromptBadge');
    if (promptBadge) {
      promptBadge.textContent = isInspectMode ? this.t('inspectPromptBadge') : this.t('buyPromptBadge');
    }
    const promptTitle = document.getElementById('propertyPromptTitle');
    if (promptTitle) {
      const tileName = this.getTileName(tile);
      promptTitle.textContent = isInspectMode ? this.t('inspectPromptTitle') : this.t('buyPromptTitle', p ? this.getPlayerName(p) : '', tileName);
    }
    const balanceBox = document.getElementById('propertyPlayerBalance');
    if (balanceBox) {
      if (isInspectMode || !p) {
        balanceBox.style.display = 'none';
      } else {
        balanceBox.style.display = 'flex';
        const balLabel = document.getElementById('propertyBalanceLabel');
        if (balLabel) balLabel.textContent = this.t('balanceLabel');
        const balCash = document.getElementById('propertyPlayerCash');
        if (balCash) balCash.textContent = `$${p.cash}`;
      }
    }

    document.getElementById('deedTitle').innerHTML = `${mainTitle}${subTitle && subTitle !== mainTitle ? ` <span style="font-size:12px; font-weight:normal; opacity:0.8;">(${subTitle})</span>` : ''}`;

    let groupText = '';
    if (tile.group) {
      groupText = isEn ? `${tile.group.toUpperCase()} DISTRICT` : `${tile.group.toUpperCase()} 地段`;
    } else {
      groupText = isEn ? tile.type.toUpperCase() : (tile.type === 'railroad' ? (isEn ? 'HIGH-SPEED RAIL' : '高鐵站') : (tile.type === 'utility' ? (isEn ? 'PUBLIC UTILITY' : '公共事業') : tile.type.toUpperCase()));
    }
    document.getElementById('deedGroupName').textContent = groupText;
    document.getElementById('deedHeader').style.background = tile.group ? this.getGroupColor(tile.group) : '#334155';
    document.getElementById('deedPrice').textContent = `$${tile.price}`;

    const priceRowLabel = document.querySelector('.deed-price-row span:first-child');
    if (priceRowLabel) priceRowLabel.textContent = this.t('deedPriceLabel');

    const buildCostRow = document.querySelector('.deed-build-cost');
    if (buildCostRow) {
      buildCostRow.innerHTML = `<span>${this.t('deedHouseCostLabel')}</span><span id="deedHouseCost">${tile.houseCost ? `$${tile.houseCost}` : this.t('deedCannotBuild')}</span>`;
    }

    const rentTableEl = document.getElementById('deedRentTable');
    if (tile.type === 'street') {
      rentTableEl.style.display = 'flex';
      rentTableEl.innerHTML = `
        <div class="rent-row"><span>${this.t('deedBaseRent')}</span><span id="rentBase">$${tile.rent[0]}</span></div>
        <div class="rent-row"><span>${this.t('deedRent1')}</span><span id="rent1">$${tile.rent[1]}</span></div>
        <div class="rent-row"><span>${this.t('deedRent2')}</span><span id="rent2">$${tile.rent[2]}</span></div>
        <div class="rent-row"><span>${this.t('deedRent3')}</span><span id="rent3">$${tile.rent[3]}</span></div>
        <div class="rent-row"><span>${this.t('deedRent4')}</span><span id="rent4">$${tile.rent[4]}</span></div>
        <div class="rent-row highlight"><span>${this.t('deedRentHotel')}</span><span id="rentHotel">$${tile.rent[5]}</span></div>
      `;
    } else if (tile.type === 'railroad') {
      rentTableEl.style.display = 'block';
      rentTableEl.innerHTML = `
        <div class="rent-row"><span>${this.t('deedRail1')}</span><span>$250</span></div>
        <div class="rent-row"><span>${this.t('deedRail2')}</span><span>$500</span></div>
        <div class="rent-row"><span>${this.t('deedRail3')}</span><span>$1,000</span></div>
        <div class="rent-row highlight"><span>${this.t('deedRail4')}</span><span>$2,000</span></div>
      `;
    } else if (tile.type === 'utility') {
      rentTableEl.style.display = 'block';
      rentTableEl.innerHTML = `
        <div class="rent-row"><span>${this.t('deedUtil1')}</span></div>
        <div class="rent-row highlight"><span>${this.t('deedUtil2')}</span></div>
      `;
    }

    const buyContainer = document.getElementById('propertyBuyActions');
    const inspectContainer = document.getElementById('propertyInspectActions');

    const buyBtn = document.getElementById('btnBuyProperty');
    const passBtn = document.getElementById('btnPassProperty');
    if (passBtn) {
      passBtn.innerHTML = `<span class="icon">❌</span> ${this.t('btnPass')}`;
    }
    const closeInspectBtn = document.getElementById('btnCloseInspectProperty');
    if (closeInspectBtn) {
      closeInspectBtn.innerHTML = `<span class="icon">✖️</span> ${this.t('btnCloseDeed')}`;
    }

    if (isInspectMode) {
      buyContainer.style.display = 'none';
      inspectContainer.style.display = 'flex';
    } else {
      buyContainer.style.display = 'flex';
      inspectContainer.style.display = 'none';

      if (buyBtn && p) {
        if (p.cash < actualPrice) {
          buyBtn.disabled = true;
          buyBtn.style.opacity = '0.5';
          buyBtn.innerHTML = `<span class="icon">⚠️</span> ${this.t('btnBuyDisabled', `$${actualPrice}`)}`;
        } else {
          buyBtn.disabled = false;
          buyBtn.style.opacity = '1';
          buyBtn.innerHTML = `<span class="icon">💰</span> ${this.t('btnBuy', `$${actualPrice}`)}`;
        }
      }
    }

    this.propertyModal.classList.remove('hidden');
  }

  showBuildHouseModal(tile, prop) {
    this.selectedBuildTile = tile;
    const p = this.getCurrentPlayer();
    const isEn = this.lang === 'en';
    const mainTitle = isEn ? (tile.enName || tile.name) : tile.name;
    const subTitle = isEn ? tile.name : (tile.enName || '');

    const badgeEl = document.getElementById('buildHousePromptBadge');
    if (badgeEl) badgeEl.textContent = this.t('buildHouseBadge');

    const titleEl = document.getElementById('buildHousePromptTitle');
    if (titleEl) titleEl.textContent = this.t('buildHouseTitle', p ? this.getPlayerName(p) : '', this.getTileName(tile));

    const balanceLabelEl = document.getElementById('buildHouseBalanceLabel');
    if (balanceLabelEl) balanceLabelEl.textContent = this.t('balanceLabel');

    const balanceCashEl = document.getElementById('buildHousePlayerCash');
    if (balanceCashEl && p) balanceCashEl.textContent = `$${p.cash}`;

    // Header of card
    const headerEl = document.getElementById('buildHouseHeader');
    if (headerEl) headerEl.style.background = tile.group ? this.getGroupColor(tile.group) : '#334155';

    const groupEl = document.getElementById('buildHouseGroupName');
    if (groupEl) {
      groupEl.textContent = isEn ? `${tile.group.toUpperCase()} DISTRICT` : `${tile.group.toUpperCase()} 地段`;
    }

    const deedTitleEl = document.getElementById('buildHouseTitle');
    if (deedTitleEl) {
      deedTitleEl.innerHTML = `${mainTitle}${subTitle && subTitle !== mainTitle ? ` <span style="font-size:12px; font-weight:normal; opacity:0.8;">(${subTitle})</span>` : ''}`;
    }

    // Status details
    const currLabelEl = document.getElementById('buildCurrentLabel');
    if (currLabelEl) currLabelEl.textContent = this.t('buildCurrentLabel');

    const currStatusEl = document.getElementById('buildCurrentStatus');
    if (currStatusEl) {
      if (prop.level === 0) currStatusEl.textContent = this.t('statusUnbuiltShort');
      else currStatusEl.textContent = this.t('podName', prop.level);
    }

    const nextLabelEl = document.getElementById('buildNextLabel');
    if (nextLabelEl) nextLabelEl.textContent = this.t('buildNextLabel');

    const nextBuildingName = prop.level === 4 ? this.t('fortressName') : this.t('podName', prop.level + 1);
    const nextStatusEl = document.getElementById('buildNextStatus');
    if (nextStatusEl) nextStatusEl.textContent = nextBuildingName;

    const costLabelEl = document.getElementById('buildCostLabel');
    if (costLabelEl) costLabelEl.textContent = this.t('buildCostLabel');

    const costValEl = document.getElementById('buildCostVal');
    if (costValEl) costValEl.textContent = `$${tile.houseCost}`;

    const rentChangeLabelEl = document.getElementById('buildRentChangeLabel');
    if (rentChangeLabelEl) rentChangeLabelEl.textContent = this.t('buildRentChangeLabel');

    const groupTiles = COLOR_GROUPS[tile.group] || [];
    const hasMonopoly = p ? groupTiles.every(tid => this.properties[tid].owner === p.id) : false;
    const currRent = (prop.level === 0) ? (tile.rent[0] * (hasMonopoly ? 2 : 1)) : tile.rent[prop.level];
    const nextRent = tile.rent[prop.level + 1];

    const rentDiffEl = document.getElementById('buildRentDiff');
    if (rentDiffEl) rentDiffEl.textContent = `$${currRent} ➔ $${nextRent}`;

    // Buttons
    const btnBuild = document.getElementById('btnConfirmBuildHouse');
    const btnPass = document.getElementById('btnPassBuildHouse');

    if (btnPass) {
      btnPass.innerHTML = `<span class="icon">❌</span> ${this.t('btnPassBuild')}`;
    }

    if (btnBuild && p) {
      if (p.cash >= tile.houseCost) {
        btnBuild.disabled = false;
        btnBuild.style.opacity = '1';
        btnBuild.innerHTML = `<span class="icon">🔨</span> ${this.t('btnBuildHouse', nextBuildingName, tile.houseCost)}`;
      } else {
        btnBuild.disabled = true;
        btnBuild.style.opacity = '0.5';
        btnBuild.innerHTML = `<span class="icon">⚠️</span> ${this.t('btnBuildHouseDisabled', tile.houseCost)}`;
      }
    }

    this.buildHouseModal.classList.remove('hidden');
  }

  confirmBuildHouse() {
    this.buildHouseModal.classList.add('hidden');
    if (!this.selectedBuildTile) {
      this.completeTurnAction();
      return;
    }
    const tile = this.selectedBuildTile;
    const prop = this.properties[tile.id];
    const p = this.getCurrentPlayer();

    if (p && p.cash >= tile.houseCost && prop.level < 5) {
      p.cash -= tile.houseCost;
      prop.level++;
      this.sound.playUpgrade();
      const bName = prop.level === 5 ? this.t('fortressName') : this.t('podName', prop.level);
      this.log(this.t('logUpgrade', this.getPlayerName(p), this.getTileName(tile), bName, tile.houseCost, p.cash), 'upgrade');
      this.updateTileBuildingsVisual(tile.id, prop.level);
      this.updatePlayerScoreCards();
      this.renderPortfolioQuickView();
    }
    this.completeTurnAction();
  }

  passBuildHouse() {
    this.buildHouseModal.classList.add('hidden');
    if (this.selectedBuildTile) {
      const p = this.getCurrentPlayer();
      if (p) {
        this.log(this.t('logVisitSelf', this.getPlayerName(p), this.getTileName(this.selectedBuildTile)));
      }
    }
    this.completeTurnAction();
  }

  buildPropertyUpgradeOnLand(player, tile, prop) {
    player.cash -= tile.houseCost;
    prop.level++;
    this.sound.playUpgrade();
    const bName = prop.level === 5 ? this.t('fortressName') : this.t('podName', prop.level);
    this.log(this.t('logUpgrade', this.getPlayerName(player), this.getTileName(tile), bName, tile.houseCost, player.cash), 'upgrade');
    this.updateTileBuildingsVisual(tile.id, prop.level);
    this.updatePlayerScoreCards();
    this.renderPortfolioQuickView();
    this.completeTurnAction();
  }

  confirmBuyProperty() {
    this.propertyModal.classList.add('hidden');
    if (!this.selectedDeedTile) return;

    const p = this.getCurrentPlayer();
    let price = this.selectedDeedTile.price;
    if (p.charKey === 'megatron') price = Math.round(price * 0.9);

    if (p.cash >= price) {
      this.buyProperty(p, this.selectedDeedTile.id, price);
    }
    this.completeTurnAction();
  }

  buyProperty(player, tileId, price) {
    player.cash -= price;
    this.properties[tileId].owner = player.id;
    this.sound.playBuy();

    const tile = BOARD_TILES[tileId];
    this.log(this.t('logBuyProp', this.getPlayerName(player), this.getTileName(tile), price, player.cash), 'buy');

    this.updateTileOwnershipVisual(tileId, player);
    this.updatePlayerScoreCards();
    this.renderPortfolioQuickView();
  }

  calculateAndPayRent(player, owner, tile, prop) {
    // Starscream trait check (20% evade unimproved rent)
    if (player.charKey === 'starscream' && prop.level === 0) {
      if (Math.random() < 0.2) {
        this.log(this.t('logStarscreamEvade', this.getTileName(tile)), 'evade');
        this.completeTurnAction();
        return;
      }
    }

    let rent = 0;

    if (tile.type === 'street') {
      const groupTiles = COLOR_GROUPS[tile.group];
      const hasMonopoly = groupTiles.every(tid => this.properties[tid].owner === owner.id);

      if (prop.level === 0) {
        rent = tile.rent[0] * (hasMonopoly ? 2 : 1);
      } else {
        rent = tile.rent[prop.level];
      }
    } else if (tile.type === 'railroad') {
      const ownedRailroads = [5, 15, 25, 35].filter(tid => this.properties[tid].owner === owner.id).length;
      const rates = [0, 250, 500, 1000, 2000];
      rent = rates[ownedRailroads] || 250;
    } else if (tile.type === 'utility') {
      const ownedUtilities = [12, 28].filter(tid => this.properties[tid].owner === owner.id).length;
      const diceSum = this.dice[0] + this.dice[1];
      const multiplier = (ownedUtilities === 2) ? 100 : 40;
      rent = diceSum * multiplier;

      if (owner.charKey === 'soundwave') {
        rent = Math.round(rent * 1.5);
        this.log(this.t('logSoundwaveUtility'), 'gain');
      }
    }

    // Process payment
    const payerName = this.getPlayerName(player);
    const ownerName = this.getPlayerName(owner);
    const tileName = this.getTileName(tile);

    const actualPay = Math.max(0, Math.min(player.cash, rent));
    player.cash -= rent;
    owner.cash += actualPay;

    this.sound.playRent();

    // Prominently log both rent loss (payer) and rent gain (owner) with exact cash balances!
    this.log(this.t('logPayRentLoss', payerName, tileName, ownerName, rent, player.cash), 'rent');
    this.log(this.t('logPayRentGain', ownerName, tileName, payerName, actualPay, owner.cash), 'gain');

    this.updatePlayerScoreCards();
    this.checkBankruptcy(player, owner);
    this.completeTurnAction();
  }

  // --- Chance & Fate Decks Execution ---
  drawChanceCard(player, isPreview = false) {
    const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    const label = this.lang === 'en' ? "⚡ CHANCE" : "⚡ 機會 CHANCE";
    this.showCardModal(label, card, player, isPreview);
  }

  drawFateCard(player, isPreview = false) {
    const card = FATE_CARDS[Math.floor(Math.random() * FATE_CARDS.length)];
    const label = this.lang === 'en' ? "🔮 FATE" : "🔮 命運 FATE";
    this.showCardModal(label, card, player, isPreview);
  }

  showCardModal(typeLabel, card, player, isPreview = false) {
    this.sound.playCard();
    const isEn = this.lang === 'en';
    const previewSuffix = isPreview ? this.t('cardPreviewSuffix') : "";
    document.getElementById('cardModalType').textContent = typeLabel + previewSuffix;
    document.getElementById('cardModalIcon').textContent = card.icon;
    document.getElementById('cardModalTitle').textContent = isEn ? (card.enTitle || card.title) : card.title;
    document.getElementById('cardModalDesc').textContent = isEn ? (card.enDesc || card.desc) : card.desc;
    document.getElementById('cardModalReward').textContent = isEn ? (card.enReward || card.reward || '') : (card.reward || '');

    const confirmBtn = document.getElementById('btnCloseCardModal');
    if (isPreview) {
      confirmBtn.innerHTML = `<span class="icon">✖️</span> ${this.t('closeCardPreview')}`;
      this.pendingCardAction = null;
    } else {
      confirmBtn.innerHTML = `<span class="icon">✅</span> ${this.t('closeCardModal')}`;
      this.pendingCardAction = () => {
        const prevPos = player.position;
        const prevJail = player.inJail;

        try {
          card.action(player, this);
        } catch (err) {
          console.error("Card action error:", err);
        }

        // If card didn't move the player and didn't send them to jail,
        // we MUST complete the turn action now!
        if (player.position === prevPos && player.inJail === prevJail) {
          this.completeTurnAction();
        }
      };
    }

    this.cardModal.classList.remove('hidden');

    // Auto close for AI player if not in preview mode
    if (!isPreview && player.isAI) {
      setTimeout(() => {
        if (!this.cardModal.classList.contains('hidden')) {
          confirmBtn.click();
        }
      }, this.getDelay(1200));
    }
  }

  // --- Jail System ---
  sendToJail(player) {
    player.position = 10;
    player.inJail = true;
    player.jailTurns = 3;
    this.doublesCount = 0;
    this.sound.playJail();

    this.log(this.t('logJailSent', this.getPlayerName(player)));
    this.updateAllTokens();
    this.updatePlayerScoreCards();
    this.completeTurnAction();
  }

  handleJailTurn(player) {
    const pName = this.getPlayerName(player);
    this.setBanner(this.t('bannerJailWaiting', pName));

    if (player.isAI) {
      setTimeout(() => {
        if (player.hasGetOutOfJailCard) {
          this.useJailCard();
        } else if (player.cash > 2500) {
          this.payJailBail();
        } else {
          this.attemptJailDoubles();
        }
      }, this.getDelay(800));
    } else {
      const dangerTag = document.querySelector('#jailModal .danger-tag');
      if (dangerTag) dangerTag.textContent = this.t('jailStatusTag');
      const titleEl = document.getElementById('jailTitle');
      if (titleEl) titleEl.textContent = this.t('jailTitle');
      const descEl = document.getElementById('jailDesc');
      if (descEl) descEl.innerHTML = this.t('jailDesc', `<span id="jailTurnsLeft">${player.jailTurns}</span>`);
      const btnPay = document.getElementById('btnJailPay');
      if (btnPay) btnPay.innerHTML = `<span class="icon">💵</span> ${this.t('btnJailPay')}`;
      const btnCard = document.getElementById('btnJailCard');
      if (btnCard) btnCard.innerHTML = `<span class="icon">🎫</span> ${this.t('btnJailCard')}`;
      const btnRoll = document.getElementById('btnJailRoll');
      if (btnRoll) btnRoll.innerHTML = `<span class="icon">🎲</span> ${this.t('btnJailRoll')}`;

      document.getElementById('jailTurnsLeft').textContent = player.jailTurns;
      const cardBtn = document.getElementById('btnJailCard');
      cardBtn.style.display = player.hasGetOutOfJailCard ? 'block' : 'none';
      this.jailModal.classList.remove('hidden');
    }
  }

  payJailBail() {
    this.jailModal.classList.add('hidden');
    const p = this.getCurrentPlayer();
    if (p.cash >= 500) {
      p.cash -= 500;
      p.inJail = false;
      p.jailTurns = 0;
      this.sound.playBuy();
      this.log(this.t('logJailBail', this.getPlayerName(p), 500, p.cash), 'jail');
      this.updatePlayerScoreCards();
      this.beginTurn();
    } else {
      this.attemptJailDoubles();
    }
  }

  useJailCard() {
    this.jailModal.classList.add('hidden');
    const p = this.getCurrentPlayer();
    if (p.hasGetOutOfJailCard) {
      p.hasGetOutOfJailCard = false;
      p.inJail = false;
      p.jailTurns = 0;
      this.sound.playBuy();
      this.log(this.t('logJailPardon', this.getPlayerName(p)), 'jail');
      this.updatePlayerScoreCards();
      this.beginTurn();
    }
  }

  attemptJailDoubles() {
    this.jailModal.classList.add('hidden');
    const p = this.getCurrentPlayer();
    this.sound.playDiceRoll();

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    this.dice = [d1, d2];
    this.renderDieFace(this.die1El, d1);
    this.renderDieFace(this.die2El, d2);

    if (d1 === d2) {
      p.inJail = false;
      p.jailTurns = 0;
      this.log(this.t('logJailDoubles', this.getPlayerName(p), d1, d2), 'jail');
      this.sound.playUpgrade();
      this.movePlayerSteps(p, d1 + d2, () => this.landOnTile(p, p.position));
    } else {
      p.jailTurns--;
      this.log(this.t('logJailFail', this.getPlayerName(p), d1, d2, p.jailTurns), 'jail');
      if (p.jailTurns <= 0) {
        p.cash -= 500;
        p.inJail = false;
        this.log(this.t('logJailForce', this.getPlayerName(p), 500, p.cash), 'jail');
        this.updatePlayerScoreCards();
      }
      this.completeTurnAction();
    }
  }

  // --- Building / Upgrade Logic ---
  openUpgradeModal() {
    const p = this.getCurrentPlayer();
    const listEl = document.getElementById('upgradeList');
    listEl.innerHTML = '';

    const modalTitle = document.querySelector('#upgradeModal .modal-title span');
    if (modalTitle) modalTitle.textContent = this.t('upgradeTitle');
    const modalSubtitle = document.querySelector('#upgradeModal .modal-title h3');
    if (modalSubtitle) modalSubtitle.textContent = this.t('upgradeSubtitle');
    const hintEl = document.querySelector('#upgradeModal .hint-text');
    if (hintEl) hintEl.textContent = this.t('upgradeHint');

    const monopolies = this.getPlayerMonopolies(p.id);

    if (monopolies.length === 0) {
      listEl.innerHTML = `<p class="placeholder-hint">${this.t('upgradeNoMonopoly')}</p>`;
    } else {
      monopolies.forEach(color => {
        COLOR_GROUPS[color].forEach(tid => {
          const tile = BOARD_TILES[tid];
          const prop = this.properties[tid];
          const isMax = (prop.level >= 5);
          const nextName = prop.level < 4 ? this.t('podName', prop.level + 1) : this.t('fortressName');
          const tileName = this.getTileName(tile);

          let statusText = '';
          if (prop.level === 0) statusText = this.t('currentStatusUnbuilt');
          else if (prop.level < 5) statusText = this.t('currentStatusBuilt', prop.level);
          else statusText = this.t('currentStatusFortress');

          const itemEl = document.createElement('div');
          itemEl.className = 'upgrade-item';
          itemEl.innerHTML = `
            <div>
              <strong style="color:${this.getGroupColor(color)}">${tileName}</strong>
              <div style="font-size:12px; color:#94a3b8;">${statusText}</div>
            </div>
            <div>
              ${isMax ? `<span style="color:#f59e0b; font-weight:bold;">${this.t('upgradeMax')}</span>` : `
                <button class="action-btn primary-btn small-btn" onclick="window.game.buildPropertyUpgrade(${tid})">
                  ${this.t('upgradeBuildBtn', nextName, tile.houseCost)}
                </button>
              `}
            </div>
          `;
          listEl.appendChild(itemEl);
        });
      });
    }

    this.upgradeModal.classList.remove('hidden');
  }

  getPlayerMonopolies(playerId) {
    const result = [];
    Object.keys(COLOR_GROUPS).forEach(color => {
      const tileIds = COLOR_GROUPS[color];
      const hasAll = tileIds.every(tid => this.properties[tid].owner === playerId);
      if (hasAll) result.push(color);
    });
    return result;
  }

  buildPropertyUpgrade(tileId) {
    const p = this.getCurrentPlayer();
    const tile = BOARD_TILES[tileId];
    const prop = this.properties[tileId];

    if (p.cash >= tile.houseCost && prop.level < 5) {
      p.cash -= tile.houseCost;
      prop.level++;
      this.sound.playUpgrade();
      const bName = prop.level === 5 ? this.t('fortressName') : this.t('podName', prop.level);
      this.log(this.t('logUpgrade', this.getPlayerName(p), this.getTileName(tile), bName, tile.houseCost, p.cash), 'upgrade');
      this.updateTileBuildingsVisual(tileId, prop.level);
      this.updatePlayerScoreCards();
      this.renderPortfolioQuickView();
      if (!this.upgradeModal.classList.contains('hidden')) {
        this.openUpgradeModal(); // refresh
      }
    }
  }

  checkUpgradeButtonVisibility() {
    const p = this.getCurrentPlayer();
    if (!p || p.isAI) {
      this.btnBuildUpgrade.style.display = 'none';
      return;
    }
    const monopolies = this.getPlayerMonopolies(p.id);
    if (monopolies.length > 0) {
      this.btnBuildUpgrade.style.display = 'inline-flex';
    } else {
      this.btnBuildUpgrade.style.display = 'none';
    }
  }

  // --- AI Automations ---
  aiDecideTurn() {
    const p = this.getCurrentPlayer();
    if (!p.isAI) return;

    // AI Check Upgrades before rolling if has money
    const monopolies = this.getPlayerMonopolies(p.id);
    if (monopolies.length > 0 && p.cash > 4000) {
      monopolies.forEach(color => {
        COLOR_GROUPS[color].forEach(tid => {
          const tile = BOARD_TILES[tid];
          const prop = this.properties[tid];
          if (prop.level < 5 && p.cash > tile.houseCost + 2000) {
            this.buildPropertyUpgrade(tid);
          }
        });
      });
    }

    // AI Roll
    this.executeDiceRoll(p);
  }

  // --- Turn Completion & Advancement ---
  completeTurnAction() {
    this.isProcessing = false;
    this.updatePlayerScoreCards();
    this.renderPortfolioQuickView();

    const p = this.getCurrentPlayer();
    if (!p) return;

    if (p.isBankrupt) {
      setTimeout(() => this.advanceTurn(), this.getDelay(800));
      return;
    }

    // Check if doubles -> roll again (if not in jail and not bankrupt)
    if (this.dice[0] === this.dice[1] && !p.inJail && this.doublesCount > 0) {
      this.setBanner(this.t('bannerDoubles', this.getPlayerName(p), this.dice[0], this.dice[1]));
      this.hasRolled = false;

      if (p.isAI) {
        setTimeout(() => this.aiDecideTurn(), this.getDelay(1000));
      } else {
        this.btnRollDice.style.display = 'inline-flex';
        this.btnRollDice.disabled = false;
        this.btnRollDice.classList.add('pulse-glow');
        this.btnEndTurn.style.display = 'none';
        this.btnEndTurn.classList.remove('pulse-glow');
        this.checkUpgradeButtonVisibility();
      }
      return;
    }

    if (p.isAI) {
      setTimeout(() => this.advanceTurn(), this.getDelay(900));
    } else {
      this.btnRollDice.style.display = 'none';
      this.btnRollDice.classList.remove('pulse-glow');
      this.btnEndTurn.style.display = 'inline-flex';
      this.btnEndTurn.classList.add('pulse-glow');
      this.setBanner(this.t('bannerDone', this.getPlayerName(p)));
      this.checkUpgradeButtonVisibility();
    }
  }

  handleEndTurn() {
    this.btnEndTurn.style.display = 'none';
    this.btnEndTurn.classList.remove('pulse-glow');
    this.advanceTurn();
  }

  advanceTurn() {
    this.checkVictoryCondition();

    const activePlayers = this.players.filter(p => !p.isBankrupt);
    if (activePlayers.length <= 1) {
      return; // Game finished!
    }

    // Find next active player
    let nextIdx = (this.currentTurnIndex + 1) % this.players.length;
    let loops = 0;
    while (this.players[nextIdx].isBankrupt && loops < this.players.length) {
      nextIdx = (nextIdx + 1) % this.players.length;
      loops++;
    }

    this.currentTurnIndex = nextIdx;
    this.renderPortfolioQuickView();
    this.beginTurn();
  }

  // --- Watchdog & Emergency Turn Recovery ---
  startWatchdog() {
    if (this.watchdogInterval) clearInterval(this.watchdogInterval);
    this.stuckCounter = 0;

    this.watchdogInterval = setInterval(() => {
      // Don't auto-reset if user is reading an open modal
      const openModal = document.querySelector('.modal-overlay:not(.hidden)');
      if (openModal) {
        this.stuckCounter = 0;
        return;
      }

      if (this.isProcessing) {
        this.stuckCounter++;
        // If state remains locked for more than 4 seconds without any modal
        if (this.stuckCounter >= 4) {
          console.warn("Watchdog: Detected unresponsive state. Automatically recovering turn flow...");
          this.log(this.t('logRecoverAuto'));
          this.isProcessing = false;
          this.stuckCounter = 0;
          const p = this.getCurrentPlayer();
          if (p) {
            if (p.isAI) {
              this.advanceTurn();
            } else {
              this.completeTurnAction();
            }
          }
        }
      } else {
        this.stuckCounter = 0;
      }
    }, 1000);
  }

  forceRecoverTurn() {
    console.warn("Manual force recover triggered");
    this.propertyModal.classList.add('hidden');
    this.cardModal.classList.add('hidden');
    this.jailModal.classList.add('hidden');
    this.upgradeModal.classList.add('hidden');
    if (this.buildHouseModal) this.buildHouseModal.classList.add('hidden');

    this.isProcessing = false;
    this.pendingCardAction = null;
    this.stuckCounter = 0;

    const p = this.getCurrentPlayer();
    if (!p) return;

    if (p.isAI) {
      this.log(this.t('logRecoverManual', `AI ${this.getPlayerName(p)}`));
      this.advanceTurn();
    } else {
      const pName = this.getPlayerName(p);
      this.log(this.t('logRecoverManual', pName));
      if (!this.hasRolled) {
        this.btnRollDice.style.display = 'inline-flex';
        this.btnRollDice.disabled = false;
        this.btnRollDice.classList.add('pulse-glow');
        this.btnEndTurn.style.display = 'none';
        this.btnEndTurn.classList.remove('pulse-glow');
        this.setBanner(this.t('bannerTurn', pName));
      } else {
        this.btnRollDice.style.display = 'none';
        this.btnEndTurn.style.display = 'inline-flex';
        this.btnEndTurn.classList.add('pulse-glow');
        this.setBanner(this.t('bannerDone', pName));
      }
      this.checkUpgradeButtonVisibility();
    }
  }

  // --- Bankruptcy & Victory Detection ---
  checkBankruptcy(player, creditor = null) {
    if (player.cash < 0) {
      player.isBankrupt = true;
      this.sound.playJail();
      this.log(this.t('logBankrupt', this.getPlayerName(player)));

      // Liquidation / transfer of properties
      Object.keys(this.properties).forEach(tid => {
        if (this.properties[tid].owner === player.id) {
          if (creditor && !creditor.isBankrupt) {
            this.properties[tid].owner = creditor.id;
            this.updateTileOwnershipVisual(tid, creditor);
          } else {
            this.properties[tid].owner = null;
            this.properties[tid].level = 0;
            this.updateTileOwnershipVisual(tid, null);
            this.updateTileBuildingsVisual(tid, 0);
          }
        }
      });

      this.updateAllTokens();
      this.updatePlayerScoreCards();
      this.checkVictoryCondition();
    }
  }

  checkVictoryCondition() {
    const activePlayers = this.players.filter(p => !p.isBankrupt);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      this.sound.playVictory();

      const winnerName = this.getPlayerName(winner);
      const winnerFaction = this.getPlayerFaction(winner);
      document.getElementById('winnerTitle').textContent = this.t('victoryTitle', winnerName);
      document.getElementById('winnerSubtitle').textContent = this.t('victorySubtitle', winnerFaction);

      const avatarBox = document.getElementById('victoryAvatarBox');
      if (avatarBox) {
        avatarBox.style.display = 'block';
        avatarBox.style.borderColor = winner.color || 'var(--accent-gold)';
        avatarBox.innerHTML = winner.avatar
          ? `<img src="${winner.avatar}" alt="${winnerName}" class="victory-avatar-img">`
          : `<span style="font-size:64px;">${winner.icon}</span>`;
      }

      const statsEl = document.getElementById('victoryStats');
      let totalProps = Object.values(this.properties).filter(p => p.owner === winner.id).length;
      const unit = this.lang === 'en' ? 'properties' : '處';
      statsEl.innerHTML = `
        <div style="font-size:16px; margin-top:10px;">${this.t('victoryCash')}<strong style="color:#10b981;">$${winner.cash}</strong></div>
        <div style="font-size:16px; margin-top:4px;">${this.t('victoryProps')}<strong>${totalProps} ${unit}</strong></div>
      `;

      this.victoryModal.classList.remove('hidden');
    }
  }

  // --- UI Update Helpers ---
  updateTurnIndicator() {
    const p = this.getCurrentPlayer();
    if (!p) return;
    this.currentTurnName.textContent = this.getPlayerName(p);
    this.currentTurnName.style.color = p.color;

    const turnAvatar = document.getElementById('turnAvatarBadge');
    if (turnAvatar) {
      turnAvatar.style.display = 'inline-flex';
      turnAvatar.style.borderColor = p.color;
      turnAvatar.innerHTML = p.avatar
        ? `<img src="${p.avatar}" alt="${this.getPlayerName(p)}" class="turn-avatar-img">`
        : `<span>${p.icon}</span>`;
    }

    // Highlight player card
    document.querySelectorAll('.player-card').forEach((card, idx) => {
      if (idx === this.currentTurnIndex) card.classList.add('active-turn');
      else card.classList.remove('active-turn');
    });
  }

  setBanner(msg) {
    this.bannerMessage.textContent = msg;
  }

  log(msg, type = null) {
    const entry = document.createElement('div');
    if (!type) {
      if (msg.includes('💸')) type = 'rent';
      else if (msg.includes('💰')) type = 'gain';
      else if (msg.includes('🏢')) type = 'buy';
      else if (msg.includes('🏗️')) type = 'upgrade';
      else if (msg.includes('🔒') || msg.includes('💵')) type = 'jail';
      else if (msg.includes('⚡')) type = 'chance';
      else if (msg.includes('🔮')) type = 'fate';
    }
    entry.className = 'log-entry' + (type ? ` ${type}` : '');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    entry.innerHTML = `<span class="log-time">[${timeStr}]</span> ${msg}`;

    this.logContainer.prepend(entry);
  }

  updateAllTokens() {
    // Clear all token slots
    BOARD_TILES.forEach(t => {
      const container = document.getElementById(`tokens-tile-${t.id}`);
      if (container) container.innerHTML = '';
    });

    // Re-place active tokens
    this.players.forEach(p => {
      if (p.isBankrupt) return;
      const container = document.getElementById(`tokens-tile-${p.position}`);
      if (container) {
        const token = document.createElement('div');
        token.className = 'pawn-token';
        token.style.borderColor = p.color;
        token.style.background = p.color;
        token.title = `${this.getPlayerName(p)} (${this.getPlayerFaction(p)})`;
        if (p.avatar) {
          token.innerHTML = `<img src="${p.avatar}" alt="${this.getPlayerName(p)}" class="token-avatar-img">`;
        } else {
          token.textContent = p.icon;
        }
        container.appendChild(token);
      }
    });
  }

  updateTileOwnershipVisual(tileId, owner) {
    const indicator = document.getElementById(`owner-tile-${tileId}`);
    if (indicator) {
      indicator.style.backgroundColor = owner ? owner.color : 'transparent';
      indicator.style.height = owner ? '6px' : '0px';
    }
  }

  updateTileBuildingsVisual(tileId, level) {
    const container = document.getElementById(`buildings-tile-${tileId}`);
    if (!container) return;
    container.innerHTML = '';

    if (level >= 1 && level <= 4) {
      for (let i = 0; i < level; i++) {
        const pip = document.createElement('div');
        pip.className = 'house-pip';
        container.appendChild(pip);
      }
    } else if (level === 5) {
      const hotel = document.createElement('div');
      hotel.className = 'hotel-pip';
      hotel.textContent = '🏰';
      container.appendChild(hotel);
    }
  }

  renderPlayersList() {
    this.playersListContainer.innerHTML = '';

    this.players.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = `player-card ${idx === this.currentTurnIndex ? 'active-turn' : ''} ${p.isBankrupt ? 'bankrupt' : ''}`;
      card.id = `playerCard_${p.id}`;

      const pName = this.getPlayerName(p);
      const pFaction = this.getPlayerFaction(p);
      const count = Object.values(this.properties).filter(prop => prop.owner === p.id).length;
      const propLabel = this.lang === 'en' ? 'Props' : '地產';
      const jailBadge = this.t('inJailBadge');
      const playerTypeStr = p.isAI ? this.t('setupAI') : this.t('setupHuman');

      card.innerHTML = `
        <div class="player-card-header">
          <div class="player-identity">
            <div class="player-avatar-badge" style="background:${p.color}; border:2px solid ${p.color};">
              ${p.avatar ? `<img src="${p.avatar}" alt="${pName}" class="avatar-badge-img">` : p.icon}
            </div>
            <div class="player-info-text">
              <div class="player-name">${pName} ${p.inJail ? `<span class="jail-badge">${jailBadge}</span>` : ''}</div>
              <div class="player-faction">${pFaction}</div>
            </div>
          </div>
          <span class="player-type-pill ${p.isAI ? 'ai' : ''}">${playerTypeStr}</span>
        </div>
        <div class="player-stats-row">
          <span class="cash-amount" id="cashVal_${p.id}">$${p.cash}</span>
          <span class="property-count" id="propCount_${p.id}">${propLabel}: ${count}</span>
        </div>
      `;
      this.playersListContainer.appendChild(card);
    });
  }

  updatePlayerScoreCards() {
    const propLabel = this.lang === 'en' ? 'Props' : '地產';
    const jailBadge = this.t('inJailBadge');

    this.players.forEach(p => {
      const cashEl = document.getElementById(`cashVal_${p.id}`);
      if (cashEl) cashEl.textContent = `$${p.cash}`;

      const card = document.getElementById(`playerCard_${p.id}`);
      if (card) {
        if (p.isBankrupt) card.classList.add('bankrupt');
        if (p.inJail) {
          let badge = card.querySelector('.jail-badge');
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'jail-badge';
            card.querySelector('.player-name').appendChild(badge);
          }
          badge.textContent = jailBadge;
        } else {
          const badge = card.querySelector('.jail-badge');
          if (badge) badge.remove();
        }
      }

      const count = Object.values(this.properties).filter(prop => prop.owner === p.id).length;
      const propCountEl = document.getElementById(`propCount_${p.id}`);
      if (propCountEl) propCountEl.textContent = `${propLabel}: ${count}`;
    });
  }

  renderPortfolioQuickView() {
    const container = document.getElementById('quickPortfolioContent');
    if (!container) return;
    if (!this.players || this.players.length === 0) {
      container.innerHTML = `<p class="placeholder-hint">${this.t('portfolioHint')}</p>`;
      return;
    }

    const isEn = this.lang === 'en';
    const countUnit = isEn ? 'props' : '處';
    let html = '';

    this.players.forEach((p, idx) => {
      const pName = this.getPlayerName(p);
      const ownedTiles = [];
      Object.keys(this.properties).forEach(tid => {
        if (this.properties[tid].owner === p.id) {
          ownedTiles.push(BOARD_TILES[tid]);
        }
      });

      const isActiveTurn = (idx === this.currentTurnIndex);
      const activeClass = isActiveTurn ? 'active-player' : '';
      const bankruptClass = p.isBankrupt ? 'bankrupt' : '';

      let tilesHtml = '';
      if (ownedTiles.length === 0) {
        tilesHtml = `<span class="portfolio-none">${this.t('noPropertiesYet')}</span>`;
      } else {
        tilesHtml = ownedTiles.map(tile => {
          const prop = this.properties[tile.id];
          const bg = tile.group ? this.getGroupColor(tile.group) : '#475569';
          const tName = this.getTileName(tile);
          let levelBadge = '';
          if (prop && prop.level >= 1 && prop.level <= 4) {
            levelBadge = ` <span class="chip-level">🏠×${prop.level}</span>`;
          } else if (prop && prop.level === 5) {
            levelBadge = ` <span class="chip-level">🏰</span>`;
          }
          return `<button type="button" class="portfolio-tile-chip" style="background:${bg};" onclick="window.game.inspectTileById(${tile.id})" title="${this.t('portfolioInspectTitle', tName)}">${tName}${levelBadge}</button>`;
        }).join('');
      }

      html += `
        <div class="portfolio-player-section ${activeClass} ${bankruptClass}" id="portfolio_sec_${p.id}">
          <div class="portfolio-player-header">
            <div class="portfolio-player-identity">
              <div class="portfolio-player-avatar" style="background:${p.color}; border-color:${p.color};">
                ${p.avatar ? `<img src="${p.avatar}" alt="${pName}">` : p.icon}
              </div>
              <span class="portfolio-player-name" style="color:${p.color};">${pName}</span>
              ${p.isBankrupt ? `<span class="portfolio-badge bankrupt">(${this.t('bankruptBadge')})</span>` : ''}
            </div>
            <span class="portfolio-player-count">${ownedTiles.length} ${countUnit}</span>
          </div>
          <div class="portfolio-tiles-row">
            ${tilesHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  updateBoardUI() {
    this.updateAllTokens();
    this.updatePlayerScoreCards();
    this.renderPortfolioQuickView();
  }

  inspectTile(tile) {
    if (tile.type === 'street' || tile.type === 'railroad' || tile.type === 'utility') {
      this.selectedDeedTile = tile;
      this.showBuyPropertyModal(tile, tile.price, true);
    }
  }

  inspectTileById(tileId) {
    const tile = BOARD_TILES[tileId];
    if (tile) {
      this.inspectTile(tile);
    }
  }

  getDelay(ms) {
    return this.gameSpeed === 2 ? Math.round(ms * 0.35) : ms;
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.game = new MonopolyGame();
  window.game.openSetupModal();
});
