// plugins/bot.js
module.exports = {
  command: 'بوت',
  description: 'يعرض فيديو ترحيبي وزر الأوامر بأسلوب ملكي مرعب',
  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      video: { url: 'https://files.catbox.moe/qdjiqw.mp4' },
      caption: `╭━━〔البوت عمك😼〕━━⬣
│👤 الاسم: *🇩🇪//GERMAN*
│🫦 الحالة: عاوزين نسوان🫦
│✈️ السرعة: اسرع من خيالك جيب ادمن تشوف😼
│⛓️ المطور: امريكي 
│⚡ جاهز ياملك😼☝
╰━━〔 𝑲𝑰𝑬𝑩𝛩𝑻 〕━━⬣`*,
      buttons: [
        {
          buttonId: 'commands',
          buttonText: { displayText: '𝑲𝑰𝑬𝑩𝛩𝑻' },
          type: 1
        }
      ],
      headerType: 5,
    }, { quoted: msg });
  }
};