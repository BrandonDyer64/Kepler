function toggleDark() {
  $('body').toggleClass('dark')
  if ($('body').hasClass('dark')) {
    window.localStorage.setItem('isDark', 'true');
  } else {
    window.localStorage.setItem('isDark', 'false');
  }
}

if (window.localStorage.getItem('isDark') == 'true') {
  $('body').addClass('dark')
}
