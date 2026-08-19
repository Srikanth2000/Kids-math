/**
 * Kids Number Quest - Core Game Engine
 */

class KidsMathGame {
  constructor() {
    this.currentMode = 'counting';
    this.stars = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.currentQuestionIndex = 1;
    this.totalQuestionsPerRound = 5;
    this.currentQuestion = null;
    this.isAnsweringLocked = false;
    this.unlockedStickers = [];

    this.stickers = [
      { id: 'star', name: 'Golden Star', emoji: '⭐', cost: 1 },
      { id: 'rocket', name: 'Space Rocket', emoji: '🚀', cost: 3 },
      { id: 'unicorn', name: 'Magical Unicorn', emoji: '🦄', cost: 6 },
      { id: 'lion', name: 'Brave Lion', emoji: '🦁', cost: 9 },
      { id: 'rainbow', name: 'Happy Rainbow', emoji: '🌈', cost: 12 },
      { id: 'crown', name: 'Super Crown', emoji: '👑', cost: 15 },
      { id: 'robot', name: 'Robo Buddy', emoji: '🤖', cost: 18 },
      { id: 'dino', name: 'Friendly Dino', emoji: '🦖', cost: 21 },
      { id: 'pizza', name: 'Yummy Pizza', emoji: '🍕', cost: 24 },
      { id: 'trophy', name: 'Grand Champion', emoji: '🏆', cost: 30 }
    ];

    this.mascotMoods = {
      default: { avatar: '⭐', msg: "Hi friend! Let's play with numbers! 🚀" },
      happy: [
        { avatar: '🥳', msg: "Wow! Fantastic! That's correct! ⭐" },
        { avatar: '🌟', msg: "Super job! You are so smart! 🎈" },
        { avatar: '🤩', msg: "Awesome! You nailed it! 🚀" },
        { avatar: '🎉', msg: "Brilliant! Keep going! 🏆" }
      ],
      encouraging: [
        { avatar: '🤗', msg: "Good try! Let's try once more! 💡" },
        { avatar: '🧐', msg: "Almost there! You can do it! 🌟" },
        { avatar: '🐰', msg: "Don't worry, give it another go! 🐾" }
      ],
      victory: { avatar: '🏆', msg: "CONGRATULATIONS! You are a Math Champion! 🎉" }
    };

    this.initElements();
    this.initEventListeners();
    this.loadQuestion();
  }

  initElements() {
    this.dom = {
      starScore: document.getElementById('star-score'),
      streakScore: document.getElementById('streak-score'),
      currentQNum: document.getElementById('current-q-num'),
      totalQNum: document.getElementById('total-q-num'),
      progressBar: document.getElementById('progress-bar'),
      stickerCount: document.getElementById('sticker-count'),
      modeTabs: document.querySelectorAll('.mode-tab'),
      mascotAvatar: document.getElementById('mascot-avatar'),
      mascotSpeech: document.getElementById('mascot-speech'),
      questionText: document.getElementById('question-text'),
      visualDisplay: document.getElementById('visual-display'),
      optionsGrid: document.getElementById('options-grid'),
      feedbackBanner: document.getElementById('feedback-banner'),
      btnVoice: document.getElementById('btn-voice'),
      btnSound: document.getElementById('btn-sound'),
      soundIcon: document.getElementById('sound-icon'),
      soundLabel: document.getElementById('sound-label'),
      btnSpeakQuestion: document.getElementById('btn-speak-question'),
      btnStickers: document.getElementById('btn-stickers'),
      btnCloseStickers: document.getElementById('btn-close-stickers'),
      stickerModal: document.getElementById('sticker-modal'),
      stickersGrid: document.getElementById('stickers-grid'),
      congratulationsModal: document.getElementById('congratulations-modal'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnVictoryStickers: document.getElementById('btn-victory-stickers'),
      victoryStars: document.getElementById('victory-stars'),
      victoryStreak: document.getElementById('victory-streak'),
      victoryStickerEmoji: document.getElementById('victory-sticker-emoji'),
      victoryStickerName: document.getElementById('victory-sticker-name'),
      victoryStickerBox: document.getElementById('victory-sticker-box')
    };

    this.dom.totalQNum.textContent = this.totalQuestionsPerRound;
  }

  initEventListeners() {
    // Mode Switcher
    this.dom.modeTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        soundEngine.playPop();
        this.dom.modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentMode = tab.dataset.mode;
        this.currentQuestionIndex = 1;
        this.updateProgress();
        this.loadQuestion();
      });
    });

    // Sound toggle
    this.dom.btnSound.addEventListener('click', () => {
      const isSoundOn = soundEngine.toggleSound();
      this.dom.soundIcon.textContent = isSoundOn ? '🔊' : '🔇';
      this.dom.soundLabel.textContent = isSoundOn ? 'Sound ON' : 'Sound OFF';
      if (isSoundOn) soundEngine.playPop();
    });

    // Voice toggle
    this.dom.btnVoice.addEventListener('click', () => {
      soundEngine.playPop();
      const isVoiceOn = soundEngine.toggleVoice();
      const label = this.dom.btnVoice.querySelector('.btn-label');
      if (label) {
        label.textContent = isVoiceOn ? 'Voice ON' : 'Voice OFF';
      }
      if (isVoiceOn) {
        soundEngine.speak("Voice narrator is on!");
      }
    });

    // Read Question Aloud
    this.dom.btnSpeakQuestion.addEventListener('click', () => {
      soundEngine.playPop();
      if (this.currentQuestion) {
        soundEngine.speak(this.currentQuestion.speechText || this.currentQuestion.prompt);
      }
    });

    // Mascot click animation
    this.dom.mascotAvatar.addEventListener('click', () => {
      soundEngine.playPop();
      soundEngine.speak("Let's keep learning and having fun!");
      this.setMascot('🥳', "You are doing amazing, keep it up!");
    });

    // Sticker Book Modal
    this.dom.btnStickers.addEventListener('click', () => {
      soundEngine.playPop();
      this.renderStickerBook();
      this.dom.stickerModal.hidden = false;
    });

    this.dom.btnCloseStickers.addEventListener('click', () => {
      soundEngine.playPop();
      this.dom.stickerModal.hidden = true;
    });

    // Victory screen actions
    this.dom.btnPlayAgain.addEventListener('click', () => {
      soundEngine.playPop();
      confettiEngine.stopVictoryShower();
      this.dom.congratulationsModal.hidden = true;
      this.currentQuestionIndex = 1;
      this.updateProgress();
      this.loadQuestion();
      this.setMascot(this.mascotMoods.default.avatar, "New round! Let's explore more numbers! 🚀");
    });

    this.dom.btnVictoryStickers.addEventListener('click', () => {
      soundEngine.playPop();
      confettiEngine.stopVictoryShower();
      this.dom.congratulationsModal.hidden = true;
      this.renderStickerBook();
      this.dom.stickerModal.hidden = false;
    });
  }

  // Set Mascot Mood
  setMascot(avatar, message) {
    this.dom.mascotAvatar.textContent = avatar;
    this.dom.mascotSpeech.textContent = message;
  }

  // Update HUD Display
  updateHUD() {
    this.dom.starScore.textContent = this.stars;
    this.dom.streakScore.textContent = this.streak;
    this.dom.currentQNum.textContent = this.currentQuestionIndex;
    this.dom.totalQNum.textContent = this.totalQuestionsPerRound;
    this.updateProgress();
    this.checkStickers();
  }

  updateProgress() {
    const pct = ((this.currentQuestionIndex - 1) / this.totalQuestionsPerRound) * 100;
    this.dom.progressBar.style.width = `${Math.min(100, Math.max(10, pct))}%`;
  }

  checkStickers() {
    let newUnlock = false;
    this.stickers.forEach(s => {
      if (this.stars >= s.cost && !this.unlockedStickers.includes(s.id)) {
        this.unlockedStickers.push(s.id);
        newUnlock = true;
      }
    });
    this.dom.stickerCount.textContent = this.unlockedStickers.length;
    return newUnlock;
  }

  renderStickerBook() {
    this.dom.stickersGrid.innerHTML = '';
    this.stickers.forEach(s => {
      const isUnlocked = this.unlockedStickers.includes(s.id);
      const slot = document.createElement('div');
      slot.className = `sticker-slot ${isUnlocked ? 'unlocked' : ''}`;
      slot.innerHTML = `
        <div class="sticker-emoji">${s.emoji}</div>
        <div class="sticker-name">${isUnlocked ? s.name : `⭐ ${s.cost} stars`}</div>
      `;
      this.dom.stickersGrid.appendChild(slot);
    });
  }

  /**
   * QUESTION GENERATORS
   */
  generateQuestion() {
    switch (this.currentMode) {
      case 'counting':
        return this.generateCountingQuestion();
      case 'addition':
        return this.generateAdditionQuestion();
      case 'compare':
        return this.generateCompareQuestion();
      case 'pattern':
        return this.generatePatternQuestion();
      default:
        return this.generateCountingQuestion();
    }
  }

  // 1. COUNTING MODE
  generateCountingQuestion() {
    const items = [
      { emoji: '🍎', name: 'apples' },
      { emoji: '🌟', name: 'stars' },
      { emoji: '🐱', name: 'kitties' },
      { emoji: '🐶', name: 'puppies' },
      { emoji: '🚗', name: 'cars' },
      { emoji: '🚀', name: 'rockets' },
      { emoji: '🍓', name: 'strawberries' },
      { emoji: '🎈', name: 'balloons' }
    ];

    const targetItem = items[Math.floor(Math.random() * items.length)];
    const count = Math.floor(Math.random() * 8) + 1; // 1 to 8

    const options = this.generateUniqueOptions(count, 1, 10, 4);

    return {
      prompt: `How many ${targetItem.name} do you see?`,
      speechText: `How many ${targetItem.name} do you see? Count them!`,
      answer: count,
      options: options,
      render: (container) => {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
          const span = document.createElement('span');
          span.className = 'visual-item';
          span.textContent = targetItem.emoji;
          span.style.animationDelay = `${i * 0.07}s`;
          span.title = `Item ${i + 1}`;
          span.addEventListener('click', () => {
            soundEngine.playPop();
            span.style.transform = 'scale(1.4) rotate(20deg)';
            setTimeout(() => { span.style.transform = ''; }, 200);
          });
          container.appendChild(span);
        }
      }
    };
  }

  // 2. ADDITION & SUBTRACTION MODE
  generateAdditionQuestion() {
    const isAddition = Math.random() > 0.35; // 65% addition, 35% subtraction
    const emojis = ['🍎', '⭐', '🎈', '🍪', '🌸', '🍭'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    let num1, num2, answer, symbol, promptText, speechText;

    if (isAddition) {
      num1 = Math.floor(Math.random() * 5) + 1; // 1 to 5
      num2 = Math.floor(Math.random() * 5) + 1; // 1 to 5
      answer = num1 + num2;
      symbol = '+';
      promptText = `${num1} + ${num2} = ?`;
      speechText = `What is ${num1} plus ${num2}?`;
    } else {
      num1 = Math.floor(Math.random() * 6) + 3; // 3 to 8
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to num1-1
      answer = num1 - num2;
      symbol = '-';
      promptText = `${num1} - ${num2} = ?`;
      speechText = `What is ${num1} minus ${num2}?`;
    }

    const options = this.generateUniqueOptions(answer, 1, 12, 4);

    return {
      prompt: promptText,
      speechText: speechText,
      answer: answer,
      options: options,
      render: (container) => {
        container.innerHTML = `
          <div class="equation-group">
            <div class="math-cluster">${emoji.repeat(num1)} <strong style="font-size:1.5rem;margin-left:6px;">(${num1})</strong></div>
            <div class="math-symbol">${symbol}</div>
            <div class="math-cluster">${emoji.repeat(num2)} <strong style="font-size:1.5rem;margin-left:6px;">(${num2})</strong></div>
            <div class="math-symbol">=</div>
            <div class="math-cluster" style="background:#fff200;font-size:1.8rem;font-weight:bold;color:#ff4757;padding:10px 20px;">?</div>
          </div>
        `;
      }
    };
  }

  // 3. BIGGER OR SMALLER MODE
  generateCompareQuestion() {
    const isBigger = Math.random() > 0.5;
    let n1 = Math.floor(Math.random() * 19) + 1;
    let n2 = Math.floor(Math.random() * 19) + 1;
    while (n1 === n2) {
      n2 = Math.floor(Math.random() * 19) + 1;
    }

    const answer = isBigger ? Math.max(n1, n2) : Math.min(n1, n2);
    const modeWord = isBigger ? 'BIGGER' : 'SMALLER';
    const speechWord = isBigger ? 'bigger' : 'smaller';

    return {
      prompt: `Which number is ${modeWord}?`,
      speechText: `Which number is ${speechWord}? ${n1} or ${n2}?`,
      answer: answer,
      options: [n1, n2],
      render: (container) => {
        container.innerHTML = `
          <div class="equation-group">
            <div class="compare-card">${n1}</div>
            <div class="math-symbol" style="color:#a4b0be;">vs</div>
            <div class="compare-card">${n2}</div>
          </div>
        `;
      }
    };
  }

  // 4. NUMBER PATTERNS MODE
  generatePatternQuestion() {
    const stepOptions = [1, 2, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const start = Math.floor(Math.random() * 5) * step + step;
    const seq = [start, start + step, start + step * 2, start + step * 3];

    // Pick missing position (usually 3rd or 4th item)
    const missingIdx = Math.random() > 0.5 ? 2 : 3;
    const answer = seq[missingIdx];

    const options = this.generateUniqueOptions(answer, 1, 60, 4);

    return {
      prompt: `What number comes next?`,
      speechText: `What number completes the pattern?`,
      answer: answer,
      options: options,
      render: (container) => {
        container.innerHTML = '';
        const group = document.createElement('div');
        group.className = 'equation-group';
        seq.forEach((num, idx) => {
          const box = document.createElement('div');
          if (idx === missingIdx) {
            box.className = 'pattern-box missing';
            box.textContent = '?';
          } else {
            box.className = 'pattern-box';
            box.textContent = num;
          }
          group.appendChild(box);
        });
        container.appendChild(group);
      }
    };
  }

  generateUniqueOptions(correctAnswer, min, max, count) {
    const set = new Set();
    set.add(correctAnswer);

    while (set.size < count) {
      let offset = Math.floor(Math.random() * 7) - 3;
      if (offset === 0) offset = 1;
      let candidate = correctAnswer + offset;
      if (candidate < min) candidate = min + set.size;
      if (candidate > max) candidate = max - set.size;
      set.add(candidate);
    }

    // Shuffle options
    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  /**
   * LOAD & DISPLAY CURRENT QUESTION
   */
  loadQuestion() {
    this.isAnsweringLocked = false;
    this.currentQuestion = this.generateQuestion();

    this.dom.questionText.textContent = this.currentQuestion.prompt;
    this.dom.feedbackBanner.className = 'feedback-banner';
    this.dom.feedbackBanner.textContent = '';

    // Render visual elements
    this.currentQuestion.render(this.dom.visualDisplay);

    // Render option buttons
    this.dom.optionsGrid.innerHTML = '';
    this.currentQuestion.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.setAttribute('aria-label', `Number ${opt}`);
      btn.addEventListener('click', (e) => this.handleAnswer(opt, btn, e));
      this.dom.optionsGrid.appendChild(btn);
    });

    this.updateHUD();

    // Auto voice prompt on load (if enabled)
    if (soundEngine.voiceEnabled) {
      setTimeout(() => {
        soundEngine.speak(this.currentQuestion.speechText || this.currentQuestion.prompt);
      }, 250);
    }
  }

  /**
   * HANDLE USER SELECTION
   */
  handleAnswer(selectedNumber, buttonEl, event) {
    if (this.isAnsweringLocked) return;

    if (selectedNumber === this.currentQuestion.answer) {
      // ---------------- CORRECT ANSWER ----------------
      this.isAnsweringLocked = true;
      buttonEl.classList.add('btn-correct');

      // 1. Play cheerful ascending arpeggio chime!
      soundEngine.playCorrect();

      // 2. Confetti particle burst at button location
      const rect = buttonEl.getBoundingClientRect();
      confettiEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);

      // 3. Increment score & streak
      this.stars += 1;
      this.streak += 1;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;

      // 4. Mascot cheering reaction
      const randomHappy = this.mascotMoods.happy[Math.floor(Math.random() * this.mascotMoods.happy.length)];
      this.setMascot(randomHappy.avatar, randomHappy.msg);

      // 5. Visual feedback banner
      this.dom.feedbackBanner.className = 'feedback-banner show success';
      this.dom.feedbackBanner.textContent = `🎉 Super Job! +1 Star!`;

      // 6. Voice feedback
      soundEngine.speak(randomHappy.msg);

      this.updateHUD();

      // Check for round completion
      setTimeout(() => {
        if (this.currentQuestionIndex >= this.totalQuestionsPerRound) {
          this.triggerRoundCompletion();
        } else {
          this.currentQuestionIndex += 1;
          this.loadQuestion();
        }
      }, 1200);

    } else {
      // ---------------- INCORRECT ANSWER ----------------
      buttonEl.classList.add('btn-incorrect');

      // 1. Play gentle, funny cartoon "boing" wobble
      soundEngine.playIncorrect();

      // 2. Reset streak (gently, never docks stars)
      this.streak = 0;
      this.updateHUD();

      // 3. Mascot encouraging reaction
      const randomEncourage = this.mascotMoods.encouraging[Math.floor(Math.random() * this.mascotMoods.encouraging.length)];
      this.setMascot(randomEncourage.avatar, randomEncourage.msg);

      // 4. Feedback banner
      this.dom.feedbackBanner.className = 'feedback-banner show retry';
      this.dom.feedbackBanner.textContent = `💡 Great try! Choose again!`;

      // 5. Voice feedback
      soundEngine.speak("Great try! Let's try another number!");

      // Remove shake class after animation so kid can click another option
      setTimeout(() => {
        buttonEl.classList.remove('btn-incorrect');
      }, 600);
    }
  }

  /**
   * ROUND COMPLETION / GRAND CONGRATULATIONS CELEBRATION
   */
  triggerRoundCompletion() {
    this.dom.progressBar.style.width = '100%';

    // 1. Play Grand Triumphant Fanfare Sound!
    soundEngine.playCongratulations();

    // 2. Continuous victory confetti rain
    confettiEngine.startVictoryShower();

    // 3. Mascot celebration
    this.setMascot(this.mascotMoods.victory.avatar, this.mascotMoods.victory.msg);

    // 4. Speak celebration message
    soundEngine.speak("Congratulations! You completed the game! You are a Math Champion!");

    // 5. Update victory modal details
    this.dom.victoryStars.textContent = `+${this.totalQuestionsPerRound} Stars`;
    this.dom.victoryStreak.textContent = `${this.bestStreak} Max Streak`;

    const latestStickerId = this.unlockedStickers[this.unlockedStickers.length - 1];
    const latestSticker = this.stickers.find(s => s.id === latestStickerId) || this.stickers[0];
    this.dom.victoryStickerEmoji.textContent = latestSticker.emoji;
    this.dom.victoryStickerName.textContent = latestSticker.name;

    // 6. Show modal
    this.dom.congratulationsModal.hidden = false;
  }
}

// Start Game on page load
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new KidsMathGame();
});
