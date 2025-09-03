const fs = require('fs');

module.exports = {
    command: 'الاكثر',
    async execute(sock, m) {
        const chatId = m.key.remoteJid;

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, { text: `🚫 هذا الأمر يعمل فقط في *المجموعات*!` });
        }

        const mostQuestions = [
            "🌀 من الأكثر كسلاً في المجموعة؟",
            "🌀 من الأكثر ذكاءً؟",
            "🌀 من الأكثر شهرة؟",
            "🌀 من الأكثر خفة دم؟",
            "🌀 من الأكثر إزعاجًا؟",
            "🌀 من الأكثر مشاهدة للأنمي؟",
            "🌀 من الأكثر استخدامًا للواتساب؟",
            "🌀 من الأكثر غموضًا؟",
            "🌀 من الأكثر حبًا للأكل؟",
            "🌀 من الأكثر نسيانًا؟",
            "🌀 من الأكثر إثارة للجدل؟",
            "🌀 من الأكثر هدوءًا؟",
            "🌀 من الأكثر حبًا للنوم؟",
            "🌀 من الأكثر تصرفًا بجنون؟",
            "🌀 من الأكثر رومانسية؟",
            "🌀 من الأكثر قوة شخصية؟",
            "🌀 من الأكثر جرأة؟",
            "🌀 من الأكثر سرعة في الرد؟",
            "🌀 من الأكثر تأخيرًا في الرد؟",
            "🌀 من الأكثر حبًا للمشاكل؟"
        ];

        const random = mostQuestions[Math.floor(Math.random() * mostQuestions.length)];

        await sock.sendMessage(chatId, { text: random });
    }
};