const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { isElite, extractPureNumber } = require('../haykala/elite.js');

const archiveName = 'ASHURA-BOT.7z';
const zipFilePath = path.join(process.cwd(), archiveName);
const botFolderPath = process.cwd();

module.exports = {
  command: 'اسكربتي',
  description: 'ضغط سكربت البوت للنخبة فقط',
  usage: '.اسكربتي',
  category: 'owner',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = extractPureNumber(senderJid);

      if (!isElite(senderNumber)) {
        return await sock.sendMessage(chatId, {
          text: "🚫 هذا الأمر مخصص فقط لأعضاء النخبة.",
        }, { quoted: msg });
      }

      const sent = await sock.sendMessage(chatId, {
        text: `📦 جاري ضغط السكربت لأقصى درجة...`,
      }, { quoted: msg });

      // 🔐 ضغط عالي مع استثناء ملفات لا تؤثر على التشغيل
      const zipCommand = `7z a -t7z -mx=9 "${archiveName}" * -xr!node_modules -xr!*.lock -xr!pre-key-*.json -xr!sessions -xr!.git -xr!cache -xr!temp -xr!*.zip`;

      exec(zipCommand, { cwd: botFolderPath, maxBuffer: 1024 * 1024 * 500 }, async (error, stdout, stderr) => {
        if (error) {
          return await sock.sendMessage(chatId, {
            text: `❌ فشل في ضغط الملفات:\n${error.message || stderr}`,
          }, { quoted: msg });
        }

        if (!fs.existsSync(zipFilePath)) {
          return await sock.sendMessage(chatId, {
            text: `❌ لم يتم إنشاء الملف.`,
          }, { quoted: msg });
        }

        // 📤 إرسال الملف
        await sock.sendMessage(chatId, {
          document: fs.readFileSync(zipFilePath),
          mimetype: 'application/x-7z-compressed',
          fileName: archiveName,
        }, { quoted: msg });

        // 🧹 حذف الملف بعد الإرسال
        fs.unlinkSync(zipFilePath);
        await sock.sendMessage(chatId, {
          text: `✅ تم إرسال الملف بنجاح وتم حذفه من التخزين.`,
        }, { quoted: msg });
      });

    } catch (err) {
      console.error('❌ خطأ في أمر اسكربتي:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ فشل:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  }
};