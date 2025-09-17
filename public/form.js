const form = document.getElementById('contactForm');
const notice = document.getElementById('notice');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    // honeypot: если заполнено — бот
    if (fd.get('hp_field')) {
        notice.textContent = 'Спасибо.';
        return;
    }

    const payload = {
        name: fd.get('name'),
        email: fd.get('email'),
        message: fd.get('message'),
    };

    try {
        const res = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const js = await res.json();
        if (res.ok) {
            notice.textContent = 'Сообщение отправлено — спасибо!';
            form.reset();
        } else {
            notice.textContent = 'Ошибка: ' + (js.error || res.statusText);
        }
    } catch (err) {
        notice.textContent = 'Сетeвая ошибка: ' + err.message;
    }
});
