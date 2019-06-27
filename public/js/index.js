const loginButton = document.querySelector('.login-popup__submit');

loginButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  window.location = 'http://localhost:3000/user-desk';
});