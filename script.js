const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const size = canvas.width;
const center = size / 2;

const segments = [
  {text: '0', color: '#444'},
  {text: '1', color: '#2ecc71'},
  {text: '2', color: '#3498db'},
  {text: '100', color: '#f1c40f'},
  {text: '200', color: '#e67e22'},
  {text: '400', color: '#e74c3c'},
  {text: '700', color: '#9b59b6'},
  {text: '1000', color: '#1abc9c'}
];

const segmentCount = segments.length;
const segmentAngle = (2 * Math.PI) / segmentCount;

let currentAngle = 0;
let isSpinning = false;
let attempts = 3;
let balance = 0;

const spinBtn = document.getElementById('spinBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const attemptsEl = document.getElementById('attemptsText');
const balanceEl = document.getElementById('balance');
const resultMsg = document.getElementById('resultMsg');

function drawWheel() {
  ctx.clearRect(0, 0, size, size);
  for (let i = 0; i < segmentCount; i++) {
    let startAngle = segmentAngle * i + currentAngle;
    let endAngle = startAngle + segmentAngle;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center - 5, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segments[i].color;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Текст
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + segmentAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = '#000';
    ctx.font = "bold 16px Arial";
    ctx.fillText(segments[i].text, center - 10, 5);
    ctx.restore();
  }
}

function spin() {
  if (isSpinning || attempts <= 0) return;
  isSpinning = true;
  spinBtn.disabled = true;
  resultMsg.textContent = '';
  attempts--;

  let spins = Math.floor(Math.random() * 5) + 5; // 5-9 полных вращений
  let randomSegment = Math.floor(Math.random() * segmentCount);

  let finalAngle = 2 * Math.PI * spins + (segmentCount - randomSegment) * segmentAngle - segmentAngle / 2;
  let duration = 4000; // 4 секунды
  let start = null;
  let startAngleCopy = currentAngle;

  function animate(timestamp) {
    if (!start) start = timestamp;
    let elapsed = timestamp - start;
    if (elapsed > duration) elapsed = duration;

    // easeOut cubic
    let easeOut = 1 - Math.pow(1 - elapsed / duration, 3);

    currentAngle = startAngleCopy + finalAngle * easeOut;
    currentAngle %= 2 * Math.PI;

    drawWheel();

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = attempts <= 0;
      attemptsEl.textContent = 'Осталось попыток: ' + attempts;
      let prize = parseInt(segments[randomSegment].text);
      if (isNaN(prize)) prize = 0;
      balance += prize;
      balanceEl.textContent = 'Заработано: ' + balance + ' ₽';

      if (prize === 0) {
        resultMsg.textContent = 'Увы, вы ничего не выиграли.';
      } else {
        resultMsg.textContent = 'Поздравляем! Вы выиграли ' + prize + ' ₽!';
      }

      if (balance > 0) {
        withdrawBtn.disabled =
