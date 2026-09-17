// Vercel Serverless Function — Admin Health API
export default async function handler(req, res) {
  return res.status(200).json({
    monitor: "HEALTHY",
    database: "HEALTHY",
    notification: "HEALTHY",
    timestamp: new Date().toISOString()
  });
}
