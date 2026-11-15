// Flotte : La bataille navale contre l'ordinateur : cherche ses cinq navires et coule-les avant qu'il ne coule les tiens.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Flotte</span><span class="hint">Place ta flotte, puis clic sur une case de la grille d'en face</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="320" height="190"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="ftFs">PLEIN ÉCRAN</button></div>
      <label class="row">Amiral <select id="ftLvl" class="f"><option value="0">Facile</option><option value="1">Normal</option></select></label>
      <div class="hint">Avant la bataille : glisse tes navires sur ta grille, un clic sur un navire le tourne. « Au hasard » les replace, « Combat ! » ou Entrée lance la partie.</div><div class="hint">Touché : tu rejoues. Autour d'un navire coulé, l'eau est marquée d'office (les navires ne se touchent jamais).</div><div class="hint">En normal, l'amiral d'en face tire en damier puis achève ce qu'il a touché.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 600px;min-width:min(100%,340px);position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(320px,calc((100vh - 190px) * 320 / 190)));height:auto;aspect-ratio:320/190}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 320 / 190))}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "FLOTTE", T: {"k": "#030a14", "k2": "#08162a", "fill": "#0e2240", "fillOn": "#143058", "hl": "#1c3a6a", "line": "#2e5a9a", "acc": "#ff4a5a", "accL": "#ffb0b8", "accS": "#c02a3a", "accD": "#4a0a14", "rivet": "#ffb0b8", "btn": "#1c3a6a", "btnHi": "#4a7ac0", "btnLo": "#08162a", "btnHov": "#1c4478", "btnHovHi": "#6a9ae0", "text": "#eef6ff", "muted": "#a8c0e0", "acc2": "#3fe0ff", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#040c1a", "bgDot": "#0e2240", "bgDot2": "#08162a", "spark": "#2e5a9a", "spark2": "#3fe0ff", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", ".....k......", ".....kk.....", ".....kwk....", ".....kwwk...", ".....k......", "kkkkkkkkkkk.", "kmmmmmmmmmmk", ".kmmmmmmmmk.", "..kkkkkkkk..", "bbbbbbbbbbbb", ".bb.bb.bb.bb"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 320, H = 190, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Flotte : la bataille navale contre l'ordinateur. Chacun tire à son tour ; le premier qui coule toute la flotte d'en face gagne. ---------- */
const FT = {N: 10, C: 13, LX: 14, RX: 176, Y0: 46, SHIPS: [5, 4, 3, 3, 2], NAMES: ['porte-avions', 'cuirassé', 'croiseur', 'sous-marin', 'torpilleur']};
const ftCells = (len, x, y, h) => Array.from({length: len}, (_, i) => [x + (h ? i : 0), y + (h ? 0 : i)]);
function ftFits(ships, id, x, y, h) {  // le navire id tiendrait-il là, sans toucher les autres (même en diagonale) ?
  const cells = ftCells(ships[id].len, x, y, h); if (cells.some(([a, b]) => a < 0 || b < 0 || a >= FT.N || b >= FT.N)) return false;
  return ships.every((s, j) => j === id || s.cells.every(([a, b]) => cells.every(([c, d]) => Math.abs(a - c) > 1 || Math.abs(b - d) > 1)));
}
function ftOcc(F) { F.occ = Array.from({length: FT.N}, () => Array(FT.N).fill(-1)); F.ships.forEach((s, id) => s.cells.forEach(([a, b]) => F.occ[b][a] = id)); }
const fts = gstore('flotte', {wins: 0, games: 0, lvl: 1});
let ft = null;
function ftPlace() {  // une flotte au hasard, les navires ne se touchent pas (même en diagonale)
  for (;;) {
    const occ = Array.from({length: FT.N}, () => Array(FT.N).fill(-1)), ships = []; let ok = true;
    FT.SHIPS.forEach((len, id) => {
      for (let t = 0; t < 200 && ok; t++) {
        const h = Math.random() < .5, x = Math.floor(Math.random() * (FT.N - (h ? len - 1 : 0))), y = Math.floor(Math.random() * (FT.N - (h ? 0 : len - 1))), cells = Array.from({length: len}, (_, i) => [x + (h ? i : 0), y + (h ? 0 : i)]);
        if (cells.every(([a, b]) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (occ[b + dy]?.[a + dx] >= 0) return false; return true; })) { cells.forEach(([a, b]) => occ[b][a] = id); ships.push({len, cells, h, hits: 0}); return; }
      }
      ok = false;
    });
    if (ok && ships.length === FT.SHIPS.length) return {occ, ships};  // ships[i] suit l'ordre de FT.SHIPS : son dessin et son nom
  }
}
function ftNew() {
  ft = Object.assign(ft || {tick: 0, raf: 0}, {mode: 'place', seen: ft ? ft.tick : 0, me: ftPlace(), foe: ftPlace(), shotMe: Array.from({length: FT.N}, () => Array(FT.N).fill(0)), shotFoe: Array.from({length: FT.N}, () => Array(FT.N).fill(0)), turn: 'me', aiAt: 0, targets: [], parts: [], rings: [], drag: null, endAt: 0, msg: 'Place tes navires'});
  ftInfo();
}
const ftSunk = s => s.hits >= s.len;
function ftFire(side, x, y) {  // side : la flotte visée ; -> 'miss' | 'hit' | 'sunk'
  const F = side === 'foe' ? ft.foe : ft.me, shots = side === 'foe' ? ft.shotFoe : ft.shotMe; if (shots[y][x]) return null;
  const id = F.occ[y][x]; shots[y][x] = id >= 0 ? 2 : 1; ftBurst(side, x, y, id >= 0);
  if (id < 0) { beep(200, .15, 'sine', 120, .06); return 'miss'; }
  const s = F.ships[id]; s.hits++; beep(90, .25, 'sawtooth', 50, .08);
  if (ftSunk(s)) { const F0 = ft; s.cells.forEach(([a, b], i) => setTimeout(() => ft === F0 && ftBurst(side, a, b, true, true), 90 * (i + 1))); setTimeout(() => beep(60, .5, 'sawtooth', 30, .09), 120); for (const [a, b] of s.cells) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (shots[b + dy]?.[a + dx] === 0) shots[b + dy][a + dx] = 1; return 'sunk'; }  // autour d'un navire coulé, l'eau est sûre
  return 'hit';
}
const ftLost = F => F.ships.every(ftSunk);
function ftAi() {  // l'ordinateur : il chasse en damier, puis achève ce qu'il a touché (niveau 0 : au hasard)
  const sh = ft.shotMe, open = []; for (let y = 0; y < FT.N; y++) for (let x = 0; x < FT.N; x++) if (!sh[y][x]) open.push([x, y]);
  let cell = null;
  if (fts.lvl > 0) {
    const hits = []; for (let y = 0; y < FT.N; y++) for (let x = 0; x < FT.N; x++) if (sh[y][x] === 2 && !ftSunk(ft.me.ships[ft.me.occ[y][x]])) hits.push([x, y]);
    if (hits.length) {
      const line = hits.length > 1 ? (hits.every(h => h[1] === hits[0][1]) ? 'h' : 'v') : null, cand = [];
      for (const [x, y] of hits) for (const [dx, dy] of line === 'h' ? [[1, 0], [-1, 0]] : line === 'v' ? [[0, 1], [0, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (sh[y + dy]?.[x + dx] === 0) cand.push([x + dx, y + dy]);
      if (cand.length) cell = cand[Math.floor(Math.random() * cand.length)];
    }
    if (!cell) { const left = ft.me.ships.filter(s => !ftSunk(s)), min = Math.min(...left.map(s => s.len)), par = open.filter(([x, y]) => (x + y) % min === 0); cell = (par.length ? par : open)[Math.floor(Math.random() * (par.length || open.length))]; }
  } else cell = open[Math.floor(Math.random() * open.length)];
  const r = ftFire('me', ...cell);
  if (ftLost(ft.me)) return ftEnd(false);
  ft.msg = r === 'miss' ? 'À toi de tirer' : r === 'sunk' ? 'Il a coulé un de tes navires !' : 'Touché ! Il rejoue'; if (r === 'miss') ft.turn = 'me'; else ft.aiAt = ft.tick + 40;
}
function ftEnd(win) { ft.mode = 'over'; ft.win = win; ft.endAt = ft.tick; fts.games++; if (win) { fts.wins++; best('flotte' + fts.lvl, -ft.shotFoe.flat().filter(v => v).length); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .14, 'triangle'), i * 100)); } saveGames(); ftInfo(); }
function ftBurst(side, x, y, hit, big = false) {
  const X = (side === 'foe' ? FT.RX : FT.LX) + x * FT.C + 6.5, Y = FT.Y0 + y * FT.C + 6.5, R = Math.random;
  if (hit) {  // le feu : une boule qui s'ouvre, des éclats qui retombent dans l'eau, puis une fumée qui monte
    ft.rings.push({x: X, y: Y, t: 0, life: big ? 26 : 20, kind: 'boom', r: big ? 12 : 9});
    for (let i = 0; i < (big ? 10 : 8); i++) { const a = R() * Math.PI * 2, v = .6 + R() * 1.4; ft.parts.push({x: X, y: Y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, g: .08, t: 0, life: 24 + R() * 12, c: R() < .5 ? '#ffd84a' : '#ff6a2a', s: 1 + (R() < .3)}); }
    for (let i = 0; i < 4; i++) ft.parts.push({x: X + R() * 6 - 3, y: Y, vx: R() * .3 - .15, vy: -.25 - R() * .2, g: 0, t: -8 - i * 6, life: 40, c: '#5a5a70', s: 2});
  } else {  // à l'eau : une gerbe qui monte et retombe, et deux ronds dans l'eau
    ft.rings.push({x: X, y: Y, t: 0, life: 30, kind: 'ripple', r: 8}, {x: X, y: Y, t: -8, life: 30, kind: 'ripple', r: 6});
    for (let i = 0; i < 9; i++) ft.parts.push({x: X + R() * 4 - 2, y: Y, vx: R() * 1.2 - .6, vy: -1.6 - R() * 1.4, g: .14, t: 0, life: 22 + R() * 8, c: R() < .5 ? '#ffffff' : '#9ad0ff', s: 1, floor: Y + 2});
  }
}
function ftStepFx() {
  for (const p of ft.parts) { if (p.t++ < 0) continue; p.x += p.vx; p.y += p.vy; p.vy += p.g; if (p.floor && p.y > p.floor) p.t = p.life; }
  for (const r of ft.rings) r.t++;
  ft.parts = ft.parts.filter(p => p.t < p.life); ft.rings = ft.rings.filter(r => r.t < r.life);
}
function ftUpdate() { if (ft.turn === 'ai' && ft.tick >= ft.aiAt) ftAi(); }
const FT_SEA = [0, 1].map(f => cnv(FT.C, FT.C, b => { px(b, '#123a6a', 0, 0, FT.C, FT.C); px(b, '#1a4a80', 0, 0, FT.C, 1); px(b, '#0c2a50', 0, 0, 1, FT.C); px(b, '#3a7ac0', 3 + f * 3, 5, 3, 1); px(b, '#3a7ac0', 1 + f * 2, 9, 2, 1); }));
function ftShipArt(type, len) {
  const w = len * FT.C, sub = type === 3;
  return cnv(w, FT.C, b => {
    const O = '#05010b', lo = sub ? '#2e3c4c' : '#5e5e74', hi = sub ? '#4e6074' : '#9a9ab4', top = sub ? '#64788e' : '#c0c0d8';
    for (let x = 1; x < w - 1; x++) {  // la coque, de profil vue du dessus : pointue devant (à droite), arrondie derrière
      const f = w - 2 - x, h = Math.max(1, Math.min(4, f < 7 ? Math.round(f * .6) : 4, x < (sub ? 5 : 3) ? x + (sub ? 0 : 2) : 4));
      px(b, O, x, 6 - h - 1, 1, 2 * h + 3); px(b, lo, x, 6 - h, 1, 2 * h + 1); px(b, hi, x, 6 - h, 1, h); if (h > 2) px(b, top, x, 6 - h, 1, 1);
    }
    const tur = (x, dir = 1) => { px(b, O, x - 1, 3, 6, 6); px(b, '#4a4a5e', x, 4, 4, 4); px(b, '#d0d0e8', x, 4, 2, 1); px(b, O, dir > 0 ? x + 4 : x - 4, 5, 4, 2); px(b, '#8a8aa0', dir > 0 ? x + 4 : x - 3, 5, 3, 1); };
    const bridge = x => { px(b, O, x - 1, 2, 7, 8); px(b, '#d8d8ec', x, 3, 5, 6); px(b, '#3a3a50', x + 1, 4, 3, 1); px(b, '#3a3a50', x + 1, 6, 3, 1); };
    if (type === 0) {  // porte-avions : pont plat sombre, piste en pointillé, îlot sur le côté, deux avions
      px(b, '#3e3e4c', 4, 3, w - 13, 7); for (let x = 6; x < w - 12; x += 5) px(b, '#e8e8f4', x, 6, 3, 1); px(b, '#ffd84a', 4, 3, w - 13, 1);
      px(b, O, Math.round(w * .62) - 1, 0, 8, 4); px(b, '#d8d8ec', Math.round(w * .62), 1, 6, 2); px(b, '#3a3a50', Math.round(w * .62) + 1, 1, 4, 1);
      for (const x of [12, 30]) { px(b, '#a8b8d0', x, 4, 1, 5); px(b, '#a8b8d0', x - 2, 6, 5, 1); px(b, '#a8b8d0', x + 2, 5, 1, 3); }
    } else if (type === 1) { tur(6); tur(16); bridge(25); tur(36, -1); }  // cuirassé : trois tourelles
    else if (type === 2) { tur(5); bridge(15); tur(27, -1); }  // croiseur
    else if (type === 3) { px(b, O, 14, 2, 9, 8); px(b, '#3a4a5c', 15, 3, 7, 6); px(b, '#6a7e94', 15, 3, 7, 2); px(b, '#9ad0ff', 17, 5, 1, 1); px(b, '#9ad0ff', 20, 5, 1, 1); px(b, '#c0c8d8', 18, 0, 1, 3); }  // sous-marin : kiosque et périscope
    else { tur(4); bridge(13); }  // torpilleur
  });
}
const FT_ART = FT.SHIPS.map((len, t) => { const h = ftShipArt(t, len), v = cnv(FT.C, h.width, b => { b.translate(FT.C, 0); b.rotate(Math.PI / 2); b.drawImage(h, 0, 0); });
  const dark = c => cnv(c.width, c.height, b => { b.drawImage(c, 0, 0); b.globalCompositeOperation = 'source-atop'; b.fillStyle = 'rgba(30,6,6,.55)'; b.fillRect(0, 0, c.width, c.height); });
  return {h, v, hs: dark(h), vs: dark(v)}; });
const FT_FIRE = [spr(['..k.k..', '.kok.k.', '.koyok.', 'koyyyok', 'koyYyok', '.koook.', '..kkk..'], {k: '#05010b', o: '#ff6a2a', y: '#ffd84a', Y: '#ffffff'}), spr(['.k...k.', 'kok.kok', '.koyok.', 'koyYyok', 'koyyyok', '.koook.', '..kkk..'], {k: '#05010b', o: '#ff6a2a', y: '#ffd84a', Y: '#ffffff'})];
function ftGrid(X0, F, shots, mine) {
  px(g, '#05010b', X0 - 2, FT.Y0 - 2, FT.N * FT.C + 4, FT.N * FT.C + 4);
  for (let y = 0; y < FT.N; y++) for (let x = 0; x < FT.N; x++) {
    const X = X0 + x * FT.C, Y = FT.Y0 + y * FT.C, s = shots[y][x], id = F.occ[y][x], ship = id >= 0 ? F.ships[id] : null;
    g.drawImage(FT_SEA[(Math.floor(ft.tick / 30) + x + y) % 2], X, Y);
    if (!mine && ft.hover && ft.hover[0] === x && ft.hover[1] === y && !s && ft.turn === 'me' && ft.mode === 'play') { px(g, '#ffd84a', X, Y, FT.C, 1); px(g, '#ffd84a', X, Y + FT.C - 1, FT.C, 1); px(g, '#ffd84a', X, Y, 1, FT.C); px(g, '#ffd84a', X + FT.C - 1, Y, 1, FT.C); }
  }
  // les navires (les miens toujours, ceux d'en face une fois coulés ; celui qu'on glisse est dessiné à part), puis les marques des tirs par-dessus
  F.ships.forEach((sh, id) => { if (!(mine || ftSunk(sh)) || mine && ft.drag?.id === id && ft.drag.moved) return; const a = FT_ART[id], im = ftSunk(sh) ? (sh.h ? a.hs : a.vs) : sh.h ? a.h : a.v; g.drawImage(im, X0 + sh.cells[0][0] * FT.C, FT.Y0 + sh.cells[0][1] * FT.C); });
  for (let y = 0; y < FT.N; y++) for (let x = 0; x < FT.N; x++) { const X = X0 + x * FT.C, Y = FT.Y0 + y * FT.C, s = shots[y][x];
    if (s === 1) { px(g, '#8ab8e8', X + 5, Y + 5, 3, 3); px(g, '#123a6a', X + 6, Y + 6, 1, 1); }
    if (s === 2) g.drawImage(FT_FIRE[(Math.floor(ft.tick / 8) + x) % 2], X + 3, Y + 3); }
  if (mine && ft.drag?.moved) { const d = ft.drag, a = FT_ART[d.id], ok = ftFits(ft.me.ships, d.id, d.x, d.y, d.h), im = d.h ? a.h : a.v, X = X0 + d.x * FT.C, Y = FT.Y0 + d.y * FT.C;
    g.globalAlpha = .85; g.drawImage(im, X, Y); g.globalAlpha = 1; const w = d.h ? im.width : FT.C, h = d.h ? FT.C : im.height, c = ok ? '#5fdf6a' : '#ff4a5a';
    px(g, c, X, Y, w, 1); px(g, c, X, Y + h - 1, w, 1); px(g, c, X, Y, 1, h); px(g, c, X + w - 1, Y, 1, h); }
}
function ftFxDraw() {
  for (const r of ft.rings) { if (r.t < 0) continue; const k = r.t / r.life;
    if (r.kind === 'boom') { const rad = 2 + k * r.r; g.globalAlpha = 1 - k * .7; for (let a = 0; a < 20; a++) { const t = a / 20 * Math.PI * 2; px(g, k < .3 ? '#ffffff' : k < .6 ? '#ffd84a' : '#ff6a2a', r.x + Math.cos(t) * rad - 1, r.y + Math.sin(t) * rad - 1, 2, 2); }
      if (k < .4) { px(g, '#fff4b0', r.x - 3, r.y - 3, 6, 6); px(g, '#ffd84a', r.x - 4, r.y - 1, 8, 2); px(g, '#ffd84a', r.x - 1, r.y - 4, 2, 8); } }
    else { const rx = 2 + k * r.r * 1.4, ry = rx * .55; g.globalAlpha = 1 - k; for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; px(g, '#c8e8ff', r.x + Math.cos(t) * rx, r.y + Math.sin(t) * ry); } }
    g.globalAlpha = 1; }
  for (const p of ft.parts) { if (p.t < 0) continue; g.globalAlpha = Math.min(1, (p.life - p.t) / 10) * (p.c === '#5a5a70' ? .7 : 1); px(g, p.c, p.x, p.y, p.s, p.s); } g.globalAlpha = 1;
}
function ftDraw() {
  for (let y = 0; y < H; y++) px(g, y % 3 ? '#081830' : '#0a1c38', 0, y, W, 1);
  pxFont(g, 'TA FLOTTE', FT.LX, FT.Y0 - 8, '#c8d8ff', 6); pxFont(g, 'EN FACE', FT.RX, FT.Y0 - 8, '#ffb0b8', 6);
  for (; ft.seen < ft.tick; ft.seen++) ftStepFx();
  ftGrid(FT.LX, ft.me, ft.shotMe, true); ftGrid(FT.RX, ft.foe, ft.shotFoe, false); ftFxDraw();
  if (ft.mode === 'place') {  // avant la bataille : la grille d'en face sert de panneau, avec deux boutons
    px(g, 'rgba(4,12,26,.82)', FT.RX - 2, FT.Y0 - 2, FT.N * FT.C + 4, FT.N * FT.C + 4);
    pxFont(g, 'PLACE TA FLOTTE', FT.RX + 65, FT.Y0 + 18, '#ffd84a', 7, 'center');
    ['Glisse un navire', 'pour le déplacer.', 'Clic : le tourner.'].forEach((t, i) => pxFont(g, t, FT.RX + 65, FT.Y0 + 36 + i * 11, '#c8d8ff', 6, 'center'));
    for (const [k, b] of Object.entries(FT_BTN)) { const on = ft.hoverBtn === k, main = k === 'go';
      px(g, '#05010b', b.x - 1, b.y - 1, b.w + 2, b.h + 2); px(g, main ? (on ? '#ff7a86' : '#ff4a5a') : on ? '#2e5a9a' : '#1c3a6a', b.x, b.y, b.w, b.h); px(g, main ? '#ffb0b8' : '#4a7ac0', b.x, b.y, b.w, 1); px(g, main ? '#c02a3a' : '#08162a', b.x, b.y + b.h - 1, b.w, 1);
      pxFont(g, b.label, b.x + b.w / 2, b.y + b.h - 4, main ? '#030a14' : '#eef6ff', 6, 'center'); } }
  const left = s => s.ships.filter(x => !ftSunk(x)).length;
  pxFont(g, left(ft.me) + ' navires', FT.LX + FT.N * FT.C, FT.Y0 - 8, '#8aa8d8', 6, 'right'); pxFont(g, left(ft.foe) + ' navires', FT.RX + FT.N * FT.C, FT.Y0 - 8, '#d88a9a', 6, 'right');
  pxFont(g, ft.mode === 'place' ? 'Place tes navires, puis « Combat ! »' : ft.msg, W / 2, 18, ft.turn === 'me' ? '#ffd84a' : '#ffffff', 7, 'center');
  if (ft.mode === 'over' && ft.tick - ft.endAt > 30) gameText(g, W, [[ft.win ? 'VICTOIRE !' : 'TA FLOTTE A COULÉ', ft.win ? '#5fdf6a' : '#ff4a5a', 12], [ft.shotFoe.flat().filter(v => v).length + ' cases visées', '#ffffff'], ['Clic : nouvelle bataille', '#ffd84a']], 100);
}
const FT_BTN = {rnd: {x: FT.RX + 20, y: FT.Y0 + 76, w: 90, h: 15, label: 'AU HASARD'}, go: {x: FT.RX + 20, y: FT.Y0 + 98, w: 90, h: 17, label: 'COMBAT !'}};
const ftCell = (e, X0 = FT.RX, clamp = false) => { const [mx, my] = cpos(e); let x = Math.floor((mx - X0) / FT.C), y = Math.floor((my - FT.Y0) / FT.C); if (clamp) { x = Math.max(-4, Math.min(FT.N + 3, x)); y = Math.max(-4, Math.min(FT.N + 3, y)); return [x, y]; } return x >= 0 && y >= 0 && x < FT.N && y < FT.N ? [x, y] : null; };
const ftBtnAt = e => { const [mx, my] = cpos(e); return Object.keys(FT_BTN).find(k => { const b = FT_BTN[k]; return mx >= b.x && mx < b.x + b.w && my >= b.y && my < b.y + b.h; }); };
function ftStart() { if (ft.mode !== 'place') return; ft.mode = 'play'; ft.drag = null; ft.msg = 'À toi de tirer'; beep(440, .1, 'square', 880, .06); }
function ftShuffle() { ft.me = ftPlace(); ft.drag = null; beep(330, .06); }
function ftRotate(id) {  // tourne autour de sa première case ; s'il ne tient pas, essaie de le décaler un peu
  const sh = ft.me.ships[id], [x0, y0] = sh.cells[0];
  for (const [dx, dy] of [[0, 0], [-1, 0], [0, -1], [-2, 0], [0, -2], [-3, 0], [0, -3], [-4, 0], [0, -4], [1, 0], [0, 1]]) if (ftFits(ft.me.ships, id, x0 + dx, y0 + dy, !sh.h)) { sh.h = !sh.h; sh.cells = ftCells(sh.len, x0 + dx, y0 + dy, sh.h); ftOcc(ft.me); beep(520, .05); return true; }
  beep(120, .08); return false;
}
function ftDrop() {  // relâché : un clic sans bouger tourne le navire, un glissé le pose s'il tient (sinon il revient)
  const d = ft.drag; ft.drag = null; if (!d) return;
  if (!d.moved) return ftRotate(d.id);
  if (!ftFits(ft.me.ships, d.id, d.x, d.y, d.h)) return beep(120, .08), false;
  const sh = ft.me.ships[d.id]; sh.cells = ftCells(sh.len, d.x, d.y, d.h); ftOcc(ft.me); beep(400, .05); return true;
}
cv.onpointermove = e => { if (!ft) return; ft.hover = ftCell(e); ft.hoverBtn = ft.mode === 'place' ? ftBtnAt(e) : null;
  const d = ft.drag; if (d) { const [cx, cy] = ftCell(e, FT.LX, true), nx = cx - d.ox, ny = cy - d.oy; if (nx !== d.x || ny !== d.y) { d.x = nx; d.y = ny; d.moved = true; } } };
cv.onpointerup = cv.onpointercancel = () => { if (ft?.drag) ftDrop(); };
cv.onpointerdown = e => {
  e.preventDefault(); if (!ft) return; if (ft.mode === 'over') { if (ft.tick - ft.endAt > 30) ftNew(); return; }
  if (ft.mode === 'place') {
    const b = ftBtnAt(e); if (b === 'go') return ftStart(); if (b === 'rnd') return ftShuffle();
    const m = ftCell(e, FT.LX), id = m ? ft.me.occ[m[1]][m[0]] : -1; if (id < 0) return;
    const [x0, y0] = ft.me.ships[id].cells[0]; ft.drag = {id, ox: m[0] - x0, oy: m[1] - y0, x: x0, y: y0, h: ft.me.ships[id].h, moved: false}; try { cv.setPointerCapture(e.pointerId); } catch {} return;
  }
  const c = ftCell(e); if (!c || ft.turn !== 'me' || ft.shotFoe[c[1]][c[0]]) return;
  const r = ftFire('foe', ...c); if (ftLost(ft.foe)) return ftEnd(true);
  ft.msg = r === 'miss' ? 'Dans l\'eau…' : r === 'sunk' ? 'Coulé ! Tu rejoues' : 'Touché ! Tu rejoues'; if (r === 'miss') { ft.turn = 'ai'; ft.aiAt = ft.tick + 45; }
};
function ftInfo() { const b = games.best['flotte' + fts.lvl]; showStats([['Victoires', fts.wins + ' / ' + fts.games], ['Victoire la plus rapide', b != null ? -b + ' tirs' : '—']]); $('ftLvl').value = fts.lvl; }
$('gNew').onclick = () => { ftNew(); $('gNew').blur(); };
$('ftFs').onclick = () => { $('ftFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
document.addEventListener('keydown', e => { if (keyOk(e) && ft?.mode === 'place' && e.key === 'Enter') { e.preventDefault(); ftStart(); } });
$('ftLvl').onchange = () => { fts.lvl = +$('ftLvl').value; saveGames(); ftNew(); $('ftLvl').blur(); };
function ftCheck() {  // vérification : 5 navires de 17 cases qui ne se touchent pas ; placer, tourner, refuser un navire collé ; tirs qui éclaboussent ; l'ordinateur finit toujours par tout couler
  const keep = ft, kl = fts.lvl, kg = fts.games, bad = [], vol = actx; actx = {currentTime: 0, createOscillator: () => { throw 0; }};
  ft = null; ftNew(); const cells = ft.me.ships.flatMap(s => s.cells); if (!(cells.length === 17 && new Set(cells.map(String)).size === 17)) bad.push('flotte');
  if (ft.mode !== 'place') bad.push('placement');
  // une flotte connue : tout en ligne à gauche, un navire par ligne paire
  ft.me.ships.forEach((s, i) => { s.h = true; s.cells = ftCells(s.len, 0, i * 2, true); }); ftOcc(ft.me);
  if (ftFits(ft.me.ships, 4, 0, 7, true)) bad.push('collé accepté'); if (!ftFits(ft.me.ships, 4, 5, 9, true)) bad.push('place libre refusée');
  ft.drag = {id: 4, ox: 0, oy: 0, x: 6, y: 8, h: true, moved: true}; if (!ftDrop() || ft.me.occ[8][6] !== 4 || ft.me.occ[8][0] !== -1) bad.push('glisser');
  if (!ftRotate(4) || ft.me.ships[4].h || ft.me.occ[9][6] !== 4) bad.push('tourner');
  ft.drag = {id: 4, ox: 0, oy: 0, x: 6, y: 8, h: false, moved: false}; ftDrop(); if (!ft.me.ships[4].h) bad.push('tourner au clic');
  ftStart(); if (ft.mode !== 'play') bad.push('combat');
  const r = ftFire('foe', ...ft.foe.ships[0].cells[0]); if (r !== 'hit' || !ft.rings.length || !ft.parts.length) bad.push('explosion');
  ft.foe.occ.some((row, y) => row.some((id, x) => { if (id < 0 && !ft.shotFoe[y][x]) { ft.parts = []; ftFire('foe', x, y); return true; } return false; })); if (!ft.parts.some(p => p.floor)) bad.push('gerbe');
  for (let i = 0; i < 60; i++) ftStepFx(); if (ft.parts.length || ft.rings.length) bad.push('effets sans fin');
  fts.lvl = 1; let n = 0; while (!ftLost(ft.me) && n < 100) { ft.turn = 'ai'; ftAi(); n++; } if (!ftLost(ft.me) || n >= 100) bad.push('ordinateur ' + n);
  actx = vol; ft = keep; fts.lvl = kl; fts.games = kg;
  return bad.length ? bad.join(', ') : 'ok';
}
{ const c = ftCheck(); console.assert(c === 'ok', 'flotte', c); }
cv.__ft = {st: () => ft, check: ftCheck, FT, BTN: FT_BTN, fits: (id, x, y, h) => ftFits(ft.me.ships, id, x, y, h)};
ctx.onOpen(() => { if (!ft) ftNew(); gameLoop(ft, 'flotte', ftUpdate, ftDraw); ftInfo(); });

}
