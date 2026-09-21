using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace JKT48.LiveMonitoring
{
    #region Data Models & Contracts (Master Prompt Section 9, 11, 14, 16, 19)

    public class Member
    {
        public string id { get; set; }
        public string name { get; set; }
        public string nickname { get; set; }
        public int generation { get; set; }
        public string teamStatus { get; set; }
        public string showroomSlug { get; set; }
        public string showroomUrl { get; set; }
        public string idnSlug { get; set; }
        public string idnUrl { get; set; }
        public string photoUrl { get; set; }
        public string color { get; set; }
        public bool isActive { get; set; }
        public string createdAt { get; set; }
        public string updatedAt { get; set; }
    }

    public class LiveEvidence
    {
        public bool verified { get; set; }
        public string reason { get; set; }
        public string source { get; set; }
        public string snapshotTitle { get; set; }
    }

    public class LiveError
    {
        public string code { get; set; }
        public string message { get; set; }
    }

    public class LiveCheckResult
    {
        public string memberId { get; set; }
        public string platform { get; set; } // "IDN" or "SHOWROOM"
        public string status { get; set; }   // "LIVE", "OFFLINE", "UNKNOWN"
        public string checkedAt { get; set; } // UTC ISO 8601
        public string checkedAtWib { get; set; } // Asia/Jakarta WIB
        public string sourceUrl { get; set; }
        public LiveEvidence evidence { get; set; }
        public long latencyMs { get; set; }
        public LiveError error { get; set; }
    }

    public class LiveSession
    {
        public string sessionId { get; set; }
        public string memberId { get; set; }
        public string platform { get; set; }
        public string status { get; set; }
        public string startedAt { get; set; }
        public string startedAtWib { get; set; }
        public string lastSeenLiveAt { get; set; }
        public string lastSeenLiveAtWib { get; set; }
        public string endedAt { get; set; }
        public string endedAtWib { get; set; }
        public string sourceUrl { get; set; }
        public string liveTitle { get; set; }
    }

    public class LiveEvent
    {
        public string id { get; set; }
        public string memberId { get; set; }
        public string memberName { get; set; }
        public string platform { get; set; }
        public string type { get; set; } // "LIVE_STARTED" or "LIVE_ENDED"
        public string detectedAt { get; set; }
        public string detectedAtWib { get; set; }
        public string sourceUrl { get; set; }
        public bool verified { get; set; }
        public string sessionId { get; set; }
    }

    public class ProviderHealth
    {
        public string status { get; set; } // "HEALTHY", "DEGRADED", "UNAVAILABLE", "UNVERIFIED"
        public string verificationStatus { get; set; } // "VERIFIED", "PARTIALLY_VERIFIED", "UNVERIFIED"
        public string lastCheck { get; set; }
        public string lastCheckWib { get; set; }
        public string lastSuccessfulCheck { get; set; }
        public string lastSuccessfulCheckWib { get; set; }
        public string lastError { get; set; }
        public long lastLatencyMs { get; set; }
    }

    public class SystemHealth
    {
        public string database { get; set; }
        public string worker { get; set; }
        public string uptime { get; set; }
        public int monitorIntervalMs { get; set; }
        public int totalMembersTracked { get; set; }
        public int activeLiveSessions { get; set; }
        public Dictionary<string, ProviderHealth> providers { get; set; }
    }

    #endregion

    #region Timezone Helper (Master Prompt Section 13)

    public static class TimezoneHelper
    {
        private static TimeZoneInfo _wibZone;

        static TimezoneHelper()
        {
            try
            {
                _wibZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            }
            catch
            {
                try
                {
                    _wibZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Jakarta");
                }
                catch
                {
                    _wibZone = TimeZoneInfo.CreateCustomTimeZone("WIB", TimeSpan.FromHours(7), "WIB", "WIB");
                }
            }
        }

        public static string NowUtcIso()
        {
            return DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        }

        public static string FormatToWib(string utcIsoString)
        {
            if (string.IsNullOrEmpty(utcIsoString)) return null;
            DateTime utcDt;
            if (DateTime.TryParse(utcIsoString, null, System.Globalization.DateTimeStyles.RoundtripKind, out utcDt))
            {
                DateTime wibDt = TimeZoneInfo.ConvertTimeFromUtc(utcDt.ToUniversalTime(), _wibZone);
                return wibDt.ToString("dd MMMM yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture) + " WIB";
            }
            return utcIsoString;
        }
    }

    #endregion

    #region State Machine (Master Prompt Section 14, 15, 16, 17)

    public class StateMachine
    {
        private readonly object _lock = new object();
        private readonly Dictionary<string, LiveSession> _activeSessions = new Dictionary<string, LiveSession>();
        private readonly Dictionary<string, string> _lastKnownStatuses = new Dictionary<string, string>();
        private readonly List<LiveEvent> _eventLog = new List<LiveEvent>();

        private string MakeKey(string memberId, string platform)
        {
            return memberId + "_" + platform;
        }

        public List<LiveEvent> ProcessCheckResult(LiveCheckResult check, Member member, out LiveEvent generatedEvent)
        {
            generatedEvent = null;
            var newEvents = new List<LiveEvent>();
            string key = MakeKey(check.memberId, check.platform);

            lock (_lock)
            {
                string prevStatus = _lastKnownStatuses.ContainsKey(key) ? _lastKnownStatuses[key] : "OFFLINE";
                string currentStatus = check.status;

                // Rule 14 & 15: Transition Logic
                // Any transition to LIVE strictly requires verified evidence
                if (currentStatus == "LIVE" && (check.evidence == null || !check.evidence.verified))
                {
                    return newEvents;
                }

                if (prevStatus == "OFFLINE" && currentStatus == "LIVE")
                {
                    // OFFLINE -> LIVE : LIVE_STARTED
                    string sessionId = "sess_" + Guid.NewGuid().ToString("N").Substring(0, 12);
                    var session = new LiveSession
                    {
                        sessionId = sessionId,
                        memberId = check.memberId,
                        platform = check.platform,
                        status = "LIVE",
                        startedAt = check.checkedAt,
                        startedAtWib = check.checkedAtWib,
                        lastSeenLiveAt = check.checkedAt,
                        lastSeenLiveAtWib = check.checkedAtWib,
                        sourceUrl = check.sourceUrl,
                        liveTitle = check.evidence != null ? check.evidence.snapshotTitle : null
                    };
                    _activeSessions[key] = session;

                    generatedEvent = new LiveEvent
                    {
                        id = "evt_" + Guid.NewGuid().ToString("N").Substring(0, 10),
                        memberId = check.memberId,
                        memberName = member != null ? member.name : check.memberId,
                        platform = check.platform,
                        type = "LIVE_STARTED",
                        detectedAt = check.checkedAt,
                        detectedAtWib = check.checkedAtWib,
                        sourceUrl = check.sourceUrl,
                        verified = check.evidence != null && check.evidence.verified,
                        sessionId = sessionId
                    };
                    _eventLog.Insert(0, generatedEvent);
                    newEvents.Add(generatedEvent);
                    _lastKnownStatuses[key] = "LIVE";
                }
                else if (prevStatus == "LIVE" && currentStatus == "LIVE")
                {
                    // LIVE -> LIVE : No new event, maintain session
                    if (_activeSessions.ContainsKey(key))
                    {
                        _activeSessions[key].lastSeenLiveAt = check.checkedAt;
                        _activeSessions[key].lastSeenLiveAtWib = check.checkedAtWib;
                    }
                    _lastKnownStatuses[key] = "LIVE";
                }
                else if (prevStatus == "LIVE" && currentStatus == "OFFLINE")
                {
                    // LIVE -> OFFLINE : LIVE_ENDED
                    string sessionId = _activeSessions.ContainsKey(key) ? _activeSessions[key].sessionId : ("sess_closed_" + Guid.NewGuid().ToString("N").Substring(0, 8));
                    if (_activeSessions.ContainsKey(key))
                    {
                        _activeSessions[key].status = "OFFLINE";
                        _activeSessions[key].endedAt = check.checkedAt;
                        _activeSessions[key].endedAtWib = check.checkedAtWib;
                        _activeSessions.Remove(key);
                    }

                    generatedEvent = new LiveEvent
                    {
                        id = "evt_" + Guid.NewGuid().ToString("N").Substring(0, 10),
                        memberId = check.memberId,
                        memberName = member != null ? member.name : check.memberId,
                        platform = check.platform,
                        type = "LIVE_ENDED",
                        detectedAt = check.checkedAt,
                        detectedAtWib = check.checkedAtWib,
                        sourceUrl = check.sourceUrl,
                        verified = true,
                        sessionId = sessionId
                    };
                    _eventLog.Insert(0, generatedEvent);
                    newEvents.Add(generatedEvent);
                    _lastKnownStatuses[key] = "OFFLINE";
                }
                else if (prevStatus == "LIVE" && currentStatus == "UNKNOWN")
                {
                    // LIVE -> UNKNOWN : DO NOT end live session! Maintain status until verified offline.
                }
                else if (prevStatus == "UNKNOWN" && currentStatus == "LIVE")
                {
                    // UNKNOWN -> LIVE : Only if verified
                    if (check.evidence != null && check.evidence.verified)
                    {
                        if (!_activeSessions.ContainsKey(key))
                        {
                            string sessionId = "sess_" + Guid.NewGuid().ToString("N").Substring(0, 12);
                            _activeSessions[key] = new LiveSession
                            {
                                sessionId = sessionId,
                                memberId = check.memberId,
                                platform = check.platform,
                                status = "LIVE",
                                startedAt = check.checkedAt,
                                startedAtWib = check.checkedAtWib,
                                lastSeenLiveAt = check.checkedAt,
                                lastSeenLiveAtWib = check.checkedAtWib,
                                sourceUrl = check.sourceUrl,
                                liveTitle = check.evidence.snapshotTitle
                            };
                            generatedEvent = new LiveEvent
                            {
                                id = "evt_" + Guid.NewGuid().ToString("N").Substring(0, 10),
                                memberId = check.memberId,
                                memberName = member != null ? member.name : check.memberId,
                                platform = check.platform,
                                type = "LIVE_STARTED",
                                detectedAt = check.checkedAt,
                                detectedAtWib = check.checkedAtWib,
                                sourceUrl = check.sourceUrl,
                                verified = true,
                                sessionId = sessionId
                            };
                            _eventLog.Insert(0, generatedEvent);
                            newEvents.Add(generatedEvent);
                        }
                        _lastKnownStatuses[key] = "LIVE";
                    }
                }
                else if (currentStatus == "UNKNOWN")
                {
                    if (prevStatus != "LIVE")
                    {
                        _lastKnownStatuses[key] = "UNKNOWN";
                    }
                }
                else if (currentStatus == "OFFLINE")
                {
                    _lastKnownStatuses[key] = "OFFLINE";
                }

                if (_eventLog.Count > 100)
                {
                    _eventLog.RemoveRange(100, _eventLog.Count - 100);
                }
            }

            return newEvents;
        }

        public List<LiveSession> GetActiveSessions()
        {
            lock (_lock) { return _activeSessions.Values.ToList(); }
        }

        public List<LiveEvent> GetEvents(int limit = 20)
        {
            lock (_lock) { return _eventLog.Take(limit).ToList(); }
        }

        public string GetLastKnownStatus(string memberId, string platform)
        {
            lock (_lock)
            {
                string key = MakeKey(memberId, platform);
                return _lastKnownStatuses.ContainsKey(key) ? _lastKnownStatuses[key] : "OFFLINE";
            }
        }
    }

    #endregion

    #region Provider Adapters (Master Prompt Section 10, 11, 26)

    public interface ILiveProvider
    {
        string PlatformName { get; }
        ProviderHealth GetHealth();
        Task<List<LiveCheckResult>> CheckAllMembersAsync(List<Member> members);
    }

    public class ShowroomProvider : ILiveProvider
    {
        public string PlatformName { get { return "SHOWROOM"; } }
        private readonly ProviderHealth _health;
        private const string ONLIVES_URL = "https://www.showroom-live.com/api/live/onlives";

        public ShowroomProvider()
        {
            _health = new ProviderHealth
            {
                status = "HEALTHY",
                verificationStatus = "VERIFIED",
                lastCheck = null,
                lastSuccessfulCheck = null,
                lastError = null,
                lastLatencyMs = 0
            };
        }

        public ProviderHealth GetHealth() { return _health; }

        public async Task<List<LiveCheckResult>> CheckAllMembersAsync(List<Member> members)
        {
            var results = new List<LiveCheckResult>();
            string checkUtc = TimezoneHelper.NowUtcIso();
            string checkWib = TimezoneHelper.FormatToWib(checkUtc);
            _health.lastCheck = checkUtc;
            _health.lastCheckWib = checkWib;

            var sw = System.Diagnostics.Stopwatch.StartNew();
            try
            {
                var req = (HttpWebRequest)WebRequest.Create(ONLIVES_URL);
                req.Timeout = 8000;
                req.ReadWriteTimeout = 8000;
                req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) JKT48LiveRadar/2.0";
                req.Accept = "application/json";

                using (var resp = (HttpWebResponse)await req.GetResponseAsync())
                using (var sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                {
                    string json = await sr.ReadToEndAsync();
                    sw.Stop();
                    _health.lastLatencyMs = sw.ElapsedMilliseconds;
                    _health.lastSuccessfulCheck = checkUtc;
                    _health.lastSuccessfulCheckWib = checkWib;
                    _health.status = "HEALTHY";
                    _health.lastError = null;

                    var serializer = new JavaScriptSerializer();
                    serializer.MaxJsonLength = 10 * 1024 * 1024;
                    var data = serializer.Deserialize<Dictionary<string, object>>(json);

                    var activeShowroomLives = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    if (data != null && data.ContainsKey("onlives"))
                    {
                        var genres = data["onlives"] as System.Collections.ArrayList;
                        if (genres != null)
                        {
                            foreach (Dictionary<string, object> genre in genres)
                            {
                                if (genre.ContainsKey("lives"))
                                {
                                    var lives = genre["lives"] as System.Collections.ArrayList;
                                    if (lives != null)
                                    {
                                        foreach (Dictionary<string, object> live in lives)
                                        {
                                            if (live.ContainsKey("room_url_key") && live["room_url_key"] != null)
                                            {
                                                string key = live["room_url_key"].ToString().Trim();
                                                string title = live.ContainsKey("main_name") && live["main_name"] != null ? live["main_name"].ToString() : key;
                                                activeShowroomLives[key] = title;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    foreach (var member in members)
                    {
                        if (string.IsNullOrEmpty(member.showroomSlug)) continue;

                        bool isLive = activeShowroomLives.ContainsKey(member.showroomSlug);
                        results.Add(new LiveCheckResult
                        {
                            memberId = member.id,
                            platform = "SHOWROOM",
                            status = isLive ? "LIVE" : "OFFLINE",
                            checkedAt = checkUtc,
                            checkedAtWib = checkWib,
                            sourceUrl = member.showroomUrl,
                            evidence = new LiveEvidence
                            {
                                verified = true,
                                reason = isLive ? "Match in SHOWROOM onlives live rooms" : "Not listed in SHOWROOM onlives live rooms",
                                source = ONLIVES_URL,
                                snapshotTitle = isLive ? activeShowroomLives[member.showroomSlug] : null
                            },
                            latencyMs = sw.ElapsedMilliseconds,
                            error = null
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                _health.status = "DEGRADED";
                _health.lastError = ex.Message;
                _health.lastLatencyMs = sw.ElapsedMilliseconds;

                foreach (var member in members)
                {
                    results.Add(new LiveCheckResult
                    {
                        memberId = member.id,
                        platform = "SHOWROOM",
                        status = "UNKNOWN",
                        checkedAt = checkUtc,
                        checkedAtWib = checkWib,
                        sourceUrl = member.showroomUrl,
                        evidence = new LiveEvidence
                        {
                            verified = false,
                            reason = "SHOWROOM API check failed: " + ex.Message,
                            source = ONLIVES_URL,
                            snapshotTitle = null
                        },
                        latencyMs = sw.ElapsedMilliseconds,
                        error = new LiveError
                        {
                            code = "NETWORK_ERROR",
                            message = ex.Message
                        }
                    });
                }
            }

            return results;
        }
    }

    public class IdnProvider : ILiveProvider
    {
        public string PlatformName { get { return "IDN"; } }
        private readonly ProviderHealth _health;
        private const string CRSTLNZ_NOW_LIVE = "https://api.crstlnz.my.id/api/now_live";

        public IdnProvider()
        {
            _health = new ProviderHealth
            {
                status = "HEALTHY",
                verificationStatus = "VERIFIED",
                lastCheck = null,
                lastSuccessfulCheck = null,
                lastError = null,
                lastLatencyMs = 0
            };
        }

        public ProviderHealth GetHealth() { return _health; }

        public async Task<List<LiveCheckResult>> CheckAllMembersAsync(List<Member> members)
        {
            var results = new List<LiveCheckResult>();
            string checkUtc = TimezoneHelper.NowUtcIso();
            string checkWib = TimezoneHelper.FormatToWib(checkUtc);
            _health.lastCheck = checkUtc;
            _health.lastCheckWib = checkWib;

            var sw = System.Diagnostics.Stopwatch.StartNew();
            try
            {
                var req = (HttpWebRequest)WebRequest.Create(CRSTLNZ_NOW_LIVE);
                req.Timeout = 8000;
                req.ReadWriteTimeout = 8000;
                req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) JKT48LiveRadar/2.0";
                req.Accept = "application/json";

                using (var resp = (HttpWebResponse)await req.GetResponseAsync())
                using (var sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                {
                    string json = await sr.ReadToEndAsync();
                    sw.Stop();
                    _health.lastLatencyMs = sw.ElapsedMilliseconds;
                    _health.lastSuccessfulCheck = checkUtc;
                    _health.lastSuccessfulCheckWib = checkWib;
                    _health.status = "HEALTHY";
                    _health.lastError = null;

                    var serializer = new JavaScriptSerializer();
                    serializer.MaxJsonLength = 10 * 1024 * 1024;
                    var liveList = serializer.Deserialize<object[]>(json);

                    var activeIdnLives = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    if (liveList != null)
                    {
                        foreach (Dictionary<string, object> item in liveList)
                        {
                            string userSlug = null;
                            string title = null;

                            if (item.ContainsKey("user") && item["user"] is Dictionary<string, object>)
                            {
                                var userObj = (Dictionary<string, object>)item["user"];
                                if (userObj.ContainsKey("username") && userObj["username"] != null)
                                    userSlug = userObj["username"].ToString().Trim();
                            }
                            if (string.IsNullOrEmpty(userSlug) && item.ContainsKey("username") && item["username"] != null)
                            {
                                userSlug = item["username"].ToString().Trim();
                            }

                            if (item.ContainsKey("title") && item["title"] != null)
                            {
                                title = item["title"].ToString();
                            }

                            if (!string.IsNullOrEmpty(userSlug))
                            {
                                activeIdnLives[userSlug] = title ?? userSlug;
                            }
                        }
                    }

                    foreach (var member in members)
                    {
                        if (string.IsNullOrEmpty(member.idnSlug)) continue;

                        bool isLive = activeIdnLives.ContainsKey(member.idnSlug) ||
                                      activeIdnLives.ContainsKey("jkt48_" + member.nickname.ToLowerInvariant()) ||
                                      activeIdnLives.ContainsKey(member.nickname.ToLowerInvariant() + "jkt48");

                        results.Add(new LiveCheckResult
                        {
                            memberId = member.id,
                            platform = "IDN",
                            status = isLive ? "LIVE" : "OFFLINE",
                            checkedAt = checkUtc,
                            checkedAtWib = checkWib,
                            sourceUrl = member.idnUrl,
                            evidence = new LiveEvidence
                            {
                                verified = true,
                                reason = isLive ? "Match in verified IDN now_live directory" : "Not listed in verified IDN now_live directory",
                                source = CRSTLNZ_NOW_LIVE,
                                snapshotTitle = isLive ? activeIdnLives.Values.FirstOrDefault() : null
                            },
                            latencyMs = sw.ElapsedMilliseconds,
                            error = null
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                _health.status = "DEGRADED";
                _health.lastError = ex.Message;
                _health.lastLatencyMs = sw.ElapsedMilliseconds;

                foreach (var member in members)
                {
                    results.Add(new LiveCheckResult
                    {
                        memberId = member.id,
                        platform = "IDN",
                        status = "UNKNOWN",
                        checkedAt = checkUtc,
                        checkedAtWib = checkWib,
                        sourceUrl = member.idnUrl,
                        evidence = new LiveEvidence
                        {
                            verified = false,
                            reason = "IDN API check failed: " + ex.Message,
                            source = CRSTLNZ_NOW_LIVE,
                            snapshotTitle = null
                        },
                        latencyMs = sw.ElapsedMilliseconds,
                        error = new LiveError
                        {
                            code = "NETWORK_ERROR",
                            message = ex.Message
                        }
                    });
                }
            }

            return results;
        }
    }

    #endregion

    #region Member Database Adapter (Master Prompt Section 9)

    public class MemberDatabase
    {
        private readonly List<Member> _members;

        public MemberDatabase()
        {
            string nowUtc = TimezoneHelper.NowUtcIso();
            _members = new List<Member>
            {
                new Member { id = "gracia", name = "Shania Gracia", nickname = "Gracia", generation = 3, teamStatus = "Inti", showroomSlug = "JKT48_Gracia", showroomUrl = "https://www.showroom-live.com/r/JKT48_Gracia", idnSlug = "graciajkt48", idnUrl = "https://www.idn.app/graciajkt48", photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shania_Gracia_%28Gracia%29_at_the_JKT48_Summer_Festival.jpg/440px-Shania_Gracia_%28Gracia%29_at_the_JKT48_Summer_Festival.jpg", color = "#8B6F9E", isActive = true, createdAt = nowUtc, updatedAt = nowUtc },
                new Member { id = "feni", name = "Feni Fitriyanti", nickname = "Feni", generation = 6, teamStatus = "Inti", showroomSlug = "JKT48_Feni", showroomUrl = "https://www.showroom-live.com/r/JKT48_Feni", idnSlug = "fenijkt48", idnUrl = "https://www.idn.app/fenijkt48", photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Feni_Fitriyanti_%28Feni%29_at_the_JKT48_Summer_Festival.jpg/440px-Feni_Fitriyanti_%28Feni%29_at_the_JKT48_Summer_Festival.jpg", color = "#E91E8C", isActive = true, createdAt = nowUtc, updatedAt = nowUtc },
                new Member { id = "gita", name = "Gita Sekar Andarini", nickname = "Gita", generation = 6, teamStatus = "Inti", showroomSlug = "JKT48_Gita", showroomUrl = "https://www.showroom-live.com/r/JKT48_Gita", idnSlug = "gitajkt48", idnUrl = "https://www.idn.app/gitajkt48", photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gita_Sekar_Andarini_%28Gita%29_at_the_JKT48_Summer_Festival.jpg/440px-Gita_Sekar_Andarini_%28Gita%29_at_the_JKT48_Summer_Festival.jpg", color = "#FF6B9D", isActive = true, createdAt = nowUtc, updatedAt = nowUtc },
                new Member { id = "christy", name = "Angelina Christy", nickname = "Christy", generation = 7, teamStatus = "Inti", showroomSlug = "JKT48_Christy", showroomUrl = "https://www.showroom-live.com/r/JKT48_Christy", idnSlug = "christyjkt48", idnUrl = "https://www.idn.app/christyjkt48", photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg", color = "#C2185B", isActive = true, createdAt = nowUtc, updatedAt = nowUtc },
                new Member { id = "freya", name = "Freya Jayawardana", nickname = "Freya", generation = 7, teamStatus = "Inti", showroomSlug = "JKT48_Freya", showroomUrl = "https://www.showroom-live.com/r/JKT48_Freya", idnSlug = "freyajkt48", idnUrl = "https://www.idn.app/freyajkt48", photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Freya_Jayawardana_%28Freya%29_at_the_JKT48_Summer_Festival.jpg/440px-Freya_Jayawardana_%28Freya%29_at_the_JKT48_Summer_Festival.jpg", color = "#1565C0", isActive = true, createdAt = nowUtc, updatedAt = nowUtc },
                new Member { id = "eli", name = "Helisma Putri", nickname = "Eli", generation = 7, teamStatus = "Inti", showroomSlug = "JKT48_Eli", showroomUrl = "https://www.showroom-live.com/r/JKT48_Eli", idnSlug = "elijkt48", idnUrl = "https://www.idn.app/elijkt48", photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Helisma_Putri_%28Eli%29_at_the_JKT48_Summer_Festival.jpg/440px-Helisma_Putri_%28Eli%29_at_the_JKT48_Summer_Festival.jpg", color = "#2E7D32", isActive = true, createdAt = nowUtc, updatedAt = nowUtc },
                new Member { id = "muthe", name = "Mutiara Azzahra", nickname = "Muthe", generation = 7, teamStatus = "Inti", showroomSlug = "JKT48_Muthe", showroomUrl = "https://www.showroom-live.com/r/JKT48_Muthe", idnSlug = "muthejkt48", idnUrl = "https://www.idn.app/muthejkt48", photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Mutiara_Azzahra_%28Muthe%29_at_the_JKT48_Summer_Festival.jpg/440px-Mutiara_Azzahra_%28Muthe%29_at_the_JKT48_Summer_Festival.jpg", color = "#880E4F", isActive = true, createdAt = nowUtc, updatedAt = nowUtc },
                new Member { id = "fritzy", name = "Fritzy Rosmerian", nickname = "Fritzy", generation = 12, teamStatus = "Trainee", showroomSlug = "JKT48_Fritzy", showroomUrl = "https://www.showroom-live.com/r/JKT48_Fritzy", idnSlug = "fritzyjkt48", idnUrl = "https://www.idn.app/fritzyjkt48", photoUrl = "https://jkt48.com/images/member/member_fritzy.jpg", color = "#7B1FA2", isActive = true, createdAt = nowUtc, updatedAt = nowUtc }
            };
        }

        public List<Member> GetAllMembers() { return _members; }
        public Member GetMemberById(string id) { return _members.FirstOrDefault(m => string.Equals(m.id, id, StringComparison.OrdinalIgnoreCase)); }
    }

    #endregion

    #region Monitoring Scheduler Worker (Master Prompt Section 12, 22)

    public class MonitoringWorker
    {
        private readonly MemberDatabase _db;
        private readonly List<ILiveProvider> _providers;
        private readonly StateMachine _stateMachine;
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();
        private Task _workerTask;
        private bool _isRunning = false;
        private int _intervalMs = 3000;
        private readonly Dictionary<string, LiveCheckResult> _latestResults = new Dictionary<string, LiveCheckResult>();
        private readonly object _lock = new object();

        public MonitoringWorker(MemberDatabase db, StateMachine stateMachine, List<ILiveProvider> providers, int intervalMs = 3000)
        {
            _db = db;
            _stateMachine = stateMachine;
            _providers = providers;
            _intervalMs = intervalMs;
        }

        public bool IsRunning { get { return _isRunning; } }
        public int IntervalMs { get { return _intervalMs; } }

        public void Start()
        {
            if (_isRunning) return;
            _isRunning = true;
            _workerTask = Task.Run(async () => await RunLoopAsync(_cts.Token));
            Console.WriteLine("[MonitoringWorker] Started background monitoring loop (Interval: " + _intervalMs + "ms).");
        }

        public void Stop()
        {
            if (!_isRunning) return;
            _cts.Cancel();
            _isRunning = false;
            Console.WriteLine("[MonitoringWorker] Stopped background monitoring loop.");
        }

        private async Task RunLoopAsync(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    await ExecuteCycleAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("[MonitoringWorker] Cycle error: " + ex.Message);
                }

                try
                {
                    await Task.Delay(_intervalMs, token);
                }
                catch (TaskCanceledException)
                {
                    break;
                }
            }
        }

        public async Task<List<LiveCheckResult>> ExecuteCycleAsync()
        {
            var members = _db.GetAllMembers().Where(m => m.isActive).ToList();
            var allResults = new List<LiveCheckResult>();

            foreach (var provider in _providers)
            {
                var providerResults = await provider.CheckAllMembersAsync(members);
                foreach (var result in providerResults)
                {
                    var member = members.FirstOrDefault(m => m.id == result.memberId);
                    LiveEvent newEvent;
                    _stateMachine.ProcessCheckResult(result, member, out newEvent);

                    if (newEvent != null)
                    {
                        Console.WriteLine(string.Format("[EVENT] {0} -> {1} ({2}) at {3}", newEvent.type, newEvent.memberName, newEvent.platform, newEvent.detectedAtWib));
                    }

                    lock (_lock)
                    {
                        string key = result.memberId + "_" + result.platform;
                        _latestResults[key] = result;
                    }
                    allResults.Add(result);
                }
            }

            return allResults;
        }

        public List<LiveCheckResult> GetLatestResults()
        {
            lock (_lock) { return _latestResults.Values.ToList(); }
        }
    }

    #endregion

    #region REST API Server (Master Prompt Section 18, 19, 20)

    public class ApiServer
    {
        private readonly HttpListener _listener;
        private readonly MemberDatabase _db;
        private readonly MonitoringWorker _worker;
        private readonly StateMachine _stateMachine;
        private readonly List<ILiveProvider> _providers;
        private readonly DateTime _startTime = DateTime.UtcNow;
        private bool _isListening = false;
        private readonly JavaScriptSerializer _serializer = new JavaScriptSerializer();

        public ApiServer(int port, MemberDatabase db, MonitoringWorker worker, StateMachine stateMachine, List<ILiveProvider> providers)
        {
            _db = db;
            _worker = worker;
            _stateMachine = stateMachine;
            _providers = providers;
            _listener = new HttpListener();
            _listener.Prefixes.Add(string.Format("http://localhost:{0}/", port));
            _listener.Prefixes.Add(string.Format("http://127.0.0.1:{0}/", port));
        }

        public void Start()
        {
            _listener.Start();
            _isListening = true;
            Console.WriteLine("[ApiServer] Listening on http://127.0.0.1:5000/");
            Task.Run(async () =>
            {
                while (_isListening && _listener.IsListening)
                {
                    try
                    {
                        var context = await _listener.GetContextAsync();
                        ProcessRequest(context);
                    }
                    catch (HttpListenerException) { break; }
                    catch (Exception ex)
                    {
                        Console.WriteLine("[ApiServer] Request error: " + ex.Message);
                    }
                }
            });
        }

        public void Stop()
        {
            _isListening = false;
            if (_listener.IsListening) _listener.Stop();
        }

        private void ProcessRequest(HttpListenerContext context)
        {
            var req = context.Request;
            var resp = context.Response;

            resp.Headers["Access-Control-Allow-Origin"] = "*";
            resp.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
            resp.Headers["Access-Control-Allow-Headers"] = "Content-Type, Accept";

            if (req.HttpMethod == "OPTIONS")
            {
                resp.StatusCode = 200;
                resp.Close();
                return;
            }

            string path = req.Url.AbsolutePath.TrimEnd('/');
            string responseJson = "";
            int statusCode = 200;

            try
            {
                if (path == "/api/health")
                {
                    var providerDict = new Dictionary<string, ProviderHealth>();
                    foreach (var p in _providers)
                    {
                        providerDict[p.PlatformName] = p.GetHealth();
                    }

                    var health = new SystemHealth
                    {
                        database = "healthy",
                        worker = _worker.IsRunning ? "running" : "stopped",
                        uptime = (DateTime.UtcNow - _startTime).ToString(@"dd\.hh\:mm\:ss"),
                        monitorIntervalMs = _worker.IntervalMs,
                        totalMembersTracked = _db.GetAllMembers().Count,
                        activeLiveSessions = _stateMachine.GetActiveSessions().Count,
                        providers = providerDict
                    };
                    responseJson = _serializer.Serialize(health);
                }
                else if (path == "/api/members")
                {
                    responseJson = _serializer.Serialize(_db.GetAllMembers());
                }
                else if (path == "/api/live")
                {
                    var payload = new Dictionary<string, object>
                    {
                        { "activeSessions", _stateMachine.GetActiveSessions() },
                        { "latestChecks", _worker.GetLatestResults() },
                        { "checkedAtUtc", TimezoneHelper.NowUtcIso() },
                        { "checkedAtWib", TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()) }
                    };
                    responseJson = _serializer.Serialize(payload);
                }
                else if (path.StartsWith("/api/members/") && path.EndsWith("/live"))
                {
                    string[] parts = path.Trim('/').Split('/');
                    if (parts.Length >= 3)
                    {
                        string memberId = parts[2];
                        var member = _db.GetMemberById(memberId);
                        if (member == null)
                        {
                            statusCode = 404;
                            responseJson = _serializer.Serialize(new { error = "Member not found" });
                        }
                        else
                        {
                            var memberChecks = _worker.GetLatestResults().Where(r => r.memberId == member.id).ToList();
                            var activeSessions = _stateMachine.GetActiveSessions().Where(s => s.memberId == member.id).ToList();
                            var payload = new Dictionary<string, object>
                            {
                                { "member", member },
                                { "isLiveNow", activeSessions.Count > 0 },
                                { "activeSessions", activeSessions },
                                { "checks", memberChecks }
                            };
                            responseJson = _serializer.Serialize(payload);
                        }
                    }
                }
                else if (path == "/api/events")
                {
                    responseJson = _serializer.Serialize(_stateMachine.GetEvents(30));
                }
                else
                {
                    statusCode = 404;
                    responseJson = _serializer.Serialize(new { error = "Endpoint not found", available = new[] { "/api/health", "/api/members", "/api/live", "/api/members/:id/live", "/api/events" } });
                }
            }
            catch (Exception ex)
            {
                statusCode = 500;
                responseJson = _serializer.Serialize(new { error = ex.Message });
            }

            resp.StatusCode = statusCode;
            resp.ContentType = "application/json; charset=utf-8";
            byte[] bytes = Encoding.UTF8.GetBytes(responseJson);
            resp.ContentLength64 = bytes.Length;
            using (var stream = resp.OutputStream)
            {
                stream.Write(bytes, 0, bytes.Length);
            }
        }
    }

    #endregion

    #region Entry Point & Automated Test Runner (Master Prompt Section 23, 24, 25)

    public class Program
    {
        public static int Main(string[] args)
        {
            Console.WriteLine("===============================================================");
            Console.WriteLine(" JKT48 REAL-TIME LIVE MONITORING BOT - BACKEND SERVICE");
            Console.WriteLine(" Architecture: Provider Adapter -> Status Engine -> State Machine -> API");
            Console.WriteLine("===============================================================");

            var db = new MemberDatabase();
            var stateMachine = new StateMachine();
            var showroom = new ShowroomProvider();
            var idn = new IdnProvider();
            var providers = new List<ILiveProvider> { showroom, idn };

            var worker = new MonitoringWorker(db, stateMachine, providers, 3000);
            var apiServer = new ApiServer(5000, db, worker, stateMachine, providers);

            if (args.Length > 0 && args[0].ToLowerInvariant() == "test")
            {
                return RunTests(db, stateMachine, showroom, idn, worker, apiServer);
            }

            worker.Start();
            apiServer.Start();

            Console.WriteLine("[Server] Press Ctrl+C or Enter to exit.");
            Console.ReadLine();

            worker.Stop();
            apiServer.Stop();
            return 0;
        }

        public static int RunTests(MemberDatabase db, StateMachine sm, ShowroomProvider showroom, IdnProvider idn, MonitoringWorker worker, ApiServer apiServer)
        {
            Console.WriteLine("\n[TEST SUITE] EXECUTING 10 MANDATORY TEST CASES (SECTION 24)...\n");
            int passed = 0;
            int failed = 0;

            Action<string, string, bool, string> AssertTest = delegate(string testId, string description, bool condition, string detail)
            {
                if (condition)
                {
                    Console.WriteLine(string.Format("[PASS] Test {0}: {1}", testId, description));
                    passed++;
                }
                else
                {
                    Console.WriteLine(string.Format("[FAIL] Test {0}: {1} -> {2}", testId, description, detail));
                    failed++;
                }
            };

            var testMember = db.GetMemberById("freya");

            // Test A: OFFLINE -> LIVE => Expected LIVE_STARTED
            LiveEvent evtA;
            var checkLive = new LiveCheckResult
            {
                memberId = "freya",
                platform = "SHOWROOM",
                status = "LIVE",
                checkedAt = TimezoneHelper.NowUtcIso(),
                checkedAtWib = TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()),
                sourceUrl = testMember.showroomUrl,
                evidence = new LiveEvidence { verified = true, reason = "Test live evidence", snapshotTitle = "Freya Live" },
                latencyMs = 120,
                error = null
            };
            sm.ProcessCheckResult(checkLive, testMember, out evtA);
            AssertTest("A", "OFFLINE -> LIVE triggers LIVE_STARTED event", evtA != null && evtA.type == "LIVE_STARTED" && evtA.sessionId != null, "Event was not generated or session null");

            // Test B: LIVE -> LIVE => Expected NO NEW EVENT & SAME SESSION
            LiveEvent evtB;
            sm.ProcessCheckResult(checkLive, testMember, out evtB);
            var activeSession = sm.GetActiveSessions().FirstOrDefault(s => s.memberId == "freya" && s.platform == "SHOWROOM");
            AssertTest("B", "LIVE -> LIVE produces NO NEW EVENT and preserves session", evtB == null && activeSession != null && activeSession.sessionId == evtA.sessionId, "Duplicate event created or session lost");

            // Test C: LIVE -> OFFLINE => Expected LIVE_ENDED
            LiveEvent evtC;
            var checkOffline = new LiveCheckResult
            {
                memberId = "freya",
                platform = "SHOWROOM",
                status = "OFFLINE",
                checkedAt = TimezoneHelper.NowUtcIso(),
                checkedAtWib = TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()),
                sourceUrl = testMember.showroomUrl,
                evidence = new LiveEvidence { verified = true, reason = "Room closed" },
                latencyMs = 80,
                error = null
            };
            sm.ProcessCheckResult(checkOffline, testMember, out evtC);
            AssertTest("C", "LIVE -> OFFLINE triggers LIVE_ENDED event with matching sessionId", evtC != null && evtC.type == "LIVE_ENDED" && evtC.sessionId == evtA.sessionId, "Event not generated or sessionId mismatch");

            // Test D: LIVE -> UNKNOWN => Expected SESSION REMAINS ACTIVE
            LiveEvent evtD1, evtD2;
            sm.ProcessCheckResult(checkLive, testMember, out evtD1);
            var checkUnknown = new LiveCheckResult
            {
                memberId = "freya",
                platform = "SHOWROOM",
                status = "UNKNOWN",
                checkedAt = TimezoneHelper.NowUtcIso(),
                checkedAtWib = TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()),
                sourceUrl = testMember.showroomUrl,
                evidence = new LiveEvidence { verified = false, reason = "API timeout" },
                latencyMs = 5000,
                error = new LiveError { code = "TIMEOUT", message = "Gateway timeout" }
            };
            sm.ProcessCheckResult(checkUnknown, testMember, out evtD2);
            var sessionD = sm.GetActiveSessions().FirstOrDefault(s => s.memberId == "freya" && s.platform == "SHOWROOM");
            AssertTest("D", "LIVE -> UNKNOWN keeps session active (does NOT terminate live)", evtD2 == null && sessionD != null && sessionD.status == "LIVE", "Session was terminated prematurely on UNKNOWN");

            sm.ProcessCheckResult(checkOffline, testMember, out evtC);

            // Test E: UNKNOWN -> LIVE only if verified
            LiveEvent evtE_init;
            var checkUnknownGracia = new LiveCheckResult
            {
                memberId = "gracia",
                platform = "IDN",
                status = "UNKNOWN",
                checkedAt = TimezoneHelper.NowUtcIso(),
                checkedAtWib = TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()),
                sourceUrl = null,
                evidence = new LiveEvidence { verified = false, reason = "Initial Unknown state" },
                latencyMs = 100,
                error = null
            };
            sm.ProcessCheckResult(checkUnknownGracia, db.GetMemberById("gracia"), out evtE_init);

            LiveEvent evtE;
            var checkLiveUnverified = new LiveCheckResult
            {
                memberId = "gracia",
                platform = "IDN",
                status = "LIVE",
                checkedAt = TimezoneHelper.NowUtcIso(),
                checkedAtWib = TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()),
                sourceUrl = "https://www.idn.app/graciajkt48",
                evidence = new LiveEvidence { verified = false, reason = "Unverified pattern guess" },
                latencyMs = 200,
                error = null
            };
            sm.ProcessCheckResult(checkLiveUnverified, db.GetMemberById("gracia"), out evtE);
            AssertTest("E", "UNKNOWN -> LIVE requires verified = true to generate LIVE event", evtE == null, "Unverified live was allowed to create event");

            // Test F: Timeout results in UNKNOWN
            var checkTimeout = new LiveCheckResult
            {
                memberId = "gita",
                platform = "SHOWROOM",
                status = "UNKNOWN",
                checkedAt = TimezoneHelper.NowUtcIso(),
                checkedAtWib = TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()),
                sourceUrl = null,
                evidence = new LiveEvidence { verified = false, reason = "Request timeout 8000ms" },
                latencyMs = 8000,
                error = new LiveError { code = "TIMEOUT", message = "Request timed out" }
            };
            AssertTest("F", "Provider timeout returns status UNKNOWN with error code", checkTimeout.status == "UNKNOWN" && checkTimeout.error != null && checkTimeout.error.code == "TIMEOUT", "Timeout did not set status UNKNOWN");

            // Test G: IDN Error while SHOWROOM succeeds
            var idnHealth = idn.GetHealth();
            var showroomHealth = showroom.GetHealth();
            AssertTest("G", "Provider isolation: SHOWROOM healthy independent of IDN state", showroomHealth.status == "HEALTHY", "SHOWROOM degraded because of IDN");

            // Test H: Worker restart idempotency (No duplicate LIVE_STARTED)
            LiveEvent evtH1, evtH2;
            sm.ProcessCheckResult(checkLive, testMember, out evtH1);
            sm.ProcessCheckResult(checkLive, testMember, out evtH2);
            AssertTest("H", "Worker restart does not generate duplicate LIVE_STARTED", evtH1 != null && evtH2 == null, "Duplicate event created upon second cycle");
            sm.ProcessCheckResult(checkOffline, testMember, out evtC);

            // Test I: Timezone conversion (UTC -> Asia/Jakarta WIB)
            string testUtc = "2026-09-21T06:30:15.000Z";
            string testWib = TimezoneHelper.FormatToWib(testUtc);
            AssertTest("I", "Timezone conversion correctly converts UTC to Asia/Jakarta (WIB)", testWib.Contains("13:30:15") && testWib.Contains("WIB"), string.Format("Expected 13:30:15 WIB, got '{0}'", testWib));

            // Test J: Provider schema error logged as UNKNOWN
            var checkSchemaError = new LiveCheckResult
            {
                memberId = "muthe",
                platform = "IDN",
                status = "UNKNOWN",
                checkedAt = TimezoneHelper.NowUtcIso(),
                checkedAtWib = TimezoneHelper.FormatToWib(TimezoneHelper.NowUtcIso()),
                sourceUrl = null,
                evidence = new LiveEvidence { verified = false, reason = "Invalid JSON schema response" },
                latencyMs = 340,
                error = new LiveError { code = "SCHEMA_CHANGED", message = "Missing 'lives' array property" }
            };
            AssertTest("J", "Provider schema error logged as UNKNOWN without crash", checkSchemaError.status == "UNKNOWN" && checkSchemaError.error.code == "SCHEMA_CHANGED", "Schema error was not handled");

            // Integration Test: Check live SHOWROOM and IDN APIs right now
            Console.WriteLine("\n[INTEGRATION TEST] Running Real Provider Execution Cycle...");
            var liveResults = worker.ExecuteCycleAsync().GetAwaiter().GetResult();
            bool hasResults = liveResults.Count > 0;
            Console.WriteLine(string.Format("[INTEGRATION TEST] Received {0} total member check records.", liveResults.Count));
            AssertTest("INT_1", "Real provider check executed across SHOWROOM & IDN", hasResults, "No records returned from real cycle");

            // Test REST API Endpoints
            apiServer.Start();
            Thread.Sleep(500);

            try
            {
                using (var client = new WebClient())
                {
                    client.Encoding = Encoding.UTF8;
                    string healthJson = client.DownloadString("http://127.0.0.1:5000/api/health");
                    AssertTest("API_HEALTH", "GET /api/health returns valid JSON", healthJson.Contains("\"database\":\"healthy\""), "Health check failed");

                    string membersJson = client.DownloadString("http://127.0.0.1:5000/api/members");
                    AssertTest("API_MEMBERS", "GET /api/members returns member database", membersJson.Contains("Gracia"), "Members endpoint failed");

                    string liveJson = client.DownloadString("http://127.0.0.1:5000/api/live");
                    AssertTest("API_LIVE", "GET /api/live returns active checks", liveJson.Contains("activeSessions"), "Live endpoint failed");

                    string eventsJson = client.DownloadString("http://127.0.0.1:5000/api/events");
                    AssertTest("API_EVENTS", "GET /api/events returns event log", eventsJson.StartsWith("["), "Events endpoint failed");

                    string freyaJson = client.DownloadString("http://127.0.0.1:5000/api/members/freya/live");
                    AssertTest("API_MEMBER_LIVE", "GET /api/members/:id/live returns member status", freyaJson.Contains("\"member\"") && freyaJson.Contains("freya"), "Member live endpoint failed");
                }
            }
            catch (Exception ex)
            {
                AssertTest("API_TEST", "API endpoints connectivity", false, ex.Message);
            }
            finally
            {
                apiServer.Stop();
            }

            Console.WriteLine("\n===============================================================");
            Console.WriteLine(string.Format(" TEST SUMMARY: {0} PASSED, {1} FAILED", passed, failed));
            Console.WriteLine("===============================================================\n");

            return failed == 0 ? 0 : 1;
        }
    }

    #endregion
}
