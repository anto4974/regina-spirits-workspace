(function(){
  'use strict';

  var viewEl = document.getElementById('view');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxSizes = document.getElementById('lightboxSizes');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');

  var galleryProducts = [];
  var galleryProductIndex = 0;
  var galleryImageIndex = 0;

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

  function productImages(p){
    if (p.images && p.images.length) return p.images;
    return [{ src: p.img, label: null }];
  }

  function findProductByImg(img){
    for (var i = 0; i < CATALOG.categories.length; i++){
      var cat = CATALOG.categories[i];
      for (var j = 0; j < cat.products.length; j++){
        var p = cat.products[j];
        if (p.img === img) return p;
        if (p.images){
          for (var k = 0; k < p.images.length; k++){
            if (p.images[k].src === img) return p;
          }
        }
      }
    }
    return null;
  }

  function productCardHtml(p, i, step){
    var images = productImages(p);
    var thumb = images[0].src;
    var html = '';
    html += '<div class="product-card" style="' + staggerStyle(i, step) + '">';
    html += '<button type="button" class="product-photo-btn" data-index="' + i + '">';
    html += '<img src="img/' + thumb + '" alt="' + escapeHtml(p.name) + '" loading="lazy">';
    html += '</button>';
    html += '<div class="product-info">';
    html += '<h3 class="product-name">' + escapeHtml(p.name) + '</h3>';
    if (p.grade) html += '<div class="product-grade">' + escapeHtml(p.grade) + '</div>';
    if (p.note) html += '<div class="product-note">' + escapeHtml(p.note) + '</div>';
    if (images.length > 1){
      html += '<div class="product-sizes">' + images.map(function(im){ return escapeHtml(im.label); }).join(' · ') + '</div>';
    } else if (p.sizes) {
      html += '<div class="product-sizes">' + escapeHtml(p.sizes) + '</div>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  function bindProductPhotos(products){
    galleryProducts = products;
    var photoBtns = viewEl.querySelectorAll('.product-photo-btn');
    photoBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        openLightbox(idx, 0);
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

    if (CATALOG.awards && CATALOG.awards.length){
      html += '<div class="awards-row">';
      CATALOG.awards.forEach(function(a, i){
        html += '<a class="award-card" href="#/premio/' + a.slug + '" style="' + staggerStyle(i, 70) + '">';
        html += '<img src="img/' + a.img + '" alt="">';
        html += '<p>' + escapeHtml(a.caption) + '</p>';
        html += '</a>';
      });
      html += '</div>';
    }

    var featuredProducts = [];
    if (CATALOG.featured && CATALOG.featured.length){
      featuredProducts = CATALOG.featured.map(findProductByImg).filter(Boolean);
      html += '<h2 class="section-heading">Più richiesti</h2>';
      html += '<div class="featured-carousel">';
      featuredProducts.forEach(function(p, i){
        html += productCardHtml(p, i, 45);
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

    if (CATALOG.corporateGifts){
      var cg = CATALOG.corporateGifts;
      html += '<a class="gifts-banner" href="#/regali-aziendali">';
      html += '<img src="img/' + cg.heroImage + '" alt="">';
      html += '<div class="gifts-banner-text">';
      html += '<h2>' + escapeHtml(cg.title) + '</h2>';
      html += '<p>' + escapeHtml(cg.tagline) + '</p>';
      html += '<span class="gifts-banner-cta">Scopri di più &rarr;</span>';
      html += '</div>';
      html += '</a>';
    }

    html += '<div class="chi-cta-wrap"><button type="button" class="btn-gold" id="chiBtn">Chi siamo</button></div>';

    viewEl.innerHTML = html;
    bindProductPhotos(featuredProducts);
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
    bindProductPhotos(cat.products);
  }

  function renderChiSiamo(){
    var html = '';
    html += '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>';
    html += '<div class="chi-text chi-text-only">';
    html += '<h1>Chi siamo</h1>';
    (CATALOG.chiText || []).forEach(function(p){
      html += '<p>' + escapeHtml(p) + '</p>';
    });
    html += '</div>';
    viewEl.innerHTML = html;
    bindBack();
  }

  function awardBySlug(slug){
    var list = CATALOG.awards || [];
    for (var i = 0; i < list.length; i++){
      if (list[i].slug === slug) return list[i];
    }
    return null;
  }

  function renderAward(slug){
    var a = awardBySlug(slug);
    if (!a){
      viewEl.innerHTML = '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>' +
        '<p>Riconoscimento non trovato.</p>';
      bindBack();
      return;
    }
    var html = '';
    html += '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>';
    html += '<div class="award-page">';
    html += '<img src="img/' + a.img + '" alt="' + escapeHtml(a.title) + '">';
    html += '<h1 class="page-title">' + escapeHtml(a.title) + '</h1>';
    html += '<p>' + escapeHtml(a.description || a.caption) + '</p>';
    html += '</div>';
    viewEl.innerHTML = html;
    bindBack();
  }

  // Testo con **grassetto** e [etichetta](https://link) — sempre escapato prima.
  function richText(s){
    return escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function extLink(href, label, cls){
    return '<a class="' + cls + '" href="' + escapeHtml(href) + '" target="_blank" rel="noopener">' + escapeHtml(label) + '</a>';
  }

  function giftsHead(eyebrow, title, lead){
    var html = '<div class="gifts-eyebrow">' + escapeHtml(eyebrow) + '</div>';
    if (title){
      var t = Array.isArray(title) ? title.map(escapeHtml).join('<br>') : escapeHtml(title);
      html += '<h2 class="gifts-title">' + t + '</h2>';
    }
    if (lead) html += '<p class="gifts-lead">' + richText(lead) + '</p>';
    return html;
  }

  function renderRegaliAziendali(){
    var cg = CATALOG.corporateGifts;
    if (!cg){
      viewEl.innerHTML = '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>' +
        '<p>Pagina non trovata.</p>';
      bindBack();
      return;
    }
    var L = cg.links;
    var html = '';
    html += '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>';

    // Hero
    var h = cg.hero;
    html += '<div class="gifts-landing-hero" style="background-image:linear-gradient(180deg,rgba(10,9,8,.72),rgba(10,9,8,.94)),url(img/' + h.bg + ')">';
    html += '<div class="gifts-eyebrow">' + escapeHtml(h.eyebrow) + '</div>';
    html += '<h1>' + h.headline.map(escapeHtml).join('<br>') + '</h1>';
    html += '<p class="gifts-lead">' + richText(h.lead) + '</p>';
    html += '<p class="gifts-claim">' + richText(h.claim) + '</p>';
    html += '<div class="gifts-btn-row">' + extLink(L.shop, 'Acquista la confezione', 'btn-solid') +
      '<a class="btn-gold" href="#preventivo" data-scroll="preventivo">Preventivo aziendale</a></div>';
    html += '<div class="gifts-badges">' + h.badges.map(function(b){ return '<span>' + escapeHtml(b) + '</span>'; }).join('') + '</div>';
    html += '<p class="gifts-small">' + escapeHtml(h.note) + '</p>';
    html += '</div>';

    // Concetto
    var c = cg.concept;
    html += '<section class="gifts-section">' + giftsHead(c.eyebrow, c.title, c.lead);
    html += '<ul class="gifts-checklist">';
    c.points.forEach(function(pt, i){
      html += '<li style="' + staggerStyle(i, 70) + '"><strong>' + escapeHtml(pt.title) + '</strong><span>' + escapeHtml(pt.text) + '</span></li>';
    });
    html += '</ul></section>';

    // Configurazioni
    var cf = cg.configurations;
    html += '<section class="gifts-section">' + giftsHead(cf.eyebrow, cf.title, cf.lead);
    html += '<div class="gifts-cards">';
    cf.cards.forEach(function(k, i){
      html += '<article class="gift-card" style="' + staggerStyle(i, 80) + '">';
      html += '<div class="gift-card-img"><img src="img/' + k.img + '" alt="' + escapeHtml(k.name) + '" loading="lazy"></div>';
      html += '<div class="gift-card-body">';
      html += '<div class="gift-card-num">' + escapeHtml(k.num) + '</div>';
      html += '<h3>' + escapeHtml(k.name) + '</h3>';
      html += '<div class="gift-card-price">' + escapeHtml(k.price) + '</div>';
      html += '<ul>' + k.items.map(function(it){ return '<li>' + escapeHtml(it) + '</li>'; }).join('') + '</ul>';
      if (k.note) html += '<p class="gift-card-note">' + escapeHtml(k.note) + '</p>';
      html += extLink(k.cta.href, k.cta.label, k.cta.ghost ? 'btn-gold gift-card-cta' : 'btn-solid gift-card-cta');
      if (k.mini) html += '<a class="gift-card-mini" href="#preventivo" data-scroll="preventivo">' + escapeHtml(k.mini) + '</a>';
      html += '</div></article>';
    });
    html += '</div>';
    if (cf.footnote) html += '<p class="gifts-small">' + escapeHtml(cf.footnote) + '</p>';
    html += '</section>';

    var galleryProducts = [];

    // Acquisto singolo
    var sg = cg.single;
    html += '<section class="gifts-section gifts-split">';
    html += '<div>' + giftsHead(sg.eyebrow, sg.title, sg.lead);
    html += '<div class="gifts-btn-row">' + extLink(L.shop, sg.cta, 'btn-solid') + '</div>';
    html += '<p class="gifts-small">' + escapeHtml(sg.note) + '</p></div>';
    html += '<div class="gifts-duo">' + sg.images.map(function(im){
      return '<img src="img/' + im.src + '" alt="' + escapeHtml(im.alt) + '" loading="lazy">';
    }).join('') + '</div></section>';

    // Catalogo
    var ct = cg.catalogSection;
    html += '<section class="gifts-section">' + giftsHead(ct.eyebrow, ct.title, ct.lead);
    html += '<div class="gifts-chips">' + ct.chips.map(function(x){ return '<span>' + escapeHtml(x) + '</span>'; }).join('') + '</div>';
    html += '<div class="gifts-btn-row">' + extLink(L.catalog, ct.cta, 'btn-gold') +
      '<a class="btn-gold" href="#/">' + escapeHtml(ct.ctaLocal) + '</a></div>';
    html += '<p class="gifts-small">' + escapeHtml(ct.note) + '</p></section>';

    // Personalizzazione
    var ps = cg.personalization;
    html += '<section class="gifts-section">' + giftsHead(ps.eyebrow, ps.title, ps.lead);
    html += '<div class="gifts-personalization">';
    ps.items.forEach(function(p, i){
      html += '<div class="gifts-pers-item" style="' + staggerStyle(i, 70) + '"><h4>' + escapeHtml(p.title) + '</h4><p>' + escapeHtml(p.text) + '</p></div>';
    });
    html += '</div><div class="gifts-btn-row">' + extLink(L.shop, ps.cta, 'btn-solid') + '</div></section>';

    // Laboratorio
    var lb = cg.lab;
    html += '<section class="gifts-section gifts-split gifts-split-lab">';
    html += '<div class="gifts-lab-gallery">' + lb.images.map(function(im){
      return '<img src="img/' + im.src + '" alt="' + escapeHtml(im.alt) + '" loading="lazy">';
    }).join('') + '</div>';
    html += '<div>' + giftsHead(lb.eyebrow, lb.title, lb.lead) + '<p class="gifts-motto">' + escapeHtml(lb.motto) + '</p></div></section>';

    // Percorso
    var st = cg.steps;
    html += '<section class="gifts-section">' + giftsHead(st.eyebrow, st.title);
    html += '<div class="gifts-steps">';
    st.items.forEach(function(it, i){
      html += '<div class="gifts-step" style="' + staggerStyle(i, 70) + '"><div class="gifts-step-n">' + (i + 1) + '</div><h3>' + escapeHtml(it.title) + '</h3><p>' + escapeHtml(it.text) + '</p></div>';
    });
    html += '</div><div class="gifts-deadline">' + richText(st.deadline) + '</div></section>';

    // Preventivo
    var q = cg.quote;
    html += '<section class="gifts-section gifts-quote" id="preventivo">' + giftsHead(q.eyebrow, q.title, q.lead);
    html += '<div class="gifts-btn-row">' + extLink(L.quote, q.cta, 'btn-solid') + '</div>';
    html += '<p class="gifts-small">' + escapeHtml(q.note) + '</p></section>';

    // FAQ
    var fq = cg.faq;
    html += '<section class="gifts-section">' + giftsHead(fq.eyebrow, fq.title);
    html += '<div class="gifts-faq">';
    fq.items.forEach(function(f){
      html += '<details><summary>' + escapeHtml(f.q) + '</summary><p>' + richText(f.a) + '</p></details>';
    });
    html += '</div></section>';

    // Chiusura
    var ft = cg.footer;
    html += '<div class="gifts-contact"><p class="gifts-motto">' + escapeHtml(ft.motto) + '</p>';
    html += '<p>' + escapeHtml(ft.address) + ' · <a href="mailto:' + escapeHtml(ft.email) + '">' + escapeHtml(ft.email) + '</a> · ' +
      '<a href="' + escapeHtml(L.site) + '" target="_blank" rel="noopener">reginaspirits.com</a></p>';
    html += '<p class="gifts-small">' + escapeHtml(ft.copy) + '</p></div>';

    viewEl.innerHTML = html;
    bindBack();
    bindProductPhotos(galleryProducts);
    // #preventivo non può essere un vero anchor: l'hash è usato dal router
    Array.prototype.forEach.call(viewEl.querySelectorAll('[data-scroll]'), function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        var target = document.getElementById(a.getAttribute('data-scroll'));
        if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });
    });
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

  function openLightbox(productIndex, imageIndex){
    if (!galleryProducts.length) return;
    galleryProductIndex = (productIndex + galleryProducts.length) % galleryProducts.length;
    var p = galleryProducts[galleryProductIndex];
    var images = productImages(p);
    galleryImageIndex = (imageIndex + images.length) % images.length;
    var current = images[galleryImageIndex];

    lightboxImg.src = 'img/' + current.src;
    lightboxImg.alt = p.name || '';
    var caption = p.name || '';
    if (p.grade) caption += ' — ' + p.grade;
    lightboxCaption.textContent = caption;

    lightboxSizes.innerHTML = '';
    if (images.length > 1){
      images.forEach(function(im, i){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lightbox-size-btn' + (i === galleryImageIndex ? ' is-active' : '');
        btn.textContent = im.label || (i + 1);
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          openLightbox(galleryProductIndex, i);
        });
        lightboxSizes.appendChild(btn);
      });
    }

    var multi = galleryProducts.length > 1;
    lightboxPrev.style.display = multi ? '' : 'none';
    lightboxNext.style.display = multi ? '' : 'none';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function prefersReducedMotion(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var SLIDE_MS = 260;
  var SLIDE_DIST = 36;
  var sliding = false;

  function slideToProduct(direction, newIndex, axis){
    if (sliding) return;
    if (prefersReducedMotion()){
      openLightbox(newIndex, 0);
      return;
    }
    sliding = true;
    var move = axis === 'y' ? 'translateY' : 'translateX';
    var outX = direction === 'next' ? -SLIDE_DIST : SLIDE_DIST;
    var inX = direction === 'next' ? SLIDE_DIST : -SLIDE_DIST;

    lightboxImg.style.transition = 'transform ' + SLIDE_MS + 'ms ease, opacity ' + SLIDE_MS + 'ms ease';
    lightboxImg.style.transform = move + '(' + outX + 'px)';
    lightboxImg.style.opacity = '0';

    setTimeout(function(){
      openLightbox(newIndex, 0);
      lightboxImg.style.transition = 'none';
      lightboxImg.style.transform = move + '(' + inX + 'px)';
      lightboxImg.style.opacity = '0';
      // force reflow so the next transition actually animates
      void lightboxImg.offsetWidth;
      lightboxImg.style.transition = 'transform ' + SLIDE_MS + 'ms ease, opacity ' + SLIDE_MS + 'ms ease';
      lightboxImg.style.transform = move + '(0)';
      lightboxImg.style.opacity = '1';
      setTimeout(function(){
        sliding = false;
        lightboxImg.style.transition = '';
        lightboxImg.style.transform = '';
        lightboxImg.style.opacity = '';
      }, SLIDE_MS);
    }, SLIDE_MS);
  }

  function showNextProduct(axis){ slideToProduct('next', galleryProductIndex + 1, axis); }
  function showPrevProduct(axis){ slideToProduct('prev', galleryProductIndex - 1, axis); }

  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sliding = false;
    lightboxImg.style.transition = '';
    lightboxImg.style.transform = '';
    lightboxImg.style.opacity = '';
  }

  lightbox.addEventListener('click', function(e){
    if (e.target === lightboxImg) { closeLightbox(); return; }
    if (e.target === lightboxClose || e.target === lightbox) { closeLightbox(); }
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function(e){ e.stopPropagation(); showPrevProduct('x'); });
  lightboxNext.addEventListener('click', function(e){ e.stopPropagation(); showNextProduct('x'); });
  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNextProduct('x');
    else if (e.key === 'ArrowLeft') showPrevProduct('x');
    else if (e.key === 'ArrowDown'){ e.preventDefault(); showNextProduct('y'); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); showPrevProduct('y'); }
  });

  // Swipe: da destra a sinistra / dal basso in alto = avanti, il contrario = indietro
  var touchStartX = null, touchStartY = null;
  lightbox.addEventListener('touchstart', function(e){
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  lightbox.addEventListener('touchend', function(e){
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    touchStartX = touchStartY = null;
    var horizontal = Math.abs(dx) >= Math.abs(dy);
    var d = horizontal ? dx : dy;
    if (Math.abs(d) < 40) return;
    e.preventDefault();
    var axis = horizontal ? 'x' : 'y';
    if (d < 0) showNextProduct(axis); else showPrevProduct(axis);
  }, { passive: false });
  // il lightbox è fisso a schermo intero: niente scroll/pull-to-refresh della pagina sotto
  lightbox.addEventListener('touchmove', function(e){ e.preventDefault(); }, { passive: false });

  // Rotellina / trackpad sul computer
  var wheelLockUntil = 0;
  lightbox.addEventListener('wheel', function(e){
    e.preventDefault();
    var now = Date.now();
    if (now < wheelLockUntil || Math.abs(e.deltaY) < 20) return;
    wheelLockUntil = now + 450;
    if (e.deltaY > 0) showNextProduct('y'); else showPrevProduct('y');
  }, { passive: false });

  // ---------- Router ----------

  function route(){
    closeLightbox();
    var hash = location.hash || '#/';
    var m = hash.match(/^#\/categoria\/([^/]+)$/);
    var mAward = hash.match(/^#\/premio\/([^/]+)$/);
    if (hash === '#/' || hash === ''){
      renderHome();
    } else if (m){
      renderCategory(decodeURIComponent(m[1]));
    } else if (mAward){
      renderAward(decodeURIComponent(mAward[1]));
    } else if (hash === '#/chi-siamo'){
      renderChiSiamo();
    } else if (hash === '#/regali-aziendali'){
      renderRegaliAziendali();
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
