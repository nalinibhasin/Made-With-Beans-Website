// ============================================
// MADE WITH BEANS — Commission form logic
// Handles file picker UI + async submission to Formspree
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initFileDropZone();
  initFormSubmit();
});

function initFileDropZone() {
  const dropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('reference');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const fileLabel = document.getElementById('fileDropLabel');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
      fileLabel.textContent = 'Reference selected:';
    } else {
      fileNameDisplay.textContent = '';
      fileLabel.textContent = 'Tap to upload a reference photo';
    }
  });

  // drag & drop support
  ['dragenter', 'dragover'].forEach(evt =>
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add('is-dragover');
    })
  );
  ['dragleave', 'drop'].forEach(evt =>
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.remove('is-dragover');
    })
  );
  dropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      fileNameDisplay.textContent = e.dataTransfer.files[0].name;
      fileLabel.textContent = 'Reference selected:';
    }
  });
}

function initFormSubmit() {
  const form = document.getElementById('commissionForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const actionUrl = form.getAttribute('action');
    if (!actionUrl || actionUrl.includes('YOUR_FORM_ID')) {
      statusEl.textContent = "Form isn't connected yet — see setup note in the code, or email us directly at coffee@madewithbeans.com.";
      statusEl.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const formData = new FormData(form);
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent = "Thanks! Your request has been sent — we'll be in touch soon.";
        statusEl.className = 'form-status success';
        form.reset();
        document.getElementById('fileNameDisplay').textContent = '';
        document.getElementById('fileDropLabel').textContent = 'Tap to upload a reference photo';
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      statusEl.textContent = "Something went wrong sending your request. Please email us directly at coffee@madewithbeans.com.";
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send request';
    }
  });
}
