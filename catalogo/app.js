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

  function renderRegaliAziendali(){
    var cg = CATALOG.corporateGifts;
    if (!cg){
      viewEl.innerHTML = '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>' +
        '<p>Pagina non trovata.</p>';
      bindBack();
      return;
    }
    var html = '';
    html += '<button type="button" class="breadcrumb" data-back>&larr; Torna al catalogo</button>';

    html += '<div class="gifts-hero"><img src="img/' + cg.heroImage + '" alt="' + escapeHtml(cg.title) + '">';
    html += '<div class="gifts-hero-content">';
    html += '<h1>' + escapeHtml(cg.title) + '</h1>';
    html += '<p>' + escapeHtml(cg.tagline) + '</p>';
    html += '</div></div>';

    html += '<p class="gifts-intro">' + escapeHtml(cg.intro) + '</p>';

    if (cg.points && cg.points.length){
      html += '<div class="gifts-points">';
      cg.points.forEach(function(pt, i){
        html += '<div class="gifts-point" style="' + staggerStyle(i, 70) + '">' + escapeHtml(pt) + '</div>';
      });
      html += '</div>';
    }

    if (cg.packages && cg.packages.length){
      html += '<h2 class="section-heading">Le confezioni</h2>';
      html += '<div class="gifts-packages">';
      cg.packages.forEach(function(pack, i){
        html += '<div class="gift-package" style="' + staggerStyle(i, 80) + '">';
        html += '<h3>' + escapeHtml(pack.name) + '</h3>';
        html += '<div class="gift-package-price">' + escapeHtml(pack.price) + '</div>';
        html += '<ul>';
        pack.items.forEach(function(item){ html += '<li>' + escapeHtml(item) + '</li>'; });
        html += '</ul>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (cg.gallery && cg.gallery.length){
      html += '<h2 class="section-heading">Dal nostro laboratorio</h2>';
      html += '<div class="gifts-gallery">';
      cg.gallery.forEach(function(img, i){
        html += '<div class="gifts-gallery-item" style="' + staggerStyle(i, 50) + '"><img src="img/' + img + '" alt="" loading="lazy"></div>';
      });
      html += '</div>';
    }

    if (cg.personalization && cg.personalization.length){
      html += '<h2 class="section-heading">Personalizzazione</h2>';
      html += '<div class="gifts-personalization">';
      cg.personalization.forEach(function(p, i){
        html += '<div class="gifts-pers-item" style="' + staggerStyle(i, 70) + '">';
        html += '<h4>' + escapeHtml(p.title) + '</h4>';
        html += '<p>' + escapeHtml(p.text) + '</p>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (cg.process && cg.process.length){
      html += '<h2 class="section-heading">Come funziona</h2>';
      html += '<ol class="gifts-process">';
      cg.process.forEach(function(step){ html += '<li>' + escapeHtml(step) + '</li>'; });
      html += '</ol>';
    }

    if (cg.faq && cg.faq.length){
      html += '<h2 class="section-heading">Domande frequenti</h2>';
      html += '<div class="gifts-faq">';
      cg.faq.forEach(function(f){
        html += '<div class="gifts-faq-item"><h4>' + escapeHtml(f.q) + '</h4><p>' + escapeHtml(f.a) + '</p></div>';
      });
      html += '</div>';
    }

    if (cg.contact){
      html += '<div class="gifts-contact">' + escapeHtml(cg.contact) + '</div>';
    }

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

  function slideToProduct(direction, newIndex){
    if (sliding) return;
    if (prefersReducedMotion()){
      openLightbox(newIndex, 0);
      return;
    }
    sliding = true;
    var outX = direction === 'next' ? -SLIDE_DIST : SLIDE_DIST;
    var inX = direction === 'next' ? SLIDE_DIST : -SLIDE_DIST;

    lightboxImg.style.transition = 'transform ' + SLIDE_MS + 'ms ease, opacity ' + SLIDE_MS + 'ms ease';
    lightboxImg.style.transform = 'translateX(' + outX + 'px)';
    lightboxImg.style.opacity = '0';

    setTimeout(function(){
      openLightbox(newIndex, 0);
      lightboxImg.style.transition = 'none';
      lightboxImg.style.transform = 'translateX(' + inX + 'px)';
      lightboxImg.style.opacity = '0';
      // force reflow so the next transition actually animates
      void lightboxImg.offsetWidth;
      lightboxImg.style.transition = 'transform ' + SLIDE_MS + 'ms ease, opacity ' + SLIDE_MS + 'ms ease';
      lightboxImg.style.transform = 'translateX(0)';
      lightboxImg.style.opacity = '1';
      setTimeout(function(){
        sliding = false;
        lightboxImg.style.transition = '';
        lightboxImg.style.transform = '';
        lightboxImg.style.opacity = '';
      }, SLIDE_MS);
    }, SLIDE_MS);
  }

  function showNextProduct(){ slideToProduct('next', galleryProductIndex + 1); }
  function showPrevProduct(){ slideToProduct('prev', galleryProductIndex - 1); }

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
  lightboxPrev.addEventListener('click', function(e){ e.stopPropagation(); showPrevProduct(); });
  lightboxNext.addEventListener('click', function(e){ e.stopPropagation(); showNextProduct(); });
  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNextProduct();
    else if (e.key === 'ArrowLeft') showPrevProduct();
  });

  var touchStartX = null;
  lightbox.addEventListener('touchstart', function(e){
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function(e){
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 40) return;
    e.preventDefault();
    if (dx < 0) showNextProduct(); else showPrevProduct();
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
