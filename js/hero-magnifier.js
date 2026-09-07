(function(){
  const visual = document.getElementById('heroVisual');
  const baseLogo = document.getElementById('heroLogo');
  const lens = document.getElementById('logoLens');
  const lensImg = document.getElementById('lensLogo');
  const lensBadge = document.getElementById('lensBadge');
  if (!visual || !baseLogo || !lens || !lensImg) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let targetX = 0.72, targetY = 0.42, x = targetX, y = targetY;
  let active = false;
  let lastMove = performance.now();

  function setLens(px, py, show=true) {
    const vr = visual.getBoundingClientRect();
    const br = baseLogo.getBoundingClientRect();
    const lensSize = lens.getBoundingClientRect().width || 154;
    const half = lensSize/2;
    const lx = Math.max(half + 8, Math.min(vr.width-half-8, px + 16));
    const ly = Math.max(half + 8, Math.min(vr.height-half-8, py - 8));
    lens.style.setProperty('--lens-x', lx + 'px');
    lens.style.setProperty('--lens-y', ly + 'px');

    const localX = Math.max(0, Math.min(br.width, px - (br.left-vr.left)));
    const localY = Math.max(0, Math.min(br.height, py - (br.top-vr.top)));
    const scale = 2.65;
    const imageW = br.width * scale;
    const imageH = br.height * scale;
    const lensXInside = lensSize/2 - localX*scale;
    const lensYInside = lensSize/2 - localY*scale;
    lensImg.style.width = imageW + 'px';
    lensImg.style.height = imageH + 'px';
    lensImg.style.left = lensXInside + 'px';
    lensImg.style.top = lensYInside + 'px';
    lensBadge.textContent = 'ZOOM 2.6×';
    if(show) lens.classList.add('is-visible');
  }

  function loop(now){
    if (!active && !reduceMotion && now-lastMove > 2600) {
      const t = now/1700;
      targetX = .68 + Math.sin(t)*.13;
      targetY = .46 + Math.cos(t*.9)*.10;
    }
    x += (targetX-x)*.085;
    y += (targetY-y)*.085;
    if(!active && !reduceMotion){
      setLens(visual.clientWidth*x, visual.clientHeight*y, true);
    }
    raf = requestAnimationFrame(loop);
  }

  visual.addEventListener('pointerenter', function(){
    active = true;
    lens.classList.add('is-visible');
  });
  visual.addEventListener('pointermove', function(e){
    const r = visual.getBoundingClientRect();
    targetX = (e.clientX-r.left)/r.width;
    targetY = (e.clientY-r.top)/r.height;
    lastMove = performance.now();
    setLens(e.clientX-r.left, e.clientY-r.top, true);
  });
  visual.addEventListener('pointerleave', function(){
    active = false;
    lastMove = performance.now();
    if(reduceMotion) lens.classList.remove('is-visible');
  });

  window.addEventListener('resize', function(){
    setLens(visual.clientWidth*targetX, visual.clientHeight*targetY, false);
  });

  if(reduceMotion){
    lens.classList.add('reduced-motion');
    setTimeout(()=>setLens(visual.clientWidth*.68, visual.clientHeight*.46, true), 200);
  }
  raf = requestAnimationFrame(loop);
  window.addEventListener('beforeunload', ()=>cancelAnimationFrame(raf));
})();
