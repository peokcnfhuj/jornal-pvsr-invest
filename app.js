// Jornal PVSR INVEST — leitor de PDF embutido
(function () {
  var reader = document.getElementById('reader');
  var frame = document.getElementById('reader-frame');
  var title = document.getElementById('reader-title');
  var download = document.getElementById('reader-download');
  var closeBtn = document.getElementById('reader-close');

  function openReader(pdf, label) {
    frame.src = pdf;
    title.textContent = 'Lendo: ' + label;
    download.href = pdf;
    reader.hidden = false;
    reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeReader() {
    frame.src = 'about:blank';
    reader.hidden = true;
  }

  var buttons = document.querySelectorAll('[data-pdf]');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      openReader(this.getAttribute('data-pdf'), this.getAttribute('data-title'));
    });
  }

  closeBtn.addEventListener('click', closeReader);
})();

// Painel ao vivo — cotações via TradingView scanner + alternative.me (sem chave, sem login)
(function () {
  var TV = 'https://scanner.tradingview.com/symbol?symbol=';
  var ITEMS = [
    { id: 'ibov', symbol: 'BMFBOVESPA%3AIBOV', dec: 2, prefix: '' },
    { id: 'usd', symbol: 'FX_IDC%3AUSDBRL', dec: 4, prefix: 'R$ ' },
    { id: 'spx', symbol: 'SP%3ASPX', dec: 2, prefix: '' },
    { id: 'ixic', symbol: 'NASDAQ%3AIXIC', dec: 2, prefix: '' },
    { id: 'dji', symbol: 'DJ%3ADJI', dec: 2, prefix: '' },
    { id: 'btc', symbol: 'BINANCE%3ABTCUSDT', dec: 2, prefix: 'US$ ' },
    { id: 'eur', symbol: 'FX_IDC%3AEURBRL', dec: 4, prefix: 'R$ ' },
    { id: 'gold', symbol: 'TVC%3AGOLD', dec: 2, prefix: 'US$ ' },
    { id: 'wti', symbol: 'NYMEX%3ACL1%21', dec: 2, prefix: 'US$ ' },
    { id: 'vix', symbol: 'TVC%3AVIX', dec: 2, prefix: '' },
    { id: 'dxy', symbol: 'TVC%3ADXY', dec: 2, prefix: '' }
  ];
  var updatedEl = document.getElementById('live-updated');

  function fmtNum(n, dec) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function fmtVar(change) {
    var sign = change > 0 ? '+' : (change < 0 ? '−' : '');
    return sign + fmtNum(Math.abs(change), 2) + '% no dia';
  }
  function varClass(change, invert) {
    if (change === 0) return 'tick-var neutral';
    var up = change > 0;
    if (invert) up = !up;
    return 'tick-var ' + (up ? 'up' : 'down');
  }
  function setVal(it, close, change) {
    var valEl = document.getElementById('live-' + it.id);
    var varEl = document.getElementById('live-' + it.id + '-var');
    if (!valEl || !varEl) return;
    var text = it.prefix + fmtNum(close, it.dec);
    if (valEl.textContent !== text) {
      valEl.textContent = text;
      valEl.classList.remove('flash');
      void valEl.offsetWidth;
      valEl.classList.add('flash');
    }
    varEl.textContent = fmtVar(change);
    varEl.className = varClass(change, it.id === 'vix');
  }
  function fetchTV(it) {
    return fetch(TV + it.symbol + '&fields=close,change').then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (d) {
      if (d && typeof d.close === 'number' && typeof d.change === 'number') {
        setVal(it, d.close, d.change);
        return true;
      }
      return false;
    }).catch(function () { return false; });
  }
  var FNG_TEXT = {
    'Extreme Fear': ['medo extremo', 'down'],
    'Fear': ['medo', 'down'],
    'Neutral': ['neutro', 'neutral'],
    'Greed': ['ganância', 'up'],
    'Extreme Greed': ['ganância extrema', 'up']
  };
  function fetchFng() {
    return fetch('https://api.alternative.me/fng/?limit=1').then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (d) {
      var item = d && d.data && d.data[0];
      if (!item) return false;
      var valEl = document.getElementById('live-fng');
      var varEl = document.getElementById('live-fng-var');
      if (!valEl || !varEl) return false;
      var text = item.value + ' pontos';
      if (valEl.textContent !== text) {
        valEl.textContent = text;
        valEl.classList.remove('flash');
        void valEl.offsetWidth;
        valEl.classList.add('flash');
      }
      var map = FNG_TEXT[item.value_classification] || ['—', 'neutral'];
      varEl.textContent = map[0];
      varEl.className = 'tick-var ' + map[1];
      return true;
    }).catch(function () { return false; });
  }
  function stamp(ok) {
    if (!updatedEl) return;
    if (ok) {
      var now = new Date();
      var hh = String(now.getHours()).padStart(2, '0');
      var mm = String(now.getMinutes()).padStart(2, '0');
      var ss = String(now.getSeconds()).padStart(2, '0');
      updatedEl.textContent = 'Atualizado às ' + hh + ':' + mm + ':' + ss;
    } else {
      updatedEl.textContent = 'Sem conexão — mostrando o último valor';
    }
  }
  var timer = null;
  function fetchAll() {
    var jobs = ITEMS.map(fetchTV);
    jobs.push(fetchFng());
    Promise.all(jobs).then(function (results) {
      var anyOk = results.some(function (x) { return x; });
      stamp(anyOk);
    });
  }
  function start() {
    if (timer) return;
    timer = setInterval(fetchAll, 60000);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); }
    else { fetchAll(); start(); }
  });
  fetchAll();
  start();
})();
