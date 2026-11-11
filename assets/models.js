// まんたんステーション：小物の3Dモデル定義
// index.html から読み込まれ、window.MANTAN_MODELS(THREE, mat) で各モデルの生成関数を返します。
// このファイルが読めなかった場合、ゲーム側は簡易モデルで代用します。
window.MANTAN_MODELS = function (T, mat) {
  'use strict';
  const V = (pts) => pts.map((p) => new T.Vector2(p[0], p[1]));
  const lathe = (pts, seg, m) => new T.Mesh(new T.LatheGeometry(V(pts), seg), m);
  const add = (g, mesh, x, y, z) => { mesh.position.set(x || 0, y || 0, z || 0); g.add(mesh); return mesh; };

  // 木製バット（全長 約0.86m、グリップテープ付き）
  function bat() {
    const g = new T.Group();
    const wood = mat(0xc99a5b, { roughness: 0.55 });
    const tape = mat(0x22262b, { roughness: 0.9 });
    add(g, lathe([[0, 0], [0.03, 0], [0.032, 0.012], [0.03, 0.026], [0.017, 0.04], [0.016, 0.3], [0.019, 0.42],
      [0.027, 0.55], [0.034, 0.66], [0.036, 0.78], [0.034, 0.83], [0.024, 0.855], [0, 0.86]], 14, wood));
    add(g, new T.Mesh(new T.CylinderGeometry(0.0185, 0.0185, 0.24, 12), tape), 0, 0.17, 0);
    const ring = add(g, new T.Mesh(new T.CylinderGeometry(0.0365, 0.0365, 0.03, 14), mat(0xd5281f, { roughness: 0.5 })), 0, 0.6, 0);
    ring.scale.set(0.98, 1, 0.98);
    return g;
  }

  // 雑巾（たたんだマイクロファイバークロス）
  function clothMat() {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    x.fillStyle = '#e9c948'; x.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 64; i += 4) { x.fillStyle = i % 8 ? 'rgba(255,255,255,0.10)' : 'rgba(120,90,0,0.10)'; x.fillRect(0, i, 64, 2); x.fillRect(i, 0, 2, 64); }
    x.strokeStyle = '#c7a52a'; x.lineWidth = 3; x.strokeRect(2, 2, 60, 60);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding;
    const m = mat(0xffffff, { map: t, keepMap: true, roughness: 1 }); m.side = T.DoubleSide; return m;
  }
  function rag() {
    const g = new T.Group(), m = clothMat();
    add(g, new T.Mesh(new T.BoxGeometry(0.3, 0.022, 0.22), m), 0, 0, 0);
    add(g, new T.Mesh(new T.BoxGeometry(0.29, 0.02, 0.21), m), 0.006, 0.021, 0.004).rotation.y = 0.05;
    add(g, new T.Mesh(new T.BoxGeometry(0.28, 0.018, 0.2), m), -0.004, 0.04, -0.003).rotation.y = -0.04;
    return g;
  }
  // バケツのふちに掛けた布（外側に垂れ、ふちをまたいで内側へ）
  function drape(m, w, r, top) {
    const geo = new T.PlaneGeometry(w, 1, 6, 12), p = geo.attributes.position;
    const path = (t) => t < 0.45 ? [r + 0.03 + 0.02 * (1 - t / 0.45), top - 0.24 * (1 - t / 0.45)]
      : t < 0.6 ? [r + 0.03 - 0.07 * ((t - 0.45) / 0.15), top + 0.02 * Math.sin((t - 0.45) / 0.15 * Math.PI)]
        : [r - 0.04 - 0.01 * ((t - 0.6) / 0.4), top - 0.16 * ((t - 0.6) / 0.4)];
    for (let i = 0; i < p.count; i++) { const t = p.getY(i) + 0.5, q = path(t); p.setXYZ(i, q[0], q[1], p.getX(i)); }
    geo.computeVertexNormals(); return new T.Mesh(geo, m);
  }
  // 窓ふき用のバケツ（グレーの樹脂バケツ＋金属の持ち手＋水）。userData.rag が「取れる雑巾」
  function bucket() {
    const g = new T.Group();
    const shell = mat(0x7f8a94, { roughness: 0.55 }); shell.side = T.DoubleSide;
    add(g, lathe([[0, 0.012], [0.15, 0.012], [0.155, 0.03], [0.19, 0.3], [0.2, 0.31], [0.2, 0.325], [0.184, 0.325], [0.146, 0.04], [0, 0.04]], 24, shell));
    const water = add(g, new T.Mesh(new T.CircleGeometry(0.176, 24), mat(0x9fc9d6, { roughness: 0.08, transparent: true, opacity: 0.75 })), 0, 0.24, 0); water.rotation.x = -Math.PI / 2;
    const steel = mat(0xc9ced3, { roughness: 0.3, metalness: 0.8 });
    const h = add(g, new T.Mesh(new T.TorusGeometry(0.2, 0.007, 6, 24, Math.PI), steel), 0, 0.3, 0); h.rotation.set(-1.15, 0, 0);
    [-0.2, 0.2].forEach((x) => add(g, new T.Mesh(new T.CylinderGeometry(0.014, 0.014, 0.02, 8), steel), x, 0.3, 0).rotation.z = Math.PI / 2);
    const r = new T.Group(); r.add(drape(clothMat(), 0.2, 0.19, 0.335)); r.rotation.y = -0.6; g.add(r);
    add(g, new T.Mesh(new T.BoxGeometry(0.05, 0.3, 0.012), mat(0x3a2c22, { roughness: 0.6 })), 0.26, 0.15, 0.2).rotation.set(0, 0.5, -0.12);
    g.scale.setScalar(1.5);
    g.userData.rag = r;
    return g;
  }

  // 水バケツ（グレーの樹脂バケツ＋金属の持ち手）。userData.water が水面（ゲーム側で色と高さを変える）
  function bucket2() {
    const g = new T.Group();
    const shell = mat(0x7f8a94, { roughness: 0.55 }); shell.side = T.DoubleSide;
    add(g, lathe([[0, 0.012], [0.15, 0.012], [0.155, 0.03], [0.19, 0.3], [0.2, 0.31], [0.2, 0.325], [0.184, 0.325], [0.146, 0.04], [0, 0.04]], 24, shell));
    const water = add(g, new T.Mesh(new T.CircleGeometry(0.176, 24), mat(0x9fd6f0, { roughness: 0.08, transparent: true, opacity: 0.82 })), 0, 0.24, 0); water.rotation.x = -Math.PI / 2;
    const steel = mat(0xc9ced3, { roughness: 0.3, metalness: 0.8 });
    const h = add(g, new T.Mesh(new T.TorusGeometry(0.2, 0.007, 6, 24, Math.PI), steel), 0, 0.3, 0); h.rotation.set(-1.15, 0, 0);
    [-0.2, 0.2].forEach((x) => add(g, new T.Mesh(new T.CylinderGeometry(0.014, 0.014, 0.02, 8), steel), x, 0.3, 0).rotation.z = Math.PI / 2);
    g.scale.setScalar(1.5);
    g.userData.water = water;
    return g;
  }

  // モップ（木の柄＋青い金具＋糸の束）。userData.yarn が糸のマテリアル（濡れると色が変わる）
  function mop() {
    const g = new T.Group();
    const wood = mat(0xc9a57a, { roughness: 0.7 }), yarn = mat(0xe9e6de, { roughness: 1 });
    add(g, new T.Mesh(new T.CylinderGeometry(0.015, 0.017, 1.3, 10), wood), 0, 0.78, 0);
    add(g, new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.06, 10), mat(0x22262b, { roughness: 0.8 })), 0, 1.44, 0);
    add(g, new T.Mesh(new T.BoxGeometry(0.34, 0.045, 0.07), mat(0x3d7fd6, { roughness: 0.5 })), 0, 0.125, 0);
    add(g, new T.Mesh(new T.CylinderGeometry(0.022, 0.03, 0.06, 8), mat(0x3d7fd6, { roughness: 0.5 })), 0, 0.16, 0);
    for (let i = 0; i < 14; i++) {
      const y = add(g, new T.Mesh(new T.CylinderGeometry(0.014, 0.02, 0.11 + (i % 3) * 0.012, 6), yarn), -0.156 + (i % 7) * 0.052, 0.055, i < 7 ? 0.02 : -0.02);
      y.rotation.x = i < 7 ? 0.25 : -0.25;
    }
    g.userData.yarn = yarn;
    return g;
  }

  // バット立て（床置きスタンド）。台座は1枚だけ。バット本体はゲーム側の「道具」として置かれる
  function batStand() {
    const g = new T.Group();
    const dark = mat(0x2a3038, { roughness: 0.5, metalness: 0.4 }), red = mat(0xd5281f, { roughness: 0.5 });
    const tube = mat(0x3a4048, { roughness: 0.45, metalness: 0.5 }); tube.side = T.DoubleSide;
    add(g, new T.Mesh(new T.CylinderGeometry(0.13, 0.13, 0.52, 16, 1, true), tube), 0, 0.28, 0);
    add(g, new T.Mesh(new T.CircleGeometry(0.13, 16), dark), 0, 0.022, 0).rotation.x = -Math.PI / 2;
    add(g, new T.Mesh(new T.TorusGeometry(0.13, 0.018, 8, 18), red), 0, 0.54, 0).rotation.x = Math.PI / 2;
    return g;
  }

  // カラーコーン
  function cone() {
    const g = new T.Group();
    const org = mat(0xff6a13, { roughness: 0.6 }), wh = mat(0xf4f4f0, { roughness: 0.5 });
    add(g, new T.Mesh(new T.BoxGeometry(0.42, 0.04, 0.42), mat(0x22262b, { roughness: 0.8 })), 0, 0.02, 0);
    add(g, lathe([[0.17, 0.04], [0.035, 0.7], [0, 0.71]], 14, org));
    add(g, lathe([[0.125, 0.25], [0.098, 0.38]], 14, wh)).scale.set(1.03, 1, 1.03);
    return g;
  }

  // 木製パレット
  function pallet() {
    const g = new T.Group(), wood = mat(0xb08a5a, { roughness: 0.9 });
    for (let i = 0; i < 5; i++) add(g, new T.Mesh(new T.BoxGeometry(1.2, 0.025, 0.14), wood), 0, 0.13, -0.42 + i * 0.21);
    for (let i = 0; i < 3; i++) add(g, new T.Mesh(new T.BoxGeometry(0.1, 0.09, 1.0), wood), -0.5 + i * 0.5, 0.07, 0);
    for (let i = 0; i < 3; i++) add(g, new T.Mesh(new T.BoxGeometry(1.2, 0.025, 0.12), wood), 0, 0.012, -0.42 + i * 0.42);
    return g;
  }

  // 地面に落ちた商品（色付きの小箱＋目印のリング）
  function loot(m) {
    const g = new T.Group();
    const it = add(g, new T.Mesh(new T.BoxGeometry(0.3, 0.26, 0.4), m), 0, 0, 0); it.rotation.set(0.2, 0.6, 0.9);
    const ring = add(g, new T.Mesh(new T.TorusGeometry(0.42, 0.03, 6, 24), mat(0xffd23a, { emissive: 0xffd23a, emissiveIntensity: 0.9, roughness: 0.5 })), 0, -0.1, 0);
    ring.rotation.x = Math.PI / 2;
    g.userData.item = it;
    return g;
  }

  return { bat: bat, rag: rag, bucket: bucket, bucket2: bucket2, mop: mop, batStand: batStand, cone: cone, pallet: pallet, loot: loot };
};
