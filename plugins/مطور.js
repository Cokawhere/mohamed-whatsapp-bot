const path = require('path');
const fs = require('fs');

module.exports = {
  name: 'مطور',
  command: ['مطور'],
  category: 'عام',
  description: 'إرسال معلومات المطور وتعليمات التواصل.',
  args: [],
  hidden: false,

  async execute(sock, msg) {
    try {
      const developerNumber1 = '491628301336@s.whatsapp.net';
      const developerEmail = '';

      const vcard1 = `BEGIN:VCARD
VERSION:3.0
FN:❃𝑲𝑰𝑬𝑩𝛩𝑻
TEL;waid=201128344786:+201128344786
END:VCARD`;

      const vcard2 = `BEGIN:VCARD
VERSION:3.0
FN:𝑲𝑰𝑬𝑩𝛩𝑻
TEL;waid=201128344786:+201128344786
EMAIL:${developerEmail}
NOTE:الرقم ليس بوت، لو كتبت أوامر بيعطيك بلوك 🦈
END:VCARD`;

      // إرسال جهتي الاتصال دفعة واحدة
      await sock.sendMessage(msg.key.remoteJid, {
        contacts: {
          displayName: "𝑲𝑰𝑬𝑩𝛩𝑻",
          contacts: [
            { vcard: vcard1 },
            { vcard: vcard2 }
          ]
        }
      }, { quoted: msg });

      const instructionsText = `┃ مرحباً بك، هذا هو مطوري ↯↯

> *تعليمات قبل الدخول إليه لتجنب الحظر منه، الرجاء قراءتها قبل الدخول إليه*

> \`1 - الدخول للأسباب المهمة فقط\`
> \`2 - أرسل رسالة واحدة فيها كل ما يلزمك\`
> \`3 - ممنوع الدخول لأسباب تافهة\``;

      const thumbnailPath = path.join(__dirname, 'image.jpeg');
      const thumbnailBuffer = fs.existsSync(thumbnailPath) ? fs.readFileSync(thumbnailPath) : null;

      await sock.sendMessage(msg.key.remoteJid, {
        text: instructionsText,
        contextInfo: {
          externalAdReply: {
            title: 'مطور البوت',
            body: 'اضغط هنا لزيارة الدعم',
            thumbnail: thumbnailBuffer,
            mediaUrl: '',
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ أثناء تنفيذ أمر مطور:', error);
    }
  }
};