const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'سرقه',
  description: 'يسرق الملصق ويرسله بحقوقك',
  async execute(sock, msg) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    if (!quoted) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗ رد على ملصق بـ سرقه',
      }, { quoted: msg });
    }

    try {
      const stream = await downloadContentFromMessage(quoted, 'sticker');
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      await sock.sendMessage(msg.key.remoteJid, {
        sticker: buffer,
        packname: "ْ سونغ 𝑲𝑰𝑬 عــــــــمِــــــــكَ",
        author: "شفت الحقوق دي انقذ فرعك",
      }, { quoted: msg });
    } catch (error) {
      console.error(error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❗ حدث خطأ أثناء سرقة الملصق',
      }, { quoted: msg });
    }
  },
};