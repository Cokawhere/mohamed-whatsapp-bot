const { getGroupMembers } = require('../haykala/elite');

module.exports = {
  command: 'شير',
  category: 'اعلان',
  description: 'يعمل شير لمنشور الصحيفة بمنتشن جماعي',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    // جلب كل الأعضاء للمنشن
    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants || [];
    const mentions = participants.map(p => p.id);

    // الرسالة المزغرفة
    const text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*»D𝐎𝐍'𝐓 𝐏𝑳𝐀𝐘 𝐖𝐈𝐓𝐇 𝑲𝑰𝑬»*

*~_اهلا فـي صـحـيـفـة 𝑲𝑰𝑬𝑩𝛩𝑻:_~*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*ننشر اهم الاحداث الي بتصير في المنظمة و ننشر الزرفات الي جديدة و لا تنسو 🫦🍷*
*– نوزّع أرقام وهميّة (كل الدول)..*
*– مسابقات ع جروبات وكل حاجه..*
*– نزرف اي نوع جروبات عدا الاسلامي..*
*– مالنا صحايف تاني دي الرسمية..*
*– نرفع بوتات وسكربتات مُعدّلة..*
*– ننشر ثغرات حصرية وأبواب خلفية..*
*– أدوات اختراق وتحكم وسيطرة..*
*– تطبيقات مجال ونسخ واتساب معدلة..*
*– قواعد بيانات مُفلترة وجاهزة..*
*– محتوى يُحذف من باقي القروبات... لكن هنا يظل..*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*جـروبـاتـنـا:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*صـحـيفـة ┇✯┇ 𝑲𝑰𝑬*
*~『 https://chat.whatsapp.com/JpiCM6Cyd222uGCuHtW4IF?mode=r_c 』~*

*𝐓𝐇𝐈𝐒 𝐈𝐒 𝐒𝐓𝐔𝐏𝐈𝐃 𝐖𝐇𝐀𝐓 𝐇𝐀𝐏𝐏𝐄𝐍𝐒 𝐖𝐇𝐄𝐍 𝐘𝐎𝐔 𝐌𝐄𝐒𝐒 𝐖𝐈𝐓𝐇 𝐘𝐎𝐔𝐑 𝐌𝐀𝐒𝐓𝐄𝐑𝐒. ࿕*
*_WELCOME TO HELL_*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(chatId, {
      text,
      mentions
    }, { quoted: msg });
  }
};