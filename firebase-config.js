// Firebase コンソール → プロジェクトの設定 →「マイアプリ」→ SDK の設定と構成 → 「構成」の内容を貼り付けてください。
// databaseURL が入っていないと、引き継ぎコードでの復元・ルーム・チャットは動きません（1人プレイは動きます）。
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",   // 例: https://xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
