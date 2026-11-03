// 儲存所有廚房小知識題目、選項與正確答案。
const questions = [
  // 第一道題目：測驗切菜時的基本安全觀念。
  { question: "切菜時，怎麼做比較安全？", options: ["手指伸直按住食材", "手指彎曲成爪狀", "一邊看手機一邊切", "拿刀追逐朋友"], answer: 1, ingredient: "麵粉" },
  // 第二道題目：認識冷藏食物的保存方式。
  { question: "牛奶開封後，最好放在哪裡？", options: ["冰箱冷藏室", "陽光下的窗台", "烤箱裡", "餐桌上三天"], answer: 0, ingredient: "雞蛋" },
  // 第三道題目：學習正確的洗手時機。
  { question: "料理前，最重要的第一步是什麼？", options: ["先試吃食材", "把手洗乾淨", "先打開烤箱", "戴上圍巾"], answer: 1, ingredient: "砂糖" },
  // 第四道題目：辨別生熟食物的處理方式。
  { question: "處理生肉和蔬菜時，砧板應該怎麼使用？", options: ["同一面直接共用", "用完不必清洗", "分開使用或清洗乾淨", "只擦一下圍裙"], answer: 2, ingredient: "奶油" },
  // 第五道題目：認識烤箱的安全使用方法。
  { question: "烤箱剛烤完食物，取出烤盤要用什麼？", options: ["隔熱手套", "濕紙巾", "赤手直接拿", "塑膠袋"], answer: 0, ingredient: "草莓" },
  // 第六道題目：認識安全解凍冷凍食材的方式。
  { question: "冷凍肉類要解凍，哪種方式較安全？", options: ["放在冰箱冷藏室", "放在陽光下曝曬", "泡在溫水裡一整天", "放在室溫過夜"], answer: 0, ingredient: "牛奶" }
];

// 記錄目前題號、答對數量、作答狀態與畫面按鈕。
let questionIndex = 0;
let correctCount = 0;
let selectedAnswer = -1;
let hasAnswered = false;
let isFinished = false;
let feedbackText = "";
let feedbackCorrect = false;
let answerButtons = [];
let actionButton = null;
let smallLayout = false;
let quizCard = {};
let kitchenCard = {};
// 儲存答對全部題目時要展示的完成蛋糕圖片。
let perfectCakeImage;

// 在建立畫布前載入完成蛋糕圖片。
function preload() {
  // 從專案資料夾載入使用者提供的蛋糕圖片。
  perfectCakeImage = loadImage("Gemini_Generated_Image_djm3fjdjm3fjdjm3-Photoroom.png");
}

// 建立會隨瀏覽器視窗調整大小的全螢幕畫布。
function setup() {
  // 建立與視窗同寬同高的畫布。
  createCanvas(windowWidth, windowHeight);
  // 使用 Fisher-Yates 洗牌，讓每次重新載入都以不同順序出題。
  for (let index = questions.length - 1; index > 0; index -= 1) {
    // 隨機選取目前位置之前的題目。
    const randomIndex = floor(random(index + 1));
    // 交換兩題的位置，題目、選項和正確答案會一併移動。
    [questions[index], questions[randomIndex]] = [questions[randomIndex], questions[index]];
  }
  // 設定文字與形狀的繪製基準。
  textFont("sans-serif");
  // 讓畫布不會因高像素螢幕而模糊。
  pixelDensity(1);
}

// 每一影格重新繪製背景、標題、測驗區與料理區。
function draw() {
  // 使用奶油黃色填滿整個畫布。
  background("#FFF5D6");
  // 依畫面尺寸重新計算兩個主要區域的位置。
  calculateLayout();
  // 繪製可愛的廚房裝飾與頁面標題。
  drawHeader();
  // 繪製答題卡片或測驗完成畫面。
  drawQuizCard();
  // 繪製收集材料的盆子或最後完成的蛋糕。
  drawKitchenCard();
}

// 依照螢幕寬度選擇並計算響應式版面。
function calculateLayout() {
  // 小於 760 像素時改用上下排列版面。
  smallLayout = width < 760;
  // 小螢幕版面將測驗卡置於畫面上半部。
  if (smallLayout) {
    // 設定行動版測驗區的留白與高度。
    const margin = 16;
    const top = 88;
    const cardHeight = min(max(height * 0.49, 300), height - 250);
    // 儲存測驗卡片的位置與尺寸。
    quizCard = { x: margin, y: top, w: width - margin * 2, h: cardHeight };
    // 將料理區放在測驗卡片下方。
    kitchenCard = { x: margin, y: top + cardHeight + 12, w: width - margin * 2, h: height - top - cardHeight - 24 };
  } else {
    // 設定桌面版兩欄版面的間距。
    const margin = max(28, width * 0.045);
    const gap = 22;
    const top = 116;
    const cardHeight = height - top - 28;
    // 設定左側測驗卡片的尺寸。
    quizCard = { x: margin, y: top, w: (width - margin * 2 - gap) * 0.59, h: cardHeight };
    // 設定右側料理卡片的尺寸。
    kitchenCard = { x: quizCard.x + quizCard.w + gap, y: top, w: width - margin - (quizCard.x + quizCard.w + gap), h: cardHeight };
  }
}

// 繪製頁面標題、進度膠囊與裝飾圖案。
function drawHeader() {
  // 將頁面標題固定置中。
  const titleX = width / 2;
  // 設定標題的水平對齊方式。
  textAlign(CENTER, CENTER);
  // 以深咖啡色繪製可愛標題。
  fill("#69452F");
  // 依螢幕寬度調整標題字級。
  textSize(smallLayout ? 26 : 34);
  // 顯示測驗名稱與小圖示。
  text("🍰 廚房小達人挑戰", titleX, smallLayout ? 27 : 36);
  // 計算並繪製目前的答題進度。
  drawProgressPill(width / 2, smallLayout ? 60 : 78);
}

// 繪製顯示答對題數的圓角進度標籤。
function drawProgressPill(centerX, centerY) {
  // 設定進度標籤寬度，並讓窄螢幕也能完整顯示。
  const pillWidth = min(170, width - 32);
  // 移除邊框並設定標籤底色。
  noStroke();
  fill("#FFE2A6");
  // 以圓角矩形繪製進度標籤。
  rectMode(CENTER);
  rect(centerX, centerY, pillWidth, 34, 17);
  // 設定進度文字顏色與字級。
  fill("#76523A");
  textAlign(CENTER, CENTER);
  textSize(16);
  // 顯示目前進度或完成提示。
  text(isFinished ? "挑戰完成！" : `答對 ${correctCount} / ${questions.length} 題`, centerX, centerY);
  // 還原矩形繪製模式，避免影響其他元件。
  rectMode(CORNER);
}

// 繪製題目、四個選項、作答回饋與下一步按鈕。
function drawQuizCard() {
  // 繪製測驗區的白色圓角底卡。
  drawCard(quizCard.x, quizCard.y, quizCard.w, quizCard.h);
  // 測驗結束後改為顯示分數與稱號。
  if (isFinished) {
    // 繪製完成狀態的標題與分數。
    drawResultText();
    // 繪製重新挑戰按鈕。
    drawActionButton("再玩一次", quizCard.x + quizCard.w / 2, quizCard.y + quizCard.h - 42, quizCard.w - 44, 44);
    // 完成畫面不再繪製題目選項。
    return;
  }
  // 繪製目前題號的小標籤。
  drawQuestionNumber();
  // 繪製目前題目的文字。
  drawQuestionText();
  // 繪製四個可點擊的選項按鈕。
  drawAnswerOptions();
  // 答題後顯示回饋文字與繼續按鈕。
  if (hasAnswered) {
    // 顯示答對或答錯的即時提示。
    drawFeedback();
    // 依題目進度決定按鈕文字。
    const actionLabel = questionIndex === questions.length - 1 ? "看看我的蛋糕 ✨" : "下一題 →";
    // 繪製前往下一題或查看成果的按鈕。
    drawActionButton(actionLabel, quizCard.x + quizCard.w / 2, quizCard.y + quizCard.h - 38, quizCard.w - 40, 42);
  }
}

// 繪製統一風格的白色圓角卡片。
function drawCard(x, y, cardWidth, cardHeight) {
  // 移除卡片外框並繪製柔和陰影。
  noStroke();
  fill("#E9DAB5");
  rect(x + 3, y + 5, cardWidth, cardHeight, 24);
  // 繪製卡片本體。
  fill("#FFFEFA");
  rect(x, y, cardWidth, cardHeight, 24);
}

// 繪製目前題目序號及共五題的提示。
function drawQuestionNumber() {
  // 設定題號標籤的位置與大小。
  const tagX = quizCard.x + (quizCard.w - 88) / 2;
  const tagY = quizCard.y + 20;
  // 繪製粉色圓角題號標籤。
  noStroke();
  fill("#FFE2E5");
  rect(tagX, tagY, 88, 28, 14);
  // 顯示題目序號。
  fill("#A7525A");
  textAlign(CENTER, CENTER);
  textSize(13);
  text(`第 ${questionIndex + 1} 題`, tagX + 44, tagY + 14);
}

// 繪製題目文字，並依照卡片寬度調整字級。
function drawQuestionText() {
  // 取得目前題目的文字內容。
  const currentQuestion = questions[questionIndex].question;
  // 設定題目文字的對齊方式與顏色。
  textAlign(CENTER, TOP);
  fill("#573E30");
  // 依裝置大小調整題目字級。
  textSize(smallLayout ? 21 : 27);
  // 在題號下方繪製題目。
  text(currentQuestion, quizCard.x + 22, quizCard.y + 63, quizCard.w - 44, 58);
  // 繪製選項區的操作提示。
  fill("#A18A73");
  textSize(15);
  text("選出你覺得最正確的答案", quizCard.x + quizCard.w / 2, quizCard.y + 119);
}

// 繪製四個選項並記錄每個選項的點擊範圍。
function drawAnswerOptions() {
  // 清除上一影格的點擊範圍資料。
  answerButtons = [];
  // 計算選項區的左右間距。
  const innerGap = 10;
  const left = quizCard.x + 20;
  const top = quizCard.y + (smallLayout ? 141 : 145);
  const buttonWidth = (quizCard.w - 40 - innerGap) / 2;
  // 依畫面高度調整每個選項的高度。
  const buttonHeight = smallLayout ? min(50, max(36, (quizCard.h - 254) / 2)) : min(74, max(56, (quizCard.h - 260) / 2));
  // 逐一繪製四個選項按鈕。
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    // 依序計算兩欄兩列的按鈕位置。
    const column = optionIndex % 2;
    const row = floor(optionIndex / 2);
    const buttonX = left + column * (buttonWidth + innerGap);
    const buttonY = top + row * (buttonHeight + 9);
    // 判斷目前按鈕是否為正確答案或已選答案。
    const isCorrectOption = hasAnswered && optionIndex === questions[questionIndex].answer;
    const isWrongSelection = hasAnswered && optionIndex === selectedAnswer && !feedbackCorrect;
    // 依按鈕狀態設定柔和底色。
    noStroke();
    fill(isCorrectOption ? "#DFF2D7" : isWrongSelection ? "#FFE1E0" : "#FFF4DF");
    // 繪製圓角選項按鈕。
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
    // 設定選項文字顏色與字級。
    fill(isCorrectOption ? "#466B3B" : isWrongSelection ? "#A34F4F" : "#624B39");
    textAlign(CENTER, CENTER);
    // 窄螢幕稍微縮小選項字級，避免文字擠出按鈕。
    textSize(smallLayout ? (buttonWidth < 145 ? 14 : 16) : 18);
    // 將選項字母與文字限制在整個按鈕文字框內置中繪製。
    text(`${String.fromCharCode(65 + optionIndex)}. ${questions[questionIndex].options[optionIndex]}`, buttonX, buttonY, buttonWidth, buttonHeight);
    // 保存此選項的座標供滑鼠點擊判斷。
    answerButtons.push({ x: buttonX, y: buttonY, w: buttonWidth, h: buttonHeight, index: optionIndex });
  }
}

// 繪製答題回饋文字。
function drawFeedback() {
  // 設定回饋文字顏色與對齊方式。
  fill(feedbackCorrect ? "#548447" : "#B45B50");
  textAlign(CENTER, CENTER);
  textSize(smallLayout ? 15 : 18);
  // 顯示作答結果與材料提示。
  text(feedbackText, quizCard.x + 18, quizCard.y + quizCard.h - 88, quizCard.w - 36, 28);
}

// 繪製測驗完成後的分數、蛋糕評語與稱號。
function drawResultText() {
  // 設定完成畫面的文字對齊方式。
  textAlign(CENTER, CENTER);
  // 依分數選擇不同風格的標題與評語。
  const score = Math.round((correctCount / questions.length) * 100);
  const title = score === 100 ? "太厲害了！" : score < 60 ? "哎呀，蛋糕烤焦了！" : "蛋糕完成囉！";
  const message = score === 100 ? "你是廚房小達人 🏆" : score < 60 ? "別氣餒，再挑戰一次吧！" : "下次再多收集一些材料吧！";
  // 繪製歡樂的完成標題。
  fill(score < 60 ? "#A64D3E" : "#69452F");
  textSize(smallLayout ? 28 : 36);
  text(title, quizCard.x + quizCard.w / 2, quizCard.y + quizCard.h * 0.31);
  // 繪製依答對題數計算的分數。
  fill("#E89257");
  textSize(smallLayout ? 46 : 58);
  text(`${score} 分`, quizCard.x + quizCard.w / 2, quizCard.y + quizCard.h * 0.49);
  // 繪製稱號或鼓勵文字。
  fill("#775C46");
  textSize(smallLayout ? 18 : 21);
  text(message, quizCard.x + 16, quizCard.y + quizCard.h * 0.65, quizCard.w - 32, 54);
  // 顯示本次答對題數。
  fill("#A18A73");
  textSize(15);
  text(`收集到 ${correctCount} 種蛋糕材料`, quizCard.x + quizCard.w / 2, quizCard.y + quizCard.h * 0.75);
}

// 繪製圓角操作按鈕並記錄其點擊範圍。
function drawActionButton(label, centerX, centerY, buttonWidth, buttonHeight) {
  // 設定按鈕底色並繪製圓角外觀。
  noStroke();
  fill("#F2A46F");
  rect(centerX - buttonWidth / 2, centerY - buttonHeight / 2, buttonWidth, buttonHeight, buttonHeight / 2);
  // 設定按鈕文字樣式。
  fill("#FFFFFF");
  textAlign(CENTER, CENTER);
  textSize(smallLayout ? 14 : 16);
  // 繪製按鈕文字。
  text(label, centerX, centerY);
  // 保存按鈕點擊範圍。
  actionButton = { x: centerX - buttonWidth / 2, y: centerY - buttonHeight / 2, w: buttonWidth, h: buttonHeight };
}

// 繪製料理區的材料盆或測驗完成後的蛋糕成果。
function drawKitchenCard() {
  // 繪製料理區的白色圓角卡片。
  drawCard(kitchenCard.x, kitchenCard.y, kitchenCard.w, kitchenCard.h);
  // 完成測驗後改為展示蛋糕。
  if (isFinished) {
    // 繪製依答題結果改變外觀的蛋糕。
    drawCakeResult();
    // 蛋糕展示狀態不再顯示材料盆。
    return;
  }
  // 繪製料理區標題與提示。
  drawKitchenTitle();
  // 繪製收集到的材料與攪拌盆。
  drawIngredientBowl();
}

// 繪製料理區標題及已收集材料數量。
function drawKitchenTitle() {
  // 依照卡片寬度決定標題垂直位置。
  const titleY = kitchenCard.y + (smallLayout ? 35 : 42);
  // 設定標題樣式。
  fill("#69452F");
  textAlign(CENTER, CENTER);
  textSize(smallLayout ? 18 : 22);
  // 顯示材料收集標題。
  text("🥣 蛋糕材料盆", kitchenCard.x + kitchenCard.w / 2, titleY);
  // 顯示材料收集進度。
  fill("#A18A73");
  textSize(smallLayout ? 14 : 16);
  text(`${correctCount} 種材料已加入`, kitchenCard.x + kitchenCard.w / 2, titleY + (smallLayout ? 19 : 25));
}

// 繪製攪拌盆及所有答對後加入的材料。
function drawIngredientBowl() {
  // 計算盆子中心點與大小。
  const centerX = kitchenCard.x + kitchenCard.w / 2;
  const centerY = kitchenCard.y + kitchenCard.h * (smallLayout ? 0.68 : 0.67);
  const bowlWidth = min(kitchenCard.w * (smallLayout ? 0.72 : 0.74), smallLayout ? 205 : 310);
  const bowlHeight = smallLayout ? 70 : 102;
  // 繪製盆子的上緣。
  noStroke();
  fill("#B8DCE2");
  ellipse(centerX, centerY - bowlHeight * 0.22, bowlWidth, bowlHeight * 0.38);
  // 繪製盆子的碗身。
  fill("#91C8D1");
  arc(centerX, centerY, bowlWidth, bowlHeight * 1.65, 0, PI, CHORD);
  // 為盆子加上可愛的亮色描邊。
  noFill();
  stroke("#72AFB9");
  strokeWeight(3);
  arc(centerX, centerY - bowlHeight * 0.22, bowlWidth, bowlHeight * 0.38, 0, PI);
  // 還原筆畫設定。
  noStroke();
  // 在盆子裡依序畫出答對收集的材料。
  drawCollectedIngredients(centerX, centerY - bowlHeight * 0.18, bowlWidth);
  // 在盆子旁邊畫上愛心裝飾。
  fill("#F3A4A7");
  textSize(smallLayout ? 17 : 23);
  text("♥", centerX - bowlWidth * 0.61, centerY - bowlHeight * 0.18);
  text("♥", centerX + bowlWidth * 0.61, centerY - bowlHeight * 0.18);
}

// 依答對數量把蛋糕材料放入盆中。
function drawCollectedIngredients(centerX, centerY, bowlWidth) {
  // 逐一繪製已答對題目對應的材料圖示。
  for (let ingredientIndex = 0; ingredientIndex < correctCount; ingredientIndex += 1) {
    // 依材料數量分散圖示位置。
    const spread = (ingredientIndex - (correctCount - 1) / 2) * min(44, bowlWidth / 6);
    // 依材料種類選擇對應的小圖案與顏色。
    const ingredient = questions[ingredientIndex].ingredient;
    const ingredientColor = ["#F6D779", "#F5E7C3", "#F7CF78", "#F2C46B", "#F28C9A", "#E8F4F5"][ingredientIndex % 6];
    // 繪製材料的柔和圓形底色。
    fill(ingredientColor);
    ellipse(centerX + spread, centerY, 36, 31);
    // 繪製材料名稱，協助辨認收集內容。
    fill("#654B37");
    textAlign(CENTER, CENTER);
    textSize(ingredient.length > 2 ? 10 : 12);
    text(ingredient, centerX + spread, centerY);
  }
}

// 繪製依分數變化的完整、缺料或烤焦蛋糕。
function drawCakeResult() {
  // 計算蛋糕展示中心與整體尺寸。
  const centerX = kitchenCard.x + kitchenCard.w / 2;
  const cakeScale = min(kitchenCard.w * 0.62, kitchenCard.h * 0.48);
  const cakeY = kitchenCard.y + kitchenCard.h * (smallLayout ? 0.60 : 0.58);
  const isBurnt = (correctCount / questions.length) * 100 < 60;
  // 全部答對時使用圖片展示完整蛋糕。
  if (correctCount === questions.length) {
    // 依圖片原始比例縮放，讓蛋糕完整顯示在料理卡片內。
    const imageScale = min(kitchenCard.w * 0.78 / perfectCakeImage.width, kitchenCard.h * 0.58 / perfectCakeImage.height);
    // 將圖片置中顯示。
    imageMode(CENTER);
    image(perfectCakeImage, centerX, kitchenCard.y + kitchenCard.h * 0.48, perfectCakeImage.width * imageScale, perfectCakeImage.height * imageScale);
    // 還原圖片繪製模式，避免影響其他畫面。
    imageMode(CORNER);
    // 顯示滿分蛋糕成果名稱。
    fill("#775C46");
    textAlign(CENTER, CENTER);
    textSize(smallLayout ? 16 : 19);
    text("完美草莓奶油蛋糕！", centerX, kitchenCard.y + kitchenCard.h - (smallLayout ? 21 : 30));
    // 已顯示圖片蛋糕，不再繪製程式生成的蛋糕。
    return;
  }
  // 繪製蛋糕盤子。
  noStroke();
  fill("#D9EDF0");
  ellipse(centerX, cakeY + cakeScale * 0.39, cakeScale * 1.22, cakeScale * 0.22);
  // 依分數決定蛋糕底層的顏色。
  fill(isBurnt ? "#654238" : "#E8A76F");
  rect(centerX - cakeScale * 0.46, cakeY - cakeScale * 0.02, cakeScale * 0.92, cakeScale * 0.34, 15);
  // 答對至少三題時才加入上層蛋糕。
  if (correctCount >= 3) {
    // 繪製蛋糕的上層。
    fill(isBurnt ? "#51362F" : "#F2C18D");
    rect(centerX - cakeScale * 0.34, cakeY - cakeScale * 0.28, cakeScale * 0.68, cakeScale * 0.29, 13);
    // 在上層蛋糕邊緣加上奶油夾層。
    if (!isBurnt) {
      // 繪製柔軟的奶油夾心。
      fill("#FFF4E8");
      rect(centerX - cakeScale * 0.35, cakeY - cakeScale * 0.06, cakeScale * 0.70, cakeScale * 0.07, 8);
      // 用圓形奶油滴做出自然的裝飾邊緣。
      for (let dripIndex = 0; dripIndex < 7; dripIndex += 1) {
        // 計算奶油滴在蛋糕正面的水平位置。
        const dripX = centerX - cakeScale * 0.29 + dripIndex * cakeScale * 0.095;
        // 繪製大小不一的奶油滴。
        ellipse(dripX, cakeY + cakeScale * 0.005, cakeScale * 0.08, cakeScale * 0.09);
      }
    }
  }
  // 完整答對時加上漂亮的奶油糖霜。
  if (correctCount === questions.length) {
    // 繪製蛋糕頂部糖霜。
    fill("#FFF4F0");
    rect(centerX - cakeScale * 0.36, cakeY - cakeScale * 0.32, cakeScale * 0.72, cakeScale * 0.10, 12);
    // 在蛋糕頂部排列奶油花。
    for (let creamIndex = 0; creamIndex < 5; creamIndex += 1) {
      // 計算奶油花在蛋糕頂部的位置。
      const creamX = centerX - cakeScale * 0.27 + creamIndex * cakeScale * 0.135;
      // 用多層圓形畫出蓬鬆的奶油花。
      fill("#FFFDFC");
      ellipse(creamX, cakeY - cakeScale * 0.34, cakeScale * 0.12, cakeScale * 0.12);
      fill("#FFE8E2");
      ellipse(creamX, cakeY - cakeScale * 0.38, cakeScale * 0.075, cakeScale * 0.075);
    }
    // 在蛋糕頂部放上新鮮草莓與藍莓。
    drawStrawberry(centerX - cakeScale * 0.23, cakeY - cakeScale * 0.38, cakeScale * 0.18);
    drawStrawberry(centerX + cakeScale * 0.23, cakeY - cakeScale * 0.38, cakeScale * 0.18);
    fill("#6C8FC4");
    ellipse(centerX, cakeY - cakeScale * 0.37, cakeScale * 0.10, cakeScale * 0.09);
    fill("#8AA8D2");
    ellipse(centerX - cakeScale * 0.07, cakeY - cakeScale * 0.34, cakeScale * 0.08, cakeScale * 0.07);
    ellipse(centerX + cakeScale * 0.07, cakeY - cakeScale * 0.34, cakeScale * 0.08, cakeScale * 0.07);
    // 在蛋糕側面點綴彩色糖珠。
    fill("#F6D36D");
    ellipse(centerX - cakeScale * 0.23, cakeY - cakeScale * 0.13, cakeScale * 0.035, cakeScale * 0.035);
    fill("#8CBF82");
    ellipse(centerX + cakeScale * 0.21, cakeY - cakeScale * 0.12, cakeScale * 0.035, cakeScale * 0.035);
    // 繪製蛋糕旁的閃亮星星。
    fill("#F2B84B");
    textAlign(CENTER, CENTER);
    textSize(smallLayout ? 21 : 29);
    text("✦", centerX - cakeScale * 0.59, cakeY - cakeScale * 0.26);
    text("✦", centerX + cakeScale * 0.58, cakeY - cakeScale * 0.37);
  } else if (isBurnt) {
    // 烤焦時加上焦黑裝飾與煙霧。
    fill("#49322D");
    ellipse(centerX - cakeScale * 0.2, cakeY + cakeScale * 0.10, 12, 8);
    ellipse(centerX + cakeScale * 0.16, cakeY + cakeScale * 0.20, 15, 7);
    fill("#9E958C");
    textAlign(CENTER, CENTER);
    textSize(smallLayout ? 22 : 30);
    text("♨", centerX + cakeScale * 0.42, cakeY - cakeScale * 0.45);
  } else {
    // 材料不足時加上不太整齊的奶油點綴。
    fill("#FFF0E8");
    ellipse(centerX - cakeScale * 0.2, cakeY - cakeScale * 0.04, 19, 12);
    ellipse(centerX + cakeScale * 0.18, cakeY - cakeScale * 0.04, 17, 11);
  }
  // 繪製蛋糕展示區的成果說明。
  fill(isBurnt ? "#A64D3E" : "#775C46");
  textAlign(CENTER, CENTER);
  textSize(smallLayout ? 16 : 19);
  const resultLabel = isBurnt ? "烤焦焦的蛋糕" : correctCount === questions.length ? "完美草莓奶油蛋糕！" : "材料不太夠的蛋糕";
  text(resultLabel, centerX, kitchenCard.y + kitchenCard.h - (smallLayout ? 21 : 30));
}

// 繪製一顆有綠色葉片與籽點的可愛草莓。
function drawStrawberry(centerX, centerY, berrySize) {
  // 儲存畫布狀態，避免草莓描邊影響其他圖案。
  push();
  // 移除外框並設定草莓果肉顏色。
  noStroke();
  fill("#F27F8B");
  // 以圓潤的水滴形狀畫出草莓本體。
  beginShape();
  vertex(centerX - berrySize * 0.48, centerY - berrySize * 0.18);
  bezierVertex(centerX - berrySize * 0.52, centerY - berrySize * 0.63, centerX + berrySize * 0.52, centerY - berrySize * 0.63, centerX + berrySize * 0.48, centerY - berrySize * 0.18);
  bezierVertex(centerX + berrySize * 0.38, centerY + berrySize * 0.18, centerX + berrySize * 0.08, centerY + berrySize * 0.49, centerX, centerY + berrySize * 0.55);
  bezierVertex(centerX - berrySize * 0.08, centerY + berrySize * 0.49, centerX - berrySize * 0.38, centerY + berrySize * 0.18, centerX - berrySize * 0.48, centerY - berrySize * 0.18);
  endShape(CLOSE);
  // 畫上草莓頂端的綠色葉片。
  fill("#79AE70");
  ellipse(centerX - berrySize * 0.18, centerY - berrySize * 0.37, berrySize * 0.40, berrySize * 0.18);
  ellipse(centerX + berrySize * 0.18, centerY - berrySize * 0.37, berrySize * 0.40, berrySize * 0.18);
  // 點綴草莓表面的金黃色小籽。
  fill("#FFE6A5");
  ellipse(centerX - berrySize * 0.20, centerY - berrySize * 0.10, berrySize * 0.055, berrySize * 0.07);
  ellipse(centerX + berrySize * 0.20, centerY - berrySize * 0.10, berrySize * 0.055, berrySize * 0.07);
  ellipse(centerX, centerY + berrySize * 0.10, berrySize * 0.055, berrySize * 0.07);
  // 還原畫布狀態，保持後續繪圖設定不變。
  pop();
}

// 處理選項與操作按鈕的滑鼠點擊事件。
function mousePressed() {
  // 先判斷使用者是否點擊目前可見的操作按鈕。
  if (actionButton && isInside(mouseX, mouseY, actionButton)) {
    // 完成畫面按下按鈕時重設整場測驗。
    if (isFinished) {
      resetQuiz();
    } else {
      // 尚有題目時前往下一題，最後一題則顯示成果。
      advanceQuiz();
    }
    // 避免同一次點擊又被當成選項點擊。
    return false;
  }
  // 已作答或已完成時，不接受新的選項答案。
  if (hasAnswered || isFinished) {
    // 告知 p5.js 此次點擊已由測驗介面處理。
    return false;
  }
  // 檢查使用者點擊的選項範圍。
  for (const button of answerButtons) {
    // 點擊選項時立即判斷答案並顯示回饋。
    if (isInside(mouseX, mouseY, button)) {
      // 儲存選項編號並鎖定本題答案。
      selectedAnswer = button.index;
      hasAnswered = true;
      // 判斷答案是否正確。
      feedbackCorrect = selectedAnswer === questions[questionIndex].answer;
      // 答對時增加答對數並把材料放入盆中。
      if (feedbackCorrect) {
        // 每題只能作答一次，因此材料不會重複加入。
        correctCount += 1;
        // 顯示新收集到的材料名稱。
        feedbackText = `答對了！${questions[questionIndex].ingredient}加入盆子囉！`;
      } else {
        // 答錯時不增加分數，也不加入材料。
        feedbackText = "差一點點！這題沒有材料加入喔。";
      }
      // 結束選項搜尋，避免重複處理。
      return false;
    }
  }
  // 避免點擊畫布時觸發瀏覽器預設行為。
  return false;
}

// 將測驗進度移至下一題或切換為成果畫面。
function advanceQuiz() {
  // 最後一題結束後顯示蛋糕與最終分數。
  if (questionIndex === questions.length - 1) {
    // 切換到完成狀態。
    isFinished = true;
    // 移除上一題的操作按鈕，避免殘留點擊區。
    actionButton = null;
    // 完成時更新進度標籤。
    return;
  }
  // 前進一題並清除作答狀態。
  questionIndex += 1;
  selectedAnswer = -1;
  hasAnswered = false;
  feedbackText = "";
  feedbackCorrect = false;
  // 清除舊按鈕範圍，等待新畫面繪製。
  actionButton = null;
}

// 清除所有答題紀錄，讓使用者可以重新挑戰。
function resetQuiz() {
  // 重設題號、分數與完成狀態。
  questionIndex = 0;
  correctCount = 0;
  isFinished = false;
  // 清除作答回饋與選項狀態。
  selectedAnswer = -1;
  hasAnswered = false;
  feedbackText = "";
  feedbackCorrect = false;
  // 清除所有舊的點擊範圍。
  answerButtons = [];
  actionButton = null;
}

// 判斷點擊座標是否落在指定矩形範圍內。
function isInside(pointX, pointY, bounds) {
  // 回傳點擊位置是否位於矩形四邊之內。
  return pointX >= bounds.x && pointX <= bounds.x + bounds.w && pointY >= bounds.y && pointY <= bounds.y + bounds.h;
}

// 視窗尺寸改變時同步調整全螢幕畫布。
function windowResized() {
  // 依照最新視窗尺寸重新設定畫布大小。
  resizeCanvas(windowWidth, windowHeight);
  // 清空過期的按鈕點擊範圍，等待新畫面重新計算。
  answerButtons = [];
  actionButton = null;
}
