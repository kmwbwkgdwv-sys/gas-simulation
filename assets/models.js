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

  // 雑巾（黄色のマイクロファイバー、波打った布）
  function rag(w, d) {
    w = w || 0.42; d = d || 0.3;
    const geo = new T.PlaneGeometry(w, d, 10, 8); geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      p.setY(i, Math.sin(x * 22) * 0.012 + Math.cos(z * 26 + x * 9) * 0.01);
    }
    geo.computeVertexNormals();
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    x.fillStyle = '#f2c62e'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#e0a800';
    for (let i = 0; i < 64; i += 8) x.fillRect(0, i, 64, 2);
    x.fillStyle = '#fff'; x.fillRect(0, 0, 64, 3); x.fillRect(0, 61, 64, 3);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding;
    const m = mat(0xffffff, { map: t, keepMap: true, roughness: 1 }); m.side = T.DoubleSide;
    return new T.Mesh(geo, m);
  }

  // 水の入ったバケツ＋ふちに掛けた雑巾。userData.rag が「取れる雑巾」
  function bucket() {
    const g = new T.Group();
    const blue = mat(0x2f6fd0, { roughness: 0.35 }); blue.side = T.DoubleSide;
    add(g, lathe([[0, 0.02], [0.27, 0.02], [0.28, 0.04], [0.36, 0.56], [0.375, 0.58], [0.375, 0.6], [0.35, 0.6], [0.265, 0.06], [0, 0.06]], 20, blue));
    const water = add(g, new T.Mesh(new T.CircleGeometry(0.335, 20), mat(0x8fd0e8, { roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.8 })), 0, 0.46, 0);
    water.rotation.x = -Math.PI / 2;
    const steel = mat(0xc9ced3, { roughness: 0.3, metalness: 0.8 });
    const h = add(g, new T.Mesh(new T.TorusGeometry(0.38, 0.012, 6, 20, Math.PI), steel), 0, 0.58, 0);
    h.rotation.z = 0; h.rotation.x = 0.5;
    const r = rag(0.5, 0.36); r.position.set(0, 0.63, 0); r.rotation.y = 0.4; g.add(r);
    const fold = rag(0.5, 0.2); fold.position.set(0.02, 0.5, 0.39); fold.rotation.set(Math.PI / 2 - 0.15, 0.4, 0); r.add(fold); fold.position.set(0, -0.11, 0.2); fold.rotation.set(1.35, 0, 0);
    g.userData.rag = r;
    return g;
  }

  // バット立て（床置きスタンド）。userData.bat が「取れるバット」
  function batStand() {
    const g = new T.Group();
    const dark = mat(0x2a3038, { roughness: 0.5, metalness: 0.4 }), red = mat(0xd5281f, { roughness: 0.5 });
    add(g, new T.Mesh(new T.CylinderGeometry(0.26, 0.3, 0.06, 18), dark), 0, 0.03, 0);
    const tube = mat(0x3a4048, { roughness: 0.45, metalness: 0.5 }); tube.side = T.DoubleSide;
    add(g, new T.Mesh(new T.CylinderGeometry(0.13, 0.13, 0.5, 16, 1, true), tube), 0, 0.31, 0);
    add(g, new T.Mesh(new T.TorusGeometry(0.13, 0.018, 8, 18), red), 0, 0.56, 0).rotation.x = Math.PI / 2;
    add(g, new T.Mesh(new T.BoxGeometry(0.04, 1.5, 0.04), dark), -0.2, 0.75, 0);
    add(g, new T.Mesh(new T.BoxGeometry(0.5, 0.34, 0.03), red), -0.2, 1.42, 0);
    const b = bat(); b.position.set(0, 0.1, 0); b.rotation.z = -0.06; g.add(b);
    g.userData.bat = b;
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

  return { bat: bat, rag: rag, bucket: bucket, batStand: batStand, cone: cone, pallet: pallet, loot: loot };
};
