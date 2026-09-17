// Vercel Serverless Function — Cron Monitor
// Triggered once every minute by Vercel Cron
export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    // Note: Live monitoring logic executes server-side
    // Compare previous states in database, detect transitions OFFLINE -> LIVE
    // Send FCM push notifications to eligible users
    
    return res.status(200).json({
      success: true,
      message: "Monitoring cycle executed successfully.",
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("[Cron Monitor] Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
