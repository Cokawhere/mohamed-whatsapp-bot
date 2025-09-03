export default {
    status: "on",
    name: 'compliment',
    command: ['مدحني'],
    category: 'fun',
    description: 'يرسل لك مدح عشوائي',
    execution: async ({ sock, m }) => {
        try {
            const compliments = [
                '✨ أنت شخص مميز جدًا!',
                '🌟 حضورك يضيء أي مكان تكون فيه.',
                '🧠 ذكاؤك يلفت الانتباه!',
                '💪 قوتك الداخلية مُلهمة.'
            ];
            const msg = compliments[Math.floor(Math.random() * compliments.length)];
            await sock.sendMessage(m.key.remoteJid, { text: msg }, { quoted: m });
        } catch (error) {
            console.error('🚫 خطأ في كود المدح:', error);
        }
    }
};