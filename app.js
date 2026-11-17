// Jornal PVSR INVEST — leitor de PDF embutido
(function () {
  if (!document.getElementById('reader')) return;
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
  if (!document.getElementById('live-updated')) return;
  var dateEl = document.getElementById('masthead-date');
  if (dateEl) {
    var dd = new Date();
    var txt = dd.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    dateEl.textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
  }
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
    { id: 'petr3', symbol: 'BMFBOVESPA:PETR3', prefix: 'R$ ', dec: 2 },
    { id: 'vale3', symbol: 'BMFBOVESPA:VALE3', prefix: 'R$ ', dec: 2 },
    { id: 'itub4', symbol: 'BMFBOVESPA:ITUB4', prefix: 'R$ ', dec: 2 },
    { id: 'bbdc4', symbol: 'BMFBOVESPA:BBDC4', prefix: 'R$ ', dec: 2 },
    { id: 'abev3', symbol: 'BMFBOVESPA:ABEV3', prefix: 'R$ ', dec: 2 },
    { id: 'wege3', symbol: 'BMFBOVESPA:WEGE3', prefix: 'R$ ', dec: 2 },
    { id: 'mglu3', symbol: 'BMFBOVESPA:MGLU3', prefix: 'R$ ', dec: 2 },
    { id: 'b3sa3', symbol: 'BMFBOVESPA:B3SA3', prefix: 'R$ ', dec: 2 },
    { id: 'bbas3', symbol: 'BMFBOVESPA:BBAS3', prefix: 'R$ ', dec: 2 },
    { id: 'suzb3', symbol: 'BMFBOVESPA:SUZB3', prefix: 'R$ ', dec: 2 },
    { id: 'prio3', symbol: 'BMFBOVESPA:PRIO3', prefix: 'R$ ', dec: 2 },
    { id: 'rent3', symbol: 'BMFBOVESPA:RENT3', prefix: 'R$ ', dec: 2 },
    { id: 'hapv3', symbol: 'BMFBOVESPA:HAPV3', prefix: 'R$ ', dec: 2 },
    { id: 'rdor3', symbol: 'BMFBOVESPA:RDOR3', prefix: 'R$ ', dec: 2 },
    { id: 'bpac11', symbol: 'BMFBOVESPA:BPAC11', prefix: 'R$ ', dec: 2 },
    { id: 'itsa4', symbol: 'BMFBOVESPA:ITSA4', prefix: 'R$ ', dec: 2 },
    { id: 'sbsp3', symbol: 'BMFBOVESPA:SBSP3', prefix: 'R$ ', dec: 2 },
    { id: 'cmig4', symbol: 'BMFBOVESPA:CMIG4', prefix: 'R$ ', dec: 2 },
    { id: 'vivt3', symbol: 'BMFBOVESPA:VIVT3', prefix: 'R$ ', dec: 2 },
    { id: 'tims3', symbol: 'BMFBOVESPA:TIMS3', prefix: 'R$ ', dec: 2 },
    { id: 'klbn11', symbol: 'BMFBOVESPA:KLBN11', prefix: 'R$ ', dec: 2 },
    { id: 'ggbr4', symbol: 'BMFBOVESPA:GGBR4', prefix: 'R$ ', dec: 2 },
    { id: 'csna3', symbol: 'BMFBOVESPA:CSNA3', prefix: 'R$ ', dec: 2 },
    { id: 'usim5', symbol: 'BMFBOVESPA:USIM5', prefix: 'R$ ', dec: 2 },
    { id: 'aapl', symbol: 'NASDAQ:AAPL', prefix: 'US$ ', dec: 2 },
    { id: 'msft', symbol: 'NASDAQ:MSFT', prefix: 'US$ ', dec: 2 },
    { id: 'nvda', symbol: 'NASDAQ:NVDA', prefix: 'US$ ', dec: 2 },
    { id: 'amzn', symbol: 'NASDAQ:AMZN', prefix: 'US$ ', dec: 2 },
    { id: 'googl', symbol: 'NASDAQ:GOOGL', prefix: 'US$ ', dec: 2 },
    { id: 'goog', symbol: 'NASDAQ:GOOG', prefix: 'US$ ', dec: 2 },
    { id: 'meta', symbol: 'NASDAQ:META', prefix: 'US$ ', dec: 2 },
    { id: 'tsla', symbol: 'NASDAQ:TSLA', prefix: 'US$ ', dec: 2 },
    { id: 'amd', symbol: 'NASDAQ:AMD', prefix: 'US$ ', dec: 2 },
    { id: 'nflx', symbol: 'NASDAQ:NFLX', prefix: 'US$ ', dec: 2 },
    { id: 'avgo', symbol: 'NASDAQ:AVGO', prefix: 'US$ ', dec: 2 },
    { id: 'cost', symbol: 'NASDAQ:COST', prefix: 'US$ ', dec: 2 },
    { id: 'adbe', symbol: 'NASDAQ:ADBE', prefix: 'US$ ', dec: 2 },
    { id: 'pep', symbol: 'NASDAQ:PEP', prefix: 'US$ ', dec: 2 },
    { id: 'csco', symbol: 'NASDAQ:CSCO', prefix: 'US$ ', dec: 2 },
    { id: 'cmcsa', symbol: 'NASDAQ:CMCSA', prefix: 'US$ ', dec: 2 },
    { id: 'intc', symbol: 'NASDAQ:INTC', prefix: 'US$ ', dec: 2 },
    { id: 'qcom', symbol: 'NASDAQ:QCOM', prefix: 'US$ ', dec: 2 },
    { id: 'txn', symbol: 'NASDAQ:TXN', prefix: 'US$ ', dec: 2 },
    { id: 'amgn', symbol: 'NASDAQ:AMGN', prefix: 'US$ ', dec: 2 },
    { id: 'isrg', symbol: 'NASDAQ:ISRG', prefix: 'US$ ', dec: 2 },
    { id: 'mdlz', symbol: 'NASDAQ:MDLZ', prefix: 'US$ ', dec: 2 },
    { id: 'gild', symbol: 'NASDAQ:GILD', prefix: 'US$ ', dec: 2 },
    { id: 'regn', symbol: 'NASDAQ:REGN', prefix: 'US$ ', dec: 2 },
    { id: 'vrtx', symbol: 'NASDAQ:VRTX', prefix: 'US$ ', dec: 2 },
    { id: 'bkng', symbol: 'NASDAQ:BKNG', prefix: 'US$ ', dec: 2 },
    { id: 'lrcx', symbol: 'NASDAQ:LRCX', prefix: 'US$ ', dec: 2 },
    { id: 'mu', symbol: 'NASDAQ:MU', prefix: 'US$ ', dec: 2 },
    { id: 'mrvl', symbol: 'NASDAQ:MRVL', prefix: 'US$ ', dec: 2 },
    { id: 'pltr', symbol: 'NASDAQ:PLTR', prefix: 'US$ ', dec: 2 },
    { id: 'crwd', symbol: 'NASDAQ:CRWD', prefix: 'US$ ', dec: 2 },
    { id: 'panw', symbol: 'NASDAQ:PANW', prefix: 'US$ ', dec: 2 },
    { id: 'zs', symbol: 'NASDAQ:ZS', prefix: 'US$ ', dec: 2 },
    { id: 'ddog', symbol: 'NASDAQ:DDOG', prefix: 'US$ ', dec: 2 },
    { id: 'mstr', symbol: 'NASDAQ:MSTR', prefix: 'US$ ', dec: 2 },
    { id: 'arm', symbol: 'NASDAQ:ARM', prefix: 'US$ ', dec: 2 },
    { id: 'cdns', symbol: 'NASDAQ:CDNS', prefix: 'US$ ', dec: 2 },
    { id: 'mnst', symbol: 'NASDAQ:MNST', prefix: 'US$ ', dec: 2 },
    { id: 'kdp', symbol: 'NASDAQ:KDP', prefix: 'US$ ', dec: 2 },
    { id: 'ctas', symbol: 'NASDAQ:CTAS', prefix: 'US$ ', dec: 2 },
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
    { id: 'jnj', symbol: 'NYSE:JNJ', prefix: 'US$ ', dec: 2 },
    { id: 'wfc', symbol: 'NYSE:WFC', prefix: 'US$ ', dec: 2 },
    { id: 'orcl', symbol: 'NYSE:ORCL', prefix: 'US$ ', dec: 2 },
    { id: 'crm', symbol: 'NYSE:CRM', prefix: 'US$ ', dec: 2 },
    { id: 'abbv', symbol: 'NYSE:ABBV', prefix: 'US$ ', dec: 2 },
    { id: 'mrk', symbol: 'NYSE:MRK', prefix: 'US$ ', dec: 2 },
    { id: 'pfe', symbol: 'NYSE:PFE', prefix: 'US$ ', dec: 2 },
    { id: 'ko', symbol: 'NYSE:KO', prefix: 'US$ ', dec: 2 },
    { id: 'dis', symbol: 'NYSE:DIS', prefix: 'US$ ', dec: 2 },
    { id: 'nke', symbol: 'NYSE:NKE', prefix: 'US$ ', dec: 2 },
    { id: 'mcd', symbol: 'NYSE:MCD', prefix: 'US$ ', dec: 2 },
    { id: 'cat', symbol: 'NYSE:CAT', prefix: 'US$ ', dec: 2 },
    { id: 'ba', symbol: 'NYSE:BA', prefix: 'US$ ', dec: 2 },
    { id: 'ge', symbol: 'NYSE:GE', prefix: 'US$ ', dec: 2 },
    { id: 'ibm', symbol: 'NYSE:IBM', prefix: 'US$ ', dec: 2 },
    { id: 'axp', symbol: 'NYSE:AXP', prefix: 'US$ ', dec: 2 },
    { id: 'gs', symbol: 'NYSE:GS', prefix: 'US$ ', dec: 2 },
    { id: 'ms', symbol: 'NYSE:MS', prefix: 'US$ ', dec: 2 },
    { id: 'c', symbol: 'NYSE:C', prefix: 'US$ ', dec: 2 },
    { id: 't', symbol: 'NYSE:T', prefix: 'US$ ', dec: 2 },
    { id: 'vz', symbol: 'NYSE:VZ', prefix: 'US$ ', dec: 2 },
    { id: 'tmo', symbol: 'NYSE:TMO', prefix: 'US$ ', dec: 2 },
    { id: 'dhr', symbol: 'NYSE:DHR', prefix: 'US$ ', dec: 2 },
    { id: 'gd', symbol: 'NYSE:GD', prefix: 'US$ ', dec: 2 },
    { id: 'lmt', symbol: 'NYSE:LMT', prefix: 'US$ ', dec: 2 },
    { id: 'rtx', symbol: 'NYSE:RTX', prefix: 'US$ ', dec: 2 },
    { id: 'nee', symbol: 'NYSE:NEE', prefix: 'US$ ', dec: 2 },
    { id: 'so', symbol: 'NYSE:SO', prefix: 'US$ ', dec: 2 },
    { id: 'duk', symbol: 'NYSE:DUK', prefix: 'US$ ', dec: 2 },
    { id: 'schw', symbol: 'NYSE:SCHW', prefix: 'US$ ', dec: 2 },
    { id: 'shel', symbol: 'LSE:SHEL', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'hsba', symbol: 'LSE:HSBA', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'vod', symbol: 'LSE:VOD', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'bp', symbol: 'LSE:BP.', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'gsk', symbol: 'LSE:GSK', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'azn', symbol: 'LSE:AZN', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'rio', symbol: 'LSE:RIO', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'ulvr', symbol: 'LSE:ULVR', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'dge', symbol: 'LSE:DGE', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'lloy', symbol: 'LSE:LLOY', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'barc', symbol: 'LSE:BARC', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'nwg', symbol: 'LSE:NWG', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'rr', symbol: 'LSE:RR.', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'iag', symbol: 'LSE:IAG', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'tsco', symbol: 'LSE:TSCO', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'sbry', symbol: 'LSE:SBRY', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'ng', symbol: 'LSE:NG.', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'sse', symbol: 'LSE:SSE', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'rel', symbol: 'LSE:REL', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'pru', symbol: 'LSE:PRU', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'lseg', symbol: 'LSE:LSEG', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'anto', symbol: 'LSE:ANTO', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'aal', symbol: 'LSE:AAL', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'glen', symbol: 'LSE:GLEN', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'iii', symbol: 'LSE:III', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'smt', symbol: 'LSE:SMT', prefix: '£ ', dec: 2, scale: 0.01 },
    { id: 'mc', symbol: 'EURONEXT:MC', prefix: '€ ', dec: 2 },
    { id: 'or', symbol: 'EURONEXT:OR', prefix: '€ ', dec: 2 },
    { id: 'asml', symbol: 'EURONEXT:ASML', prefix: '€ ', dec: 2 },
    { id: 'san', symbol: 'EURONEXT:SAN', prefix: '€ ', dec: 2 },
    { id: 'bn', symbol: 'EURONEXT:BN', prefix: '€ ', dec: 2 },
    { id: 'air', symbol: 'EURONEXT:AIR', prefix: '€ ', dec: 2 },
    { id: 'ai', symbol: 'EURONEXT:AI', prefix: '€ ', dec: 2 },
    { id: 'schneider', symbol: 'EURONEXT:SU', prefix: '€ ', dec: 2 },
    { id: 'el', symbol: 'EURONEXT:EL', prefix: '€ ', dec: 2 },
    { id: 'bnp', symbol: 'EURONEXT:BNP', prefix: '€ ', dec: 2 },
    { id: 'aca', symbol: 'EURONEXT:ACA', prefix: '€ ', dec: 2 },
    { id: 'cs', symbol: 'EURONEXT:CS', prefix: '€ ', dec: 2 },
    { id: 'dg', symbol: 'EURONEXT:DG', prefix: '€ ', dec: 2 },
    { id: 'cap', symbol: 'EURONEXT:CAP', prefix: '€ ', dec: 2 },
    { id: 'dsy', symbol: 'EURONEXT:DSY', prefix: '€ ', dec: 2 },
    { id: 'rno', symbol: 'EURONEXT:RNO', prefix: '€ ', dec: 2 },
    { id: 'tte', symbol: 'EURONEXT:TTE', prefix: '€ ', dec: 2 },
    { id: 'adyen', symbol: 'EURONEXT:ADYEN', prefix: '€ ', dec: 2 },
    { id: 'heia', symbol: 'EURONEXT:HEIA', prefix: '€ ', dec: 2 },
    { id: 'phia', symbol: 'EURONEXT:PHIA', prefix: '€ ', dec: 2 },
    { id: 'sap', symbol: 'XETR:SAP', prefix: '€ ', dec: 2 },
    { id: 'sie', symbol: 'XETR:SIE', prefix: '€ ', dec: 2 },
    { id: 'alv', symbol: 'XETR:ALV', prefix: '€ ', dec: 2 },
    { id: 'dte', symbol: 'XETR:DTE', prefix: '€ ', dec: 2 },
    { id: 'mbg', symbol: 'XETR:MBG', prefix: '€ ', dec: 2 },
    { id: 'bmw', symbol: 'XETR:BMW', prefix: '€ ', dec: 2 },
    { id: 'vow3', symbol: 'XETR:VOW3', prefix: '€ ', dec: 2 },
    { id: 'bas', symbol: 'XETR:BAS', prefix: '€ ', dec: 2 },
    { id: 'bayn', symbol: 'XETR:BAYN', prefix: '€ ', dec: 2 },
    { id: 'dbk', symbol: 'XETR:DBK', prefix: '€ ', dec: 2 },
    { id: 'ads', symbol: 'XETR:ADS', prefix: '€ ', dec: 2 },
    { id: 'muv2', symbol: 'XETR:MUV2', prefix: '€ ', dec: 2 },
    { id: 'hen3', symbol: 'XETR:HEN3', prefix: '€ ', dec: 2 },
    { id: 'ifx', symbol: 'XETR:IFX', prefix: '€ ', dec: 2 },
    { id: 'rwe', symbol: 'XETR:RWE', prefix: '€ ', dec: 2 },
    { id: 'nesn', symbol: 'SIX:NESN', prefix: 'CHF ', dec: 2 },
    { id: 'novn', symbol: 'SIX:NOVN', prefix: 'CHF ', dec: 2 },
    { id: 'ubsg', symbol: 'SIX:UBSG', prefix: 'CHF ', dec: 2 },
    { id: 'zurn', symbol: 'SIX:ZURN', prefix: 'CHF ', dec: 2 },
    { id: 'abbn', symbol: 'SIX:ABBN', prefix: 'CHF ', dec: 2 },
    { id: 'sika', symbol: 'SIX:SIKA', prefix: 'CHF ', dec: 2 },
    { id: 'givn', symbol: 'SIX:GIVN', prefix: 'CHF ', dec: 2 },
    { id: 'lonn', symbol: 'SIX:LONN', prefix: 'CHF ', dec: 2 },
    { id: 'cfr', symbol: 'SIX:CFR', prefix: 'CHF ', dec: 2 },
    { id: 'slhn', symbol: 'SIX:SLHN', prefix: 'CHF ', dec: 2 },
    { id: 'eni', symbol: 'MIL:ENI', prefix: '€ ', dec: 2 },
    { id: 'isp', symbol: 'MIL:ISP', prefix: '€ ', dec: 2 },
    { id: 'ucg', symbol: 'MIL:UCG', prefix: '€ ', dec: 2 },
    { id: 'enel', symbol: 'MIL:ENEL', prefix: '€ ', dec: 2 },
    { id: 'g', symbol: 'MIL:G', prefix: '€ ', dec: 2 },
    { id: 'race', symbol: 'MIL:RACE', prefix: '€ ', dec: 2 },
    { id: 'monc', symbol: 'MIL:MONC', prefix: '€ ', dec: 2 },
    { id: 'pry', symbol: 'MIL:PRY', prefix: '€ ', dec: 2 },
    { id: 'trn', symbol: 'MIL:TRN', prefix: '€ ', dec: 2 },
    { id: 'ldo', symbol: 'MIL:LDO', prefix: '€ ', dec: 2 },
    { id: 'sanbme', symbol: 'BME:SAN', prefix: '€ ', dec: 2 },
    { id: 'bbva', symbol: 'BME:BBVA', prefix: '€ ', dec: 2 },
    { id: 'ibe', symbol: 'BME:IBE', prefix: '€ ', dec: 2 },
    { id: 'tef', symbol: 'BME:TEF', prefix: '€ ', dec: 2 },
    { id: 'rep', symbol: 'BME:REP', prefix: '€ ', dec: 2 },
    { id: 'itx', symbol: 'BME:ITX', prefix: '€ ', dec: 2 },
    { id: 'aena', symbol: 'BME:AENA', prefix: '€ ', dec: 2 },
    { id: 'fer', symbol: 'BME:FER', prefix: '€ ', dec: 2 },
    { id: 'cabk', symbol: 'BME:CABK', prefix: '€ ', dec: 2 },
    { id: 'ele', symbol: 'BME:ELE', prefix: '€ ', dec: 2 },
    { id: 'toyota', symbol: 'TSE:7203', prefix: '¥ ', dec: 0 },
    { id: 'sony', symbol: 'TSE:6758', prefix: '¥ ', dec: 0 },
    { id: 'softbank', symbol: 'TSE:9984', prefix: '¥ ', dec: 0 },
    { id: 'keyence', symbol: 'TSE:6861', prefix: '¥ ', dec: 0 },
    { id: 'mufg', symbol: 'TSE:8306', prefix: '¥ ', dec: 0 },
    { id: 'smfg', symbol: 'TSE:8316', prefix: '¥ ', dec: 0 },
    { id: 'tokyoel', symbol: 'TSE:8035', prefix: '¥ ', dec: 0 },
    { id: 'recruit', symbol: 'TSE:6098', prefix: '¥ ', dec: 0 },
    { id: 'nintendo', symbol: 'TSE:7974', prefix: '¥ ', dec: 0 },
    { id: 'ntt', symbol: 'TSE:9432', prefix: '¥ ', dec: 0 },
    { id: 'kddi', symbol: 'TSE:9433', prefix: '¥ ', dec: 0 },
    { id: 'softbankc', symbol: 'TSE:9434', prefix: '¥ ', dec: 0 },
    { id: 'fastret', symbol: 'TSE:9983', prefix: '¥ ', dec: 0 },
    { id: 'denso', symbol: 'TSE:6902', prefix: '¥ ', dec: 0 },
    { id: 'honda', symbol: 'TSE:7267', prefix: '¥ ', dec: 0 },
    { id: 'nissan', symbol: 'TSE:7201', prefix: '¥ ', dec: 0 },
    { id: 'canon', symbol: 'TSE:7751', prefix: '¥ ', dec: 0 },
    { id: 'hitachi', symbol: 'TSE:6501', prefix: '¥ ', dec: 0 },
    { id: 'fujitsu', symbol: 'TSE:6702', prefix: '¥ ', dec: 0 },
    { id: 'mhi', symbol: 'TSE:7011', prefix: '¥ ', dec: 0 },
    { id: 'mitsucorp', symbol: 'TSE:8058', prefix: '¥ ', dec: 0 },
    { id: 'itochu', symbol: 'TSE:8001', prefix: '¥ ', dec: 0 },
    { id: 'tencent', symbol: 'HKEX:700', prefix: 'HK$ ', dec: 2 },
    { id: 'baba', symbol: 'HKEX:9988', prefix: 'HK$ ', dec: 2 },
    { id: 'meituan', symbol: 'HKEX:3690', prefix: 'HK$ ', dec: 2 },
    { id: 'jd', symbol: 'HKEX:9618', prefix: 'HK$ ', dec: 2 },
    { id: 'xiaomi', symbol: 'HKEX:1810', prefix: 'HK$ ', dec: 2 },
    { id: 'ccb', symbol: 'HKEX:939', prefix: 'HK$ ', dec: 2 },
    { id: 'icbc', symbol: 'HKEX:1398', prefix: 'HK$ ', dec: 2 },
    { id: 'boc', symbol: 'HKEX:3988', prefix: 'HK$ ', dec: 2 },
    { id: 'aia', symbol: 'HKEX:1299', prefix: 'HK$ ', dec: 2 },
    { id: 'pingan', symbol: 'HKEX:2318', prefix: 'HK$ ', dec: 2 },
    { id: 'cnooc', symbol: 'HKEX:883', prefix: 'HK$ ', dec: 2 },
    { id: 'petrochina', symbol: 'HKEX:857', prefix: 'HK$ ', dec: 2 },
    { id: 'sinopec', symbol: 'HKEX:386', prefix: 'HK$ ', dec: 2 },
    { id: 'chinamob', symbol: 'HKEX:941', prefix: 'HK$ ', dec: 2 },
    { id: 'chinauni', symbol: 'HKEX:762', prefix: 'HK$ ', dec: 2 },
    { id: 'bochk', symbol: 'HKEX:2388', prefix: 'HK$ ', dec: 2 },
    { id: 'ckh', symbol: 'HKEX:1', prefix: 'HK$ ', dec: 2 },
    { id: 'clp', symbol: 'HKEX:2', prefix: 'HK$ ', dec: 2 },
    { id: 'hsbc', symbol: 'HKEX:5', prefix: 'HK$ ', dec: 2 },
    { id: 'henderson', symbol: 'HKEX:12', prefix: 'HK$ ', dec: 2 },
    { id: 'shk', symbol: 'HKEX:16', prefix: 'HK$ ', dec: 2 },
    { id: 'moutai', symbol: 'SSE:600519', prefix: 'CN¥ ', dec: 2 },
    { id: 'pinganins', symbol: 'SSE:601318', prefix: 'CN¥ ', dec: 2 },
    { id: 'cmb', symbol: 'SSE:600036', prefix: 'CN¥ ', dec: 2 },
    { id: 'yangtze', symbol: 'SSE:600900', prefix: 'CN¥ ', dec: 2 },
    { id: 'yili', symbol: 'SSE:600887', prefix: 'CN¥ ', dec: 2 },
    { id: 'petrochn', symbol: 'SSE:601857', prefix: 'CN¥ ', dec: 2 },
    { id: 'indbank', symbol: 'SSE:601166', prefix: 'CN¥ ', dec: 2 },
    { id: 'hengrui', symbol: 'SSE:600276', prefix: 'CN¥ ', dec: 2 },
    { id: 'icbcsh', symbol: 'SSE:601398', prefix: 'CN¥ ', dec: 2 },
    { id: 'wuliangye', symbol: 'SZSE:000858', prefix: 'CN¥ ', dec: 2 },
    { id: 'pinganbk', symbol: 'SZSE:000001', prefix: 'CN¥ ', dec: 2 },
    { id: 'byd', symbol: 'SZSE:002594', prefix: 'CN¥ ', dec: 2 },
    { id: 'catl', symbol: 'SZSE:300750', prefix: 'CN¥ ', dec: 2 },
    { id: 'midea', symbol: 'SZSE:000333', prefix: 'CN¥ ', dec: 2 },
    { id: 'hikvision', symbol: 'SZSE:002415', prefix: 'CN¥ ', dec: 2 },
    { id: 'samsung', symbol: 'KRX:005930', prefix: '₩ ', dec: 0 },
    { id: 'skhynix', symbol: 'KRX:000660', prefix: '₩ ', dec: 0 },
    { id: 'hyundai', symbol: 'KRX:005380', prefix: '₩ ', dec: 0 },
    { id: 'sdi', symbol: 'KRX:006400', prefix: '₩ ', dec: 0 },
    { id: 'lgchem', symbol: 'KRX:051910', prefix: '₩ ', dec: 0 },
    { id: 'naver', symbol: 'KRX:035420', prefix: '₩ ', dec: 0 },
    { id: 'kakao', symbol: 'KRX:035720', prefix: '₩ ', dec: 0 },
    { id: 'kbfin', symbol: 'KRX:105560', prefix: '₩ ', dec: 0 },
    { id: 'shinhan', symbol: 'KRX:055550', prefix: '₩ ', dec: 0 },
    { id: 'celltrion', symbol: 'KRX:068270', prefix: '₩ ', dec: 0 },
    { id: 'reliance', symbol: 'NSE:RELIANCE', prefix: '₹ ', dec: 2 },
    { id: 'tcs', symbol: 'NSE:TCS', prefix: '₹ ', dec: 2 },
    { id: 'infy', symbol: 'NSE:INFY', prefix: '₹ ', dec: 2 },
    { id: 'hdfc', symbol: 'NSE:HDFCBANK', prefix: '₹ ', dec: 2 },
    { id: 'icici', symbol: 'NSE:ICICIBANK', prefix: '₹ ', dec: 2 },
    { id: 'sbi', symbol: 'NSE:SBIN', prefix: '₹ ', dec: 2 },
    { id: 'bharti', symbol: 'NSE:BHARTIARTL', prefix: '₹ ', dec: 2 },
    { id: 'itc', symbol: 'NSE:ITC', prefix: '₹ ', dec: 2 },
    { id: 'lt', symbol: 'NSE:LT', prefix: '₹ ', dec: 2 },
    { id: 'hul', symbol: 'NSE:HINDUNILVR', prefix: '₹ ', dec: 2 },
    { id: 'bajfin', symbol: 'NSE:BAJFINANCE', prefix: '₹ ', dec: 2 },
    { id: 'maruti', symbol: 'NSE:MARUTI', prefix: '₹ ', dec: 2 },
    { id: 'tatapower', symbol: 'NSE:TATAPOWER', prefix: '₹ ', dec: 2 },
    { id: 'axisbank', symbol: 'NSE:AXISBANK', prefix: '₹ ', dec: 2 },
    { id: 'hcltech', symbol: 'NSE:HCLTECH', prefix: '₹ ', dec: 2 },
    { id: 'tatasteel', symbol: 'NSE:TATASTEEL', prefix: '₹ ', dec: 2 },
    { id: 'wipro', symbol: 'NSE:WIPRO', prefix: '₹ ', dec: 2 },
    { id: 'bhp', symbol: 'ASX:BHP', prefix: 'A$ ', dec: 2 },
    { id: 'cba', symbol: 'ASX:CBA', prefix: 'A$ ', dec: 2 },
    { id: 'csl', symbol: 'ASX:CSL', prefix: 'A$ ', dec: 2 },
    { id: 'nab', symbol: 'ASX:NAB', prefix: 'A$ ', dec: 2 },
    { id: 'wbc', symbol: 'ASX:WBC', prefix: 'A$ ', dec: 2 },
    { id: 'anz', symbol: 'ASX:ANZ', prefix: 'A$ ', dec: 2 },
    { id: 'wow', symbol: 'ASX:WOW', prefix: 'A$ ', dec: 2 },
    { id: 'mqg', symbol: 'ASX:MQG', prefix: 'A$ ', dec: 2 },
    { id: 'rioasx', symbol: 'ASX:RIO', prefix: 'A$ ', dec: 2 },
    { id: 'fmg', symbol: 'ASX:FMG', prefix: 'A$ ', dec: 2 },
    { id: 'tls', symbol: 'ASX:TLS', prefix: 'A$ ', dec: 2 },
    { id: 'ry', symbol: 'TSX:RY', prefix: 'C$ ', dec: 2 },
    { id: 'td', symbol: 'TSX:TD', prefix: 'C$ ', dec: 2 },
    { id: 'shop', symbol: 'TSX:SHOP', prefix: 'C$ ', dec: 2 },
    { id: 'enb', symbol: 'TSX:ENB', prefix: 'C$ ', dec: 2 },
    { id: 'cnq', symbol: 'TSX:CNQ', prefix: 'C$ ', dec: 2 },
    { id: 'su', symbol: 'TSX:SU', prefix: 'C$ ', dec: 2 },
    { id: 'bce', symbol: 'TSX:BCE', prefix: 'C$ ', dec: 2 },
    { id: 'bmo', symbol: 'TSX:BMO', prefix: 'C$ ', dec: 2 },
    { id: 'cm', symbol: 'TSX:CM', prefix: 'C$ ', dec: 2 },
    { id: 'bns', symbol: 'TSX:BNS', prefix: 'C$ ', dec: 2 },
    { id: 'cnr', symbol: 'TSX:CNR', prefix: 'C$ ', dec: 2 },
    { id: 'cp', symbol: 'TSX:CP', prefix: 'C$ ', dec: 2 },
    { id: 'atd', symbol: 'TSX:ATD', prefix: 'C$ ', dec: 2 },
    { id: 'tri', symbol: 'TSX:TRI', prefix: 'C$ ', dec: 2 },
    { id: 'fts', symbol: 'TSX:FTS', prefix: 'C$ ', dec: 2 },
    { id: 'mfc', symbol: 'TSX:MFC', prefix: 'C$ ', dec: 2 },
    { id: 'walmex', symbol: 'BMV:WALMEX', prefix: 'MX$ ', dec: 2 },
    { id: 'aramco', symbol: 'TADAWUL:2222', prefix: 'SR ', dec: 2 },
    { id: 'rajhi', symbol: 'TADAWUL:1120', prefix: 'SR ', dec: 2 },
    { id: 'sabic', symbol: 'TADAWUL:2010', prefix: 'SR ', dec: 2 },
    { id: 'snb', symbol: 'TADAWUL:1180', prefix: 'SR ', dec: 2 },
    { id: 'maaden', symbol: 'TADAWUL:1211', prefix: 'SR ', dec: 2 }
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
