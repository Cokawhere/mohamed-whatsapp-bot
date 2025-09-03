module.exports = {
  command: 'ت',
  description: 'عرض تفاصيل الهوية بشكل مرعب.',
  category: 'info',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const info = `
🔻⚠️【⚠️ تحذير أمني ⚠️】🔻

- ✦ المنظمة : 𝑺𝑶𝑳𝑶 🕷
- ✦ المطور : 𝑲𝑰𝑵𝑮 ⚡️
- ✦ آخر تعديل : 📆 13 / 7 / 2025

⛔ أي محاولة نسخ أو تقليد سيتم تتبعها...
☠️ النظام مؤمن بكود جحيمي.

━━━━━━━━━━━━━━
`;

    await sock.sendMessage(jid, { text: info }, { quoted: msg });
  }
};