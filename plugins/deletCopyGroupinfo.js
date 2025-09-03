// أمر حذف: يحذف النسخة المحددة من النسخ المحفوظة
import fs from 'fs';
import path from 'path';

export default {
  name: 'حذف',
  command: ['حذف_حفظ'],
  category: 'نسخ قروبات',
  description: 'يحذف النسخة المحددة من النسخ المحفوظة',
  args: ['اسم نسخة محفوظة من قروب تبي  تحذفها'],
  hidden: false,
  execution: async ({ sock, m, args, prefix, sleep }) => {
    // التأكد من أن الأمر يعمل داخل مجموعة فقط
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: 'هذا الأمر يعمل فقط داخل المجموعات.' });
    }
    const senderNumber = m.key.participant;
    // التحقق من تقديم اسم النسخ المطلوب حذفه
    if (args.length === 0) {
      return sock.sendMessage(m.key.remoteJid, { text: 'يرجى تحديد اسم النسخ الذي تريد حذفه.' });
    }
    const copyName = args.join(' ');
    const baseDir = path.join('tmp', 'copy-group', copyName);
    if (!fs.existsSync(baseDir)) {
      return sock.sendMessage(m.key.remoteJid, { text: `النسخة "${copyName}" غير موجودة.` });
    }
    try {
      fs.rmSync(baseDir, { recursive: true, force: true });
      sock.sendMessage(m.key.remoteJid, { text: `تم حذف النسخة "${copyName}" بنجاح.` });
    } catch (error) {
      console.error('خطأ أثناء حذف النسخة:', error);
      sock.sendMessage(m.key.remoteJid, { text: 'حدث خطأ أثناء محاولة حذف النسخة.' });
    }
  },
};