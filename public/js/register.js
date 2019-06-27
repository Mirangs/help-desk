const form = document.querySelector(".register__form");

const getFormData = async form => {
  const firstName = form
    .querySelector('[name="first-name"]')
    .getAttribute("value");
  const lastName = form
    .querySelector('[name="last-name"]')
    .getAttribute("value");
  const middleName = form
    .querySelector('[name="middle-name"]')
    .getAttribute("value");
  const birthday = form
    .querySelector('[name="birthday"]')
    .getAttribute("value");
  const phone = form.querySelector('[name="phone"]').getAttribute("value");
  const email = form.querySelector('[name="email"]').getAttribute("value");
  const pass = form.querySelector('[name="pass"]').getAttribute("value");
  const pass2 = form.querySelector('[name="pass2"]').getAttribute("value");
  const login = form.querySelector('[name="login"]').getAttribute("value");
  const post = form.querySelector('[name="post"]').getAttribute("value");
  const department = form
    .querySelector('[name="department"]')
    .getAttribute("value");
  const sex = form.querySelector('[name="sex"]').getAttribute("value");

  const res = {
    firstName,
    lastName,
    middleName,
    birthday,
    phone,
    email,
    pass,
    login,
    post,
    department,
    sex
  }

  return {
      firstName,
      lastName,
      middleName,
      birthday,
      phone,
      email,
      pass,
      login,
      post,
      department,
      sex
  }
}
