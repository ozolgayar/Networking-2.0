<script>
  // Глобальное состояние
  const state = {
    networking: 0,
    contacts: 0,
    visibility: 0,
    zlataGoal: 0, // 0–6
    purposeText: '',
    wheel: {
      segments: ['Карьера', 'Образование', 'Хобби', 'Личные проекты', 'Финансы', 'Здоровье'],
      values: [0, 0, 0, 0, 0, 0],
       importance: [5, 5, 5, 5, 5, 5],  // ← ДОБАВИТЬ
      currentIndex: 0
    },
    beads: {
      stage: 1,
      attempts: 0
    },
    bizcardRewarded: false
  };

  // ===== Утилиты =====
// Порядок экранов — ГЛОБАЛЬНО
  const screenOrder = [
    'screen-1', 'screen-2', 'screen-3', 'screen-4', 'screen-5',
    'screen-6', 'screen-7', 'screen-8', 'screen-9', 'screen-10',
    'screen-11', 'screen-12', 'screen-13', 'screen-14', 'screen-15',
    'screen-16', 'screen-16-1', 'screen-17', 'screen-18', 'screen-19',
    'screen-20', 'screen-21', 'screen-21-1', 'screen-22', 'screen-23', 'screen-24',
    'screen-25', 'screen-26'
  ];

  // ===== Утилиты =====
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screenEl = document.getElementById(id);
    if (screenEl) screenEl.classList.add('active');

    const chapterPill = document.getElementById('chapter-pill');
    if (chapterPill) {
      const idx = screenOrder.indexOf(id);
      const s21idx = screenOrder.indexOf('screen-21');
      const s23idx = screenOrder.indexOf('screen-23');
      if (idx <= s21idx) chapterPill.textContent = 'Глава 1';
      else if (idx <= s23idx) chapterPill.textContent = 'Глава 2';
      else chapterPill.textContent = 'Глава 3';
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function addNetworking(delta) {
    state.networking = clamp(state.networking + delta, 0, 100);
    updateHud();
  }

  function addContacts(delta) {
    state.contacts = Math.max(0, state.contacts + delta);
    updateHud();
  }

  function addVisibility(delta) {
    state.visibility = Math.max(0, state.visibility + delta);
    updateHud();
  }

  function updateHud() {
    const bar = document.getElementById('hud-networking-bar');
    const valLabel = document.getElementById('hud-networking-value');
    const contactsLabel = document.getElementById('hud-contacts');
    const visLabel = document.getElementById('hud-visibility');

    bar.style.transform = `scaleX(${state.networking / 100})`;
    valLabel.textContent = `${state.networking} / 100`;
    contactsLabel.textContent = state.contacts;
    visLabel.textContent = state.visibility;

    const goalChipText = document.getElementById('goal-chip-text');
    if (state.zlataGoal > 0) {
      goalChipText.textContent = `Познакомиться с 6 людьми в сфере Карьера/Маркетинг (${state.zlataGoal}/6)`;
    } else {
      goalChipText.textContent = 'Цель ещё не сформулирована';
    }
    document.getElementById('zlata-goal-progress').textContent = `${state.zlataGoal} / 6`;
    document.getElementById('goal-popup-progress').textContent = `${state.zlataGoal} / 6`;
  }

  function initGlobalNav() {
    document.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-next');
        showScreen(nextId);
      });
    });

    // Кнопки "Назад" — data-prev
   document.querySelectorAll('[data-prev]').forEach(btn => {
  btn.addEventListener('click', () => {
    const screen = btn.closest('.screen');
    if (!screen) return;
    const idx = screenOrder.indexOf(screen.id);
    if (idx > 0) {
      showScreen(screenOrder[idx - 1]);
    }
  });
});
 }
  // Меню навигации
  function initMainMenu() {
    const toggle = document.getElementById('main-menu-toggle');
    const menu = document.getElementById('main-menu');

    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    menu.addEventListener('click', e => {
      const li = e.target.closest('[data-goto]');
      if (!li) return;
      const target = li.dataset.goto;
      showScreen(target);
      menu.classList.remove('active');
    });

    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  }

  // ===== Экран 1: цитаты =====
  function initQuotes() {
    const quotes = [
      {
        text: 'Поставьте себе цель каждую неделю знакомиться с новым человеком. Неважно, кем он будет и где это произойдёт.',
        author: 'Кейт Ферраци'
      },
      {
        text: 'Чаще бывает полезнее знать многих, чем многое.',
        author: 'Роберт Лембке'
      },
      {
        text: 'Нетворкинг — это искусство создания отношений, которые в перспективе могут быть полезны в любой сфере жизни.',
        author: 'Гил Петерсил'
      },
      {
        text: 'Нетворкинг – умение открыто и искренне общаться с самыми разными людьми, выстраивая сеть полезных знакомств.',
        author: 'Кейт Феррацци'
      },
      {
        text: 'Если из-за страха перед неизвестным мы отгораживаемся от общения, мы теряем себя как личности и как компании. Когда становимся открытыми, появляются новые возможности учиться и сотрудничать.',
        author: 'Джефф Джарвис'
      }
    ];
    let idx = 0;
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');

    function showQuote() {
      const q = quotes[idx % quotes.length];
      textEl.textContent = q.text;
      authorEl.textContent = q.author;
      idx++;
    }
    showQuote();
    let counter = 0;
    const interval = setInterval(() => {
      showQuote();
      counter += 1;
      if (counter >= 2) {
        clearInterval(interval);
      }
    }, 2500);
  }
    // ===== Экран 2: тест =====
  function initQuiz() {
    const questions = [
      { q: 'Я знаю, как найти общий язык с незнакомыми мне людьми.', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
      { q: 'Сможете ли вы знакомиться с несколькими новыми людьми?', opts: ['Не смогу','Не уверен','Возможно','Смогу','Смогу и начну это делать'] },
      { q: 'Я знаю, как правильно и оригинально представиться незнакомому человеку.', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
      { q: 'Я смогу делать каждую неделю рассылку новостей и/или полезной информации списку своих знакомых.', opts: ['Не смогу','Не уверен','Возможно','Смогу','Смогу и начну это делать'] },
      { q: 'Я знаю, насколько важно запоминать имя и ценности человека, с которым познакомился.', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
      { q: 'Я буду просить о помощи своих знакомых, когда в этом действительно нуждаюсь.', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] },
      { q: 'Я буду делиться своими контактами и знаниями со знакомыми и малознакомыми людьми, чтобы им помочь.', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] },
      { q: 'Я буду публиковать свои статьи / писать экспертное мнение в специализированные издания.', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] },
      { q: 'Я знаю, как публично выступать перед целевой аудиторией на бизнес-ланчах, конференциях и прочих мероприятиях.', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
      { q: 'Ко мне будут обращаться незнакомые люди за помощью.', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] }
    ];
    const container = document.getElementById('quiz-container');
    const progressEl = document.getElementById('quiz-progress');
    const answers = [];
    let currentQ = 0;
    function showQuestion(idx) {
      if (idx >= questions.length) { showResult(); return; }
      const q = questions[idx];
      progressEl.textContent = 'Вопрос ' + (idx + 1) + ' из ' + questions.length;
      const div = document.createElement('div');
      div.className = 'quiz-q';
      const h = document.createElement('h3');
      h.textContent = (idx + 1) + '. ' + q.q;
      div.appendChild(h);
      const optsWrap = document.createElement('div');
      optsWrap.className = 'quiz-options';
      q.opts.forEach(function(label, oi) {
        const btn = document.createElement('div');
        btn.className = 'quiz-opt';
        btn.textContent = label;
        btn.addEventListener('click', function() {
          optsWrap.querySelectorAll('.quiz-opt').forEach(function(b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          answers[idx] = oi + 1;
          currentQ = idx + 1;
          setTimeout(function() {
            showQuestion(currentQ);
            container.scrollTop = container.scrollHeight;
          }, 350);
        });
        optsWrap.appendChild(btn);
      });
      div.appendChild(optsWrap);
      container.appendChild(div);
    }
    function showResult() {
      var total = answers.reduce(function(a, b) { return a + b; }, 0);
      var msg;
      if (total <= 20) {
        msg = 'Зарядись на эффективный нетворкинг и настройся на полное погружение в курс! Рекомендуем пройти его от А до Я.';
      } else if (total <= 35) {
        msg = 'Кажется, у тебя есть базовые знания. Повысь их до максимума — сделай первый шаг!';
      } else {
        msg = 'Твоих знаний вполне достаточно, чтобы добиться блестящих результатов. Но перед тобой стоит ответственная задача — сделать свой навык нетворкинга ещё более совершенным. Дерзай!';
      }
      progressEl.textContent = 'Тест завершён';
      var div = document.createElement('div');
      div.className = 'quiz-result';
      var h3 = document.createElement('h3');
      h3.textContent = 'Твой результат: ' + total + ' из 50';
      div.appendChild(h3);
      var p = document.createElement('p');
      p.style.fontSize = '13px';
      p.style.lineHeight = '1.5';
      p.textContent = msg;
      div.appendChild(p);
      container.appendChild(div);
      document.getElementById('btn-quiz-next').style.display = 'inline-flex';
      container.scrollTop = container.scrollHeight;
    }
    showQuestion(0);
  }

  // ===== Экран 3: поиск ключей =====
  function initKeysGame() {
    const hotspot = document.getElementById('keys-hotspot');
    hotspot.addEventListener('click', () => {
      showScreen('screen-4');
    });
  }

  // ===== Экран 4: кафе =====
  function initCafeScreen() {
    const buttons = document.querySelectorAll('#screen-4 [data-choice]');
    const modal = document.getElementById('cafe-modal');
    const modalContent = document.getElementById('cafe-modal-content');

    function openModal(html) {
      modalContent.innerHTML = html;
      modal.classList.add('active');
    }

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice');
        let html = '';
        if (choice === '1') {
          html = `
            <h3>Упущенная возможность</h3>
            <p>
              В мире нетворкинга бездействие – это тоже действие.
              Отношения с Павлом не испорчены, но и не улучшены.
              Иногда самый большой риск – это не рисковать вовсе.
            </p>
            <div class="actions-row" style="margin-top:10px; justify-content:flex-end;">
              <button class="btn" id="cafe-next">В офис</button>
            </div>
          `;
        } else if (choice === '2') {
          html = `
            <h3>+1 к узнаваемости</h3>
            <p>
              Павел улыбнулся в ответ и ушёл в хорошем настроении.
            </p>
            <p class="note">Микроанимация: +1 к Узнаваемости.</p>
            <div class="actions-row" style="margin-top:10px; justify-content:flex-end;">
              <button class="btn" id="cafe-next">В офис</button>
            </div>
          `;
          addVisibility(1);
        } else {
          html = `
            <h3>+3 к узнаваемости</h3>
            <p>
              Павел немного удивился, но ответил: «О, Злата, привет! Да, без него никак».
            </p>
            <p class="note">Микроанимация: +3 к Узнаваемости.</p>
            <div class="actions-row" style="margin-top:10px; justify-content:flex-end;">
              <button class="btn" id="cafe-next">В офис</button>
            </div>
          `;
          addVisibility(3);
        }
        openModal(html);
        setTimeout(() => {
          const nextBtn = document.getElementById('cafe-next');
          if (nextBtn) {
            nextBtn.addEventListener('click', () => {
              modal.classList.remove('active');
              showScreen('screen-5');
            });
          }
        }, 10);
      });
    });
  }

  // ===== Экран 5: карта (офис) =====
  function initOfficeMap() {
    const ind = document.getElementById('office-indicator');
    ind.addEventListener('click', () => showScreen('screen-6'));
  }

  // ===== Экран 6: офис, командировка =====
  function initOfficeChoices() {
    const btnAccept = document.getElementById('btn-accept-trip');
    const btnDecline = document.getElementById('btn-decline-trip');
    const modal = document.getElementById('boss-modal');
    const modalOk = document.getElementById('boss-modal-ok');

    btnAccept.addEventListener('click', () => {
      addNetworking(1);
      showScreen('screen-7');
    });

    btnDecline.addEventListener('click', () => {
      addNetworking(-1);
      modal.classList.add('active');
    });

    modalOk.addEventListener('click', () => {
      modal.classList.remove('active');
      showScreen('screen-7');
    });
  }

  // ===== Экран 9: карта (домой) =====
  function initHomeMap() {
    document.getElementById('home-indicator').addEventListener('click', () => {
      showScreen('screen-10');
    });
  }

  // ===== Экран 10: ноутбук =====
function initLaptopHotspot() {
    document.getElementById('folder-goal').addEventListener('click', function() {
      showScreen('screen-11');
    });
    document.getElementById('folder-schedule').addEventListener('click', function() {
      document.getElementById('schedule-modal').classList.add('active');
    });
    document.getElementById('schedule-modal-ok').addEventListener('click', function() {
      document.getElementById('schedule-modal').classList.remove('active');
    });
    document.getElementById('schedule-modal').addEventListener('click', function(e) {
      if (e.target === document.getElementById('schedule-modal')) {
        document.getElementById('schedule-modal').classList.remove('active');
      }
    });
  }

  // ===== Экран 11: цель нетворкинга =====
  function initPurposeScreen() {
    const btn = document.getElementById('btn-purpose-submit');
    const modal = document.getElementById('purpose-modal');
    const cont = document.getElementById('purpose-modal-continue');

    btn.addEventListener('click', () => {
      const text = document.getElementById('networking-purpose').value.trim();
      state.purposeText = text;
      addNetworking(1);
      modal.classList.add('active');
    });

    cont.addEventListener('click', () => {
      modal.classList.remove('active');
      showScreen('screen-12');
    });
  }

  // ===== Экран 12: Нити нетворкинга — мини-игра с бусинами =====
  const beadsStages = [
    { word: 'УСТАНОВКА', feedbackOk: 'Установка связей — это первый шаг, смелость начать. Супер! Двигаемся дальше.' },
    { word: 'УДЕРЖАНИЕ', feedbackOk: 'Удержание связей — это забота, искусство поддерживать контакт тёплым.' },
    { word: 'ЦЕННОСТЬ', feedbackOk: 'Ценность связей — это результат, к которому приводят первые два шага.' }
  ];

  function shuffleArray(arr) {
    return arr
      .map((v) => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ v }) => v);
  }

  function renderBeadsStage() {
    const stageIndex = state.beads.stage - 1;
    const stage = beadsStages[stageIndex];
    const pool = document.getElementById('beads-pool');
    const target = document.getElementById('beads-target');
    const feedback = document.getElementById('beads-feedback');
    const label = document.getElementById('beads-stage-label');

    if (!stage) return;

    label.textContent = String(state.beads.stage);

    pool.innerHTML = '';
    target.innerHTML = '';
    feedback.textContent = '';
    feedback.classList.remove('error');

    const letters = stage.word.split('');
    const shuffled = shuffleArray(letters);

    shuffled.forEach((ch) => {
      const el = document.createElement('div');
      el.className = 'bead';
      el.textContent = ch;
      el.draggable = true;
      el.dataset.letter = ch;
      pool.appendChild(el);
    });

    initBeadsDnD();
  }

  function initBeadsDnD() {
    const pool = document.getElementById('beads-pool');
    const target = document.getElementById('beads-target');

    function handleDragStart(e) {
      if (!e.target.classList.contains('bead')) return;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', e.target.dataset.letter);
      e.dataTransfer.setDragImage(e.target, 12, 12);
      e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
      if (e.target.classList.contains('bead')) {
        e.target.classList.remove('dragging');
      }
    }

    function allowDrop(e) {
      e.preventDefault();
    }

    function handleDropToTarget(e) {
      e.preventDefault();
      const dragging = document.querySelector('.bead.dragging');
      if (dragging && dragging.parentElement !== target) {
        target.appendChild(dragging);
      }
    }

    function handleDropToPool(e) {
      e.preventDefault();
      const dragging = document.querySelector('.bead.dragging');
      if (dragging && dragging.parentElement !== pool) {
        pool.appendChild(dragging);
      }
    }

    [pool, target].forEach((el) => {
      el.addEventListener('dragover', allowDrop);
    });
    pool.addEventListener('drop', handleDropToPool);
    target.addEventListener('drop', handleDropToTarget);

    document.querySelectorAll('.bead').forEach((b) => {
      b.addEventListener('dragstart', handleDragStart);
      b.addEventListener('dragend', handleDragEnd);
    });
  }

  function initBeadsGame() {
    const resetBtn = document.getElementById('beads-reset');
    const checkBtn = document.getElementById('beads-check');
    const feedback = document.getElementById('beads-feedback');
    const summaryModal = document.getElementById('beads-summary-modal');
    const summaryContinue = document.getElementById('beads-summary-continue');

    renderBeadsStage();

    resetBtn.addEventListener('click', () => {
      state.beads.attempts = 0;
      renderBeadsStage();
    });

    checkBtn.addEventListener('click', () => {
      const stageIndex = state.beads.stage - 1;
      const stage = beadsStages[stageIndex];
      const target = document.getElementById('beads-target');
      const letters = Array.from(target.querySelectorAll('.bead')).map((b) => b.dataset.letter).join('');
      if (letters === stage.word) {
        feedback.textContent = stage.feedbackOk;
        feedback.classList.remove('error');
        if (state.beads.stage < 3) {
          state.beads.stage++;
          state.beads.attempts = 0;
          setTimeout(renderBeadsStage, 600);
        } else {
          addNetworking(1);
          setTimeout(() => {
            summaryModal.classList.add('active');
          }, 600);
        }
      } else {
        state.beads.attempts++;
        if (state.beads.attempts >= 2) {
          target.innerHTML = '';
          stage.word.split('').forEach((ch) => {
            const el = document.createElement('div');
            el.className = 'bead';
            el.textContent = ch;
            el.draggable = false;
            target.appendChild(el);
          });
        }
        feedback.textContent = 'Не получилось собрать слово. Попробуй ещё раз.';
        feedback.classList.add('error');
      }
    });

    summaryModal.addEventListener('click', (e) => {
      if (e.target === summaryModal) {
        summaryModal.classList.remove('active');
      }
    });
    summaryContinue.addEventListener('click', () => {
      summaryModal.classList.remove('active');
    });
  }

  // ===== Экран 13: страхи =====
  function initFears() {
    const btnFears = document.getElementById('btn-fears-submit');
    const secondStep = document.getElementById('fears-second-step');
    const btnFight = document.getElementById('btn-fight-submit');
    const modal = document.getElementById('fears-modal');

    btnFears.addEventListener('click', () => {
      document.querySelectorAll('#fear-grid .mask-card').forEach(card => {
        card.classList.add('flipped');
      });
      secondStep.style.display = 'block';
    });

    btnFight.addEventListener('click', () => {
      addNetworking(1);
      modal.classList.add('active');
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // ===== Экран 14: колесо баланса =====
  // ===== SVG-колесо: вспомогательные функции =====
const wheelCategories = [
  { name:'Карьера',        color:'#22c55e', emoji:'💼' },
  { name:'Образование',    color:'#38bdf8', emoji:'🏫' },
  { name:'Хобби',          color:'#f97316', emoji:'🎨' },
  { name:'Личные проекты', color:'#a855f7', emoji:'📁' },
  { name:'Финансы',        color:'#facc15', emoji:'💸' },
  { name:'Здоровье',       color:'#e11d48', emoji:'🩺' }
];

function polar(cx, cy, r, angle) {
  const rad = (angle - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(cx, cy, r1, r2, startAngle, endAngle) {
  const p1 = polar(cx, cy, r2, startAngle);
  const p2 = polar(cx, cy, r2, endAngle);
  const p3 = polar(cx, cy, r1, endAngle);
  const p4 = polar(cx, cy, r1, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${r2} ${r2} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${r1} ${r1} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ');
}

function renderWheel(svgId, values, activeIndex) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const cx = 210, cy = 210, maxR = 150, innerR = 24;
  const step = (maxR - innerR) / 10;
  svg.innerHTML = '';

  for (let i = 1; i <= 10; i++) {
    const r = innerR + step * i;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke', i === 10 ? '#cbd5e1' : '#e2e8f0');
    c.setAttribute('stroke-width', '1');
    svg.appendChild(c);
  }

  for (let i = 0; i < 6; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const p = polar(cx, cy, maxR + 10, i * 60);
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
    line.setAttribute('stroke', '#e2e8f0'); line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);
  }

  wheelCategories.forEach((cat, i) => {
    const start = i * 60, end = start + 60;
    const value = values[i] || 0;
    const r2 = innerR + step * value;

    if (value > 0) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', sectorPath(cx, cy, innerR, r2, start, end));
      path.setAttribute('fill', cat.color);
      path.setAttribute('fill-opacity', activeIndex === i ? '0.92' : '0.78');
      path.setAttribute('stroke', '#ffffff'); path.setAttribute('stroke-width', '2');
      svg.appendChild(path);
    }

    if (activeIndex === i) {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      ring.setAttribute('d', sectorPath(cx, cy, innerR, maxR, start, end));
      ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', cat.color);
      ring.setAttribute('stroke-width', '4'); ring.setAttribute('stroke-dasharray', '8 6');
      svg.appendChild(ring);
    }

    const lp = polar(cx, cy, maxR + 34, start + 30);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lp.x); text.setAttribute('y', lp.y);
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', activeIndex === i ? '800' : '700');
    text.setAttribute('fill', activeIndex === i ? cat.color : '#64748b');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = cat.name;
    svg.appendChild(text);

    if (value > 0) {
      const sp = polar(cx, cy, Math.max(innerR + 14, innerR + step * value - 10), start + 30);
      const st = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      st.setAttribute('x', sp.x); st.setAttribute('y', sp.y);
      st.setAttribute('font-size', '13'); st.setAttribute('font-weight', '800');
      st.setAttribute('fill', '#1e293b'); st.setAttribute('text-anchor', 'middle');
      st.textContent = value;
      svg.appendChild(st);
    }
  });

  const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  center.setAttribute('cx', cx); center.setAttribute('cy', cy); center.setAttribute('r', innerR);
  center.setAttribute('fill', '#ffffff'); center.setAttribute('stroke', '#e2e8f0');
  center.setAttribute('stroke-width', '2');
  svg.appendChild(center);
}

// ===== Экран 14: колесо баланса (новое) =====
function initWheel() {
  const segBtnContainer = document.getElementById('seg-level-buttons');
  const currentSegName = document.getElementById('current-seg-name');
   const btnFinish = document.getElementById('btn-wheel-finish');
  const btnReset = document.getElementById('btn-wheel-reset');

  function findNextUnfilled() {
    return state.wheel.values.findIndex(v => v === 0);
  }

  segBtnContainer.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const b = document.createElement('button');
    b.textContent = i;
    b.dataset.level = i;
    segBtnContainer.appendChild(b);
  }

  function updateUI() {
    const idx = state.wheel.currentIndex;
    const name = wheelCategories[idx].name;
    const value = state.wheel.values[idx];
    currentSegName.textContent = name;
    segBtnContainer.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.level, 10) === value);
    });
    renderWheel('wheelSvg', state.wheel.values, idx);
    const allFilled = state.wheel.values.every(v => v > 0);
    btnFinish.style.display = allFilled ? 'inline-flex' : 'none';
    btnReset.style.display = allFilled ? 'inline-flex' : 'none';
     }

  segBtnContainer.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    state.wheel.values[state.wheel.currentIndex] = parseInt(e.target.dataset.level, 10);
    const next = findNextUnfilled();
    if (next !== -1) state.wheel.currentIndex = next;
    updateUI();
  });

  // Готово — начисляем очки и переходим на экран 15
  btnFinish.addEventListener('click', () => {
    addNetworking(1);
    showScreen('screen-15');
  });

  // Оценить заново — сбрасываем все оценки
  btnReset.addEventListener('click', () => {
    state.wheel.values = [0, 0, 0, 0, 0, 0];
    state.wheel.currentIndex = 0;
    updateUI();
  });

  state.wheel.currentIndex = 0;
  updateUI();
}

// ===== Экран 15: результат колеса (новое) =====
function initWheelSummary() {
  const slidersContainer = document.getElementById('importance-sliders');
  const btnCalc = document.getElementById('btn-calc-priority');
  const resultBlock = document.getElementById('priority-result');
  const topSectorsEl = document.getElementById('top-sectors');
  let slidersBuilt = false;

  function buildSliders() {
    if (slidersBuilt) return;
    slidersBuilt = true;
    slidersContainer.innerHTML = '';
    wheelCategories.forEach((cat, i) => {
      const row = document.createElement('div');
      row.className = 'importance-row';
      row.innerHTML = `
        <span class="imp-label">${cat.emoji} ${cat.name}</span>
        <input type="range" min="1" max="10" value="${state.wheel.importance[i]}" data-idx="${i}">
        <span class="imp-value">${state.wheel.importance[i]}</span>
      `;
      const slider = row.querySelector('input[type="range"]');
      const valSpan = row.querySelector('.imp-value');
      slider.addEventListener('input', () => {
        state.wheel.importance[i] = parseInt(slider.value, 10);
        valSpan.textContent = slider.value;
      });
      slidersContainer.appendChild(row);
    });
  }

  btnCalc.addEventListener('click', () => {
    // Формула: score = importance * (11 - wheelValue)
    // Чем выше важность И чем ниже текущий балл контактов — тем выше score
    const scores = wheelCategories.map((cat, i) => ({
      idx: i,
      name: cat.name,
      emoji: cat.emoji,
      importance: state.wheel.importance[i],
      contacts: state.wheel.values[i],
     score: state.wheel.importance[i] * (11 - state.wheel.values[i])
    }));
    document.getElementById('btn-screen15-continue').style.display = 'inline-flex';

    // Сортируем по убыванию score
    scores.sort((a, b) => b.score - a.score);

    // Берём топ — все с максимальным score, или топ-2
    const topScore = scores[0].score;
    const top = scores.filter(s => s.score >= topScore * 0.85); // в пределах 85% от макс.

    topSectorsEl.innerHTML = top.map(s =>
      `<span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:999px; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.4); margin:2px;">${s.emoji} ${s.name} <span style="font-size:11px; color:var(--text-soft);">(важность ${s.importance}, контакты ${s.contacts})</span></span>`
    ).join(' ');

    resultBlock.style.display = 'block';
    addNetworking(1);
  });

  // Отрисовка при открытии экрана
  const observer = new MutationObserver(() => {
    if (document.getElementById('screen-15').classList.contains('active')) {
      renderWheel('resultWheelSvg', state.wheel.values, -1);
      buildSliders();
    }
  });
  observer.observe(document.getElementById('screen-container'), {
    attributes: true, subtree: true, attributeFilter: ['class']
  });
}
// ===== Экран 16: перетаскивание человечков =====
function initPeopleDrag() {
  const pool = document.getElementById('people-pool');
  const target = document.getElementById('people-target');
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'person-token';
    p.textContent = '🙂';
    p.draggable = true;
    pool.appendChild(p);
  }

  function allowDrop(e) { e.preventDefault(); }

  function handleDrop(e, dest) {
    e.preventDefault();
    const dragging = document.querySelector('.person-token.dragging:not([data-part-id])');
    if (dragging && dragging.parentElement !== dest) {
      dest.appendChild(dragging);
    }
  }

  [pool, target].forEach(el => { el.addEventListener('dragover', allowDrop); });
  pool.addEventListener('drop', e => handleDrop(e, pool));
  target.addEventListener('drop', e => handleDrop(e, target));

  document.addEventListener('dragstart', e => {
    if (e.target.classList.contains('person-token') && !e.target.dataset.partId) {
      e.target.classList.add('dragging');
    }
  });
  document.addEventListener('dragend', e => {
    if (e.target.classList.contains('person-token') && !e.target.dataset.partId) {
      e.target.classList.remove('dragging');
    }
  });
}
  // ===== HUD цель Златы — появляется только с экрана 17 =====
  function initGoalHud() {
    const chip = document.getElementById('goal-chip');
    const popup = document.getElementById('goal-popup');
    const close = document.getElementById('goal-popup-close');

    chip.addEventListener('click', () => {
      if (chip.style.display !== 'none') {
       popup.style.display = 'flex';
popup.style.pointerEvents = 'auto';
      }
    });

    close.addEventListener('click', () => {
      popup.style.display = 'none';
popup.style.pointerEvents = 'none';
    });
    popup.addEventListener('click', e => {
      if (e.target === popup) popup.style.display = 'none';
    });

    const observer = new MutationObserver(() => {
      const s17 = document.getElementById('screen-17');
      if (s17 && s17.classList.contains('active')) {
        chip.style.display = 'flex';
      }
    });
    observer.observe(document.getElementById('screen-container'), { attributes: true, subtree: true, attributeFilter: ['class'] });
  }

  // ===== Экран 19: логика визитки =====
  function initBizcard() {
    const elementsContainer = document.getElementById('bizcard-elements');
    const target = document.getElementById('bizcard-target');
    const feedback = document.getElementById('bizcard-feedback');
    const btnCheck = document.getElementById('btn-bizcard-check');

    const parts = [
      { id: 'name', label: 'Имя и фамилия' },
      { id: 'title', label: 'Должность' },
      { id: 'contacts', label: 'Контакты' },
      { id: 'msg', label: 'Ключевое сообщение' }
    ];

    // создаём элементы
    parts.forEach(p => {
      const el = document.createElement('div');
      el.className = 'person-token';
      el.textContent = p.label;
      el.dataset.partId = p.id;
      el.draggable = true;
      elementsContainer.appendChild(el);
    });

    function allowDrop(e) {
      e.preventDefault();
    }

    function handleDrop(e, dest) {
      e.preventDefault();
      const dragging = document.querySelector('.person-token.dragging');
      if (dragging && dragging.parentElement !== dest) {
        dest.appendChild(dragging);
      }
    }

    [elementsContainer, target].forEach(el => {
      el.addEventListener('dragover', allowDrop);
    });
    elementsContainer.addEventListener('drop', e => handleDrop(e, elementsContainer));
    target.addEventListener('drop', e => handleDrop(e, target));

    document.addEventListener('dragstart', e => {
      if (e.target.classList.contains('person-token') && e.target.dataset.partId) {
        e.target.classList.add('dragging');
      }
    });
    document.addEventListener('dragend', e => {
      if (e.target.classList.contains('person-token') && e.target.dataset.partId) {
        e.target.classList.remove('dragging');
      }
    });

    btnCheck.addEventListener('click', () => {
      const placed = Array.from(target.querySelectorAll('.person-token'));
      if (placed.length !== parts.length) {
        feedback.textContent = 'Добавь все элементы визитки на карточку.';
        feedback.style.color = '#fca5a5';
        return;
      }
      const order = placed.map(p => p.dataset.partId);
      const correct = ['name', 'title', 'contacts', 'msg'];
      const isCorrect = order.join('|') === correct.join('|');
      if (isCorrect) {
        feedback.textContent = 'Класс! Визитка собрана логично. +1 к узнаваемости.';
        feedback.style.color = '#4ade80';
        if (!state.bizcardRewarded) {
          addVisibility(1);
          state.bizcardRewarded = true;
        }
      } else {
        feedback.textContent = 'Элементы лучше расположить в таком порядке: имя, должность, контакты, ключевое сообщение.';
        feedback.style.color = '#fca5a5';
      }
    });
  }

  // ===== Экран 20–21: повышение узнаваемости =====
  function initProfileAndSticky() {
    document.getElementById('btn-profile-done').addEventListener('click', () => {
      addVisibility(2);
    });

    const board = document.getElementById('sticky-board');
    const input = document.getElementById('sticky-input');
    const addBtn = document.getElementById('btn-sticky-add');

    addBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      const sticky = document.createElement('div');
      sticky.className = 'sticky';
      sticky.innerHTML = `
        <div>${text}</div>
        <div class="sticky-footer">
          <span style="opacity:0.7;">@you</span>
          <span class="like-count" data-likes="0">♥ 0</span>
        </div>
      `;
      board.appendChild(sticky);
      addVisibility(1);
      input.value = '';
    });

    board.addEventListener('click', e => {
      const target = e.target.closest('.like-count');
      if (!target) return;
      let likes = parseInt(target.dataset.likes || '0', 10);
      likes++;
      target.dataset.likes = String(likes);
      target.textContent = `♥ ${likes}`;
    });
  }
 // ===== Экран 21-1: сумочка нетворкера =====
  function initBag() {
    var items = [
      {emoji:'💼',name:'Визитница',text:'Это не та визитница, которая находится в левом внутреннем кармане пиджака или блейзера. Это запасная визитница — неприкосновенный запас, пользоваться которым нужно в случае крайней необходимости.'},
      {emoji:'🖊️',name:'Ручка',text:'Всегда имей при себе запасную ручку, а лучше две. Идеально, если они именные или корпоративные.'},
      {emoji:'📓',name:'Записная книжка',text:'Понадобится для записей мыслей в дороге, во время семинаров или конференций. Не бери в привычку запоминать имена, телефоны, идеи и любые мысли. Забудешь.'},
      {emoji:'🧻',name:'Салфетки',text:'Частые переезды, десятки рукопожатий в день, регулярные кофе-брейки, где еду чаще всего берут руками. Влажные салфетки тут просто незаменимы. Рекомендация: используй антибактериальные жидкости на спиртовой основе.'},
      {emoji:'🧴',name:'Пятновыводитель',text:'Порой случается этот неловкий момент, когда приятный и вкусный кофе-брейк заканчивается пятном на сорочке или брюках. А ведь конференция только началась. Но зачем выдумывать велосипед, когда есть компактные пятновыводители?'},
      {emoji:'💊',name:'Аптечка',text:'Частые переезды и длительные конференции выматывают. Не нужно с собой брать огромную аптечку. Отрежь по 2–4 таблетки от каждой пластины и возьми только средства от головной боли, от давления и для улучшения пищеварения.'},
      {emoji:'🍬',name:'Мятные конфеты',text:'Продолжая тему кофе-брейков, убедись, что после его завершения с тобой приятно общаться. Как говорится: «Свежесть дыхания облегчает понимание».'},
      {emoji:'📖',name:'Книга или журнал',text:'Любой нетворкер должен уделять время развитию своего кругозора. Он помогает поддержать разговор на разные темы. Поэтому возьми в привычку читать книги и журналы в свободную минуту.'},
      {emoji:'🔋',name:'Зарядное устройство',text:'Универсальное зарядное устройство — гаджет размером с визитницу, которое заряжает ваш телефон без подключения к электричеству. Выручает при каждой поездке.'},
      {emoji:'✨',name:'Парфюм',text:'Дело каждого использовать парфюм или нет. Можно держать в сумке парфюм маленькой ёмкости 30 мл или купить пробники.'}
    ];
    var shelf = document.getElementById('bag-shelf');
    var zone = document.getElementById('bag-zone');
    var modal = document.getElementById('bag-modal');
    var mTitle = document.getElementById('bag-modal-title');
    var mText = document.getElementById('bag-modal-text');
    var mTake = document.getElementById('bag-modal-take');
    var btnGo = document.getElementById('btn-bag-go');
    var doneMsg = document.getElementById('bag-done-msg');
    var currentIdx = -1;
    var taken = 0;

    items.forEach(function(item, i) {
      var el = document.createElement('div');
      el.className = 'bag-item';
      el.dataset.idx = i;
      el.innerHTML = '<span class="bag-emoji">' + item.emoji + '</span>' + item.name;
      el.addEventListener('click', function() {
        currentIdx = i;
        mTitle.textContent = item.emoji + ' ' + item.name;
        mText.textContent = item.text;
        modal.classList.add('active');
      });
      shelf.appendChild(el);
    });

    mTake.addEventListener('click', function() {
      if (currentIdx < 0) return;
      var el = shelf.querySelector('[data-idx="' + currentIdx + '"]');
      if (el && !el.classList.contains('taken')) {
        el.classList.add('taken');
        var chip = document.createElement('div');
        chip.className = 'bag-chip';
        chip.textContent = items[currentIdx].emoji + ' ' + items[currentIdx].name;
        zone.appendChild(chip);
        taken++;
        if (taken >= items.length) {
          doneMsg.style.display = 'block';
          btnGo.style.display = 'inline-flex';
        }
      }
      modal.classList.remove('active');
      currentIdx = -1;
    });

    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('active');
    });

    btnGo.addEventListener('click', function() {
      showScreen('screen-22');
    });
  }
  // ===== Экран 22–23: персонажи конференции =====
  const confCharacters = [
    { id: 'c1', name: 'Ольга', sphere: 'Карьера', match: true, x: '20%', y: '30%' },
    { id: 'c2', name: 'Максим', sphere: 'Маркетинг', match: true, x: '60%', y: '40%' },
    { id: 'c3', name: 'Анна', sphere: 'Образование', match: false, x: '30%', y: '65%' },
    { id: 'c4', name: 'Иван', sphere: 'Хобби', match: false, x: '70%', y: '70%' }
  ];
  const coffeeCharacters = [
    { id: 'k1', name: 'Елена', sphere: 'Карьера', match: true, x: '25%', y: '40%' },
    { id: 'k2', name: 'Дмитрий', sphere: 'Финансы', match: false, x: '55%', y: '30%' },
    { id: 'k3', name: 'Светлана', sphere: 'Личные проекты', match: false, x: '70%', y: '60%' }
  ];

  function createCharacterDot(char, container, modal, modalContent) {
  const dot = document.createElement('div');
  dot.className = 'character-dot';
  dot.style.left = char.x;
  dot.style.top = char.y;
  dot.dataset.match = char.match ? 'true' : 'false';
  dot.textContent = char.name[0];

  const tooltip = document.createElement('div');
  tooltip.className = 'character-tooltip';
  tooltip.textContent = char.sphere;
  dot.appendChild(tooltip);

  dot.addEventListener('click', () => {
    let html = `<h3>Знакомство с ${char.name}</h3>
      <p>Сфера: <strong>${char.sphere}</strong>.</p>`;
    if (char.match) {
      state.zlataGoal = clamp(state.zlataGoal + 1, 0, 6);
      addNetworking(1);
      addContacts(1);
      html += `
        <p class="note">Сфера подходит цели Златы. +1 к счётчику цели, +1 к нетворкингу, +1 к знакомствам.</p>
      `;
    } else {
      addNetworking(1);
      addContacts(1);
      html += `
        <p class="note">Сфера не совпадает с целевой, но это всё равно полезное знакомство.
        +1 к нетворкингу, +1 к знакомствам.</p>
      `;
    }
    html += `
      <div class="actions-row" style="margin-top:10px; justify-content:flex-end;">
        <button class="btn secondary modal-close-btn">Закрыть</button>
      </div>`;
    modalContent.innerHTML = html;
    modal.classList.add('active');
    updateHud();

    const closeBtn = modalContent.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
  });

  container.appendChild(dot);
}

  function initConference() {
    const hall = document.getElementById('conf-hall');
    const modal = document.getElementById('conf-modal');
    const modalContent = document.getElementById('conf-modal-content');

    confCharacters.forEach(c => createCharacterDot(c, hall, modal, modalContent));

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });

    const coffeeHall = document.getElementById('coffee-hall');
    const coffeeModal = document.getElementById('coffee-modal');
    const coffeeModalContent = document.getElementById('coffee-modal-content');

    coffeeCharacters.forEach(c => createCharacterDot(c, coffeeHall, coffeeModal, coffeeModalContent));

    coffeeModal.addEventListener('click', e => {
      if (e.target === coffeeModal) coffeeModal.classList.remove('active');
    });
  }

  // ===== Экран 24: follow-up =====
  function initFollowup() {
    const btn = document.getElementById('btn-followup-send');
    btn.addEventListener('click', () => {
      addNetworking(1);
      addVisibility(1);
    });
  }

  // ===== Экран 25: календарь касаний =====
  function initCalendar() {
    const grid = document.getElementById('calendar-grid');
    const icons = document.getElementById('calendar-icons');

    for (let i = 1; i <= 21; i++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell';
      const placeholder = document.createElement('div');
      placeholder.className = 'calendar-icon-placeholder';
      placeholder.textContent = i;
      cell.appendChild(placeholder);
      grid.appendChild(cell);
    }

    function allowDrop(e) {
      e.preventDefault();
    }

    grid.addEventListener('dragover', allowDrop);
    grid.addEventListener('drop', e => {
      const targetCell = e.target.closest('.calendar-cell');
      if (!targetCell) return;
      const dragging = document.querySelector('.calendar-icon.dragging');
      if (dragging) {
        const clone = dragging.cloneNode(true);
        clone.classList.remove('dragging');
        clone.draggable = false;
        const placeholder = targetCell.querySelector('.calendar-icon-placeholder');
        if (placeholder) {
          placeholder.replaceWith(clone);
          addNetworking(1);
          addVisibility(1);
        }
      }
    });

    icons.addEventListener('dragstart', e => {
      if (e.target.classList.contains('calendar-icon')) {
        e.target.classList.add('dragging');
      }
    });
    icons.addEventListener('dragend', e => {
      if (e.target.classList.contains('calendar-icon')) {
        e.target.classList.remove('dragging');
      }
    });
  }

  // ===== Экран 26: финал =====
  function initFinalScreen() {
    const screen = document.getElementById('screen-26');
    const finalNetworking = document.getElementById('final-networking');
    const finalContacts = document.getElementById('final-contacts');
    const finalVisibility = document.getElementById('final-visibility');
    const finalFates = document.getElementById('final-fates');
    const finalGoalResult = document.getElementById('final-goal-result');

    const observer = new MutationObserver(() => {
      if (screen.classList.contains('active')) {
        finalNetworking.textContent = `${state.networking} / 100`;
        finalContacts.textContent = state.contacts;
        finalVisibility.textContent = state.visibility;

        finalFates.innerHTML = '';
        let fate;
        if (state.networking >= 80 && state.contacts >= 6 && state.visibility >= 10) {
          fate = {
            title: 'Мисс популярность',
            desc: 'Ты уверенно заводишь связи и поддерживаешь их. Ты — центр своей профессиональной сети.'
          };
        } else if (state.networking >= 40 && state.contacts >= 3 && state.visibility >= 5) {
          fate = {
            title: 'Местная звезда',
            desc: 'Ты заметен(на) в своём окружении, у тебя уже есть крепкое ядро полезных контактов.'
          };
        } else {
          fate = {
            title: 'Стесняшка',
            desc: 'Ты сделал(а) несколько шагов, но пока нетворкинг остаётся зоной роста. Зато теперь ты знаешь путь.'
          };
        }

        const card = document.createElement('div');
        card.className = 'fate-card';
        card.innerHTML = `
          <div class="fate-title">${fate.title}</div>
          <div class="fate-metric">${fate.desc}</div>
        `;
        finalFates.appendChild(card);

        finalGoalResult.textContent = state.zlataGoal >= 6
          ? 'достигнута (6/6 или больше)'
          : `не достигнута (${state.zlataGoal}/6)`;
      }
    });

    observer.observe(document.getElementById('screen-container'), { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
 // ===== Экран 16-1: локации =====
  function initLocations() {
    const pool = document.getElementById('location-pool');
    const modal = document.getElementById('locations-modal');
    const feedbackEl = document.getElementById('locations-feedback');
    const btnDone = document.getElementById('btn-locations-done');
    const btnContinue = document.getElementById('locations-continue');

    const locations = [
      'Бары', 'Ночные клубы', 'Рестораны', 'Домашние вечеринки',
      'Кафе', 'Залы заседаний', 'Спортзал', 'Офисные переговорные',
      'Конференции', 'Кофейни', 'Телефонные разговоры',
      'Переписка по электронной почте', 'Видеочаты', 'Мессенджеры',
      'Природа', 'Вечеринки на свежем воздухе', 'Званые ужины',
      'Походы в кино', 'Казино', 'Концерты',
      'Официальные мероприятия с дресс-кодом', 'Коктейльные вечеринки',
      'Тематические парки', 'Фестивали', 'Корпоративные мероприятия',
      'Спортивные мероприятия'
    ];

    // Создаём чипы
    locations.forEach(loc => {
      const chip = document.createElement('div');
      chip.className = 'location-chip';
      chip.textContent = loc;
      chip.draggable = true;
      chip.dataset.location = loc;
      pool.appendChild(chip);
    });

    // Drag & Drop
    let draggedChip = null;

    document.addEventListener('dragstart', e => {
      if (e.target.classList.contains('location-chip')) {
        draggedChip = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    document.addEventListener('dragend', e => {
      if (e.target.classList.contains('location-chip')) {
        e.target.classList.remove('dragging');
        draggedChip = null;
        document.querySelectorAll('.location-drop-zone').forEach(z => z.classList.remove('drag-over'));
      }
    });

    // Разрешаем drop на зонах категорий И на пуле (возврат)
    const allDropZones = document.querySelectorAll('#screen-16-1 .location-drop-zone');
    
    function setupDropZone(zone) {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (draggedChip) {
          zone.appendChild(draggedChip);
          // Обновляем стиль чипа
          draggedChip.classList.remove('in-comfort', 'in-neutral', 'in-avoid');
          const cat = zone.dataset.category;
          if (cat === 'comfort') draggedChip.classList.add('in-comfort');
          else if (cat === 'neutral') draggedChip.classList.add('in-neutral');
          else if (cat === 'avoid') draggedChip.classList.add('in-avoid');
        }
      });
    }

    allDropZones.forEach(setupDropZone);

    // Пул тоже как drop-зона (для возврата)
    pool.addEventListener('dragover', e => e.preventDefault());
    pool.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedChip) {
        pool.appendChild(draggedChip);
        draggedChip.classList.remove('in-comfort', 'in-neutral', 'in-avoid');
      }
    });

    // Кнопка «Готово»
    btnDone.addEventListener('click', () => {
      const comfortZone = document.querySelector('.location-drop-zone[data-category="comfort"]');
      const neutralZone = document.querySelector('.location-drop-zone[data-category="neutral"]');
      const avoidZone = document.querySelector('.location-drop-zone[data-category="avoid"]');

      const comfortItems = Array.from(comfortZone.querySelectorAll('.location-chip')).map(c => c.textContent);
      const neutralItems = Array.from(neutralZone.querySelectorAll('.location-chip')).map(c => c.textContent);
      const avoidItems = Array.from(avoidZone.querySelectorAll('.location-chip')).map(c => c.textContent);

      let html = '';

      if (comfortItems.length > 0) {
        html += `
          <div style="margin-bottom: 8px;">
            <strong style="color: #4ade80;">🐟 Как рыба в воде (${comfortItems.length}):</strong>
            <p style="font-size: 13px; margin-top: 2px;">Это те места, куда ты ходишь с удовольствием и где чувствуешь себя в полной мере собой.</p>
            <p style="font-size: 12px; color: var(--text-soft); margin-top: 2px;">${comfortItems.join(', ')}</p>
          </div>
        `;
      }

      if (neutralItems.length > 0) {
        html += `
          <div style="margin-bottom: 8px;">
            <strong style="color: #facc15;">😐 Нейтрально (${neutralItems.length}):</strong>
            <p style="font-size: 13px; margin-top: 2px;">Ситуации, связанные с общением, могут развиваться по-разному — всё зависит от настроения и от того, кто рядом.</p>
            <p style="font-size: 12px; color: var(--text-soft); margin-top: 2px;">${neutralItems.join(', ')}</p>
          </div>
        `;
      }

      if (avoidItems.length > 0) {
        html += `
          <div style="margin-bottom: 8px;">
            <strong style="color: #f97373;">🚫 Ноги моей тут не будет (${avoidItems.length}):</strong>
            <p style="font-size: 13px; margin-top: 2px;">Тут тебе неуютно, скучно и плохо.</p>
            <p style="font-size: 12px; color: var(--text-soft); margin-top: 2px;">${avoidItems.join(', ')}</p>
          </div>
        `;
      }

      if (comfortItems.length === 0 && neutralItems.length === 0 && avoidItems.length === 0) {
        html = '<p>Ты пока ничего не распределил. Попробуй перетащить хотя бы несколько локаций!</p>';
      }

      feedbackEl.innerHTML = html;
      addNetworking(1);
      modal.classList.add('active');
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });

 btnContinue.addEventListener('click', () => {
  modal.classList.remove('active');
  showScreen('screen-17');
});
  }
   document.addEventListener('DOMContentLoaded', () => {
    initGlobalNav();
    initMainMenu();
    initQuotes();
    initQuiz();
    initKeysGame();
    initCafeScreen();
    initOfficeMap();
    initOfficeChoices();
    initHomeMap();
    initLaptopHotspot();
    initPurposeScreen();
    initBeadsGame();
    initFears();
    initWheel();
    initWheelSummary();
    initPeopleDrag();
    initLocations();      // ← ДОБАВИТЬ
    initGoalHud();
    initBizcard();
    initProfileAndSticky();
    initBag();
    initConference();
    initFollowup();
    initCalendar();
    initFinalScreen();
    updateHud();
  });
</script>
