module.exports = {
  command: 'تستو',
  description: '⚙️ اختبار أداء البوت',
  usage: '.تست',
  category: 'tools',

  async execute(sock, msg) {
    try {
      let botProfilePic;
      try {
        botProfilePic = await sock.profilePictureUrl(sock.user.id, 'image');
      } catch {
        botProfilePic = 'https://i.imgur.com/8TnZ4Rv.png';
      }

      const messageText = `
🕷 *𝑲𝑰𝑬𝑩𝛩𝑻*
━━━━━━━━━━━━━━
✅ *Online*
⚡ *Power : MAX*
🆔 *ID :* ${sock.user.id}
━━━━━━━━━━━━━━
_I'm here..._
      `.trim();

      const message = {
        text: messageText,
        mentions: [msg.sender],
        contextInfo: {
          mentionedJid: [msg.sender],
          externalAdReply: {
            title: "🕷 𝑩𝛩𝑻 - 𝑲𝑰𝑬",
            body: "⚡ Ready for action.",
            thumbnailUrl: botProfilePic,
            sourceUrl: `https://wa.me/491628301336`,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (error) {
      console.error('❌ Test Command Error:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حدث خطأ أثناء تنفيذ الأمر.',
      }, { quoted: msg });
    }
  }
};