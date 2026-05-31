const cleanYouTubeAds = () => {
    // 1. Instantly click the "Skip Ad" button if it exists
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
    if (skipButton) {
      skipButton.click();
    }
  
    // 2. Fast-forward unskippable video ads
    // The '.ad-showing' class is added to the player when an ad is active
    const adOverlay = document.querySelector('.ad-showing');
    const video = document.querySelector('video');
    
    if (adOverlay && video) {
      // Jump to the end of the ad to force YouTube to load the actual video
      if (video.duration && video.currentTime < video.duration - 1) {
        video.currentTime = video.duration;
      }
    }
  
    // 3. Remove static ad banners from the DOM
    const staticAds = document.querySelectorAll(
      'ytd-ad-slot-renderer, ytd-banner-promo-renderer, ytd-player-legacy-desktop-watch-ads-renderer'
    );
    staticAds.forEach(ad => ad.style.display = 'none');
  };
  
  // Run the check every 500ms to catch dynamic DOM changes
  setInterval(cleanYouTubeAds, 500);