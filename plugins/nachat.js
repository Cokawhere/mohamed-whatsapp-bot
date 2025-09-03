export default 
    status: "on",
    name: 'suggestActivity',
    command: ['اقتراح_نشاط'],
    category: 'fun',
    description: 'اقتراح نشاط عشوائي للمجموعة',
    execution: async ( sock, m ) => 
        try 
            const activities = [
                '🎬 مشاهدة فيلم "Inception"',
                '📖 قراءة كتاب "الخيميائي" لباولو كويلو',
                '👨‍🍳 تجربة وصفة "المقلوبة"',
                '🎨 رسم منظر طبيعي',
                '🧘‍♂️ ممارسة التأمل لمدة 10 دقائق',
                // أضف المزيد من الأنشطة هنا
            ];
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            await sock.sendMessage(m.key.remoteJid,  text: `اقتراح اليوم:{randomActivity}` }, { quoted: m });
        } catch (err) {
            console.log('خطأ في اقتراح النشاط:', err);
        }
    }
};
