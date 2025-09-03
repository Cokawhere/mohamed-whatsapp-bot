// روح صلي يورع 🗿
const fs = require('fs');
const path = require('path');

// ملف لتخزين حالة كل جروب
const DATA_PATH = path.join(__dirname, '..', 'data', 'islam-groups.json');

// تحميل أو إنشاء ملف الحالات
function loadGroups() {
    if (!fs.existsSync(DATA_PATH)) return {};
    return JSON.parse(fs.readFileSync(DATA_PATH));
}
function saveGroups(data) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// أوقات الصلاة لسيدي العابد
const prayerTimes = [
    { hour: 4, minute: 36, name: "الفجر" },
    { hour: 13, minute: 42, name: "الظهر" },
    { hour: 17, minute: 21, name: "العصر" },
    { hour: 20, minute: 51, name: "المغرب" },
    { hour: 22, minute: 23, name: "العشاء" }
];

const hadith = "قال ﷺ: «الصلاة عماد الدين، من أقامها فقد أقام الدين.»";
const city = "سيدي العابد - المغرب";

// وظيفة إرسال التذكير
async function sendPrayerReminder(sock, groupId, prayer) {
    const msg = `
🕌 *تذكير بصلاة ${prayer.name}* 🕌
📍 *${city}*
${hadith}

⏰ حان الآن وقت *صلاة ${prayer.name}*!
فضلاً توقفوا عن الدردشة وتهيؤوا للصلاة 🙏

(سيتم إعادة فتح الدردشة خلال 5 ثوانٍ)
`;

    try {
        await sock.groupSettingUpdate(groupId, 'announcement');
        await sock.sendMessage(groupId, { text: msg });
        setTimeout(async () => {
            await sock.groupSettingUpdate(groupId, 'not_announcement');
            await sock.sendMessage(groupId, { text: "✅ تم فتح الدردشة للجميع! تقبل الله منا ومنكم 🤲" });
        }, 5000);
    } catch (err) {
        console.error("خطأ في إرسال التذكير:", err);
    }
}

// مراقبة الأمر .إسلام تشغيل / .إسلام ايقاف
module.exports = {
    command: 'إسلام',
    description: 'تفعيل أو إيقاف تذكير أوقات الصلاة في الجروب',
    category: 'دين',
    usage: '.إسلام تشغيل | .إسلام ايقاف',
    async execute(sock, msg) {
        const groupId = msg.key.remoteJid;
        if (!groupId.endsWith('@g.us')) return;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const args = text.trim().split(/\s+/);
        const subCmd = args?.toLowerCase();

        let groups = loadGroups();

        if (subCmd === 'تشغيل') {
            groups[groupId] = true;
            saveGroups(groups);
            return sock.sendMessage(groupId, { text: '✅ تم تفعيل تذكير أوقات الصلاة في هذا الجروب!' }, { quoted: msg });
        }
        if (subCmd === 'ايقاف') {
            groups[groupId] = false;
            saveGroups(groups);
            return sock.sendMessage(groupId, { text: '🛑 تم إيقاف تذكير أوقات الصلاة في هذا الجروب!' }, { quoted: msg });
        }

        return sock.sendMessage(groupId, { text: 'اكتب:\n.إسلام تشغيل\nأو\n.إسلام ايقاف' }, { quoted: msg });
    }
};

// مهمة التذكير كل دقيقة (مرة واحدة فقط عند أول تحميل)
if (!global._islamPrayerInterval) {
    global._islamPrayerInterval = setInterval(async () => {
        const now = new Date();
        const groups = loadGroups();
        for (const prayer of prayerTimes) {
            if (now.getHours() === prayer.hour && now.getMinutes() === prayer.minute) {
                for (const groupId in groups) {
                    if (groups[groupId]) {
                        try {
                            // sock الأساسي لازم يكون معرف في global
                            const sock = global.sock || global.client;
                            if (sock) {
                                await sendPrayerReminder(sock, groupId, prayer);
                            } else {
                                console.log("sock غير معرف!");
                            }
                        } catch (e) {
                            console.error("خطأ أثناء إرسال التذكير:", e);
                        }
                    }
                }
            }
        }
    }, 60000);
}