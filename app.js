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
  var SCAN_URL = 'https://scanner.tradingview.com/global/scan';
  var TV = 'https://scanner.tradingview.com/symbol?symbol=';
  var TICKERS = [
    { id: 'ibov', symbol: 'BMFBOVESPA:IBOV', prefix: '', dec: 2 },
    { id: 'usd', symbol: 'FX_IDC:USDBRL', prefix: 'R$ ', dec: 4 },
    { id: 'spx', symbol: 'SP:SPX', prefix: '', dec: 2 },
    { id: 'ixic', symbol: 'NASDAQ:IXIC', prefix: '', dec: 2 },
    { id: 'dji', symbol: 'DJ:DJI', prefix: '', dec: 2 },
    { id: 'btc', symbol: 'BINANCE:BTCUSDT', prefix: 'US$ ', dec: 2 },
    { id: 'eur', symbol: 'FX_IDC:EURBRL', prefix: 'R$ ', dec: 4 },
    { id: 'gold', symbol: 'TVC:GOLD', prefix: 'US$ ', dec: 2 },
    { id: 'wti', symbol: 'NYMEX:CL1!', prefix: 'US$ ', dec: 2 },
    { id: 'vix', symbol: 'TVC:VIX', prefix: '', dec: 2, invert: true },
    { id: 'dxy', symbol: 'TVC:DXY', prefix: '', dec: 2 },
    { id: 'petr4', symbol: 'BMFBOVESPA:PETR4', prefix: 'R$ ', dec: 2 },
    { id: 'vale3', symbol: 'BMFBOVESPA:VALE3', prefix: 'R$ ', dec: 2 },
    { id: 'itub4', symbol: 'BMFBOVESPA:ITUB4', prefix: 'R$ ', dec: 2 },
    { id: 'bbdc4', symbol: 'BMFBOVESPA:BBDC4', prefix: 'R$ ', dec: 2 },
    { id: 'abev3', symbol: 'BMFBOVESPA:ABEV3', prefix: 'R$ ', dec: 2 },
    { id: 'wege3', symbol: 'BMFBOVESPA:WEGE3', prefix: 'R$ ', dec: 2 },
    { id: 'mglu3', symbol: 'BMFBOVESPA:MGLU3', prefix: 'R$ ', dec: 2 },
    { id: 'b3sa3', symbol: 'BMFBOVESPA:B3SA3', prefix: 'R$ ', dec: 2 },
    { id: 'bbas3', symbol: 'BMFBOVESPA:BBAS3', prefix: 'R$ ', dec: 2 },
    { id: 'suzb3', symbol: 'BMFBOVESPA:SUZB3', prefix: 'R$ ', dec: 2 },
    { id: 'aapl', symbol: 'NASDAQ:AAPL', prefix: 'US$ ', dec: 2 },
    { id: 'msft', symbol: 'NASDAQ:MSFT', prefix: 'US$ ', dec: 2 },
    { id: 'nvda', symbol: 'NASDAQ:NVDA', prefix: 'US$ ', dec: 2 },
    { id: 'amzn', symbol: 'NASDAQ:AMZN', prefix: 'US$ ', dec: 2 },
    { id: 'googl', symbol: 'NASDAQ:GOOGL', prefix: 'US$ ', dec: 2 },
    { id: 'meta', symbol: 'NASDAQ:META', prefix: 'US$ ', dec: 2 },
    { id: 'tsla', symbol: 'NASDAQ:TSLA', prefix: 'US$ ', dec: 2 },
    { id: 'amd', symbol: 'NASDAQ:AMD', prefix: 'US$ ', dec: 2 },
    { id: 'nflx', symbol: 'NASDAQ:NFLX', prefix: 'US$ ', dec: 2 },
    { id: 'avgo', symbol: 'NASDAQ:AVGO', prefix: 'US$ ', dec: 2 },
    { id: 'jpm', symbol: 'NYSE:JPM', prefix: 'US$ ', dec: 2 },
    { id: 'v', symbol: 'NYSE:V', prefix: 'US$ ', dec: 2 },
    { id: 'unh', symbol: 'NYSE:UNH', prefix: 'US$ ', dec: 2 },
    { id: 'ma', symbol: 'NYSE:MA', prefix: 'US$ ', dec: 2 },
    { id: 'hd', symbol: 'NYSE:HD', prefix: 'US$ ', dec: 2 },
    { id: 'pg', symbol: 'NYSE:PG', prefix: 'US$ ', dec: 2 },
    { id: 'xom', symbol: 'NYSE:XOM', prefix: 'US$ ', dec: 2 },
    { id: 'lly', symbol: 'NYSE:LLY', prefix: 'US$ ', dec: 2 },
    { id: 'bac', symbol: 'NYSE:BAC', prefix: 'US$ ', dec: 2 },
    { id: 'cvx', symbol: 'NYSE:CVX', prefix: 'US$ ', dec: 2 },
    { id: 'or', symbol: 'EURONEXT:OR', prefix: '€ ', dec: 2 },
    { id: 'asml', symbol: 'EURONEXT:ASML', prefix: '€ ', dec: 2 },
    { id: 'sap', symbol: 'XETR:SAP', prefix: '€ ', dec: 2 },
    { id: 'shel', symbol: 'LSE:SHEL', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'nesn', symbol: 'SIX:NESN', prefix: 'CHF ', dec: 2 },
    { id: 'hsba', symbol: 'LSE:HSBA', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'nvo', symbol: 'NYSE:NVO', prefix: 'US$ ', dec: 2 },
    { id: 'toyota', symbol: 'TSE:7203', prefix: '¥ ', dec: 0 },
    { id: 'sony', symbol: 'TSE:6758', prefix: '¥ ', dec: 0 },
    { id: 'softbank', symbol: 'TSE:9984', prefix: '¥ ', dec: 0 },
    { id: 'tencent', symbol: 'HKEX:700', prefix: 'HK$ ', dec: 2 },
    { id: 'baba', symbol: 'HKEX:9988', prefix: 'HK$ ', dec: 2 }
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
  function setVal(t, close, change) {
    var valEl = document.getElementById('live-' + t.id);
    var varEl = document.getElementById('live-' + t.id + '-var');
    if (!valEl || !varEl) return;
    var text = t.prefix + fmtNum(close * (t.scale || 1), t.dec);
    if (valEl.textContent !== text) {
      valEl.textContent = text;
      valEl.classList.remove('flash');
      void valEl.offsetWidth;
      valEl.classList.add('flash');
    }
    varEl.textContent = fmtVar(change);
    varEl.className = varClass(change, t.invert);
  }
  function fetchScan() {
    var tickers = TICKERS.map(function (t) { return t.symbol; });
    return fetch(SCAN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ symbols: { tickers: tickers }, columns: ['close', 'change'] })
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (d) {
      var map = {};
      (d.data || []).forEach(function (row) { map[row.s] = row.d; });
      var ok = 0;
      TICKERS.forEach(function (t) {
        var row = map[t.symbol];
        if (row && typeof row[0] === 'number' && typeof row[1] === 'number') {
          setVal(t, row[0], row[1]);
          ok++;
        }
      });
      return ok > 0;
    }).catch(function () { return false; });
  }
  function fetchTV(t) {
    return fetch(TV + encodeURIComponent(t.symbol) + '&fields=close,change').then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (d) {
      if (d && typeof d.close === 'number' && typeof d.change === 'number') {
        setVal(t, d.close, d.change);
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
    fetchScan().then(function (scanOk) {
      var jobs = [fetchFng()];
      if (!scanOk) {
        // reserva: busca os 12 índices um a um (método da v2.4)
        var idxIds = ['ibov', 'usd', 'spx', 'ixic', 'dji', 'btc', 'eur', 'gold', 'wti', 'vix', 'dxy'];
        idxIds.forEach(function (id) {
          var t = null;
          TICKERS.forEach(function (x) { if (x.id === id) t = x; });
          if (t) jobs.push(fetchTV(t));
        });
      }
      return Promise.all(jobs);
    }).then(function (results) {
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
