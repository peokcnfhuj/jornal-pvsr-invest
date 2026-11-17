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
