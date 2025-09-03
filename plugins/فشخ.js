const { isElite, extractPureNumber } = require('../haykala/elite');
const fs = require('fs');
const { join } = require('path');

module.exports = {
  command: 'فشخ',
  description: 'يرسل رسالة فشخ مع منشن خفي لكل الجروب',
  category: 'النخبة',

  async execute(sock, msg, args = []) {
    try {
      // رقم المرسل بصيغة نقية بدون @ و : 
      const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
      const senderNumber = extractPureNumber(senderJid);

      // معرف الجروب
      const groupJid = msg.key.remoteJid;

      // تحقق ان الأمر فقط في الجروبات
      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, { text: '❌ هذا الأمر يعمل فقط في القروبات.' }, { quoted: msg });
      }

      // تحقق صلاحيات النخبة
      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, { text: '*ما معك صلاحية دز*' }, { quoted: msg });
      }

      // جلب بيانات الجروب وأعضاءه
      const metadata = await sock.groupMetadata(groupJid);
      const mentions = metadata.participants.map(p => p.id);

      // نص الرسالة اللي تبي ترسلها
      const replyText = `
╭─❍ 『 *𝐅𝐀𝐂𝐄 𝐁𝐑𝐄𝐀𝐊𝐄𝐑* 』 ❍

│ 👣 بختصار تم فشخك و زرفك ونكحك و و و...؟

> *اذا عرفت انـتقـم* :

★─────────────────╰`;

      // ارسال الرسالة مع منشن خفي للجميع
      return sock.sendMessage(groupJid, {
        text: replyText,
        mentions
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};