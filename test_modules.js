// Global mock for browser globals
globalThis.window = {
  location: { hash: "#home" },
  addEventListener: () => {},
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  }
};
globalThis.localStorage = globalThis.window.localStorage;
globalThis.sessionStorage = {
  getItem: () => null,
  setItem: () => {}
};
globalThis.document = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => "light"
  },
  getElementById: () => ({ innerHTML: "" }),
  createElement: () => ({ appendChild: () => {}, remove: () => {}, classList: { add: () => {} } }),
  body: { appendChild: () => {} }
};

async function run() {
  try {
    const auth = await import("./src/lib/auth.js");
    console.log("auth ok");
    const db = await import("./src/lib/database.js");
    console.log("db ok, members count:", db.db.getMembers().length);
    const header = await import("./src/components/Header.js");
    console.log("header ok, rendered len:", header.renderHeader("home").length);
    const home = await import("./src/app/HomeView.js");
    console.log("home ok, rendered len:", home.renderHomeView().length);
    const members = await import("./src/app/MemberListView.js");
    console.log("members ok, rendered len:", members.renderMemberListView().length);
    const oshi = await import("./src/app/OshiView.js");
    console.log("oshi ok, rendered len:", oshi.renderOshiView().length);
    const splash = await import("./src/components/LoginSplashAnimation.js");
    console.log("splash ok");
    console.log("ALL MODULES TESTED AND PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("MODULE ERROR:", err);
    process.exit(1);
  }
}

run();
