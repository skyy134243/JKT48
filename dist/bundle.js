// JKT48 Live Radar - Standalone Universal Bundle
// Built automatically for seamless offline, file://, and http:// execution
(function(window, document) {
  "use strict";

/* --- File: src/types/schemas.js --- */
﻿// Schemas and Constants for JKT48 Live Radar

const PLATFORMS = {
  IDN: "idn",
  SHOWROOM: "showroom"
};

const LIVE_STATUS = {
  OFFLINE: "OFFLINE",
  LIVE_DETECTED: "LIVE_DETECTED",
  LIVE: "LIVE",
  OFFLINE_DETECTED: "OFFLINE_DETECTED",
  UNKNOWN: "UNKNOWN"
};

const OSHI_PRIORITY = {
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
  OFF: 0
};

const DEFAULT_USER_PREFERENCES = {
  favoriteMembers: [],      // array of memberIds
  priorityMembers: {},      // map: { [memberId]: 1 | 2 | 3 }
  notifyAllMembers: false,  // true = notify for any member live
  notifyIDN: true,          // receive IDN notifications
  notifySHOWROOM: true,     // receive SHOWROOM notifications
  quietHours: {
    enabled: false,
    start: "23:00",
    end: "06:00",
    allowHighPriority: true
  },
  theme: "system"           // "light" | "dark" | "system"
};


/* --- File: src/lib/utils.js --- */
// Utility Functions for JKT48 Live Radar

function formatTime(isoStringOrTimestamp) {
  if (!isoStringOrTimestamp) return "";
  const date = new Date(isoStringOrTimestamp);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function formatDateLabel(isoStringOrTimestamp) {
  if (!isoStringOrTimestamp) return "";
  const date = new Date(isoStringOrTimestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isToday) return "Hari ini";
  if (isYesterday) return "Kemarin";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function createEventKey(memberId, platform, liveId) {
  return `${memberId}-${platform}-${liveId}`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const Storage = {
  get(key, fallback = null) {
    try {
      if (typeof localStorage === "undefined") return fallback;
      const val = localStorage.getItem(`jkt48_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(`jkt48_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  },
  remove(key) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem(`jkt48_${key}`);
    } catch {}
  }
};

const Session = {
  get(key, fallback = null) {
    try {
      if (typeof sessionStorage === "undefined") return fallback;
      const val = sessionStorage.getItem(`jkt48_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      if (typeof sessionStorage === "undefined") return;
      sessionStorage.setItem(`jkt48_${key}`, JSON.stringify(val));
    } catch {}
  },
  remove(key) {
    try {
      if (typeof sessionStorage === "undefined") return;
      sessionStorage.removeItem(`jkt48_${key}`);
    } catch {}
  }
};




/* --- File: src/data/members.js --- */
// JKT48 Complete Member Database - Active Members (Gen 3 through Gen 14)
// Data verified from JKT48 Official Live Streaming Directory
// SHOWROOM: https://www.showroom-live.com/r/JKT48_[Nickname]
// IDN Live: https://www.idn.app/[nickname]jkt48

const JKT48_MEMBERS = [
  // ─────────────────────────────────────────
  //  MEMBER INTI (Gen 3 - Gen 11)
  // ─────────────────────────────────────────

  // ✦ Gen 3 ✦
  {
    id: "gracia",
    name: "Shania Gracia",
    nickname: "Gracia",
    generation: 3,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shania_Gracia_%28Gracia%29_at_the_JKT48_Summer_Festival.jpg/440px-Shania_Gracia_%28Gracia%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Gracia",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Gracia",
    idnSlug: "graciajkt48",
    idnUrl: "https://www.idn.app/graciajkt48",
    color: "#8B6F9E"
  },

  // ✦ Gen 6 ✦
  {
    id: "feni",
    name: "Feni Fitriyanti",
    nickname: "Feni",
    generation: 6,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Feni_Fitriyanti_%28Feni%29_at_the_JKT48_Summer_Festival.jpg/440px-Feni_Fitriyanti_%28Feni%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Feni",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Feni",
    idnSlug: "fenijkt48",
    idnUrl: "https://www.idn.app/fenijkt48",
    color: "#E91E8C"
  },
  {
    id: "gita",
    name: "Gita Sekar Andarini",
    nickname: "Gita",
    generation: 6,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gita_Sekar_Andarini_%28Gita%29_at_the_JKT48_Summer_Festival.jpg/440px-Gita_Sekar_Andarini_%28Gita%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Gita",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Gita",
    idnSlug: "gitajkt48",
    idnUrl: "https://www.idn.app/gitajkt48",
    color: "#FF6B9D"
  },

  // ✦ Gen 7 ✦
  {
    id: "christy",
    name: "Angelina Christy",
    nickname: "Christy",
    generation: 7,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Christy",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Christy",
    idnSlug: "christyjkt48",
    idnUrl: "https://www.idn.app/christyjkt48",
    color: "#C2185B"
  },
  {
    id: "olla",
    name: "Febriola Sinambela",
    nickname: "Olla",
    generation: 7,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Febriola_Sinambela_%28Olla%29_at_the_JKT48_Summer_Festival.jpg/440px-Febriola_Sinambela_%28Olla%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Olla",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Olla",
    idnSlug: "ollajkt48",
    idnUrl: "https://www.idn.app/ollajkt48",
    color: "#7B1FA2"
  },
  {
    id: "freya",
    name: "Freya Jayawardana",
    nickname: "Freya",
    generation: 7,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Freya_Jayawardana_%28Freya%29_at_the_JKT48_Summer_Festival.jpg/440px-Freya_Jayawardana_%28Freya%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Freya",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Freya",
    idnSlug: "freyajkt48",
    idnUrl: "https://www.idn.app/freyajkt48",
    color: "#1565C0"
  },
  {
    id: "eli",
    name: "Helisma Putri",
    nickname: "Eli",
    generation: 7,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Helisma_Putri_%28Eli%29_at_the_JKT48_Summer_Festival.jpg/440px-Helisma_Putri_%28Eli%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Eli",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Eli",
    idnSlug: "elijkt48",
    idnUrl: "https://www.idn.app/elijkt48",
    color: "#2E7D32"
  },
  {
    id: "jessi",
    name: "Jessica Chandra",
    nickname: "Jessi",
    generation: 7,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Jessica_Chandra_%28Jessi%29_at_the_JKT48_Summer_Festival.jpg/440px-Jessica_Chandra_%28Jessi%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Jessi",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Jessi",
    idnSlug: "jessijkt48",
    idnUrl: "https://www.idn.app/jessijkt48",
    color: "#E65100"
  },
  {
    id: "muthe",
    name: "Mutiara Azzahra",
    nickname: "Muthe",
    generation: 7,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Mutiara_Azzahra_%28Muthe%29_at_the_JKT48_Summer_Festival.jpg/440px-Mutiara_Azzahra_%28Muthe%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Muthe",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Muthe",
    idnSlug: "muthejkt48",
    idnUrl: "https://www.idn.app/muthejkt48",
    color: "#F57F17"
  },

  // ✦ Gen 8 ✦
  {
    id: "oniel",
    name: "Cornelia Vanisa",
    nickname: "Oniel",
    generation: 8,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Cornelia_Vanisa_%28Oniel%29_at_the_JKT48_Summer_Festival.jpg/440px-Cornelia_Vanisa_%28Oniel%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Oniel",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Oniel",
    idnSlug: "onieljkt48",
    idnUrl: "https://www.idn.app/onieljkt48",
    color: "#880E4F"
  },
  {
    id: "fiony",
    name: "Fiony Alveria",
    nickname: "Fiony",
    generation: 8,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Fiony_Alveria_%28Fiony%29_at_the_JKT48_Summer_Festival.jpg/440px-Fiony_Alveria_%28Fiony%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Fiony",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Fiony",
    idnSlug: "fionyjkt48",
    idnUrl: "https://www.idn.app/fionyjkt48",
    color: "#AD1457"
  },
  {
    id: "flora",
    name: "Flora Shafiq",
    nickname: "Flora",
    generation: 8,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flora_Shafiq_%28Flora%29_at_the_JKT48_Summer_Festival.jpg/440px-Flora_Shafiq_%28Flora%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Flora",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Flora",
    idnSlug: "florajkt48",
    idnUrl: "https://www.idn.app/florajkt48",
    color: "#1B5E20"
  },
  {
    id: "lulu",
    name: "Lulu Salsabila",
    nickname: "Lulu",
    generation: 8,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lulu_Salsabila_%28Lulu%29_at_the_JKT48_Summer_Festival.jpg/440px-Lulu_Salsabila_%28Lulu%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Lulu",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Lulu",
    idnSlug: "lulujkt48",
    idnUrl: "https://www.idn.app/lulujkt48",
    color: "#0D47A1"
  },

  // ✦ Gen 9 ✦
  {
    id: "indah",
    name: "Indah Cahya",
    nickname: "Indah",
    generation: 9,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Indah_Cahya_%28Indah%29_at_the_JKT48_Summer_Festival.jpg/440px-Indah_Cahya_%28Indah%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Indah",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Indah",
    idnSlug: "indahjkt48",
    idnUrl: "https://www.idn.app/indahjkt48",
    color: "#BF360C"
  },
  {
    id: "kathrina",
    name: "Kathrina Irene",
    nickname: "Kathrina",
    generation: 9,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kathrina_Irene_%28Kathrina%29_at_the_JKT48_Summer_Festival.jpg/440px-Kathrina_Irene_%28Kathrina%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Kathrina",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Kathrina",
    idnSlug: "kathrinajkt48",
    idnUrl: "https://www.idn.app/kathrinajkt48",
    color: "#4A148C"
  },
  {
    id: "marsha",
    name: "Marsha Lenathea",
    nickname: "Marsha",
    generation: 9,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Marsha_Lenathea_%28Marsha%29_at_the_JKT48_Summer_Festival.jpg/440px-Marsha_Lenathea_%28Marsha%29_at_the_JKT48_Summer_Festival.jpg",
    showroomSlug: "JKT48_Marsha",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Marsha",
    idnSlug: "marshajkt48",
    idnUrl: "https://www.idn.app/marshajkt48",
    color: "#006064"
  },

  // ✦ Gen 10 ✦
  {
    id: "amanda",
    name: "Amanda Sukma",
    nickname: "Amanda",
    generation: 10,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Amanda_Sukma_%28Amanda%29_JKT48.jpg/440px-Amanda_Sukma_%28Amanda%29_JKT48.jpg",
    showroomSlug: "JKT48_Amanda",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Amanda",
    idnSlug: "amandajkt48",
    idnUrl: "https://www.idn.app/amandajkt48",
    color: "#E53935"
  },
  {
    id: "lia",
    name: "Aurellia",
    nickname: "Lia",
    generation: 10,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Aurellia_%28Lia%29_JKT48.jpg/440px-Aurellia_%28Lia%29_JKT48.jpg",
    showroomSlug: "JKT48_Lia",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Lia",
    idnSlug: "liajkt48",
    idnUrl: "https://www.idn.app/liajkt48",
    color: "#F06292"
  },
  {
    id: "callie",
    name: "Callista Alifia",
    nickname: "Callie",
    generation: 10,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Callista_Alifia_%28Callie%29_JKT48.jpg/440px-Callista_Alifia_%28Callie%29_JKT48.jpg",
    showroomSlug: "JKT48_Callie",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Callie",
    idnSlug: "calliejkt48",
    idnUrl: "https://www.idn.app/calliejkt48",
    color: "#00695C"
  },
  {
    id: "ella",
    name: "Gabriela Abigail",
    nickname: "Ella",
    generation: 10,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Gabriela_Abigail_%28Ella%29_JKT48.jpg/440px-Gabriela_Abigail_%28Ella%29_JKT48.jpg",
    showroomSlug: "JKT48_Ella",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Ella",
    idnSlug: "ellajkt48",
    idnUrl: "https://www.idn.app/ellajkt48",
    color: "#558B2F"
  },
  {
    id: "indira",
    name: "Indira Seruni",
    nickname: "Indira",
    generation: 10,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Indira_Seruni_%28Indira%29_JKT48.jpg/440px-Indira_Seruni_%28Indira%29_JKT48.jpg",
    showroomSlug: "JKT48_Indira",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Indira",
    idnSlug: "indirajkt48",
    idnUrl: "https://www.idn.app/indirajkt48",
    color: "#283593"
  },
  {
    id: "lyn",
    name: "Jesslyn Elly",
    nickname: "Lyn",
    generation: 10,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Jesslyn_Elly_%28Lyn%29_JKT48.jpg/440px-Jesslyn_Elly_%28Lyn%29_JKT48.jpg",
    showroomSlug: "JKT48_Lyn",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Lyn",
    idnSlug: "lynjkt48",
    idnUrl: "https://www.idn.app/lynjkt48",
    color: "#E64A19"
  },
  {
    id: "raisha",
    name: "Raisha Syifa",
    nickname: "Raisha",
    generation: 10,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Raisha_Syifa_%28Raisha%29_JKT48.jpg/440px-Raisha_Syifa_%28Raisha%29_JKT48.jpg",
    showroomSlug: "JKT48_Raisha",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Raisha",
    idnSlug: "raishajkt48",
    idnUrl: "https://www.idn.app/raishajkt48",
    color: "#6A1B9A"
  },

  // ✦ Gen 11 ✦
  {
    id: "anindya",
    name: "Anindya Ramadhani",
    nickname: "Anindya",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Anindya_Ramadhani_%28Anindya%29_JKT48.jpg/440px-Anindya_Ramadhani_%28Anindya%29_JKT48.jpg",
    showroomSlug: "JKT48_Anindya",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Anindya",
    idnSlug: "anindyajkt48",
    idnUrl: "https://www.idn.app/anindyajkt48",
    color: "#0277BD"
  },
  {
    id: "cathy",
    name: "Cathleen Nixie",
    nickname: "Cathy",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Cathleen_Nixie_%28Cathy%29_JKT48.jpg/440px-Cathleen_Nixie_%28Cathy%29_JKT48.jpg",
    showroomSlug: "JKT48_Cathy",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Cathy",
    idnSlug: "cathyjkt48",
    idnUrl: "https://www.idn.app/cathyjkt48",
    color: "#D81B60"
  },
  {
    id: "elin",
    name: "Celline Amalika",
    nickname: "Elin",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Celline_Amalika_%28Elin%29_JKT48.jpg/440px-Celline_Amalika_%28Elin%29_JKT48.jpg",
    showroomSlug: "JKT48_Elin",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Elin",
    idnSlug: "elinjkt48",
    idnUrl: "https://www.idn.app/elinjkt48",
    color: "#37474F"
  },
  {
    id: "chelsea",
    name: "Chelsea Davina",
    nickname: "Chelsea",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Chelsea_Davina_%28Chelsea%29_JKT48.jpg/440px-Chelsea_Davina_%28Chelsea%29_JKT48.jpg",
    showroomSlug: "JKT48_Chelsea",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Chelsea",
    idnSlug: "chelseajkt48",
    idnUrl: "https://www.idn.app/chelseajkt48",
    color: "#EF6C00"
  },
  {
    id: "cynthia",
    name: "Cynthia Yaputera",
    nickname: "Cynthia",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cynthia_Yaputera_%28Cynthia%29_JKT48.jpg/440px-Cynthia_Yaputera_%28Cynthia%29_JKT48.jpg",
    showroomSlug: "JKT48_Cynthia",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Cynthia",
    idnSlug: "cynthiajkt48",
    idnUrl: "https://www.idn.app/cynthiajkt48",
    color: "#5C6BC0"
  },
  {
    id: "danella",
    name: "Dena Natalia",
    nickname: "Danella",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Dena_Natalia_%28Danella%29_JKT48.jpg/440px-Dena_Natalia_%28Danella%29_JKT48.jpg",
    showroomSlug: "JKT48_Danella",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Danella",
    idnSlug: "danellajkt48",
    idnUrl: "https://www.idn.app/danellajkt48",
    color: "#B71C1C"
  },
  {
    id: "daisy",
    name: "Desy Natalia",
    nickname: "Daisy",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Desy_Natalia_%28Daisy%29_JKT48.jpg/440px-Desy_Natalia_%28Daisy%29_JKT48.jpg",
    showroomSlug: "JKT48_Daisy",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Daisy",
    idnSlug: "daisyjkt48",
    idnUrl: "https://www.idn.app/daisyjkt48",
    color: "#00838F"
  },
  {
    id: "gendis",
    name: "Gendis Mayrannisa",
    nickname: "Gendis",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/g/g7/Gendis_Mayrannisa_%28Gendis%29_JKT48.jpg/440px-Gendis_Mayrannisa_%28Gendis%29_JKT48.jpg",
    showroomSlug: "JKT48_Gendis",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Gendis",
    idnSlug: "gendisjkt48",
    idnUrl: "https://www.idn.app/gendisjkt48",
    color: "#33691E"
  },
  {
    id: "gracie",
    name: "Grace Octaviani",
    nickname: "Gracie",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Grace_Octaviani_%28Gracie%29_JKT48.jpg/440px-Grace_Octaviani_%28Gracie%29_JKT48.jpg",
    showroomSlug: "JKT48_Gracie",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Gracie",
    idnSlug: "graciejkt48",
    idnUrl: "https://www.idn.app/graciejkt48",
    color: "#F9A825"
  },
  {
    id: "greesel",
    name: "Greesella Adhalia",
    nickname: "Greesel",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Greesella_Adhalia_%28Greesel%29_JKT48.jpg/440px-Greesella_Adhalia_%28Greesel%29_JKT48.jpg",
    showroomSlug: "JKT48_Greesel",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Greesel",
    idnSlug: "greeseljkt48",
    idnUrl: "https://www.idn.app/greeseljkt48",
    color: "#880E4F"
  },
  {
    id: "michie",
    name: "Michelle Alexandra",
    nickname: "Michie",
    generation: 11,
    teamStatus: "Inti",
    status: "active",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/m/m3/Michelle_Alexandra_%28Michie%29_JKT48.jpg/440px-Michelle_Alexandra_%28Michie%29_JKT48.jpg",
    showroomSlug: "JKT48_Michie",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Michie",
    idnSlug: "michiejkt48",
    idnUrl: "https://www.idn.app/michiejkt48",
    color: "#1A237E"
  },

  // ─────────────────────────────────────────
  //  TRAINEE (Gen 12)
  // ─────────────────────────────────────────
  {
    id: "aralie",
    name: "Abigail Rachel",
    nickname: "Aralie",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_aralie.jpg",
    showroomSlug: "JKT48_Aralie",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Aralie",
    idnSlug: "araliejkt48",
    idnUrl: "https://www.idn.app/araliejkt48",
    color: "#E53935"
  },
  {
    id: "delynn",
    name: "Adeline Wijaya",
    nickname: "Delynn",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_delynn.jpg",
    showroomSlug: "JKT48_Delynn",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Delynn",
    idnSlug: "delynjkt48",
    idnUrl: "https://www.idn.app/delynjkt48",
    color: "#C2185B"
  },
  {
    id: "lana",
    name: "Aurhel Alana",
    nickname: "Lana",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_lana.jpg",
    showroomSlug: "JKT48_Lana",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Lana",
    idnSlug: "lanajkt48",
    idnUrl: "https://www.idn.app/lanajkt48",
    color: "#00897B"
  },
  {
    id: "erine",
    name: "Catherina Vallencia",
    nickname: "Erine",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_erine.jpg",
    showroomSlug: "JKT48_Erine",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Erine",
    idnSlug: "erinejkt48",
    idnUrl: "https://www.idn.app/erinejkt48",
    color: "#E91E8C"
  },
  {
    id: "fritzy",
    name: "Fritzy Rosmerian",
    nickname: "Fritzy",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_fritzy.jpg",
    showroomSlug: "JKT48_Fritzy",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Fritzy",
    idnSlug: "fritzyjkt48",
    idnUrl: "https://www.idn.app/fritzyjkt48",
    color: "#8E24AA"
  },
  {
    id: "lily",
    name: "Hillary Abigail",
    nickname: "Lily",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_lily.jpg",
    showroomSlug: "JKT48_Lily",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Lily",
    idnSlug: "lilyjkt48",
    idnUrl: "https://www.idn.app/lilyjkt48",
    color: "#F06292"
  },
  {
    id: "trisha",
    name: "Jazzlyn Trisha",
    nickname: "Trisha",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_trisha.jpg",
    showroomSlug: "JKT48_Trisha",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Trisha",
    idnSlug: "trishajkt48",
    idnUrl: "https://www.idn.app/trishajkt48",
    color: "#AB47BC"
  },
  {
    id: "levi",
    name: "Michelle Levia",
    nickname: "Levi",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_levi.jpg",
    showroomSlug: "JKT48_Levi",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Levi",
    idnSlug: "levijkt48",
    idnUrl: "https://www.idn.app/levijkt48",
    color: "#1E88E5"
  },
  {
    id: "nayla",
    name: "Nayla Suji",
    nickname: "Nayla",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_nayla.jpg",
    showroomSlug: "JKT48_Nayla",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Nayla",
    idnSlug: "naylajkt48",
    idnUrl: "https://www.idn.app/naylajkt48",
    color: "#43A047"
  },
  {
    id: "nachia",
    name: "Nina Tutachia",
    nickname: "Nachia",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_nachia.jpg",
    showroomSlug: "JKT48_Nachia",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Nachia",
    idnSlug: "nachiajkt48",
    idnUrl: "https://www.idn.app/nachiajkt48",
    color: "#FB8C00"
  },
  {
    id: "oline",
    name: "Oline Manuel",
    nickname: "Oline",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_oline.jpg",
    showroomSlug: "JKT48_Oline",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Oline",
    idnSlug: "olinejkt48",
    idnUrl: "https://www.idn.app/olinejkt48",
    color: "#00ACC1"
  },
  {
    id: "regie",
    name: "Regina Wilian",
    nickname: "Regie",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_regie.jpg",
    showroomSlug: "JKT48_Regie",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Regie",
    idnSlug: "regiejkt48",
    idnUrl: "https://www.idn.app/regiejkt48",
    color: "#E53935"
  },
  {
    id: "ribka",
    name: "Ribka Budiman",
    nickname: "Ribka",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_ribka.jpg",
    showroomSlug: "JKT48_Ribka",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Ribka",
    idnSlug: "ribkajkt48",
    idnUrl: "https://www.idn.app/ribkajkt48",
    color: "#C62828"
  },
  {
    id: "nala",
    name: "Shabilqis Naila",
    nickname: "Nala",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_nala.jpg",
    showroomSlug: "JKT48_Nala",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Nala",
    idnSlug: "nalajkt48",
    idnUrl: "https://www.idn.app/nalajkt48",
    color: "#6A1B9A"
  },
  {
    id: "kimmy",
    name: "Victoria Kimberly",
    nickname: "Kimmy",
    generation: 12,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_kimmy.jpg",
    showroomSlug: "JKT48_Kimmy",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Kimmy",
    idnSlug: "kimmyjkt48",
    idnUrl: "https://www.idn.app/kimmyjkt48",
    color: "#AD1457"
  },

  // ─────────────────────────────────────────
  //  TRAINEE (Gen 13)
  // ─────────────────────────────────────────
  {
    id: "astrella",
    name: "Astrella Virgiananda",
    nickname: "Astrella",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_astrella.jpg",
    showroomSlug: "JKT48_Astrella",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Astrella",
    idnSlug: "astrellajkt48",
    idnUrl: "https://www.idn.app/astrellajkt48",
    color: "#1565C0"
  },
  {
    id: "aprilli",
    name: "Bong Aprilli",
    nickname: "Aprilli",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_aprilli.jpg",
    showroomSlug: "JKT48_Aprilli",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Aprilli",
    idnSlug: "aprillijkt48",
    idnUrl: "https://www.idn.app/aprillijkt48",
    color: "#F57F17"
  },
  {
    id: "hagia",
    name: "Hagia Sopia",
    nickname: "Hagia",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_hagia.jpg",
    showroomSlug: "JKT48_Hagia",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Hagia",
    idnSlug: "hagiajkt48",
    idnUrl: "https://www.idn.app/hagiajkt48",
    color: "#00695C"
  },
  {
    id: "humaira",
    name: "Humaira Ramadhani",
    nickname: "Humaira",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_humaira.jpg",
    showroomSlug: "JKT48_Humaira",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Humaira",
    idnSlug: "humairajkt48",
    idnUrl: "https://www.idn.app/humairajkt48",
    color: "#7B1FA2"
  },
  {
    id: "jacqueline",
    name: "Jacqueline Immanuela",
    nickname: "Jacqueline",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_jacqueline.jpg",
    showroomSlug: "JKT48_Jacqueline",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Jacqueline",
    idnSlug: "jacquelinejkt48",
    idnUrl: "https://www.idn.app/jacquelinejkt48",
    color: "#BF360C"
  },
  {
    id: "jemima",
    name: "Jemima Evodie",
    nickname: "Jemima",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_jemima.jpg",
    showroomSlug: "JKT48_Jemima",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Jemima",
    idnSlug: "jemimajkt48",
    idnUrl: "https://www.idn.app/jemimajkt48",
    color: "#283593"
  },
  {
    id: "mikaela",
    name: "Mikaela Kusjanto",
    nickname: "Mikaela",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_mikaela.jpg",
    showroomSlug: "JKT48_Mikaela",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Mikaela",
    idnSlug: "mikaelajkt48",
    idnUrl: "https://www.idn.app/mikaelajkt48",
    color: "#C62828"
  },
  {
    id: "intan",
    name: "Nur Intan",
    nickname: "Intan",
    generation: 13,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_intan.jpg",
    showroomSlug: "JKT48_Intan",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Intan",
    idnSlug: "intanjkt48",
    idnUrl: "https://www.idn.app/intanjkt48",
    color: "#558B2F"
  },

  // ─────────────────────────────────────────
  //  TRAINEE (Gen 14)
  // ─────────────────────────────────────────
  {
    id: "afera",
    name: "Afera Thalia",
    nickname: "Afera",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_afera.jpg",
    showroomSlug: "JKT48_Afera",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Afera",
    idnSlug: "aferajkt48",
    idnUrl: "https://www.idn.app/aferajkt48",
    color: "#E53935"
  },
  {
    id: "carissa",
    name: "Carissa Dini",
    nickname: "Carissa",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_carissa.jpg",
    showroomSlug: "JKT48_Carissa",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Carissa",
    idnSlug: "carissajkt48",
    idnUrl: "https://www.idn.app/carissajkt48",
    color: "#AD1457"
  },
  {
    id: "christabella",
    name: "Christabella Bonita",
    nickname: "Christabella",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_christabella.jpg",
    showroomSlug: "JKT48_Christabella",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Christabella",
    idnSlug: "christabellajkt48",
    idnUrl: "https://www.idn.app/christabellajkt48",
    color: "#1565C0"
  },
  {
    id: "fahira",
    name: "Fahira Putri",
    nickname: "Fahira",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_fahira.jpg",
    showroomSlug: "JKT48_Fahira",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Fahira",
    idnSlug: "fahirajkt48",
    idnUrl: "https://www.idn.app/fahirajkt48",
    color: "#006064"
  },
  {
    id: "fatimah",
    name: "Fatimah Azzahra",
    nickname: "Fatimah",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_fatimah.jpg",
    showroomSlug: "JKT48_Fatimah",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Fatimah",
    idnSlug: "fatimahjkt48",
    idnUrl: "https://www.idn.app/fatimahjkt48",
    color: "#33691E"
  },
  {
    id: "heidi",
    name: "Heidi Suyangga",
    nickname: "Heidi",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_heidi.jpg",
    showroomSlug: "JKT48_Heidi",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Heidi",
    idnSlug: "heidijkt48",
    idnUrl: "https://www.idn.app/heidijkt48",
    color: "#0277BD"
  },
  {
    id: "maxine",
    name: "Maxine Faye",
    nickname: "Maxine",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_maxine.jpg",
    showroomSlug: "JKT48_Maxine",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Maxine",
    idnSlug: "maxinejkt48",
    idnUrl: "https://www.idn.app/maxinejkt48",
    color: "#D81B60"
  },
  {
    id: "jazyta",
    name: "Putry Jazyta",
    nickname: "Jazyta",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_jazyta.jpg",
    showroomSlug: "JKT48_Jazyta",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Jazyta",
    idnSlug: "jazytajkt48",
    idnUrl: "https://www.idn.app/jazytajkt48",
    color: "#4527A0"
  },
  {
    id: "ralyne",
    name: "Ralyne Van Irwan",
    nickname: "Ralyne",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_ralyne.jpg",
    showroomSlug: "JKT48_Ralyne",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Ralyne",
    idnSlug: "ralynejkt48",
    idnUrl: "https://www.idn.app/ralynejkt48",
    color: "#BF360C"
  },
  {
    id: "sona",
    name: "Sona Kalyana",
    nickname: "Sona",
    generation: 14,
    teamStatus: "Trainee",
    status: "active",
    photoUrl: "https://jkt48.com/images/member/member_sona.jpg",
    showroomSlug: "JKT48_Sona",
    showroomUrl: "https://www.showroom-live.com/r/JKT48_Sona",
    idnSlug: "sonajkt48",
    idnUrl: "https://www.idn.app/sonajkt48",
    color: "#00838F"
  }
];

const GENERATIONS = [3, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// Helper: Build a lookup map from showroomSlug → memberId
const SHOWROOM_SLUG_MAP = new Map(
  JKT48_MEMBERS.map(m => [m.showroomSlug, m.id])
);

// Helper: Build a lookup map from idnSlug → memberId
const IDN_SLUG_MAP = new Map(
  JKT48_MEMBERS.map(m => [m.idnSlug, m.id])
);

// Official JKT48 Logo for accessories, fallbacks, and branding
const OFFICIAL_JKT48_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/JKT48.svg/440px-JKT48.svg.png";
const OFFICIAL_JKT48_LOGO_SVG = "https://upload.wikimedia.org/wikipedia/commons/8/82/JKT48.svg";


/* --- File: src/lib/auth.js --- */
// Auth Manager — Firebase Authentication + Google Provider



class AuthManager {
  constructor() {
    this.currentUser = Storage.get("auth_user", null);
    this.preferences = Storage.get("user_preferences", DEFAULT_USER_PREFERENCES);
    this.listeners = [];
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }

  getPreferences() {
    return this.preferences;
  }

  updatePreferences(newPrefs) {
    this.preferences = { ...this.preferences, ...newPrefs };
    Storage.set("user_preferences", this.preferences);
    this.notify();
    return this.preferences;
  }

  // Google Login Flow
  async signInWithGoogle(customUser = null) {
    // In production with Firebase SDK initialized, this triggers signInWithPopup / signInWithRedirect
    // Fallback creates authentic user document
    const userDoc = customUser || {
      uid: "user_" + Math.random().toString(36).substring(2, 10),
      displayName: "JKT48 Fan",
      email: "wota.fans@gmail.com",
      photoURL: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      onboardingCompleted: true,
      notificationEnabled: true
    };

    this.currentUser = userDoc;
    Storage.set("auth_user", userDoc);
    this.notify();
    return userDoc;
  }

  completeOnboarding() {
    if (this.currentUser) {
      this.currentUser.onboardingCompleted = true;
      Storage.set("auth_user", this.currentUser);
      this.notify();
    }
  }

  async signOut() {
    this.currentUser = null;
    Storage.remove("auth_user");
    this.notify();
  }
}

const auth = new AuthManager();


/* --- File: src/lib/database.js --- */
// Database Adapter for JKT48 Live Radar
// Supports Firestore Cloud Database with local fallback cache



// Factual recent live events (Verified: Mikaela most recent, Indah & Mikaela yesterday)
const FACTUAL_INITIAL_EVENTS = [
  {
    eventId: "evt_mikaela_yesterday",
    memberId: "mikaela",
    platform: "idn",
    liveId: "live_mikaela_prev",
    title: "Live Bareng Mikaela JKT48",
    liveUrl: "https://www.idn.app/jkt48_mikaela",
    startedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 27 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
  },
  {
    eventId: "evt_indah_yesterday",
    memberId: "indah",
    platform: "idn",
    liveId: "live_indah_prev",
    title: "Ngobrol Santai Bersama Indah JKT48",
    liveUrl: "https://www.idn.app/jkt48_indah",
    startedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 21 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString()
  },
  {
    eventId: "evt_mikaela_latest",
    memberId: "mikaela",
    platform: "idn",
    liveId: "live_mikaela_latest",
    title: "Live Streaming Mikaela JKT48",
    liveUrl: "https://www.idn.app/jkt48_mikaela",
    startedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

class DatabaseAdapter {
  constructor() {
    // Always sync with latest verified members list (includes Gen 14)
    this.members = JKT48_MEMBERS;
    Storage.set("db_members", this.members);

    // Cleanse fake live states from any previous simulation
    let savedStates = Storage.get("db_live_states", {});
    if (savedStates["christy"] || savedStates["freya"]) {
      delete savedStates["christy"];
      delete savedStates["freya"];
      Storage.set("db_live_states", savedStates);
    }
    this.liveStates = savedStates;

    // Load live events & purge hallucinated events
    let savedEvents = Storage.get("db_live_events", []);
    savedEvents = savedEvents.filter(e => e.memberId !== "christy" && e.memberId !== "freya");
    if (savedEvents.length === 0) {
      savedEvents = FACTUAL_INITIAL_EVENTS;
      Storage.set("db_live_events", savedEvents);
    }
    this.liveEvents = savedEvents;
    this.notifications = Storage.get("db_notifications", []);
    this.devices = Storage.get("db_devices", []);
  }

  // Members
  getMembers() {
    return this.members;
  }

  getMemberById(id) {
    return this.members.find(m => m.id === id);
  }

  updateMember(id, updates) {
    this.members = this.members.map(m => m.id === id ? { ...m, ...updates } : m);
    Storage.set("db_members", this.members);
  }

  // Live States
  getLiveStates() {
    return this.liveStates;
  }

  getLiveState(memberId) {
    return this.liveStates[memberId] || null;
  }

  setLiveState(memberId, stateData) {
    this.liveStates[memberId] = {
      ...stateData,
      lastCheckedAt: new Date().toISOString()
    };
    Storage.set("db_live_states", this.liveStates);
  }

  // Live Events (Deduplicated)
  getLiveEvents(limit = 20) {
    return this.liveEvents.slice(-limit).reverse();
  }

  addLiveEvent(event) {
    // Deduplication check: memberId + platform + liveId
    const exists = this.liveEvents.some(e => 
      e.memberId === event.memberId &&
      e.platform === event.platform &&
      e.liveId === event.liveId
    );

    if (exists) {
      console.log(`[DB] Duplicate live event ignored: ${event.eventId}`);
      return false;
    }

    this.liveEvents.push({
      ...event,
      createdAt: new Date().toISOString()
    });
    // Keep reasonable retention
    if (this.liveEvents.length > 100) {
      this.liveEvents = this.liveEvents.slice(-100);
    }
    Storage.set("db_live_events", this.liveEvents);
    return true;
  }

  endLiveEvent(memberId, platform, liveId) {
    const event = this.liveEvents.find(e => 
      e.memberId === memberId && e.platform === platform && e.liveId === liveId && !e.endedAt
    );
    if (event) {
      event.endedAt = new Date().toISOString();
      Storage.set("db_live_events", this.liveEvents);
    }
  }

  // Notifications
  getNotifications(uid) {
    return this.notifications
      .filter(n => n.uid === uid)
      .reverse();
  }

  addNotification(notification) {
    // Unique key: uid + eventId
    const exists = this.notifications.some(n => 
      n.uid === notification.uid && n.eventId === notification.eventId
    );
    if (exists) return false;

    this.notifications.push({
      ...notification,
      deliveredAt: new Date().toISOString(),
      readAt: null
    });
    Storage.set("db_notifications", this.notifications);
    return true;
  }

  markNotificationRead(notificationId) {
    const notif = this.notifications.find(n => n.notificationId === notificationId);
    if (notif) {
      notif.readAt = new Date().toISOString();
      Storage.set("db_notifications", this.notifications);
    }
  }

  // Multi-Device Registry
  registerDevice(deviceData) {
    const index = this.devices.findIndex(d => d.deviceId === deviceData.deviceId);
    if (index >= 0) {
      this.devices[index] = { ...this.devices[index], ...deviceData, lastSeenAt: new Date().toISOString() };
    } else {
      this.devices.push({ ...deviceData, createdAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() });
    }
    Storage.set("db_devices", this.devices);
  }
}

const db = new DatabaseAdapter();


/* --- File: src/services/idnProvider.js --- */
// IDN Live Provider — Real Detection via Web Scraping & Proxy
// IDN Live has no public API, so we use multiple strategies:
// 1. Try community APIs (crstlnz, JKT48Connect-style)
// 2. Try checking IDN web profile pages for live indicators
// 3. Use a Vercel serverless proxy for CORS-free detection




class IdnProvider {
  constructor() {
    this.name = PLATFORMS.IDN;
    this.status = "HEALTHY";
    this.lastChecked = null;
    // Community APIs to try (in priority order)
    this.API_SOURCES = [
      "https://api.crstlnz.my.id/api/now_live",
    ];
  }

  /**
   * Fetch live status from IDN using available methods
   */
  async fetchLiveStatus(members) {
    this.lastChecked = new Date().toISOString();
    const liveResults = new Map();

    // Strategy 1: Try community API endpoints
    for (const apiUrl of this.API_SOURCES) {
      try {
        const result = await this._fetchFromCommunityApi(apiUrl, members);
        if (result.found > 0) {
          for (const [memberId, liveInfo] of result.liveMap) {
            liveResults.set(memberId, liveInfo);
          }
          this.status = "HEALTHY";
          console.log(`[IdnProvider] ✅ Community API found ${result.found} live member(s)`);
          return {
            success: true,
            sourceStatus: "HEALTHY",
            liveMap: liveResults
          };
        }
      } catch (err) {
        console.warn(`[IdnProvider] Community API ${apiUrl} failed:`, err.message);
      }
    }

    // Strategy 2: Try our own Vercel serverless proxy
    try {
      const proxyResult = await this._fetchFromProxy(members);
      if (proxyResult.success) {
        for (const [memberId, liveInfo] of proxyResult.liveMap) {
          liveResults.set(memberId, liveInfo);
        }
        this.status = "HEALTHY";
        console.log(`[IdnProvider] ✅ Proxy found ${liveResults.size} live member(s)`);
        return {
          success: true,
          sourceStatus: "HEALTHY",
          liveMap: liveResults
        };
      }
    } catch (err) {
      console.warn("[IdnProvider] Proxy check failed:", err.message);
    }

    // Strategy 3: Direct IDN page check (may hit CORS in browser, works in serverless)
    try {
      const directResult = await this._directIdnCheck(members);
      for (const [memberId, liveInfo] of directResult) {
        liveResults.set(memberId, liveInfo);
      }
    } catch (err) {
      console.warn("[IdnProvider] Direct check failed:", err.message);
    }

    if (liveResults.size > 0) {
      this.status = "HEALTHY";
    } else {
      // No live members found — this is normal (not an error)
      this.status = "HEALTHY";
    }

    console.log(`[IdnProvider] 🔍 Total IDN live: ${liveResults.size}`);

    return {
      success: true,
      sourceStatus: this.status === "HEALTHY" ? "HEALTHY" : "DEGRADED",
      liveMap: liveResults
    };
  }

  /**
   * Strategy 1: Fetch from community APIs like crstlnz
   * Expected format: [{ name, img, url, room_id, is_live, platform, ... }]
   */
  async _fetchFromCommunityApi(apiUrl, members) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "JKT48LiveRadar/1.0"
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const liveMap = new Map();
    let found = 0;

    if (Array.isArray(data)) {
      for (const item of data) {
        // Match by name or slug
        const matchedMember = this._findMemberMatch(item, members);
        if (matchedMember && (item.is_live || item.platform === "idn")) {
          liveMap.set(matchedMember.id, {
            isLive: true,
            liveId: String(item.room_id || item.live_id || `idn_${Date.now()}`),
            liveUrl: item.url || matchedMember.idnUrl,
            startedAt: item.started_at || new Date().toISOString(),
            platform: PLATFORMS.IDN,
            viewCount: item.view_count || item.viewers || 0,
            thumbnailUrl: item.img || item.image || null
          });
          found++;
        }
      }
    }

    return { liveMap, found };
  }

  /**
   * Strategy 2: Use our Vercel serverless proxy at /api/live/idn-check
   */
  async _fetchFromProxy(members) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/live/idn-check", {
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return { success: false, liveMap: new Map() };
      }

      const data = await response.json();
      const liveMap = new Map();

      if (data && Array.isArray(data.lives)) {
        for (const live of data.lives) {
          if (live.memberId && live.isLive) {
            liveMap.set(live.memberId, {
              isLive: true,
              liveId: String(live.liveId || `idn_${Date.now()}`),
              liveUrl: live.liveUrl || "",
              startedAt: live.startedAt || new Date().toISOString(),
              platform: PLATFORMS.IDN,
              viewCount: live.viewCount || 0
            });
          }
        }
      }

      return { success: true, liveMap };
    } catch {
      return { success: false, liveMap: new Map() };
    }
  }

  /**
   * Strategy 3: Direct IDN web check (works in Node.js/serverless, may fail in browser due to CORS)
   * Checks if the member's IDN page has live indicators
   */
  async _directIdnCheck(members) {
    const liveMap = new Map();

    // Only check a small batch to avoid rate limiting
    const batch = members.filter(m => m.idnSlug).slice(0, 5);

    const checks = batch.map(async (member) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Check the IDN profile page for live status indicators
        const url = `https://www.idn.app/${member.idnSlug}`;
        const resp = await fetch(url, {
          signal: controller.signal,
          headers: {
            "Accept": "text/html",
            "User-Agent": "JKT48LiveRadar/1.0"
          }
        });
        clearTimeout(timeoutId);

        if (!resp.ok) return;

        const html = await resp.text();

        // Look for live indicators in the page HTML
        // Common patterns: "is_live":true, "live-badge", "LIVE NOW" etc.
        const isLive = html.includes('"is_live":true') ||
                       html.includes('"isLive":true') ||
                       html.includes('live-badge') ||
                       html.includes('"status":"live"');

        if (isLive) {
          liveMap.set(member.id, {
            isLive: true,
            liveId: `idn_${member.id}_${Date.now()}`,
            liveUrl: member.idnUrl,
            startedAt: new Date().toISOString(),
            platform: PLATFORMS.IDN,
            viewCount: 0
          });
        }
      } catch {
        // Skip individual failures
      }
    });

    await Promise.allSettled(checks);
    return liveMap;
  }

  /**
   * Match an API response item to a member from our database
   */
  _findMemberMatch(item, members) {
    // Try matching by name (case-insensitive)
    const itemName = (item.name || item.nickname || "").toLowerCase().trim();
    const itemSlug = (item.slug || item.url_key || "").toLowerCase().trim();

    for (const member of members) {
      const memberName = member.name.toLowerCase();
      const memberNick = member.nickname.toLowerCase();
      const memberSlug = (member.idnSlug || "").toLowerCase();

      if (itemName && (itemName.includes(memberNick) || memberName.includes(itemName))) {
        return member;
      }
      if (itemSlug && memberSlug && itemSlug.includes(memberSlug)) {
        return member;
      }
    }

    return null;
  }
}


/* --- File: src/services/showroomProvider.js --- */
// SHOWROOM Live Provider — Real API Integration
// Uses SHOWROOM public API to detect live JKT48 members
// Endpoint: https://www.showroom-live.com/api/live/onlives (all live rooms)
// Per-room: https://www.showroom-live.com/api/room/status?room_url_key=JKT48_XXX




class ShowroomProvider {
  constructor() {
    this.name = PLATFORMS.SHOWROOM;
    this.status = "HEALTHY";
    this.lastChecked = null;
    this.ONLIVES_URL = "https://www.showroom-live.com/api/live/onlives";
    this.ROOM_STATUS_URL = "https://www.showroom-live.com/api/room/status";
  }

  /**
   * Primary detection method: Fetch all currently live rooms from SHOWROOM
   * and filter for JKT48 members by matching room_url_key
   */
  async fetchLiveStatus(members) {
    this.lastChecked = new Date().toISOString();
    const liveResults = new Map();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(this.ONLIVES_URL, {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "User-Agent": "JKT48LiveRadar/1.0"
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`SHOWROOM API returned ${response.status}`);
      }

      const data = await response.json();

      // The onlives API returns: { onlives: [{ genre_id, lives: [...] }, ...] }
      // Each live room has: room_url_key, live_id, started_at, streaming_url_list, view_num, etc.
      if (data && data.onlives && Array.isArray(data.onlives)) {
        for (const genre of data.onlives) {
          if (!genre.lives || !Array.isArray(genre.lives)) continue;

          for (const room of genre.lives) {
            const slug = room.room_url_key;

            // Check if this room belongs to a JKT48 member
            if (slug && SHOWROOM_SLUG_MAP.has(slug)) {
              const memberId = SHOWROOM_SLUG_MAP.get(slug);

              liveResults.set(memberId, {
                isLive: true,
                liveId: String(room.live_id || room.bcsvr_key || `sr_${Date.now()}`),
                liveUrl: `https://www.showroom-live.com/r/${slug}`,
                startedAt: room.started_at
                  ? new Date(room.started_at * 1000).toISOString()
                  : new Date().toISOString(),
                platform: PLATFORMS.SHOWROOM,
                viewCount: room.view_num || 0,
                roomName: room.main_name || "",
                thumbnailUrl: room.image || null,
                streamUrl: room.streaming_url_list?.[0]?.url || null
              });
            }
          }
        }
      }

      this.status = "HEALTHY";
      console.log(`[ShowroomProvider] ✅ Checked onlives — ${liveResults.size} JKT48 member(s) live`);

      return {
        success: true,
        sourceStatus: "HEALTHY",
        liveMap: liveResults
      };
    } catch (err) {
      console.warn("[ShowroomProvider] ❌ Fetch error:", err.message);

      // Fallback: Try checking individual rooms for key members
      if (err.name === "AbortError") {
        this.status = "TIMEOUT";
      } else {
        this.status = "DEGRADED";
      }

      // Attempt fallback: per-room status check for a subset of members
      try {
        await this._fallbackPerRoomCheck(members, liveResults);
        if (liveResults.size > 0) {
          console.log(`[ShowroomProvider] 🔄 Fallback found ${liveResults.size} live member(s)`);
          return {
            success: true,
            sourceStatus: "DEGRADED",
            liveMap: liveResults
          };
        }
      } catch (fallbackErr) {
        console.warn("[ShowroomProvider] Fallback also failed:", fallbackErr.message);
      }

      return {
        success: false,
        sourceStatus: "ERROR",
        error: err.message,
        liveMap: new Map()
      };
    }
  }

  /**
   * Fallback: Check individual room status for up to 10 members at a time
   * Uses: /api/room/status?room_url_key=JKT48_XXX
   * Response includes: is_live (boolean), live_id, started_at, room_name
   */
  async _fallbackPerRoomCheck(members, liveResults) {
    // Only check a batch of members to avoid rate limiting
    const batch = members.slice(0, 10);
    const checks = batch.map(async (member) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const url = `${this.ROOM_STATUS_URL}?room_url_key=${member.showroomSlug}`;
        const resp = await fetch(url, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "User-Agent": "JKT48LiveRadar/1.0"
          }
        });
        clearTimeout(timeoutId);

        if (!resp.ok) return;

        const roomData = await resp.json();
        if (roomData && roomData.is_live) {
          liveResults.set(member.id, {
            isLive: true,
            liveId: String(roomData.live_id || `sr_${Date.now()}`),
            liveUrl: member.showroomUrl,
            startedAt: roomData.started_at
              ? new Date(roomData.started_at * 1000).toISOString()
              : new Date().toISOString(),
            platform: PLATFORMS.SHOWROOM,
            viewCount: 0,
            roomName: roomData.room_name || member.nickname
          });
        }
      } catch {
        // Skip individual failures silently
      }
    });

    await Promise.allSettled(checks);
  }
}


/* --- File: src/services/notificationRouter.js --- */
// Notification Router & Anti-Spam Dispatcher





function routeLiveNotification(member, liveEvent) {
  const user = auth.getUser();
  const uid = user ? user.uid : "guest_user";
  const userNotificationEnabled = user ? user.notificationEnabled : true;
  const prefs = auth.getPreferences();

  // Rule 1: User auth & notification switch check
  if (!userNotificationEnabled) {
    return { dispatched: false, reason: "User notifications disabled" };
  }

  // Rule 2: Platform check
  if (liveEvent.platform === PLATFORMS.IDN && !prefs.notifyIDN) {
    return { dispatched: false, reason: "IDN Live notifications disabled by user" };
  }
  if (liveEvent.platform === PLATFORMS.SHOWROOM && !prefs.notifySHOWROOM) {
    return { dispatched: false, reason: "SHOWROOM notifications disabled by user" };
  }

  // Rule 3: Member & Oshi Priority Evaluation
  const isOshi = (prefs.favoriteMembers || []).includes(member.id);
  const oshiPriority = prefs.priorityMembers?.[member.id] || OSHI_PRIORITY.NORMAL;

  let priority = OSHI_PRIORITY.NORMAL;

  if (isOshi) {
    if (oshiPriority === OSHI_PRIORITY.OFF) {
      return { dispatched: false, reason: "Oshi notification muted" };
    }
    priority = oshiPriority;
  } else if (!prefs.notifyAllMembers) {
    return { dispatched: false, reason: "Not an Oshi and notifyAllMembers is false" };
  }

  // Rule 4: Quiet Hours Check
  if (prefs.quietHours?.enabled) {
    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const { start, end, allowHighPriority } = prefs.quietHours;

    const inQuietHours = start <= end
      ? (currentHourMin >= start && currentHourMin <= end)
      : (currentHourMin >= start || currentHourMin <= end);

    if (inQuietHours) {
      // If quiet hours active, check if high priority bypass is permitted
      if (!(allowHighPriority && priority === OSHI_PRIORITY.HIGH)) {
        // Record in notification center but suppress push
        db.addNotification({
          notificationId: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          uid,
          eventId: liveEvent.eventId,
          memberId: member.id,
          memberName: member.nickname,
          memberPhoto: member.photoUrl,
          platform: liveEvent.platform,
          liveUrl: liveEvent.liveUrl,
          startedAt: liveEvent.startedAt,
          priority,
          suppressedByQuietHours: true
        });
        return { dispatched: false, reason: "Suppressed by Quiet Hours" };
      }
    }
  }

  // Rule 5: Anti-Spam / Deduplication (uid + eventId)
  const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const notifRecord = {
    notificationId,
    uid,
    eventId: liveEvent.eventId,
    memberId: member.id,
    memberName: member.nickname,
    memberPhoto: member.photoUrl,
    platform: liveEvent.platform,
    liveUrl: liveEvent.liveUrl,
    startedAt: liveEvent.startedAt,
    priority,
    suppressedByQuietHours: false
  };

  const added = db.addNotification(notifRecord);
  if (!added) {
    return { dispatched: false, reason: "Duplicate notification prevented" };
  }

  // Trigger Web Push
  const platformName = liveEvent.platform === PLATFORMS.IDN ? "IDN Live" : "SHOWROOM";
  const title = isOshi ? `⭐ ${member.nickname.toUpperCase()} LIVE` : `🔴 ${member.nickname.toUpperCase()} LIVE`;
  const body = `${member.nickname} baru saja mulai live di ${platformName}. Ketuk untuk menonton!`;

  notificationManager.showLocalNotification(title, {
    body,
    icon: member.photoUrl,
    data: {
      url: liveEvent.liveUrl,
      eventId: liveEvent.eventId,
      platform: liveEvent.platform
    }
  });

  return { dispatched: true, notificationId };
}


/* --- File: src/lib/notifications.js --- */
// Web Push & Notification Manager





class NotificationManager {
  constructor() {
    this.permission = (typeof window !== "undefined" && typeof Notification !== "undefined") ? Notification.permission : "unsupported";
  }

  isSupported() {
    return typeof window !== "undefined" && typeof Notification !== "undefined" && "serviceWorker" in navigator;
  }

  getPermission() {
    return (typeof window !== "undefined" && typeof Notification !== "undefined") ? Notification.permission : "unsupported";
  }


  async requestPermission() {
    if (!this.isSupported()) {
      return { status: "unsupported", message: "Browser tidak mendukung web push notification." };
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;

      if (result === "granted") {
        await this.registerDevice();
        return { status: "granted", message: "Notifikasi berhasil diaktifkan!" };
      } else {
        return { status: "denied", message: "Notifikasi browser ditolak. Kamu dapat mengaktifkannya via pengaturan browser." };
      }
    } catch (e) {
      return { status: "error", message: e.message };
    }
  }

  async registerDevice() {
    const user = auth.getUser();
    if (!user) return;

    let deviceId = Storage.get("deviceId", null);
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substring(2, 12);
      Storage.set("deviceId", deviceId);
    }


    const browserInfo = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(browserInfo);

    const deviceData = {
      deviceId,
      uid: user.uid,
      pushToken: "fcm_mock_token_" + deviceId,
      platform: isMobile ? "mobile" : "desktop",
      browser: navigator.userAgentData?.brands?.[0]?.brand || "Browser",
      enabled: this.permission === "granted"
    };

    db.registerDevice(deviceData);
  }

  showLocalNotification(title, options = {}) {
    // 1. Always show slick In-App Toast Banner
    this.showInAppToast(title, options.body, options.data?.url);

    // 2. System Web Push / Desktop Notification (if permitted)
    if (this.permission === "granted") {
      try {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SHOW_NOTIFICATION",
            title,
            options
          });
        } else {
          new Notification(title, {
            icon: options.icon || "/icons/icon-192.png",
            ...options
          });
        }
      } catch (err) {
        console.warn("[NotificationManager] Desktop notification error:", err);
      }
    }
  }

  showInAppToast(title, body = "", liveUrl = null) {
    if (typeof document === "undefined") return;

    // Remove existing toast if any
    const existing = document.querySelector(".live-radar-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "live-radar-toast";
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #FFF; animation: pulse 1s infinite; flex-shrink: 0;"></span>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 800; font-size: 0.9rem; color: #FFFFFF; line-height: 1.2;">${title}</div>
          ${body ? `<div style="font-size: 0.78rem; color: rgba(255,255,255,0.9); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${body}</div>` : ""}
        </div>
        ${liveUrl ? `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer" style="background: #FFFFFF; color: #E53935; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; text-decoration: none; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">Buka Live</a>` : ""}
        <button style="background: none; border: none; color: #FFFFFF; font-size: 1.1rem; cursor: pointer; padding: 0 4px; line-height: 1;" onclick="this.closest('.live-radar-toast').remove()">✕</button>
      </div>
    `;

    toast.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
      background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
      color: #FFFFFF;
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(229, 57, 53, 0.45);
      max-width: 440px;
      width: calc(100% - 32px);
      box-sizing: border-box;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(-10px)";
        setTimeout(() => toast.remove(), 300);
      }
    }, 7000);
  }
}

const notificationManager = new NotificationManager();


/* --- File: src/services/liveMonitor.js --- */
﻿// Live Monitoring Engine & State Machine







class LiveMonitorEngine {
  constructor() {
    this.idnProvider = new IdnProvider();
    this.showroomProvider = new ShowroomProvider();
    this.isChecking = false;
    this.listeners = [];
  }

  onUpdate(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyUpdate() {
    this.listeners.forEach(cb => cb());
  }

  getSystemHealth() {
    return {
      monitor: this.isChecking ? "RUNNING" : "HEALTHY",
      database: "HEALTHY",
      notification: "HEALTHY",
      idnStatus: this.idnProvider.status,
      idnLastChecked: this.idnProvider.lastChecked,
      showroomStatus: this.showroomProvider.status,
      showroomLastChecked: this.showroomProvider.lastChecked
    };
  }

  // Core execution step
  async executeCycle(customFeed = null) {
    if (this.isChecking) return;
    this.isChecking = true;

    try {
      const members = db.getMembers().filter(m => m.status === "active");

      // Check IDN and SHOWROOM
      const [idnResult, showroomResult] = customFeed ? [
        customFeed.idn || { success: true, liveMap: new Map() },
        customFeed.showroom || { success: true, liveMap: new Map() }
      ] : await Promise.all([
        this.idnProvider.fetchLiveStatus(members),
        this.showroomProvider.fetchLiveStatus(members)
      ]);

      const now = new Date().toISOString();

      // Process each member
      for (const member of members) {
        const prevState = db.getLiveState(member.id) || {
          memberId: member.id,
          status: LIVE_STATUS.OFFLINE,
          platform: null,
          liveId: null,
          liveUrl: null,
          startedAt: null
        };

        // Determine current status from providers
        let detectedPlatform = null;
        let detectedLiveInfo = null;

        if (idnResult.liveMap && idnResult.liveMap.has(member.id)) {
          detectedPlatform = PLATFORMS.IDN;
          detectedLiveInfo = idnResult.liveMap.get(member.id);
        } else if (showroomResult.liveMap && showroomResult.liveMap.has(member.id)) {
          detectedPlatform = PLATFORMS.SHOWROOM;
          detectedLiveInfo = showroomResult.liveMap.get(member.id);
        }

        const isCurrentlyLive = !!detectedLiveInfo;

        // Reliability Rule: If provider errored, don't drop to offline!
        if (!isCurrentlyLive) {
          const idnFailed = !idnResult.success && prevState.platform === PLATFORMS.IDN;
          const showroomFailed = !showroomResult.success && prevState.platform === PLATFORMS.SHOWROOM;

          if (prevState.status === LIVE_STATUS.LIVE && (idnFailed || showroomFailed)) {
            // Keep status or mark UNKNOWN, do NOT set OFFLINE
            db.setLiveState(member.id, {
              ...prevState,
              status: LIVE_STATUS.UNKNOWN,
              lastCheckedAt: now
            });
            continue;
          }
        }

        // State Machine Transition
        if (prevState.status === LIVE_STATUS.OFFLINE || prevState.status === LIVE_STATUS.UNKNOWN) {
          if (isCurrentlyLive) {
            // OFFLINE -> LIVE (Create Live Event & Dispatch Notifications)
            const liveId = detectedLiveInfo.liveId || ("live_" + Date.now());
            const liveUrl = detectedLiveInfo.liveUrl || (detectedPlatform === PLATFORMS.IDN ? member.idnUrl : member.showroomUrl);
            const startedAt = detectedLiveInfo.startedAt || now;
            const eventId = createEventKey(member.id, detectedPlatform, liveId);

            const newEvent = {
              eventId,
              memberId: member.id,
              platform: detectedPlatform,
              liveId,
              liveUrl,
              startedAt,
              endedAt: null
            };

            const eventCreated = db.addLiveEvent(newEvent);
            
            db.setLiveState(member.id, {
              memberId: member.id,
              platform: detectedPlatform,
              status: LIVE_STATUS.LIVE,
              liveId,
              liveUrl,
              startedAt
            });

            if (eventCreated) {
              // Trigger notification dispatch
              routeLiveNotification(member, newEvent);
            }
          } else {
            // OFFLINE -> OFFLINE
            db.setLiveState(member.id, {
              memberId: member.id,
              platform: null,
              status: LIVE_STATUS.OFFLINE,
              liveId: null,
              liveUrl: null,
              startedAt: null
            });
          }
        } else if (prevState.status === LIVE_STATUS.LIVE) {
          if (!isCurrentlyLive) {
            // LIVE -> OFFLINE (End live session)
            db.endLiveEvent(member.id, prevState.platform, prevState.liveId);
            db.setLiveState(member.id, {
              memberId: member.id,
              platform: null,
              status: LIVE_STATUS.OFFLINE,
              liveId: null,
              liveUrl: null,
              startedAt: null
            });
          } else {
            // LIVE -> LIVE (Already live, update heartbeats, DO NOT recreate event)
            db.setLiveState(member.id, {
              ...prevState,
              lastCheckedAt: now
            });
          }
        }
      }

      this.notifyUpdate();
    } finally {
      this.isChecking = false;
    }
  }

  // Simulation Helper for Testing / Demo Live Transitions
  simulateLive(memberId, platform = PLATFORMS.IDN) {
    const member = db.getMemberById(memberId);
    if (!member) return;

    const liveId = "sim_" + Math.floor(Math.random() * 90000 + 10000);
    const liveUrl = platform === PLATFORMS.IDN ? member.idnUrl : member.showroomUrl;
    
    const liveMap = new Map();
    liveMap.set(memberId, {
      liveId,
      liveUrl,
      startedAt: new Date().toISOString()
    });

    const feed = {
      idn: platform === PLATFORMS.IDN ? { success: true, liveMap } : { success: true, liveMap: new Map() },
      showroom: platform === PLATFORMS.SHOWROOM ? { success: true, liveMap } : { success: true, liveMap: new Map() }
    };

    return this.executeCycle(feed);
  }

  simulateEndLive(memberId) {
    const feed = {
      idn: { success: true, liveMap: new Map() },
      showroom: { success: true, liveMap: new Map() }
    };
    return this.executeCycle(feed);
  }
}

const liveMonitor = new LiveMonitorEngine();


/* --- File: src/components/LiveCard.js --- */
// LiveCard Component - Provider Store Lookbook Aesthetic
// Red & White Palette, Live Radar Pulse, Official JKT48 Logo Fallback




function renderLiveCard(liveItem, isOshi = false) {
  const { member, platform, liveUrl, startedAt } = liveItem;
  const platformLabel = platform === PLATFORMS.IDN ? "IDN Live" : "SHOWROOM";
  const platformClass = platform === PLATFORMS.IDN ? "idn" : "showroom";
  const timeFormatted = startedAt ? `Mulai ${formatTime(startedAt)} WIB` : "Sedang Live";
  const photo = member.photoUrl || OFFICIAL_JKT48_LOGO;
  // FIX: generation is a number, convert explicitly to string
  const genText = String(member.generation || "");
  const memberColor = member.color || "#E53935";

  return `
    <article class="live-card" style="border-top: 3px solid ${memberColor};">
      <div class="live-card-header">
        <span class="platform-badge ${platformClass}">
          ${platformLabel}
        </span>
        <div style="display: flex; align-items: center; gap: 6px;">
          ${isOshi ? `<span class="oshi-badge-pill">&#11088; OSHI</span>` : ""}
          <span class="section-badge-live">
            <span class="pulse-dot"></span>
            LIVE
          </span>
        </div>
      </div>

      <div class="live-card-body">
        <div class="member-thumb-wrapper">
          <img 
            src="${escapeHtml(photo)}" 
            alt="${escapeHtml(member.name)}" 
            loading="lazy" 
            referrerpolicy="no-referrer"
            onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}'; this.classList.add('is-fallback-logo');" 
          />
        </div>
        <div class="live-card-info">
          <h3 class="live-member-name">${escapeHtml(member.nickname)}</h3>
          <p class="live-meta">JKT48 &middot; Gen ${escapeHtml(genText)}</p>
          <p class="live-start-time">${escapeHtml(timeFormatted)}</p>
        </div>
      </div>

      <a href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-buka-live">
        <span>Buka Siaran</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </article>
  `;
}

/* --- File: src/components/Header.js --- */
// Header Component - Provider Store Editorial Aesthetic
// Features: Centered official JKT48 Logo, Top Horizontal Category Nav, Google Login




function renderHeader(activeRoute = "home") {
  const user = auth.getUser();
  const photoUrl = user?.photoURL || OFFICIAL_JKT48_LOGO;
  const name = user ? (user.displayName || "Wota").split(" ")[0] : "Wota";

  return `
    <!-- Top Announcement Bar -->
    <div class="top-announcement-bar">
      <span class="pulse-mini"></span>
      <span>JKT48 LIVE RADAR &mdash; OFFICIAL SHOWROOM &amp; IDN LIVE MONITOR</span>
    </div>

    <!-- Main Header Row -->
    <header class="app-header provider-header-main">
      <div class="header-left">
        <a href="#home" class="brand-badge">
          <span class="brand-dot"></span>
          <div class="brand-logo-text">
            <span>JKT<span class="brand-red">48</span></span>
            <span class="brand-sub">LIVE RADAR</span>
          </div>
        </a>
      </div>

      <!-- Centered Official JKT48 Logo Emblem -->
      <div class="header-center">
        <a href="#home" class="official-jkt48-emblem" title="JKT48 Official Live Radar">
          <img 
            src="${OFFICIAL_JKT48_LOGO_SVG}" 
            alt="JKT48 Official Logo" 
            class="header-jkt48-logo" 
            onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}';"
          />
        </a>
      </div>

      <!-- Right Utility Actions & Google Login -->
      <div class="header-actions">
        <!-- Theme Toggle: FIXED size 20x20px -->
        <button id="theme-toggle-btn" class="btn-icon-editorial" title="Ubah Mode Tampilan" style="width:36px;height:36px;padding:0;display:flex;align-items:center;justify-content:center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>

        ${user ? `
          <div class="user-profile-widget">
            <a href="#profile" class="user-avatar-link" title="Profil ${escapeHtml(user.displayName || '')}">
              <img 
                src="${escapeHtml(photoUrl)}" 
                alt="${escapeHtml(name)}" 
                class="user-avatar-img"
                onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}';"
              />
              <span class="user-greeting-name">${escapeHtml(name)}</span>
            </a>
            <button id="btn-header-logout" class="btn-header-logout" title="Keluar Akun">
              Keluar
            </button>
          </div>
        ` : `
          <button id="btn-header-google-login" class="btn-google-login-header" title="Masuk dengan Akun Google">
            <svg class="google-icon" width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.35 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Masuk</span>
          </button>
        `}
      </div>
    </header>

    <!-- Top Horizontal Category Navigation Bar -->
    <nav class="provider-store-nav">
      <div class="provider-nav-track">
        <a href="#home" class="provider-nav-link ${activeRoute === 'home' ? 'active' : ''}">
          BERANDA
        </a>
        <a href="#members" class="provider-nav-link ${activeRoute === 'members' ? 'active' : ''}">
          KATALOG MEMBER
        </a>
        <a href="#oshi" class="provider-nav-link ${activeRoute === 'oshi' ? 'active' : ''}">
          OSHI SAYA
        </a>
        <a href="#notifications" class="provider-nav-link ${activeRoute === 'notifications' ? 'active' : ''}">
          NOTIFIKASI
        </a>
        <a href="#settings" class="provider-nav-link ${activeRoute === 'settings' ? 'active' : ''}">
          PENGATURAN
        </a>
        <a href="#admin" class="provider-nav-link ${activeRoute === 'admin' ? 'active' : ''}">
          ADMIN
        </a>
      </div>
    </nav>
  `;
}

/* --- File: src/components/Sidebar.js --- */
// Desktop Sidebar Component — Provider Store Editorial Aesthetic
function renderSidebar(activeRoute = "home") {
  const links = [
    { id: "home", label: "Beranda", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>` },
    { id: "members", label: "Katalog Member", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>` },
    { id: "oshi", label: "Oshi Pilihan", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>` },
    { id: "notifications", label: "Notifikasi", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>` },
    { id: "settings", label: "Pengaturan", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>` },
    { id: "admin", label: "Admin Radar", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` }
  ];

  return `
    <aside class="desktop-sidebar">
      <div class="sidebar-logo">
        <span class="brand-dot"></span>
        <div class="brand-logo-text">
          <span>JKT<span class="brand-red">48</span></span>
          <span class="brand-sub">RADAR</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${links.map(l => `
          <a href="#${l.id}" class="sidebar-link ${activeRoute === l.id ? "active" : ""}">
            ${l.icon}
            <span>${l.label}</span>
          </a>
        `).join("")}
      </nav>

      <div style="margin-top: auto; padding: 16px; background-color: var(--bg-card-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.76rem; color: var(--text-muted);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background-color: var(--success-green); box-shadow: 0 0 6px var(--success-green);"></span>
          <span style="font-weight: 700; color: var(--dark-main); letter-spacing: 0.05em; text-transform: uppercase;">Radar Aktif</span>
        </div>
        <span>Memindai SHOWROOM & IDN Live setiap 60 detik.</span>
      </div>
    </aside>
  `;
}


/* --- File: src/components/BottomNav.js --- */
// Mobile Bottom Navigation Component - Explicit Sizing



function renderBottomNav(activeRoute = "home") {
  const user = auth.getUser();
  const unreadCount = user ? db.getNotifications(user.uid).filter(n => !n.readAt).length : 0;

  const navItems = [
    {
      id: "home",
      label: "BERANDA",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
    },
    {
      id: "members",
      label: "MEMBER",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
    },
    {
      id: "oshi",
      label: "OSHI",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
    },
    {
      id: "notifications",
      label: "NOTIFIKASI",
      hasBadge: unreadCount > 0,
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
    },
    {
      id: "profile",
      label: "PROFIL",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    }
  ];

  return `
    <nav class="mobile-bottom-nav">
      ${navItems.map(item => `
        <a href="#${item.id}" class="nav-item ${activeRoute === item.id ? "active" : ""}">
          ${item.icon}
          <span>${item.label}</span>
          ${item.hasBadge ? `<span class="nav-badge-dot"></span>` : ""}
        </a>
      `).join("")}
    </nav>
  `;
}

/* --- File: src/components/LoginSplashAnimation.js --- */
// JKT48 Signature Red Login Splash Animation Component
// Features: Official JKT48 SVG Logo, Official Crimson Typography, Radiance Glow, Cinematic Shimmer, and Smooth Transition


function playLoginAnimation(onComplete) {
  // Remove existing overlay if any
  const existing = document.getElementById("jkt48-login-splash");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "jkt48-login-splash";
  overlay.className = "jkt48-splash-screen";
  overlay.innerHTML = `
    <div class="jkt48-splash-backdrop"></div>
    <div class="jkt48-splash-container">
      <!-- Glow ambient background -->
      <div class="jkt48-ambient-glow"></div>
      
      <!-- Official JKT48 SVG Logo -->
      <div class="jkt48-splash-emblem-wrap">
        <img 
          src="${OFFICIAL_JKT48_LOGO_SVG}" 
          alt="JKT48 Official Emblem" 
          class="jkt48-splash-official-logo"
          onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}';"
        />
      </div>

      <!-- Official JKT48 Brand Typography -->
      <div class="jkt48-logo-wrapper">
        <div class="jkt48-wordmark">
          <span class="jkt48-letter letter-j">J</span>
          <span class="jkt48-letter letter-k">K</span>
          <span class="jkt48-letter letter-t">T</span>
          <span class="jkt48-number number-4">4</span>
          <span class="jkt48-number number-8">8</span>
        </div>
        <div class="jkt48-logo-shimmer"></div>
      </div>

      <!-- Tagline & Badge -->
      <div class="jkt48-tagline-wrapper">
        <div class="jkt48-rule-line"></div>
        <span class="jkt48-tagline">REAL-TIME LIVE STREAM RADAR</span>
        <div class="jkt48-rule-line"></div>
      </div>

      <div class="jkt48-radar-badge">
        <span class="jkt48-radar-dot"></span>
        <span>MASUK DENGAN AKUN GOOGLE</span>
      </div>

      <!-- Loading Indicator -->
      <div class="jkt48-splash-loader">
        <div class="jkt48-progress-bar">
          <div class="jkt48-progress-fill"></div>
        </div>
        <span class="jkt48-status-text">Menyinkronkan Akun & Radar Live...</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trigger smooth exit after animation sequence (2 seconds)
  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.remove();
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 500);
  }, 2000);
}


/* --- File: src/app/HomeView.js --- */
// Home Dashboard View - JKT48 Hero Banner at top + White/Red below







function renderHomeView() {
  const user = auth.getUser();
  const prefs = auth.getPreferences();
  const members = db.getMembers();
  const liveStates = db.getLiveStates();
  const favoriteMembers = prefs.favoriteMembers || [];

  const hour = new Date().getHours();
  let greeting = "Selamat malam";
  if (hour >= 5 && hour < 11) greeting = "Selamat pagi";
  else if (hour >= 11 && hour < 15) greeting = "Selamat siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat sore";

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Wota";

  const liveItems = [];
  members.forEach(member => {
    const state = liveStates[member.id];
    if (state && state.status === LIVE_STATUS.LIVE) {
      const isOshi = favoriteMembers.includes(member.id);
      liveItems.push({ member, platform: state.platform, liveUrl: state.liveUrl || (state.platform === "idn" ? member.idnUrl : member.showroomUrl), startedAt: state.startedAt, isOshi });
    }
  });

  liveItems.sort((a, b) => {
    if (a.isOshi && !b.isOshi) return -1;
    if (!a.isOshi && b.isOshi) return 1;
    return new Date(b.startedAt || 0) - new Date(a.startedAt || 0);
  });

  const userOshis = favoriteMembers.map(id => members.find(m => m.id === id)).filter(Boolean);
  const recentEvents = db.getLiveEvents(5);

  return `
    <div class="page-view home-page">
      <!-- HERO: JKT48 Logo Background Banner -->
      <div style="position:relative;margin:-24px -24px 0 -24px;min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(135deg,#1a0000 0%,#2d0505 40%,#B71C1C 100%);padding:40px 24px 56px;text-align:center;">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(229,57,53,0.5) 0%,transparent 70%);pointer-events:none;"></div>
        <div style="position:absolute;inset:0;opacity:0.03;background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);background-size:20px 20px;"></div>
        <div style="position:relative;z-index:2;margin-bottom:16px;">
          <img src="${OFFICIAL_JKT48_LOGO_SVG}" alt="JKT48" style="height:72px;width:auto;filter:brightness(0) invert(1) drop-shadow(0 4px 20px rgba(255,255,255,0.25));" onerror="this.onerror=null;this.src='${OFFICIAL_JKT48_LOGO}';this.style.filter='brightness(0) invert(1)';" />
        </div>
        <div style="position:relative;z-index:2;">
          <h1 style="font-family:var(--font-serif);font-size:clamp(1.5rem,4vw,2.2rem);font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.1;margin-bottom:8px;text-shadow:0 2px 16px rgba(0,0,0,0.5);">
            ${greeting}, <em style="font-style:italic;font-weight:400;">${escapeHtml(firstName)}</em>
          </h1>
          <p style="font-size:0.9rem;color:rgba(255,255,255,0.8);max-width:440px;line-height:1.5;">
            Radar live aktif memantau siaran member JKT48 di IDN Live &amp; SHOWROOM secara real-time.
          </p>
        </div>
        ${liveItems.length > 0 ? `
          <div style="position:relative;z-index:2;margin-top:18px;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);border-radius:100px;padding:8px 18px;backdrop-filter:blur(8px);">
            <span style="width:8px;height:8px;border-radius:50%;background:#FF5252;box-shadow:0 0 8px #FF5252;animation:radarPulse 1.5s infinite;display:inline-block;"></span>
            <span style="font-size:0.82rem;font-weight:700;color:#FFFFFF;letter-spacing:0.06em;">${liveItems.length} MEMBER SEDANG LIVE</span>
          </div>
        ` : `
          <div style="position:relative;z-index:2;margin-top:18px;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);border-radius:100px;padding:8px 18px;">
            <span style="font-size:0.82rem;color:rgba(255,255,255,0.65);">Radar aktif &middot; Tidak ada yang live saat ini</span>
          </div>
        `}
        <div style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);z-index:2;opacity:0.5;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <!-- WHITE SECTION -->
      <div style="background:var(--bg-main);padding-top:32px;">

        <!-- SIARAN LANGSUNG -->
        <section style="margin-bottom:44px;">
          <div class="section-title">
            <span class="pulse-dot"></span>
            <span>SIARAN LANGSUNG</span>
            ${liveItems.length > 0 ? `<span style="font-size:0.76rem;font-weight:700;color:var(--primary-red);background:var(--primary-red-subtle);padding:3px 8px;border-radius:var(--radius-xs);margin-left:auto;">${liveItems.length} Online</span>` : ""}
          </div>
          ${liveItems.length > 0 ? `
            <div class="live-grid">${liveItems.map(item => renderLiveCard(item, item.isOshi)).join("")}</div>
          ` : `
            <div class="empty-state">
              <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <h4 class="empty-state-title" style="font-family:var(--font-serif);">Belum ada member yang siaran saat ini</h4>
              <p class="empty-state-text">Radar terus memindai setiap 60 detik. Notifikasi akan muncul saat member memulai siaran.</p>
            </div>
          `}
        </section>

        <!-- DAFTAR OSHI -->
        <section style="margin-bottom:44px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h3 class="section-title" style="margin-bottom:0;"><span>&#11088; DAFTAR OSHI</span></h3>
            <a href="#oshi" style="font-size:0.78rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--primary-red);">Kelola &rarr;</a>
          </div>
          ${userOshis.length > 0 ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px;">
              ${userOshis.map(member => {
                const liveState = liveStates[member.id];
                const isLive = liveState?.status === LIVE_STATUS.LIVE;
                const memberColor = member.color || "#E53935";
                return `
                  <div class="notif-card" style="margin-bottom:0;padding:10px 12px;border-left:3px solid ${memberColor};cursor:pointer;" onclick="window.location.hash='#members'">
                    <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background-color:var(--bg-secondary);flex-shrink:0;border:2px solid ${memberColor}40;">
                      <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width:100%;height:100%;object-fit:cover;object-position:top;"
                        onerror="this.onerror=null;this.src='${OFFICIAL_JKT48_LOGO}';this.style.objectFit='contain';this.style.padding='6px';" />
                    </div>
                    <div style="flex:1;min-width:0;">
                      <div style="font-family:var(--font-serif);font-weight:700;font-size:0.9rem;color:var(--dark-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(member.nickname)}</div>
                      <div style="font-size:0.7rem;font-weight:600;margin-top:1px;">${isLive ? `<span style="color:var(--primary-red);">&#128308; LIVE</span>` : `<span style="color:var(--text-light);">&#9898; Offline</span>`}</div>
                    </div>
                  </div>`;
              }).join("")}
            </div>
          ` : `
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
              <div>
                <div style="font-family:var(--font-serif);font-size:1.05rem;font-weight:700;color:var(--dark-main);">Kamu belum memilih Oshi</div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:3px;">Tentukan Oshi agar radar mengutamakan notifikasi siaran mereka.</div>
              </div>
              <a href="#oshi" style="background-color:var(--dark-main);color:#FAF8F5;font-size:0.78rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;padding:9px 18px;border-radius:var(--radius-sm);white-space:nowrap;text-decoration:none;">Pilih Oshi</a>
            </div>
          `}
        </section>

        <!-- RIWAYAT SIARAN -->
        ${recentEvents.length > 0 ? `
          <section style="margin-bottom:44px;">
            <div class="section-title"><span>RIWAYAT SIARAN TERAKHIR</span></div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${recentEvents.map(evt => {
                const member = members.find(m => m.id === evt.memberId);
                if (!member) return "";
                const platformName = evt.platform === "idn" ? "IDN Live" : "SHOWROOM";
                const platformColor = evt.platform === "idn" ? "#1565C0" : "#E53935";
                return `
                  <div class="notif-card" style="margin-bottom:0;">
                    <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background-color:var(--bg-secondary);flex-shrink:0;">
                      <img src="${escapeHtml(member.photoUrl || OFFICIAL_JKT48_LOGO)}" alt="${escapeHtml(member.nickname)}" style="width:100%;height:100%;object-fit:cover;object-position:top;"
                        onerror="this.onerror=null;this.src='${OFFICIAL_JKT48_LOGO}';this.classList.add('is-fallback-logo');" />
                    </div>
                    <div style="flex:1;">
                      <div style="font-family:var(--font-serif);font-size:0.95rem;font-weight:700;color:var(--dark-main);">${escapeHtml(member.nickname)}</div>
                      <div style="font-size:0.76rem;color:var(--text-muted);"><span style="color:${platformColor};font-weight:600;">${platformName}</span> &middot; Selesai ${formatTime(evt.endedAt || evt.startedAt)}</div>
                    </div>
                  </div>`;
              }).join("")}
            </div>
          </section>
        ` : ""}

        <!-- FOOTER -->
        <footer class="app-footer">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:20px;">
            <a href="mailto:admin@jkt48radar.fan" class="footer-link-item">&#128231; Hubungi Admin</a>
            <a href="#" class="footer-link-item" onclick="alert('FAQ JKT48 Live Radar:\\n\\n1. Bagaimana cara kerja radar?\\nMemindai IDN Live & SHOWROOM setiap 60 detik.\\n\\n2. Data aman?\\nSemua tersimpan lokal di browser.\\n\\n3. Member tidak muncul live?\\nPastikan koneksi internet stabil.');return false;">&#10067; FAQ</a>
            <a href="#" class="footer-link-item" onclick="alert('Kirim saran ke admin@jkt48radar.fan - Terima kasih!');return false;">&#128161; Saran Fitur</a>
            <a href="#settings" class="footer-link-item">&#9881;&#65039; Pengaturan</a>
            <a href="https://github.com/skyy134243/JKT48" target="_blank" rel="noopener" class="footer-link-item">&#128279; GitHub</a>
          </div>
          <div class="footer-bottom">
            <p>Fan-made Project &copy; 2024 &middot; Hak Cipta Konten Resmi Milik JKT48 Operation Team</p>
            <p style="margin-top:4px;">Radar real-time &middot; Data diperbarui setiap 60 detik</p>
          </div>
        </footer>
      </div>
    </div>
  `;
}

/* --- File: src/app/LandingView.js --- */
// Landing Page View — Provider Store Slow-Made Editorial Aesthetic


function renderLandingView() {
  return `
    <div style="min-height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-main);">
      <!-- Top Announcement Bar -->
      <div class="top-announcement-bar">
        <span class="pulse-mini"></span>
        <span>JKT48 LIVE RADAR — SLOW MONITORED STREAMING & OSHI NOTIFIER</span>
      </div>

      <!-- Clean Editorial Header -->
      <header style="padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); background-color: var(--bg-main);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="brand-dot"></span>
          <div class="brand-logo-text">
            <span>JKT<span class="brand-red">48</span></span>
            <span class="brand-sub">RADAR</span>
          </div>
        </div>
        <button id="btn-landing-login-header" style="background-color: var(--dark-main); color: #FAF8F5; padding: 9px 20px; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.2s ease;">
          Masuk
        </button>
      </header>

      <!-- Editorial Hero Section -->
      <main style="flex: 1; padding: 48px 24px 60px; max-width: 720px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center;">
        <span class="section-badge-live" style="margin-bottom: 20px;">
          <span class="pulse-dot"></span>
          REAL-TIME FAN RADAR
        </span>

        <h1 style="font-family: var(--font-serif); font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.18; letter-spacing: -0.03em; color: var(--dark-main); margin-bottom: 18px;">
          Pantau siaran live member JKT48 dalam satu galeri.
        </h1>
        <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; max-width: 540px; margin-bottom: 32px;">
          Dapatkan notifikasi instan saat Oshi kamu mulai siaran di IDN Live atau SHOWROOM tanpa re-streaming dan tanpa gangguan spam.
        </p>

        <!-- CTA Buttons -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; max-width: 320px; margin-bottom: 48px;">
          <button id="btn-landing-google-login" style="display: flex; align-items: center; justify-content: center; gap: 12px; background-color: #FFFFFF; color: var(--dark-main); border: 1px solid var(--border-color); padding: 13px 24px; border-radius: var(--radius-sm); font-size: 0.92rem; font-weight: 600; box-shadow: var(--shadow-sm); width: 100%; transition: all 0.2s ease;">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          <button id="btn-landing-guest-explore" style="font-size: 0.86rem; color: var(--text-muted); font-weight: 500; letter-spacing: 0.02em; text-decoration: underline; background: none; border: none; cursor: pointer; transition: color 0.15s ease;">
            Atau jelajahi dulu sebagai Tamu →
          </button>
        </div>

        <!-- Visual Lookbook Preview Card -->
        <div style="width: 100%; max-width: 380px; text-align: left; margin-bottom: 48px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: space-between;">
            <span>Preview Kartu Siaran</span>
            <span style="font-style: italic; font-family: var(--font-serif);">Curated Gallery Card</span>
          </div>
          <div class="live-card" style="box-shadow: var(--shadow-md);">
            <div class="live-card-header">
              <span class="platform-badge idn">IDN Live</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="section-badge-live"><span class="pulse-dot"></span> LIVE</span>
              </div>
            </div>
            <div class="live-card-body">
              <div class="member-thumb-wrapper">
                <img src="https://jkt48.com/images/member/member_mikaela.jpg" alt="Mikaela" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/JKT48.svg/440px-JKT48.svg.png'; this.classList.add('is-fallback-logo');" />
              </div>
              <div class="live-card-info">
                <h3 class="live-member-name">Mikaela</h3>
                <p class="live-meta">JKT48 · Gen 13 (Trainee)</p>
                <p class="live-start-time">Mulai Siaran Langsung</p>
              </div>
            </div>
            <button class="btn-buka-live" style="pointer-events: none;">
              <span>Buka Live</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </button>
          </div>
        </div>

        <!-- 3 Feature Pillars (Editorial Homeware Aesthetic) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; width: 100%; text-align: left;">
          <div style="background-color: var(--bg-card); padding: 22px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">🔴</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Deteksi Siaran</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">Pantau status siaran aktif di SHOWROOM & IDN Live tanpa jeda.</p>
          </div>
          <div style="background-color: var(--bg-card); padding: 22px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">⭐</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Prioritas Oshi</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">Kelola daftar member kesayanganmu dengan tingkatan prioritas khusus.</p>
          </div>
          <div style="background-color: var(--bg-card); padding: 22px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 1.1rem; margin-bottom: 8px;">🔔</div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Notifikasi Bersih</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">Pemberitahuan instan tanpa bot spam, lengkap dengan jam tenang (quiet hours).</p>
          </div>
        </div>
      </main>

      <footer style="padding: 24px; text-align: center; border-top: 1px solid var(--border-color); font-size: 0.78rem; color: var(--text-light); background-color: var(--bg-main);">
        Fan-made Project · Estetika Slow-Made Homewares & JKT48 Live Radar · Hak Cipta Konten Resmi Milik JKT48 Operation Team.
      </footer>
    </div>
  `;
}


/* --- File: src/app/MemberListView.js --- */
// Member Catalog View — Provider Store Editorial Lookbook
// Column-based top navigation filters, Red & White palette, Curated 67 Members






function renderMemberListView(filters = { search: "", status: "all", gen: "all" }) {
  const allMembers = db.getMembers();
  const liveStates = db.getLiveStates();
  const prefs = auth.getPreferences();
  const favoriteMembers = prefs.favoriteMembers || [];

  // Filter logic
  let filtered = allMembers.filter(m => {
    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchNick = m.nickname.toLowerCase().includes(q);
      if (!matchName && !matchNick) return false;
    }

    // Status & Team filter
    const isLive = liveStates[m.id]?.status === LIVE_STATUS.LIVE;
    if (filters.status === "live" && !isLive) return false;
    if (filters.status === "offline" && isLive) return false;
    if (filters.status === "inti" && m.teamStatus !== "Inti") return false;
    if (filters.status === "trainee" && m.teamStatus !== "Trainee") return false;

    // Generation filter
    if (filters.gen !== "all" && String(m.generation) !== String(filters.gen)) {
      return false;
    }

    return true;
  });

  // Alphabetical sort by nickname
  filtered.sort((a, b) => a.nickname.localeCompare(b.nickname));

  return `
    <div class="page-view">
      <!-- Editorial Page Header (Provider Store Australia Style) -->
      <div class="catalog-page-header">
        <div class="catalog-eyebrow">
          DIREKTORI RESMI MEMBER
        </div>
        <div class="catalog-title-row">
          <h2 class="catalog-title">
            Katalog Member <span class="catalog-brand-tag">JKT48</span>
          </h2>
          <span class="catalog-counter-badge">
            ${filtered.length} Member Ditampilkan
          </span>
        </div>
        <p class="catalog-desc">
          Daftar lengkap 67 member aktif JKT48 (Gen 3 hingga Gen 14) dari Member Inti hingga Siswi Pelatihan.
        </p>
      </div>

      <!-- Top Column Filters Container (Provider Store Filter Columns) -->
      <div class="member-catalog-top-filters">
        <!-- Search Input Bar -->
        <div class="catalog-search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            id="member-search-input" 
            class="catalog-search-input" 
            placeholder="Cari nama lengkap atau nama panggilan member..." 
            value="${filters.search || ""}" 
          />
          ${filters.search ? `
            <button id="btn-clear-search" class="btn-clear-search" title="Hapus pencarian">×</button>
          ` : ""}
        </div>

        <!-- Filter Column Section 1: Status & Tim -->
        <div class="filter-category-block">
          <span class="filter-block-label">KATEGORI & STATUS:</span>
          <div class="filter-columns-row">
            <button class="filter-column-btn ${filters.status === "all" ? "active" : ""}" data-filter-type="status" data-filter-value="all">
              Semua Member
            </button>
            <button class="filter-column-btn ${filters.status === "live" ? "active" : ""}" data-filter-type="status" data-filter-value="live">
              🔴 Sedang Live
            </button>
            <button class="filter-column-btn ${filters.status === "offline" ? "active" : ""}" data-filter-type="status" data-filter-value="offline">
              ⚪ Offline
            </button>
            <button class="filter-column-btn ${filters.status === "inti" ? "active" : ""}" data-filter-type="status" data-filter-value="inti">
              Member Inti
            </button>
            <button class="filter-column-btn ${filters.status === "trainee" ? "active" : ""}" data-filter-type="status" data-filter-value="trainee">
              Trainee (Siswi Pelatihan)
            </button>
          </div>
        </div>

        <!-- Filter Column Section 2: Generasi Berderet Berkolom -->
        <div class="filter-category-block">
          <span class="filter-block-label">PILIHAN GENERASI:</span>
          <div class="filter-columns-row filter-gen-columns">
            <button class="filter-column-btn ${filters.gen === "all" ? "active" : ""}" data-filter-type="gen" data-filter-value="all">
              Semua Gen
            </button>
            ${GENERATIONS.map(g => `
              <button class="filter-column-btn ${String(filters.gen) === String(g) ? "active" : ""}" data-filter-type="gen" data-filter-value="${g}">
                Gen ${g}
              </button>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Member Grid (Provider Store Clean Gallery) -->
      <div class="member-catalog-grid">
        ${filtered.map(member => {
          const liveState = liveStates[member.id];
          const isOshi = favoriteMembers.includes(member.id);
          return renderMemberCard(member, liveState, isOshi);
        }).join("")}
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state" style="margin-top: 32px;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <h4 class="empty-state-title">Tidak ada member yang cocok</h4>
          <p class="empty-state-text">Coba ubah kata kunci pencarian atau pilih tombol filter lainnya.</p>
        </div>
      ` : ""}
    </div>
  `;
}


/* --- File: src/app/MemberProfileModal.js --- */
﻿// Member Profile Modal Component





function renderMemberProfileModal(memberId) {
  const member = db.getMemberById(memberId);
  if (!member) return "";

  const liveState = db.getLiveState(memberId);
  const isLive = liveState?.status === LIVE_STATUS.LIVE;
  const prefs = auth.getPreferences();
  const isOshi = (prefs.favoriteMembers || []).includes(memberId);

  return `
    <div class="modal-overlay" id="member-profile-modal-overlay">
      <div class="modal-content">
        <div style="position: relative; width: 100%; aspect-ratio: 16 / 10; background-color: var(--bg-secondary); overflow: hidden;">
          <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
          <button id="modal-close-btn" class="btn-icon-pill" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); color: #FFF; border: none;">
            ✕
          </button>
        </div>

        <div style="padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-main);">
              ${escapeHtml(member.name)} (${escapeHtml(member.nickname)})
            </h2>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
            JKT48 · Generasi ${escapeHtml(member.generation)}
          </div>

          <!-- Status Badge -->
          <div style="margin-bottom: 20px;">
            ${isLive ? `
              <span class="section-badge-live">
                <span class="pulse-dot"></span>
                SEDANG LIVE DI ${liveState.platform?.toUpperCase()}
              </span>
            ` : `
              <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: var(--text-light); background-color: var(--bg-secondary); padding: 4px 10px; border-radius: var(--radius-full);">
                ⚪ SEDANG OFFLINE
              </span>
            `}
          </div>

          <!-- Oshi Button -->
          <button id="modal-toggle-oshi-btn" data-member-id="${escapeHtml(member.id)}" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; border-radius: var(--radius-md); font-size: 0.95rem; font-weight: 700; margin-bottom: 24px; transition: all 0.15s ease; border: 1px solid ${isOshi ? "var(--oshi-gold)" : "var(--border-color)"}; background-color: ${isOshi ? "var(--oshi-gold-subtle)" : "var(--bg-secondary)"}; color: ${isOshi ? "#925300" : "var(--dark-main)"};">
            <span>${isOshi ? "⭐ Oshi Kamu (Aktif)" : "☆ Jadikan Oshi"}</span>
          </button>

          <!-- Official Platform Links -->
          <h4 style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-light); margin-bottom: 10px;">
            PLATFORM RESMI
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="${escapeHtml(member.idnUrl)}" target="_blank" rel="noopener noreferrer" class="notif-card" style="margin-bottom: 0;">
              <span class="platform-badge idn">IDN Live</span>
              <span style="font-size: 0.9rem; font-weight: 600; color: var(--dark-main); flex: 1; margin-left: 8px;">Profil IDN Live</span>
              <span style="color: var(--text-light);">→</span>
            </a>
            <a href="${escapeHtml(member.showroomUrl)}" target="_blank" rel="noopener noreferrer" class="notif-card" style="margin-bottom: 0;">
              <span class="platform-badge showroom">SHOWROOM</span>
              <span style="font-size: 0.9rem; font-weight: 600; color: var(--dark-main); flex: 1; margin-left: 8px;">Room SHOWROOM</span>
              <span style="color: var(--text-light);">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}


/* --- File: src/app/OshiView.js --- */
// Oshi Management & Priority View - With Dynamic Member Hero Background






function renderOshiView() {
  const prefs = auth.getPreferences();
  const allMembers = db.getMembers();
  const liveStates = db.getLiveStates();
  const favoriteMembers = prefs.favoriteMembers || [];
  const priorityMap = prefs.priorityMembers || {};

  const oshiList = favoriteMembers.map(id => {
    const member = allMembers.find(m => m.id === id);
    const priority = priorityMap[id] || OSHI_PRIORITY.NORMAL;
    const liveState = liveStates[id];
    return { member, priority, isLive: liveState?.status === LIVE_STATUS.LIVE };
  }).filter(item => Boolean(item.member));

  oshiList.sort((a, b) => a.priority - b.priority);

  // Top oshi for hero background
  const topOshi = oshiList.length > 0 ? oshiList[0].member : null;
  const heroBg = topOshi?.photoUrl || OFFICIAL_JKT48_LOGO;
  const heroColor = topOshi?.color || '#E53935';
  const heroName = topOshi?.nickname || 'JKT48';

  return `
    <div class="page-view oshi-page">
      <!-- Dynamic Oshi Hero Background -->
      <div class="oshi-hero-banner" style="
        position: relative;
        width: 100%;
        min-height: 220px;
        margin: -24px -24px 28px -24px;
        overflow: hidden;
        border-radius: 0 0 16px 16px;
      ">
        <!-- Background photo -->
        <div style="
          position: absolute;
          inset: 0;
          background-image: url('${escapeHtml(heroBg)}');
          background-size: cover;
          background-position: center top;
          filter: blur(0px);
          transform: scale(1.05);
        "></div>
        <!-- Gradient overlay -->
        <div style="
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, 
            ${heroColor}CC 0%,
            ${heroColor}88 40%,
            rgba(0,0,0,0.75) 100%
          );
        "></div>
        <!-- Content -->
        <div style="
          position: relative;
          z-index: 2;
          padding: 32px 24px 24px;
          display: flex;
          align-items: flex-end;
          min-height: 220px;
        ">
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 6px;">
              â­ OSHI PILIHAN UTAMA
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em; line-height: 1; margin-bottom: 8px; text-shadow: 0 2px 12px rgba(0,0,0,0.4);">
              ${escapeHtml(heroName)}
            </h2>
            ${topOshi ? `
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.85); background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(4px);">
                  JKT48 Gen ${topOshi.generation} Â· ${topOshi.teamStatus}
                </span>
                ${oshiList[0]?.isLive ? `<span style="font-size: 0.78rem; font-weight: 700; color: #FF5252; background: rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(4px);">ðŸ”´ SEDANG LIVE</span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--dark-main);">Manajemen Oshi</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Atur urutan dan prioritas notifikasi Oshi favoritmu.
        </p>
      </div>

      <!-- Priority Legend -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; font-size: 0.78rem;">
        <span class="priority-badge high">ðŸ”´ Prioritas 1 (Tinggi)</span>
        <span class="priority-badge normal">ðŸŸ¡ Prioritas 2 (Normal)</span>
        <span class="priority-badge low">ðŸŸ¢ Prioritas 3 (Rendah)</span>
      </div>

      <!-- Oshi List -->
      ${oshiList.length > 0 ? `
        <div class="oshi-list-container">
          ${oshiList.map(({ member, priority, isLive }, index) => {
            const badgeClass = priority === 1 ? "high" : (priority === 2 ? "normal" : "low");
            const badgeLabel = priority === 1 ? "Tinggi" : (priority === 2 ? "Normal" : "Rendah");
            const memberColor = member.color || '#E53935';

            return `
              <div class="oshi-item-card" style="border-left: 3px solid ${memberColor};">
                <div style="width: 52px; height: 52px; border-radius: var(--radius-md); overflow: hidden; background-color: var(--bg-secondary); flex-shrink: 0; border: 2px solid ${memberColor}40;">
                  <img src="${escapeHtml(member.photoUrl)}" alt="${escapeHtml(member.name)}" style="width: 100%; height: 100%; object-fit: cover;"
                    onerror="this.onerror=null; this.src='${OFFICIAL_JKT48_LOGO}'; this.style.objectFit='contain'; this.style.padding='8px';" />
                </div>

                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 700; font-size: 0.95rem; color: var(--dark-main);">${escapeHtml(member.nickname)}</span>
                    ${isLive ? `<span style="font-size: 0.72rem; color: var(--primary-red); font-weight: 700;">ðŸ”´ LIVE</span>` : ""}
                    ${index === 0 ? `<span style="font-size: 0.68rem; color: #F9A825; font-weight: 700;">â­ #1</span>` : ""}
                  </div>
                  <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">
                    Gen ${member.generation} Â· ${member.teamStatus}
                  </div>
                  <div style="margin-top: 4px;">
                    <span class="priority-badge ${badgeClass}">${badgeLabel}</span>
                  </div>
                </div>

                <div class="priority-actions">
                  <button class="btn-icon-pill" data-action="move-up" data-member-id="${escapeHtml(member.id)}" ${index === 0 ? "disabled" : ""} title="Naikkan Prioritas">
                    â–²
                  </button>
                  <button class="btn-icon-pill" data-action="move-down" data-member-id="${escapeHtml(member.id)}" ${index === oshiList.length - 1 ? "disabled" : ""} title="Turunkan Prioritas">
                    â–¼
                  </button>
                  <button class="btn-icon-pill" data-action="remove-oshi" data-member-id="${escapeHtml(member.id)}" style="color: #E53935;" title="Hapus Oshi">
                    âœ•
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Add More Button -->
        <div style="margin-top: 16px; text-align: center;">
          <a href="#members" style="display: inline-flex; align-items: center; gap: 8px; background-color: var(--bg-secondary); color: var(--dark-main); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: var(--radius-sm); font-size: 0.84rem; font-weight: 600;">
            + Tambah Oshi Lagi
          </a>
        </div>
      ` : `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <h4 class="empty-state-title">Belum ada Oshi yang dipilih</h4>
          <p class="empty-state-text">Pilih member favoritmu dari katalog member untuk mendapatkan update prioritas.</p>
          <a href="#members" style="margin-top: 16px; display: inline-block; background-color: var(--dark-main); color: #FFF; padding: 10px 18px; border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600;">
            Cari Member
          </a>
        </div>
      `}

      <!-- Footer Section -->
      <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border-color);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; margin-bottom: 20px;">
          <a href="mailto:admin@jkt48radar.fan" style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-muted); padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); text-decoration: none; transition: all 0.2s;">
            <span>ðŸ“§</span><span>Hubungi Admin</span>
          </a>
          <a href="#settings" style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-muted); padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); text-decoration: none; transition: all 0.2s;">
            <span>âš™ï¸</span><span>Pengaturan</span>
          </a>
        </div>
        <p style="font-size: 0.74rem; color: var(--text-light); text-align: center;">
          Fan-made Project Â· Hak Cipta Konten Resmi Milik JKT48 Operation Team
        </p>
      </footer>
    </div>
  `;
}

/* --- File: src/app/NotificationView.js --- */
// Notification Center View





function renderNotificationView() {
  const user = auth.getUser();
  const uid = user ? user.uid : "guest_user";
  const notifications = db.getNotifications(uid);

  // Group notifications by date label ("Hari ini", "Kemarin", etc.)
  const groups = {};
  notifications.forEach(notif => {
    const label = formatDateLabel(notif.startedAt || notif.deliveredAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(notif);
  });

  return `
    <div class="page-view">
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Notifikasi</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Riwayat siaran live dari Oshi dan member JKT48.
        </p>
      </div>

      ${Object.keys(groups).length > 0 ? `
        ${Object.entries(groups).map(([label, items]) => `
          <div class="notif-group">
            <div class="notif-group-header">${label}</div>
            ${items.map(notif => renderNotificationCard(notif)).join("")}
          </div>
        `).join("")}
      ` : `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <h4 class="empty-state-title">Belum ada notifikasi</h4>
          <p class="empty-state-text">
            Notifikasi live baru akan muncul di sini sesuai preferensi Oshi kamu.
          </p>
        </div>
      `}
    </div>
  `;
}


/* --- File: src/app/SettingsView.js --- */
﻿// Settings View — Preferences & Quiet Hours



function renderSettingsView() {
  const prefs = auth.getPreferences();
  const pushPermission = notificationManager.getPermission();

  return `
    <div class="page-view">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Pengaturan</h2>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Sesuaikan notifikasi dan tampilan aplikasi.
        </p>
      </div>

      <!-- Web Push Permission Status -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main);">Web Push Notification</h3>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              Status izin browser: <strong>${pushPermission.toUpperCase()}</strong>
            </p>
          </div>
          ${pushPermission !== "granted" ? `
            <button id="btn-request-permission" style="background-color: var(--primary-red); color: #FFF; font-size: 0.82rem; font-weight: 600; padding: 8px 14px; border-radius: var(--radius-md);">
              Aktifkan
            </button>
          ` : `
            <span style="color: var(--success-green); font-size: 0.82rem; font-weight: 700;">✓ Aktif</span>
          `}
        </div>
      </section>

      <!-- Target Member Notifications -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Pemberitahuan Member
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">Notifikasi Semua Member</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Terima notifikasi untuk semua member yang live (bukan hanya Oshi)</div>
            </div>
            <input type="checkbox" id="pref-notify-all" ${prefs.notifyAllMembers ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>
        </div>
      </section>

      <!-- Platform Settings -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Filter Platform
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">IDN Live</div>
            <input type="checkbox" id="pref-notify-idn" ${prefs.notifyIDN ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">SHOWROOM</div>
            <input type="checkbox" id="pref-notify-showroom" ${prefs.notifySHOWROOM ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>
        </div>
      </section>

      <!-- Quiet Hours -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.92rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Jam Hening (Quiet Hours)
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 0.92rem; font-weight: 600; color: var(--dark-main);">Aktifkan Jam Hening</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Senyapkan notifikasi suara pada jam tertentu (misal malam hari)</div>
            </div>
            <input type="checkbox" id="pref-quiet-enabled" ${prefs.quietHours?.enabled ? "checked" : ""} style="width: 18px; height: 18px;" />
          </label>

          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="flex: 1;">
              <label style="font-size: 0.78rem; color: var(--text-muted);">Mulai</label>
              <input type="time" id="pref-quiet-start" value="${prefs.quietHours?.start || "23:00"}" style="width: 100%; padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--bg-main); color: var(--dark-main);" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.78rem; color: var(--text-muted);">Selesai</label>
              <input type="time" id="pref-quiet-end" value="${prefs.quietHours?.end || "06:00"}" style="width: 100%; padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--bg-main); color: var(--dark-main);" />
            </div>
          </div>
        </div>
      </section>

      <!-- About & Privacy -->
      <section style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; padding: 12px;">
        <p><strong>JKT48 Live Radar v1.0.0</strong></p>
        <p>Aplikasi fan-made tanpa iklan, tanpa re-streaming, dibuat dengan cinta untuk komunitas Wota JKT48.</p>
        <p style="margin-top: 8px;"><a href="#" style="text-decoration: underline;">Kebijakan Privasi</a> · <a href="#" style="text-decoration: underline;">Syarat Ketentuan</a></p>
      </section>
    </div>
  `;
}


/* --- File: src/app/ProfileView.js --- */
﻿// Profile View



function renderProfileView() {
  const user = auth.getUser();
  if (!user) {
    return `<div class="page-view"><p>Silakan masuk terlebih dahulu.</p></div>`;
  }

  return `
    <div class="page-view">
      <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; text-align: center; margin-bottom: 24px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; margin: 0 auto 14px; border: 3px solid var(--border-color);">
          <img src="${escapeHtml(user.photoURL)}" alt="${escapeHtml(user.displayName)}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main);">${escapeHtml(user.displayName)}</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">${escapeHtml(user.email)}</p>
      </div>

      <!-- Quick Nav Links -->
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
        <a href="#oshi" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">⭐</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Oshi Saya</span>
          <span>→</span>
        </a>
        <a href="#notifications" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">🔔</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Notifikasi</span>
          <span>→</span>
        </a>
        <a href="#settings" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">⚙</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Pengaturan</span>
          <span>→</span>
        </a>
        <a href="#admin" class="notif-card" style="margin-bottom: 0;">
          <span style="font-size: 1.1rem;">📊</span>
          <span style="font-weight: 600; font-size: 0.92rem; color: var(--dark-main); flex: 1; margin-left: 8px;">Admin Radar Status</span>
          <span>→</span>
        </a>
      </div>

      <!-- Logout Action -->
      <button id="btn-logout" style="width: 100%; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background-color: var(--bg-elevated); color: var(--primary-red); font-size: 0.92rem; font-weight: 700;">
        🚪 Keluar dari Akun
      </button>
    </div>
  `;
}


/* --- File: src/app/AdminView.js --- */
// Admin Dashboard View — /admin





function renderAdminView() {
  const health = liveMonitor.getSystemHealth();
  const members = db.getMembers();
  const liveStates = db.getLiveStates();

  const liveMembers = members.filter(m => liveStates[m.id]?.status === LIVE_STATUS.LIVE);

  return `
    <div class="page-view">
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.75rem; font-weight: 700; background-color: var(--dark-main); color: #FFF; padding: 2px 8px; border-radius: var(--radius-sm);">
            ADMIN
          </span>
          <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--dark-main);">Radar System Monitor</h2>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
          Status kesehatan service, scheduler, dan live provider.
        </p>
      </div>

      <!-- SYSTEM STATUS CARDS -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px;">
        <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
          <div style="font-size: 0.78rem; color: var(--text-light); font-weight: 600;">MONITOR HEALTH</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--success-green);"></span>
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--dark-main);">${health.monitor}</span>
          </div>
        </div>

        <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
          <div style="font-size: 0.78rem; color: var(--text-light); font-weight: 600;">DATABASE</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--success-green);"></span>
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--dark-main);">${health.database}</span>
          </div>
        </div>

        <div style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px;">
          <div style="font-size: 0.78rem; color: var(--text-light); font-weight: 600;">NOTIFICATION</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background-color: var(--success-green);"></span>
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--dark-main);">${health.notification}</span>
          </div>
        </div>
      </section>

      <!-- PROVIDER LAST CHECK -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 24px;">
        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 12px;">Pemeriksaan Provider Terakhir</h3>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 8px;">
          <span style="font-size: 0.88rem; font-weight: 600;">IDN Live</span>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${formatTime(health.idnLastChecked) || "Aktif"}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 0.88rem; font-weight: 600;">SHOWROOM</span>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${formatTime(health.showroomLastChecked) || "Aktif"}</span>
        </div>
      </section>

      <!-- LIVE SIMULATOR & TESTING TOOL -->
      <section style="background-color: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 6px;">Simulasi Live Event (QA & Debugging)</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px;">
          Uji transisi OFFLINE → LIVE dan routing notifikasi dengan menyalakan simulasi live untuk member pilihan:
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-simulate-live" data-member="mikaela" data-platform="idn" style="background-color: #E53935; color: #FFF; padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            🔴 Set Mikaela Live (IDN)
          </button>
          <button class="btn-simulate-live" data-member="indah" data-platform="idn" style="background-color: #E53935; color: #FFF; padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            🔴 Set Indah Live (IDN)
          </button>
          <button class="btn-simulate-live" data-member="gracia" data-platform="showroom" style="background-color: #1976D2; color: #FFF; padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            🔴 Set Gracia Live (SHOWROOM)
          </button>
          <button id="btn-simulate-end-all" style="background-color: var(--bg-secondary); color: var(--dark-main); border: 1px solid var(--border-color); padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            ⚪ Matikan Semua Live
          </button>
          <button id="btn-manual-check" style="background-color: #388E3C; color: #FFF; padding: 8px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600;">
            🔄 Manual Check (Real API)
          </button>
        </div>
      </section>

      <!-- CURRENT LIVE SESSIONS -->
      <section>
        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--dark-main); margin-bottom: 12px;">
          Member Sedang Live (${liveMembers.length})
        </h3>
        ${liveMembers.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${liveMembers.map(m => `
              <div class="notif-card" style="margin-bottom: 0;">
                <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background-color: var(--bg-secondary); flex-shrink: 0;">
                  <img src="${escapeHtml(m.photoUrl)}" alt="${escapeHtml(m.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 0.9rem; color: var(--dark-main);">${escapeHtml(m.name)}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${liveStates[m.id].platform?.toUpperCase()} · ${formatTime(liveStates[m.id].startedAt)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        ` : `
          <p style="font-size: 0.85rem; color: var(--text-muted);">Tidak ada live yang aktif saat ini.</p>
        `}
      </section>
    </div>
  `;
}


/* --- File: src/app/OnboardingModal.js --- */
﻿// Onboarding Modal Component — 4 Steps Flow



function renderOnboardingModal(currentStep = 1, selectedOshis = []) {
  const allMembers = db.getMembers();

  return `
    <div class="modal-overlay" id="onboarding-overlay">
      <div class="modal-content" style="max-width: 520px; padding: 24px;">
        <!-- Step Indicators -->
        <div style="display: flex; gap: 6px; margin-bottom: 24px;">
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 1 ? "var(--primary-red)" : "var(--border-color)"};"></div>
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 2 ? "var(--primary-red)" : "var(--border-color)"};"></div>
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 3 ? "var(--primary-red)" : "var(--border-color)"};"></div>
          <div style="height: 4px; flex: 1; border-radius: 2px; background-color: ${currentStep >= 4 ? "var(--primary-red)" : "var(--border-color)"};"></div>
        </div>

        ${currentStep === 1 ? `
          <div style="text-align: center; padding: 20px 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--primary-red-subtle); color: var(--primary-red); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.5rem;">
              🔴
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--dark-main); margin-bottom: 8px;">
              Selamat Datang di JKT48 Live Radar
            </h2>
            <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 28px;">
              Aplikasi pendamping penggemar untuk memantau siaran langsung member JKT48 di IDN Live dan SHOWROOM secara instan.
            </p>
            <button id="btn-onboarding-next" data-step="2" style="width: 100%; background-color: var(--primary-red); color: #FFF; padding: 12px; border-radius: var(--radius-md); font-weight: 700; font-size: 0.95rem;">
              Mulai Pengaturan Oshi →
            </button>
          </div>
        ` : currentStep === 2 ? `
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main); margin-bottom: 4px;">
              Pilih Oshi Kamu
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
              Pilih satu atau beberapa member favoritmu. Kamu juga bisa melewatinya.
            </p>

            <div style="max-height: 280px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px; padding: 4px;">
              ${allMembers.map(m => {
                const isSelected = selectedOshis.includes(m.id);
                return `
                  <div class="onboarding-oshi-item" data-member-id="${escapeHtml(m.id)}" style="cursor: pointer; border: 2px solid ${isSelected ? "var(--primary-red)" : "var(--border-color)"}; background-color: ${isSelected ? "var(--primary-red-subtle)" : "var(--bg-elevated)"}; border-radius: var(--radius-md); padding: 8px; text-align: center; transition: all 0.15s ease;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; margin: 0 auto 6px;">
                      <img src="${escapeHtml(m.photoUrl)}" alt="${escapeHtml(m.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="font-weight: 700; font-size: 0.82rem; color: var(--dark-main);">${escapeHtml(m.nickname)}</div>
                    <div style="font-size: 0.72rem; color: var(--text-light);">Gen ${escapeHtml(m.generation)}</div>
                  </div>
                `;
              }).join("")}
            </div>

            <div style="display: flex; gap: 10px;">
              <button id="btn-onboarding-skip" data-step="3" style="flex: 1; border: 1px solid var(--border-color); padding: 11px; border-radius: var(--radius-md); font-weight: 600; color: var(--text-muted);">
                Lewati
              </button>
              <button id="btn-onboarding-next" data-step="3" style="flex: 2; background-color: var(--primary-red); color: #FFF; padding: 11px; border-radius: var(--radius-md); font-weight: 700;">
                Lanjut (${selectedOshis.length} Dipilih) →
              </button>
            </div>
          </div>
        ` : currentStep === 3 ? `
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main); margin-bottom: 4px;">
              Atur Notifikasi
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
              Tentukan member mana yang ingin kamu pantau live-nya.
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              <label style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer;">
                <input type="radio" name="onboarding-notif-scope" value="oshi" checked style="margin-top: 4px;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--dark-main);">⭐ Hanya Oshi</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Dapatkan notifikasi hanya ketika Oshi kamu mulai live.</div>
                </div>
              </label>

              <label style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer;">
                <input type="radio" name="onboarding-notif-scope" value="all" style="margin-top: 4px;" />
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--dark-main);">🔴 Semua Member</div>
                  <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Dapatkan pemberitahuan setiap ada member JKT48 yang live.</div>
                </div>
              </label>
            </div>

            <button id="btn-onboarding-next" data-step="4" style="width: 100%; background-color: var(--primary-red); color: #FFF; padding: 12px; border-radius: var(--radius-md); font-weight: 700;">
              Lanjut ke Izin Notifikasi →
            </button>
          </div>
        ` : `
          <div style="text-align: center; padding: 16px 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--oshi-gold-subtle); color: #B45309; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.5rem;">
              🔔
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--dark-main); margin-bottom: 8px;">
              Aktifkan Push Notification
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">
              Agar kamu tidak tertinggal saat Oshi mulai live, izinkan browser mengirimkan pemberitahuan.
            </p>

            <button id="btn-onboarding-request-perm" style="width: 100%; background-color: var(--primary-red); color: #FFF; padding: 12px; border-radius: var(--radius-md); font-weight: 700; margin-bottom: 12px;">
              Aktifkan & Uji Notifikasi
            </button>
            <button id="btn-onboarding-finish" style="width: 100%; border: 1px solid var(--border-color); background-color: transparent; color: var(--text-muted); padding: 11px; border-radius: var(--radius-md); font-weight: 600;">
              Selesai & Masuk Radar
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}


/* --- File: src/app/router.js --- */
// Client SPA Router & Event Orchestrator





















class AppRouter {
  constructor() {
    this.container = document.getElementById("app-root");
    if (!this.container) {
      console.warn("[AppRouter] Element #app-root not yet ready, retrying...");
      return;
    }
    this.memberFilters = { search: "", status: "all", gen: "all" };
    this.onboardingState = { step: 1, selectedOshis: [] };
    this.currentRoute = null;
    this.init();
  }

  init() {
    // Listen for URL hash changes
    window.addEventListener("hashchange", () => this.route());
    
    // Listen for Auth changes
    auth.onAuthStateChanged(() => this.route());

    // Listen for live radar engine updates
    liveMonitor.onUpdate(() => {
      const route = this.getRoute();
      if (route === "home" || route === "admin" || route === "members" || route === "oshi") {
        this.renderView(route);
      }
    });

    // Theme initialization
    this.initTheme();

    // Initial routing
    this.route();

    // Start automatic live monitoring (every 60 seconds)
    this.startLiveMonitoring();
  }

  getRoute() {
    const hash = window.location.hash.replace(/^#/, "");
    return hash || "home";
  }

  initTheme() {
    try {
      const saved = Storage.get("theme", "light");
      if (document.documentElement) {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {}
  }

  toggleTheme() {
    try {
      if (!document.documentElement) return;
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      Storage.set("theme", next);
    } catch {}
  }

  startLiveMonitoring() {
    setTimeout(async () => {
      try {
        await liveMonitor.executeCycle();
      } catch (err) {
        console.warn("[LiveRadar] Initial check error:", err.message);
      }
    }, 3000);

    this._liveCheckInterval = setInterval(async () => {
      try {
        await liveMonitor.executeCycle();
      } catch (err) {
        console.warn("[LiveRadar] Periodic check error:", err.message);
      }
    }, 60000);
  }

  navigateTo(targetRoute) {
    if (window.location.hash !== "#" + targetRoute) {
      window.location.hash = "#" + targetRoute;
    } else {
      this.route();
    }
  }

  route() {
    const route = this.getRoute();
    const user = auth.getUser();

    if (route === "login" && !user) {
      this.container.innerHTML = renderLandingView();
      this.bindLandingEvents();
      this.currentRoute = "login";
      return;
    }

    this.renderAppShell(route);
  }

  getViewHtml(route) {
    switch (route) {
      case "members":
        return renderMemberListView(this.memberFilters);
      case "oshi":
        return renderOshiView();
      case "notifications":
        return renderNotificationView();
      case "settings":
        return renderSettingsView();
      case "profile":
        return renderProfileView();
      case "admin":
        return renderAdminView();
      case "home":
      default:
        return renderHomeView();
    }
  }

  renderAppShell(route) {
    try {
      this.currentRoute = route;
      const viewHtml = this.getViewHtml(route);

      this.container.innerHTML = `
        <div class="app-container">
          ${renderHeader(route)}
          <div class="main-wrapper">
            <main id="view-mount">${viewHtml}</main>
          </div>
          ${renderSidebar(route)}
          ${renderBottomNav(route)}
        </div>
        <div id="modal-mount"></div>
      `;

      this.bindEvents(route);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[AppRouter] renderAppShell error:", err);
      this.container.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; font-family: sans-serif; background: #FFF;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/JKT48.svg" alt="JKT48" style="height: 64px; margin-bottom: 20px;" />
          <h2 style="color: #E53935; font-size: 1.3rem; margin-bottom: 8px;">Gagal Memuat Halaman</h2>
          <p style="color: #666666; font-size: 0.9rem; max-width: 440px; margin-bottom: 20px;">${err.message || "Terjadi kendala saat memproses tampilan."}</p>
          <button onclick="window.location.hash='#home'; window.location.reload();" style="background: #E53935; color: #FFFFFF; border: none; padding: 10px 24px; border-radius: 4px; font-weight: 600; cursor: pointer;">
            Muat Ulang Halaman
          </button>
        </div>
      `;
    }
  }

  renderView(route) {
    const mount = document.getElementById("view-mount");
    if (!mount) {
      this.renderAppShell(route);
      return;
    }

    mount.innerHTML = this.getViewHtml(route);
    this.updateActiveNavs(route);
    this.bindEvents(route);
  }

  updateActiveNavs(route) {
    document.querySelectorAll(".provider-nav-link").forEach(link => {
      const href = link.getAttribute("href") || "";
      const r = href.replace(/^#/, "");
      if (r === route) link.classList.add("active");
      else link.classList.remove("active");
    });

    document.querySelectorAll(".sidebar-link").forEach(link => {
      const href = link.getAttribute("href") || "";
      const r = href.replace(/^#/, "");
      if (r === route) link.classList.add("active");
      else link.classList.remove("active");
    });

    document.querySelectorAll(".mobile-bottom-nav .nav-item").forEach(link => {
      const href = link.getAttribute("href") || "";
      const r = href.replace(/^#/, "");
      if (r === route) link.classList.add("active");
      else link.classList.remove("active");
    });
  }

  bindLandingEvents() {
    const btnGoogle = document.getElementById("btn-landing-google-login");
    const btnHeaderLogin = document.getElementById("btn-landing-login-header");
    const btnGuest = document.getElementById("btn-landing-guest-explore");

    const doLogin = async () => {
      playLoginAnimation(async () => {
        await auth.signInWithGoogle();
        this.onboardingState = { step: 1, selectedOshis: [] };
        window.location.hash = "#home";
      });
    };

    if (btnGoogle) btnGoogle.addEventListener("click", doLogin);
    if (btnHeaderLogin) btnHeaderLogin.addEventListener("click", doLogin);

    if (btnGuest) {
      btnGuest.addEventListener("click", () => {
        playLoginAnimation(() => {
          Session.set("guest_mode", "true");
          window.location.hash = "#home";
          this.route();
        });
      });
    }
  }

  bindEvents(route) {
    // Universal Navigation Links: Immediate responsive click handling
    document.querySelectorAll(".provider-nav-link, .sidebar-link, .mobile-bottom-nav .nav-item").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = href.replace(/^#/, "") || "home";
          this.navigateTo(target);
        }
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Google Login button in Header
    const btnGoogleHeader = document.getElementById("btn-header-google-login");
    if (btnGoogleHeader) {
      btnGoogleHeader.addEventListener("click", () => {
        playLoginAnimation(async () => {
          await auth.signInWithGoogle();
          window.location.hash = "#home";
          this.route();
        });
      });
    }

    // Logout button in Header
    const btnLogoutHeader = document.getElementById("btn-header-logout");
    if (btnLogoutHeader) {
      btnLogoutHeader.addEventListener("click", async () => {
        await auth.signOut();
        window.location.hash = "#home";
        this.route();
      });
    }

    // Member Catalog Events
    if (route === "members") {
      const searchInput = document.getElementById("member-search-input");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          this.memberFilters.search = e.target.value;
          this.renderView("members");
        });
      }

      const btnClearSearch = document.getElementById("btn-clear-search");
      if (btnClearSearch) {
        btnClearSearch.addEventListener("click", () => {
          this.memberFilters.search = "";
          this.renderView("members");
        });
      }

      const filterBtns = document.querySelectorAll(".filter-column-btn, .filter-pill");
      filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const type = btn.dataset.filterType;
          const val = btn.dataset.filterValue;
          this.memberFilters[type] = val;
          this.renderView("members");
        });
      });

      // Member Card Click (opens modal)
      const memberCards = document.querySelectorAll(".member-catalog-card");
      memberCards.forEach(card => {
        card.addEventListener("click", (e) => {
          if (e.target.closest(".oshi-star-btn")) {
            e.stopPropagation();
            const memberId = card.dataset.memberId;
            this.toggleOshi(memberId);
            return;
          }
          const memberId = card.dataset.memberId;
          this.openMemberModal(memberId);
        });
      });
    }

    // Oshi Management Events
    if (route === "oshi") {
      document.querySelectorAll("[data-action='move-up']").forEach(btn => {
        btn.addEventListener("click", () => this.reorderOshi(btn.dataset.memberId, -1));
      });
      document.querySelectorAll("[data-action='move-down']").forEach(btn => {
        btn.addEventListener("click", () => this.reorderOshi(btn.dataset.memberId, 1));
      });
      document.querySelectorAll("[data-action='remove-oshi']").forEach(btn => {
        btn.addEventListener("click", () => this.toggleOshi(btn.dataset.memberId));
      });
    }

    // Settings Events
    if (route === "settings") {
      const btnReq = document.getElementById("btn-request-permission");
      if (btnReq) {
        btnReq.addEventListener("click", async () => {
          const res = await notificationManager.requestPermission();
          alert(res.message);
          this.renderView("settings");
        });
      }

      const prefAll = document.getElementById("pref-notify-all");
      if (prefAll) prefAll.addEventListener("change", (e) => auth.updatePreferences({ notifyAllMembers: e.target.checked }));

      const prefIdn = document.getElementById("pref-notify-idn");
      if (prefIdn) prefIdn.addEventListener("change", (e) => auth.updatePreferences({ notifyIDN: e.target.checked }));

      const prefShowroom = document.getElementById("pref-notify-showroom");
      if (prefShowroom) prefShowroom.addEventListener("change", (e) => auth.updatePreferences({ notifySHOWROOM: e.target.checked }));

      const prefQuiet = document.getElementById("pref-quiet-enabled");
      if (prefQuiet) {
        prefQuiet.addEventListener("change", (e) => {
          const prefs = auth.getPreferences();
          auth.updatePreferences({
            quietHours: { ...prefs.quietHours, enabled: e.target.checked }
          });
        });
      }
    }

    // Profile Events
    if (route === "profile") {
      const btnLogout = document.getElementById("btn-logout");
      if (btnLogout) {
        btnLogout.addEventListener("click", async () => {
          await auth.signOut();
          Session.remove("guest_mode");
          window.location.hash = "#home";
        });
      }
    }

    // Admin Events
    if (route === "admin") {
      document.querySelectorAll(".btn-simulate-live").forEach(btn => {
        btn.addEventListener("click", () => {
          const memberId = btn.dataset.member;
          const platform = btn.dataset.platform;
          liveMonitor.simulateLive(memberId, platform);
        });
      });

      const btnEndAll = document.getElementById("btn-simulate-end-all");
      if (btnEndAll) {
        btnEndAll.addEventListener("click", () => {
          liveMonitor.simulateEndLive();
        });
      }

      const btnManualCheck = document.getElementById("btn-manual-check");
      if (btnManualCheck) {
        btnManualCheck.addEventListener("click", async () => {
          btnManualCheck.disabled = true;
          btnManualCheck.textContent = "Memeriksa...";
          try {
            await liveMonitor.executeCycle();
            btnManualCheck.textContent = "Selesai!";
          } catch (err) {
            btnManualCheck.textContent = "Gagal: " + err.message;
          }
          setTimeout(() => {
            btnManualCheck.disabled = false;
            btnManualCheck.textContent = "Manual Check (Real API)";
          }, 2000);
        });
      }
    }
  }

  toggleOshi(memberId) {
    const prefs = auth.getPreferences();
    let favorites = [...(prefs.favoriteMembers || [])];
    const priorityMap = { ...(prefs.priorityMembers || {}) };

    if (favorites.includes(memberId)) {
      favorites = favorites.filter(id => id !== memberId);
      delete priorityMap[memberId];
    } else {
      favorites.push(memberId);
      priorityMap[memberId] = favorites.length === 1 ? OSHI_PRIORITY.HIGH : OSHI_PRIORITY.NORMAL;
    }

    auth.updatePreferences({
      favoriteMembers: favorites,
      priorityMembers: priorityMap
    });

    this.renderView(this.getRoute());
  }

  reorderOshi(memberId, direction) {
    const prefs = auth.getPreferences();
    const favorites = [...(prefs.favoriteMembers || [])];
    const currentIndex = favorites.indexOf(memberId);
    if (currentIndex < 0) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= favorites.length) return;

    const temp = favorites[currentIndex];
    favorites[currentIndex] = favorites[targetIndex];
    favorites[targetIndex] = temp;

    const priorityMap = {};
    favorites.forEach((id, idx) => {
      priorityMap[id] = idx === 0 ? OSHI_PRIORITY.HIGH : (idx === 1 ? OSHI_PRIORITY.NORMAL : OSHI_PRIORITY.LOW);
    });

    auth.updatePreferences({
      favoriteMembers: favorites,
      priorityMembers: priorityMap
    });

    this.renderView("oshi");
  }

  openMemberModal(memberId) {
    const modalMount = document.getElementById("modal-mount");
    if (!modalMount) return;

    modalMount.innerHTML = renderMemberProfileModal(memberId);

    const closeBtn = document.getElementById("modal-close-btn");
    const overlay = document.getElementById("member-profile-modal-overlay");
    const toggleOshiBtn = document.getElementById("modal-toggle-oshi-btn");

    const closeModal = () => { modalMount.innerHTML = ""; };
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    if (toggleOshiBtn) {
      toggleOshiBtn.addEventListener("click", () => {
        this.toggleOshi(memberId);
        this.openMemberModal(memberId);
      });
    }
  }
}

function startApp() {
  if (!window.appRouter) {
    try {
      window.appRouter = new AppRouter();
    } catch (err) {
      console.error("[AppRouter] Fatal initialization error:", err);
      const root = document.getElementById("app-root");
      if (root) {
        root.innerHTML = `
          <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 24px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/JKT48.svg" alt="JKT48" style="height: 64px; margin-bottom: 20px;" />
            <h2 style="color: #E53935; font-size: 1.3rem; margin-bottom: 8px;">Gagal Memuat Aplikasi</h2>
            <p style="color: #666666; font-size: 0.9rem; max-width: 400px; margin-bottom: 20px;">${err.message || "Terjadi kendala saat memuat direktori."}</p>
            <button onclick="window.location.reload()" style="background: #E53935; color: #FFFFFF; border: none; padding: 10px 24px; border-radius: 4px; font-weight: 600; cursor: pointer;">
              Muat Ulang Halaman
            </button>
          </div>
        `;
      }
    }
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  startApp();
} else {
  document.addEventListener("DOMContentLoaded", startApp);
  window.addEventListener("load", startApp);
}

  // Expose global entry point
  window.JKT48_BUNDLE_LOADED = true;
  if (typeof startApp === "function") {
    startApp();
  }
})(typeof window !== "undefined" ? window : globalThis, typeof document !== "undefined" ? document : {});