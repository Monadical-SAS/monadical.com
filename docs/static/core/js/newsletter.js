function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const successMessage = form.querySelector('.success-message');
    const email = form.querySelector('input[name="email"]').value;

    fetch('https://forms.monadical.com/submit/newsletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
    })
    .then(response => {
        if (!response.ok) throw new Error('Submission failed');
        successMessage.style.display = 'block';
        form.reset();
        setTimeout(() => successMessage.style.display = 'none', 5000);
    })
    .catch(error => {
        alert('Submission failed: ' + error.message);
    });
}