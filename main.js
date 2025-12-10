$(document).ready(function () {
  // Set current year in footer
  $('#year').text(new Date().getFullYear());

  const closeModal = () => {
    $('#confirmation-modal').fadeOut();
  };

  // Close modal on button, close icon, or backdrop click
  $('#modal-button').on('click', closeModal);
  $('.close').on('click', closeModal);
  $('#confirmation-modal').on('click', function (e) {
    if (e.target === this) closeModal();
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contactForm = event.target;
    const formData = new FormData(contactForm);

    // Validate reCAPTCHA
    const recaptchaToken = formData.get('g-recaptcha-response');
    if (!recaptchaToken) {
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }

      $('#modal-title').text('Error!');
      $('#modal-message').text('Please verify that you are not a robot by solving the captcha.');
      $('#confirmation-modal').fadeIn();
    } else {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams([...formData]).toString(),
      })
        .then(() => {
          contactForm.reset();
          if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
          }

          $('#modal-title').text('Form submitted!');
          $('#modal-message').text("Thanks for contacting us. We've received your message and our team will be in touch to assist you.");
          $('#confirmation-modal').fadeIn();
        })
        .catch(() => {
          contactForm.reset();
          if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
          }

          $('#modal-title').text('Uh Oh!');
          $('#modal-message').text('We encountered an issue with your submission. Please review your details and try again.');
          $('#confirmation-modal').fadeIn();
        });
    }
  };

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
});
