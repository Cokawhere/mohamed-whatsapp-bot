const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/userGroupData.json');

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        if (!id.endsWith('@g.us')) return;

        // تحميل الداتا من json مباشرة
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(raw);

        // التحقق من الترحيب
        if (action === 'add' && data.welcome?.[id]?.enabled) {
            const welcomeData = data.welcome[id];
            const welcomeMessage = welcomeData.message || 'أهلًا @منشن في قروب @قروب 🎉';

            let groupMetadata = { subject: 'القروب', desc: 'لا يوجد وصف' };
            try {
                groupMetadata = await sock.groupMetadata(id);
            } catch (e) {
                console.error('فشل في جلب بيانات القروب:', e.message);
            }

            const groupName = groupMetadata.subject;
            const groupDescription = groupMetadata.desc || 'لا يوجد وصف';

            for (const participant of participants) {
                const user = participant.split('@')[0];
                const finalMessage = welcomeMessage
                    .replace(/@منشن/g, `@${user}`)
                    .replace(/@قروب/g, groupName)
                    .replace(/@وصف/g, groupDescription);

                let profilePicUrl;
                try {
                    profilePicUrl = await sock.profilePictureUrl(participant, 'image');
                } catch {
                    profilePicUrl = 'https://i.imgur.com/2wzGhpF.jpeg';
                }

                await sock.sendMessage(id, {
                    image: { url: profilePicUrl },
                    caption: finalMessage,
                    mentions: [participant]
                });
            }
        }

        // التحقق من المغادرة
        if (action === 'remove' && data.goodbye?.[id]?.enabled) {
            const goodbyeData = data.goodbye[id];
            const goodbyeMessage = goodbyeData.message || 'وداعًا @منشن 👋';

            for (const participant of participants) {
                const user = participant.split('@')[0];
                const finalMessage = goodbyeMessage.replace(/@منشن/g, `@${user}`);

                await sock.sendMessage(id, {
                    text: finalMessage,
                    mentions: [participant]
                });
            }
        }
    } catch (err) {
        console.error('خطأ في handleGroupParticipantUpdate:', err);
    }
}

module.exports = {
    handleGroupParticipantUpdate
};