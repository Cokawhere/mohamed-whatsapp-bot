
const traps = {}; // خزن الفخاخ هنا

module.exports = {
    command: 'not',
    description: 'إلغاء الفخ عن شخص محدد بالمنشن أو الرد',
    usage: '.الغاء_الفخ @شخص',
    category: 'zarf',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        let targetJid;

        // جلب الشخص من المنشن أو الرد
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            targetJid = msg.message.extendedTextMessage.contextInfo.participant;
        } else {
            return await sock.sendMessage(groupJid, { text: '❗ حدد الشخص بالمنشن أو الرد.' }, { quoted: msg });
        }

        // تحقق من وجود فخ نشط لهذا الشخص
        if (traps[groupJid] && traps[groupJid][targetJid]) {
            clearInterval(traps[groupJid][targetJid].intervalId);
            delete traps[groupJid][targetJid];
            await sock.sendMessage(groupJid, { text: `✅ تم إلغاء الفخ عن <@${targetJid.split('@')}>` }, { quoted: msg, mentions: [targetJid] });
        } else {
            await sock.sendMessage(groupJid, { text: '❗ لا يوجد فخ نشط لهذا الشخص.' }, { quoted: msg });
        }
    }
};
