# 🌟 Kids Number Quest - Fun Math Game 🎈

An interactive, kid-friendly educational web application where kids can play with numbers, learn counting, addition, comparison, and sequences with cheerful audio feedback, animations, and a reward sticker book.

---

## 🎯 Key Features

1. **Synthesized Web Audio System**:
   - **Correct Answer**: Cheerful ascending arpeggio chime chord (`C5 -> E5 -> G5 -> C6`) + high sparkle.
   - **Incorrect Answer**: Gentle, playful cartoon "boing" wobble (downward pitch bend with soft LFO vibrato — encouraging and fun, never harsh).
   - **Congratulations Fanfare**: Triumphant multi-part brass/chime victory fanfare melody upon finishing a round/game.
   - **Text-to-Speech Narrator**: Reads questions and cheering messages aloud for early readers.

2. **4 Engaging Game Modes**:
   - 🍎 **Count Items**: Count animated cute items (apples, puppies, rockets, stars, cars).
   - ➕ **Add & Subtract Magic**: Visual + numeric equation puzzles.
   - ⚖️ **Bigger or Smaller**: Number comparison challenges.
   - 🔢 **Number Patterns**: Missing sequence detection.

3. **Rewards & Motivation**:
   - ⭐ **Stars & Streaks**: Earn stars with each correct answer and build streaks.
   - 🏆 **Magical Sticker Book**: Collect cute unlockable prize stickers (Rocket, Unicorn, Lion, Dino, etc.).
   - 🎉 **Grand Congratulations Screen**: Confetti celebration, trophy presentation, and fanfare music when finishing 5 questions in a round.

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari):

```bash
# Option 1: Double-click index.html or run in PowerShell
Start-Process "D:\kids-math-quest\index.html"
```

Or serve via any static HTTP server:
```bash
# Option 2: Using Python http.server or npx serve
cd D:\kids-math-quest
python -m http.server 8000
```
Then visit `http://localhost:8000`.
