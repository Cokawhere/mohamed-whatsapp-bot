const path = require('path');

module.exports = {
    command: 'الاوامر',
    async execute(sock, m) {
        try {
            const chatId = m.key.remoteJid;

            const message = `
*~┓━ ╼•╃⌬〔☁〕⌬╄•╾ ━┏~*
 *أڪــــــواد لــجمـيــــ؏ الأوامـــــࢪ*
*┛━━━━━━━••━━━━━━━┗*

*. اوامر*
*. اوامر1*
*. اوامر2*
*. اوامر3*
*. اوامر4*
*. اوامر5*
*. اوامر6*

⚙️ *تطوير بواسطة:* ⤸𝑲𝑰𝑬𝑩𝛩𝑻⤹
            `.trim();

            const imagePath = path.join(__dirname, 'input.jpg');

            await sock.sendMessage(chatId, {
                image: { url: imagePath },
                caption: message
            });
        } catch (error) {
            console.error('حدث خطأ أثناء تنفيذ أمر بوت:', error);
        }
    }
};