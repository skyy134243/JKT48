// Vercel Serverless Function — Live Status API
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  return res.status(200).json({
    status: "healthy",
    liveCount: 0,
    liveSessions: [],
    checkedAt: new Date().toISOString()
  });
}
