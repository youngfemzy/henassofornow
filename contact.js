document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) window.lucide.createIcons();

  const rfqForm = document.getElementById('rfqForm');
  if (!rfqForm) return;

  // --- Modal Elements ---
  const overlay   = document.getElementById('formModal');
  const modalIcon = document.getElementById('formModalIcon');
  const modalTitle = document.getElementById('formModalTitle');
  const modalMsg  = document.getElementById('formModalMsg');
  const modalClose = document.getElementById('formModalClose');

  function showModal(type, title, message) {
    modalIcon.className = 'form-modal-icon ' + type;
    modalIcon.innerHTML = type === 'success'
      ? '<i data-lucide="check" style="width:30px;height:30px"></i>'
      : '<i data-lucide="alert-circle" style="width:30px;height:30px"></i>';
    modalTitle.textContent = title;
    modalMsg.textContent = message;
    overlay.classList.add('show');
    if (window.lucide) window.lucide.createIcons();
  }

  function hideModal() {
    overlay.classList.remove('show');
  }

  modalClose.addEventListener('click', hideModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) hideModal();
  });

  // --- Form Submit ---
  rfqForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = rfqForm.querySelector('.contact-form-submit');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    const data = new FormData(rfqForm);

    fetch('core/process-contact.php', {
      method: 'POST',
      body: data
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        showModal('success', 'Inquiry Submitted', result.message);
        rfqForm.reset();
      } else {
        showModal('error', 'Submission Failed', result.message || 'Something went wrong. Please try again.');
      }
    })
    .catch(() => {
      showModal('error', 'Network Error', 'Could not reach the server. Please check your connection and try again.');
    })
    .finally(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    });
  });
});
