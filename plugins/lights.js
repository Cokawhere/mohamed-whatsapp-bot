const promiseTimeout = (ms, promise) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timed Out')), ms))
  ]);
};

export default {
  name: 'لعب',
  command: ['لعب'],
  category: 'ألعاب',
  description: 'مراقبة رسائل المجموعة لمدة 2 دقيقة و 5 ثواني وإدارة النظام',
  args: [],
  execution: async ({ sock, m, args, prefix, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: 'هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
    const participants = groupMetadata.participants;
    const messageCounts = {};
    const activeUsers = participants.map(p => p.id);
    const admins = participants.filter(p => p.admin).map(p => p.id);

    let isGreen = true;
    let totalTime = 125000;
    let greenDuration = 9000;
    let redDuration = 5000;
    const startTime = Date.now();

    let removedPlayers = false;
    let isMonitoring = false;

    await sock.sendMessage(m.key.remoteJid, { text: '*بدأت اللعبة!*' });

    const messageListener = async (chatUpdate) => {
      const message = chatUpdate.messages[0];
      const sender = message.key.participant || message.key.remoteJid;

      if (message.key.remoteJid !== m.key.remoteJid || !message.message) return;

      // تسجيل عدد الرسائل لكل مستخدم
      messageCounts[sender] = (messageCounts[sender] || 0) + 1;

      if (!isMonitoring) return;

      if (!isGreen && sender !== sock.user.id && !admins.includes(sender)) {
        try {
          await promiseTimeout(10000, sock.groupParticipantsUpdate(m.key.remoteJid, [sender], 'remove'));
          await sock.sendMessage(m.key.remoteJid, {
            text: `*تم إقصاء لاعب!* @${sender.split('@')[0]}`,
            mentions: [sender],
          });

          removedPlayers = true;
        } catch (error) {
          console.error('Error while removing participant:', error.message);
        }
      }
    };

    sock.ev.on('messages.upsert', messageListener);

    while (Date.now() - startTime < totalTime) {
      if (isGreen) {
        await sock.sendMessage(m.key.remoteJid, { text: '🟢' });
      } else {
        await sock.sendMessage(m.key.remoteJid, { text: '🔴' });

        isMonitoring = false;
        await sleep(1000);
        isMonitoring = true;
      }

      const duration = isGreen
        ? greenDuration > 3000
          ? greenDuration
          : Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000
        : Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000;

      await sleep(duration);

      isGreen = !isGreen;

      if (isGreen && greenDuration > 3000) {
        greenDuration = 3000;
      }
    }

    sock.ev.off('messages.upsert', messageListener);
    await sock.sendMessage(m.key.remoteJid, { text: '*انتهى الوقت! سيتم تصفية جميع من هم أقل من 20 رسالة*' });

    const toRemove = [];
    const toKeep = [];

    for (const user of activeUsers) {
      const count = messageCounts[user] || 0;
      if (count >= 20) {
        toKeep.push({ id: user, count });
      } else {
        toRemove.push(user);
      }
    }

    const toRemoveWithoutAdmins = toRemove.filter(user => !admins.includes(user));

    if (toRemoveWithoutAdmins.length > 0) {
      await sock.groupParticipantsUpdate(m.key.remoteJid, toRemoveWithoutAdmins, 'remove');
    }

    toKeep.sort((a, b) => b.count - a.count);

    const mentionText = toKeep
      .map(user => `@${user.id.split('@')[0]} : ${user.count}`)
      .join('\n');

    const resultsMessage = `عدد الذين خسرو : ${toRemoveWithoutAdmins.length}\nعدد الذين تبقوا : ${toKeep.length}\n\n${mentionText}`;

    await sock.sendMessage(m.key.remoteJid, { text: resultsMessage, mentions: toKeep.map(user => user.id) });

    for (const key in messageCounts) {
      delete messageCounts[key];
    }
  },
  hidden: false,
};