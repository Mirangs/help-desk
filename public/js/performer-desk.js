const adminTable = document.querySelector('.dashboard__table');

const fetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

adminTable.addEventListener('change', evt => {
  const fieldName = evt.target.getAttribute('name');
  const row = evt.target.parentNode.parentNode;
  const id = row.querySelector('.dashboard__item-id').textContent;

  const payload = {
    id,
    [fieldName]: evt.target.value
  }
  fetchOptions.body = JSON.stringify(payload);
  
  fetch('/performer-desk', fetchOptions)
    .then(res => res.json())
    .then(({ id }) => {
      const message = document.createElement('p');
      message.classList.add('dashboard__message');
      message.textContent = `Заявка ${id} була успішно змінена`;

      adminTable.parentNode.appendChild(message);

      setTimeout(() => {
        adminTable.parentNode.removeChild(message);
      }, 2000);
    });
});
