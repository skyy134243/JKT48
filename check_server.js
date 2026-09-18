async function check() {
  const files = [
    '/',
    '/index.html',
    '/src/styles/main.css',
    '/src/styles/components.css',
    '/src/app/router.js',
    '/src/lib/auth.js',
    '/src/lib/database.js',
    '/src/lib/utils.js',
    '/src/data/members.js',
    '/src/types/schemas.js',
    '/src/services/liveMonitor.js',
    '/src/services/idnProvider.js',
    '/src/services/showroomProvider.js',
    '/src/components/Header.js',
    '/src/components/Sidebar.js',
    '/src/components/BottomNav.js',
    '/src/components/MemberCard.js',
    '/src/components/LiveCard.js',
    '/src/components/LoginSplashAnimation.js',
    '/src/app/HomeView.js',
    '/src/app/LandingView.js',
    '/src/app/MemberListView.js',
    '/src/app/OshiView.js',
    '/src/app/NotificationView.js',
    '/src/app/SettingsView.js',
    '/src/app/ProfileView.js',
    '/src/app/AdminView.js',
    '/src/app/OnboardingModal.js',
    '/src/app/MemberProfileModal.js'
  ];
  let failed = 0;
  for (const f of files) {
    try {
      const res = await fetch('http://localhost:3000' + f);
      if (!res.ok) {
        console.log('FAIL:', f, res.status);
        failed++;
      }
    } catch (e) {
      console.log('ERR:', f, e.message);
      failed++;
    }
  }
  console.log(`Check finished! Failed: ${failed}`);
}
check();
