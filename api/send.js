export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body || {};
    // простая валидация
    if (!message || !email) {
        return res.status(400).json({ error: 'Не заполнены обязательные поля' });
    }

    // Формируем текст сообщения для Telegram
    const text = `Новая обратная связь:\nИмя: ${name || '-'}\nEmail: ${email}\n\nСообщение:\n${message}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Server misconfiguration: missing env vars' });
    }

    try {
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
            }),
        });

        const data = await tgRes.json();
        if (!data.ok) {
            return res.status(502).json({ error: 'Telegram API error', details: data });
        }

        // CORS для разных хостов (при необходимости замените * на ваш домен)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        return res.status(200).json({ ok: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
