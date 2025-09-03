const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'تست',
  description: 'اختبار البوت',
  usage: '.تست',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const fancyText = `
╭─❖ 『 👑 𝑲𝑰𝑬𝑩𝛩𝑻 』 ❖─╮
│
│ *»D𝐎𝐍'𝐓 𝐏𝑳𝐀𝐘 𝐖𝐈𝐓𝐇 »*
│ **≡𝑲𝑰𝑬 𝒍𝒊𝒌𝒆𝒅𝒂𝒔 🌹💋🌐**
│
╰────────────╯`;

      const imagePath = path.join(__dirname, '../media/image.jpeg');
      const hasImage = fs.existsSync(imagePath);
      const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: fancyText,
          contextInfo: {
            externalAdReply: {
              title: "☠️ 𝑲𝑰𝑬𝑩𝛩𝑻 ⚡",
              body: "جرب اللعب؟ جهّز نفسك للجحيم 🔥",
              thumbnail: imageBuffer,
              mediaType: 1,
              sourceUrl: "https://t.me/Sanji_Bot_Channel",
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        },
        { quoted: msg }
      );

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ حدث خطأ: ${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};