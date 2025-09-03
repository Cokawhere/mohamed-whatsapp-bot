const fs = require('fs');
const { join } = require('path');

module.exports = {
    command: 'المطور',
    description: 'عرض معلومات المطور',
    usage: '.المطور',
    category: 'info',

    async execute(sock, msg) {
        try {
            const chatId = msg.key.remoteJid;

            const devName = "𝑺𝑶𝑵𝑮︎";
            const devTitle = "الماني";
            const devCountry = "🇩🇪🇩🇪";
            const devAge = "المهم كبير";
            const devNumber = "+491628301336";
            const telegramUser = "moham15d";
            const devVideoPath = join(process.cwd(), 'imaje.jpeg');

            const infoMessage = `
*╗═══━━━━━━━━━━🜲* 
*┃ﮩ  𝑲 𝑰 𝑬 ⟦⚙️⟧ 𝐁 ❍ 𝐓* 
*┃ﮩ*
*┃ﮩ ✯ الاسم:  ${devName}*
*┃ﮩ ✯ اللقب:  ${devTitle}*
*┃ﮩ ✯ الدولة:  ${devCountry}*
*┃ﮩ ✯ العمࢪ:  ${devAge}*
*┃ﮩ ✯ الࢪقم:  ${devNumber}*
*┃ﮩ ✯ تلجرام: 
> *ﮩ ${telegramUser}*
*╝═══━━━━━━━━━━🜲* 
💎 للتواصل عبر واتساب:
wa.me/${devNumber.replace(/\+/g, '')}
            `.trim();

            // إرسال جهة الاتصال أولاً
            const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${devName}
ORG:${devTitle}
TEL;type=CELL;waid=${devNumber}:${devNumber}
END:VCARD`;

            await sock.sendMessage(chatId, {
                contacts: {
                    displayName: devName,
                    contacts: [{ vcard }]
                }
            }, { quoted: msg });

            // بعدها يرسل الفيديو أو الرسالة
            if (fs.existsSync(devVideoPath)) {
                const videoBuffer = fs.readFileSync(devVideoPath);
                await sock.sendMessage(chatId, {
                    video: videoBuffer,
                    caption: infoMessage
                }, { quoted: msg });
            } else {
                await sock.sendMessage(chatId, { text: infoMessage }, { quoted: msg });
            }

        } catch (err) {
            console.error('❌ خطأ في أمر المطور:', err);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ أثناء عرض معلومات المطور:\n${err.message || err.toString()}`
            }, { quoted: msg });
        }
    }
};