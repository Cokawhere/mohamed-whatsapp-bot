const حماية_الجروبات = new Map(); // لكل جروب حالته
module.exports = {
  command: 'ذكيه',
  description: 'تفعيل أو تعطيل الحماية الذكية للجروب',
  category: 'الحماية',

  async handler(sock, m, args) {
    const النص = args.join(' ').trim().toLowerCase();
    const id = m.chat;

    if (نص === 'طفي' || نص === 'ايقاف' || نص === 'إيقاف') {
      if (!حماية_الجروبات.get(id)) {
        return sock.sendMessage(id, { text: '🚫 الحماية بالفعل متوقفة.' });
      }
      حماية_الجروبات.set(id, false);
      return sock.sendMessage(id, { text: '🔒 تم إيقاف الحماية للجروب.' });
    }

    if (حماية_الجروبات.get(id)) {
      return sock.sendMessage(id, { text: '✅ الحماية مفعلة بالفعل.' });
    }

    حماية_الجروبات.set(id, true);
    return sock.sendMessage(id, { text: '🛡️ تم تفعيل الحماية للجروب.' });
  },

  // نوفر الوصول للحالة من الخارج
  حماية_الجروبات
};