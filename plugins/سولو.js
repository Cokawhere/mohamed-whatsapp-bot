const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'سولو',
    description: 'اختبار البوت',
    usage: '.كينج',
    category: 'tools',

    async execute(sock, msg) {
        try {
            const decoratedText = `
╭─❖ 『 👑 𝑲𝑰𝑬𝑩𝛩𝑻 』 ❖─╮
│
> انت تفتخر انك جنب سونغ
│
╰────────────╯`;

            const imagePath = path.join(__dirname, '../media/black.jpg');
            const hasImage = fs.existsSync(imagePath);
            const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

            await sock.sendMessage(
                msg.key.remoteJid,
                {
                    text: decoratedText,
                    contextInfo: {
                        externalAdReply: {
                            title: "👑 𝑲𝑰𝑬𝑩𝛩𝑻⚡",
                            body: "𝑺𝑬𝑹𝑽𝑬𝑹 𝑼𝑵𝑪𝑳𝑬 is always watching...",
                            thumbnail: imageBuffer,
                            mediaType: 1,
                            sourceUrl: "https://t.me/Sanji_Bot_Channel",
                            renderLargerThumbnail: false,
                            showAdAttribution: true
                        }
                    },
                    mentions: [msg.sender]
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error('❌ خطأ في تنفيذ كينج:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ: ${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};