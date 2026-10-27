(function(){
  'use strict';

  var viewEl = document.getElementById('view');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');

  document.getElementById('headerTag').textContent = CATALOG.tagline;
  document.getElementById('headerLogo').alt = 'Regina Spirits';

  function escapeHtml(s){
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function categoryBySlug(slug){
    for (var i = 0; i < CATALOG.categories.length; i++){
      if (CATALOG.categories[i].slug === slug) return CATALOG.categories[i];
    }
    return null;
  }

  function findProductByImg(img){
    for (var i = 0; i < CATALOG.categories.length; i++){
      var cat = CATALOG.categories[i];
      for (var j = 0; j < cat.products.length; j++){
        if (cat.products[j].img === img) return cat.products[j];
      }
    }
    return null;
  }

  function productCardHtml(p, i, step){
    var html = '';
    html += '<div class="product-card" style="' + staggerStyle(i, step) + '">';
    html += '<button type="button" class="product-photo-btn" data-img="img/' + p.img + '" data-name="' + escapeHtml(p.name) + '" data-grade="' + escapeHtml(p.grade || '') + '">';
    html += '<img src="img/' + p.img + '" alt="' + escapeHtml(p.name) + '" loading="lazy">';
    html += '</button>';
    html += '<div class="product-info">';
    html += '<h3 class="product-name">' + escapeHtml(p.name) + '</h3>';
    if (p.grade) html += '<div class="product-grade">' + escapeHtml(p.grade) + '</div>';
    if (p.note) html += '<div class="product-note">' + escapeHtml(p.note) + '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function bindProductPhotos(){
    var photoBtns = viewEl.querySelectorAll('.product-photo-btn');
    photoBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        openLightbox(btn.getAttribute('data-img'), btn.getAttribute('data-name'), btn.getAttribute('data-grade'));
      });
    });
  }

  function staggerStyle(index, step){
    step = step || 60;
    return 'animation-delay:' + (index * step) + 'ms';
  }

  // ---------- Views ----------

  function renderHome(){
    var html = '';
    html += '<section class="hero">';
    html += '<img src="img/' + CATALOG.heroCover + '" alt="Regina Spirits">';
    html += '<div class="hero-content">';
    html += '<p class="hero-sub">' + escapeHtml(CATALOG.tagline) + '</p>';
    html += '<h1 class="hero-title">Il nostro catalogo</h1>';
    html += '</div>';
    html += '</section>';

    if (CATALOG.featured && CATALOG.featured.length){
      html += '<h2 class="section-heading">Più richiesti</h2>';
      html += '<div class="product-grid featured-grid">';
      CATALOG.featured.forEach(function(img, i){
        var p = findProductByImg(img);
        if (p) html += productCardHtml(p, i, 45);
      });
      html += '</div>';
    }

    html += '<h2 class="section-heading">Categorie</h2>';
    html += '<div class="cat-grid">';
    CATALOG.categories.forEach(function(cat, i){
      var count = cat.products.length;
      var countLabel = count === 0 ? 'Su richiesta' : (count + (count === 1 ? ' prodotto' : ' prodotti'));
      html += '<a class="cat-card" href="#/categoria/' + cat.slug + '" style="' + staggerStyle(i) + '">';
      html += '<div class="cat-img-wrap"><img src="img/' + cat.cover + '" alt="" loading="lazy"></div>';
      html += '<div class="cat-body">';
      html += '<h3 class="cat-name">' + escapeHtml(cat.name) + '</h3>';
      html += '<div class="cat-count">' + countLabel + '</div>';
      html += '</div>';
      html += '</a>';
    });
    html += '</div>';

    html += '<div class="chi-cta-wrap"><button type="button" class="btn-gold" id="chiBtn">Chi siamo</button></div>';

    viewEl.innerHTML = html;
    bindProductPhotos();
    document.getElementById('chiBtn').addEventListener('click', function(){
      location.hash = '#/chi-siamo';
    });
  }

  function renderCategory(slug){
    var cat = categoryBySlug(slug);
    if (!cat){
      viewEl.innerHTML = '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>' +
        '<p>Categoria non trovata.</p>';
      bindBack();
      return;
    }

    var html = '';
    html += '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>';
    html += '<h1 class="page-title">' + escapeHtml(cat.name) + '</h1>';

    if (cat.info){
      if (cat.info.heroImage){
        html += '<div class="info-hero"><img src="img/' + cat.info.heroImage + '" alt="' + escapeHtml(cat.info.title || cat.name) + '"></div>';
      }
      html += '<div class="info-box">';
      html += '<p class="intro">' + escapeHtml(cat.info.intro) + '</p>';
      html += '<ul>';
      cat.info.items.forEach(function(item){
        html += '<li>' + escapeHtml(item) + '</li>';
      });
      html += '</ul>';
      html += '</div>';
    } else {
      if (cat.intro) html += '<p class="cat-intro">' + escapeHtml(cat.intro) + '</p>';
      html += '<div class="product-grid">';
      cat.products.forEach(function(p, i){
        html += productCardHtml(p, i, 45);
      });
      html += '</div>';
    }

    viewEl.innerHTML = html;
    bindBack();
    bindProductPhotos();
  }

  function renderChiSiamo(){
    var html = '';
    html += '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>';
    html += '<div class="chi-wrap">';
    html += '<img src="img/' + CATALOG.chiImage + '" alt="Regina Spirits">';
    html += '<div class="chi-text">';
    html += '<h1>Chi siamo</h1>';
    (CATALOG.chiText || []).forEach(function(p){
      html += '<p>' + escapeHtml(p) + '</p>';
    });
    html += '</div>';
    html += '</div>';
    viewEl.innerHTML = html;
    bindBack();
  }

  function bindBack(){
    var btn = viewEl.querySelector('[data-back]');
    if (btn){
      btn.addEventListener('click', function(){
        location.hash = '#/';
      });
    }
  }

  // ---------- Lightbox ----------

  function openLightbox(src, name, grade){
    lightboxImg.src = src;
    lightboxImg.alt = name || '';
    var caption = name || '';
    if (grade) caption += ' — ' + grade;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', function(e){
    if (e.target === lightboxImg) { closeLightbox(); return; }
    if (e.target === lightboxClose || e.target === lightbox) { closeLightbox(); }
  });
  lightboxClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });

  // ---------- Router ----------

  function route(){
    closeLightbox();
    var hash = location.hash || '#/';
    var m = hash.match(/^#\/categoria\/([^/]+)$/);
    if (hash === '#/' || hash === ''){
      renderHome();
    } else if (m){
      renderCategory(decodeURIComponent(m[1]));
    } else if (hash === '#/chi-siamo'){
      renderChiSiamo();
    } else {
      renderHome();
    }
    window.scrollTo(0, 0);
  }

  document.getElementById('homeLink').addEventListener('click', function(){
    location.hash = '#/';
  });
  document.getElementById('homeLink').addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      location.hash = '#/';
    }
  });

  window.addEventListener('hashchange', route);
  route();
})();
