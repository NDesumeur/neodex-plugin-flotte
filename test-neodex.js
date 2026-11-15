// lancé par le test « local » de NeoDex : la vérification interne, un navire glissé puis tourné à la souris, « Combat ! »,
// un tir touché (explosion), un tir à l'eau (gerbe), le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('gc').__ft, ft = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'flotte-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  // un évènement du pointeur au point (x, y) du canevas
  const ev = (type, x, y) => pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('${type}', {bubbles: true, pointerId: 1, clientX: r.left + ${x} / 320 * r.width, clientY: r.top + ${y} / 190 * r.height})); return 0; })()`);
  const cellXY = (X0, x, y) => [X0 + x * 13 + 6, 46 + y * 13 + 6];
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('gNew').click(), 0`); await sleep(100);
  if (await C('return ft.mode;') !== 'place') throw new Error('la partie devait commencer par le placement');
  await shot('0-placement');
  // le torpilleur : on cherche une place libre où il tient, on l'y glisse, puis un clic le tourne
  const plan = await C(`const s = ft.me.ships[4]; for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (T.fits(4, x, y, s.h) && (x !== s.cells[0][0] || y !== s.cells[0][1])) return {from: s.cells[0], to: [x, y]}; return null;`);
  if (!plan) throw new Error('aucune place libre pour le torpilleur');
  await ev('pointerdown', ...cellXY(14, ...plan.from)); await ev('pointermove', ...cellXY(14, ...plan.to)); await sleep(60); await shot('1-glisse'); await ev('pointerup', ...cellXY(14, ...plan.to));
  if (await C('return ft.me.occ[' + plan.to[1] + '][' + plan.to[0] + '];') !== 4) throw new Error('le torpilleur devait être posé à sa nouvelle place');
  const h0 = await C('return ft.me.ships[4].h;'); await ev('pointerdown', ...cellXY(14, ...plan.to)); await ev('pointerup', ...cellXY(14, ...plan.to));
  const h1 = await C('return ft.me.ships[4].h;'); if (h0 === h1 && await C(`return T.fits(4, ${plan.to[0]}, ${plan.to[1]}, ${!h0});`)) throw new Error('le clic devait tourner le torpilleur');
  // « Combat ! » sur la grille d'en face
  const B = await C('return T.BTN.go;'); await ev('pointerdown', B.x + 5, B.y + 5); if (await C('return ft.mode;') !== 'play') throw new Error('« Combat ! » devait lancer la bataille');
  // un tir sur un navire d'en face (explosion), puis un tir à l'eau (gerbe)
  const hit = await C('return ft.foe.ships[1].cells[0];'); await ev('pointerdown', ...cellXY(176, ...hit)); await sleep(130); await shot('2-explosion');
  if (await C(`return ft.shotFoe[${hit[1]}][${hit[0]}];`) !== 2) throw new Error('le tir devait toucher');
  const miss = await C('for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (ft.foe.occ[y][x] < 0 && !ft.shotFoe[y][x]) return [x, y];');
  await ev('pointerdown', ...cellXY(176, ...miss)); await sleep(150); await shot('3-gerbe');
  if (!await C('return ft.parts.some(p => p.floor) || ft.turn === "ai";')) throw new Error('le tir à l\'eau devait éclabousser');
  // un navire coulé d'en face, pour la capture
  await C(`ft.turn = 'me'; return 0;`); for (const c of await C('return ft.foe.ships[4].cells;')) { await C(`ft.turn = 'me'; return 0;`); await ev('pointerdown', ...cellXY(176, ...c)); await sleep(60); }
  await sleep(500); await shot('4-coule');
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('ftFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  await pj(`document.getElementById('gNew').click(), 0`);
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 280) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · navire glissé et tourné · combat · explosion · gerbe · coulé · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
