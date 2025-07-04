export function isMobile() {
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  return isMobileUA || isSmallScreen;
}
