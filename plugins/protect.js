import { promises as fs } from 'fs';
import { join } from 'path';

export default {
    name: "Protection",
    command: ["المطلقة", "ح مطلقة"],
    category: "settings",
    description: "حماية المجموعة من التغييرات غير المصرح بها",
    version: "1.2.0",
    status: "on",
    execution: async ({ sock, m, args, prefix }) => {
        // Add elite check at the start

        const proJsonPath = join(process.cwd(), 'pro.json');
        
        let protectionData;
        try {
            try {
                const data = await fs.readFile(proJsonPath, 'utf8');
                protectionData = JSON.parse(data);
                if (!protectionData.groups) protectionData.groups = {};
            } catch (err) {
                if (err.code === 'ENOENT') {
                    protectionData = { groups: {} };
                    await fs.writeFile(proJsonPath, JSON.stringify(protectionData, null, 2));
                    console.log('[Protection Data] Created new pro.json with default structure');
                } else {
                    throw err;
                }
            }
        } catch (error) {
            console.error('[Protection Data] Error handling pro.json:', error);
            return sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ في معالجة ملف الحماية' });
        }

        const groupId = m.key.remoteJid;
        if (!groupId?.endsWith('@g.us')) return sock.sendMessage(m.key.remoteJid, { text: '❌ هذا الأمر يعمل في المجموعات فقط' });
        
        const groupMetadata = await sock.groupMetadata(groupId);
        const botNumber = sock.decodeJid(sock.user.id);
        const isBotAdmin = groupMetadata.participants.find(p => sock.decodeJid(p.id) === botNumber && p.admin);
        
        if (!isBotAdmin) {
            return sock.sendMessage(m.key.remoteJid, { text: '❌ يجب ترقية البوت إلى مشرف أولاً' });
        }

        if (!protectionData.groups[groupId]) {
            protectionData.groups[groupId] = {
                enabled: false,
                fullpro: false,
                admins: [],
                groupName: groupMetadata.subject,
                groupId: groupId,
                lastUpdate: new Date().toISOString()
            };
        }

        if (!args[0] || m.body === 'ح') {
            const currentAdmins = groupMetadata.participants
                .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                .map(p => ({
                    id: p.id,
                    admin: p.admin
                }));
            protectionData.groups[groupId] = {
                ...protectionData.groups[groupId],
                enabled: true,
                fullpro: false,
                admins: currentAdmins,
                lastUpdate: new Date().toISOString()
            };
            await fs.writeFile(proJsonPath, JSON.stringify(protectionData, null, 2));
            return sock.sendMessage(m.key.remoteJid, { text: '*✅ تم تفعيل الحماية*' });
        }

        switch (args[0]) {
            case 'حالة':
                const status = protectionData.groups[groupId];
                let statusMessage = `*📊 حالة الحماية في المجموعة:*\n\n`;
                statusMessage += `🛡️ الحماية العادية: ${status.enabled ? '✅ مفعلة' : '❌ معطلة'}\n`;
                statusMessage += `⚜️ الحماية المطلقة: ${status.fullpro ? '✅ مفعلة' : '❌ معطلة'}`;
                return sock.sendMessage(m.key.remoteJid, { text: statusMessage });

            case 'شغل':
                if (protectionData.groups[groupId].fullpro) {
                    protectionData.groups[groupId].fullpro = false;
                }
                protectionData.groups[groupId].enabled = true;
                protectionData.groups[groupId].lastUpdate = new Date().toISOString();
                await fs.writeFile(proJsonPath, JSON.stringify(protectionData, null, 2));
                return sock.sendMessage(m.key.remoteJid, { text: '✅ تم تفعيل الحماية العادية\n❎ تم تعطيل الحماية المطلقة تلقائياً' });

            case 'طفي':
                protectionData.groups[groupId].enabled = false;
                protectionData.groups[groupId].lastUpdate = new Date().toISOString();
                await fs.writeFile(proJsonPath, JSON.stringify(protectionData, null, 2));
                return sock.sendMessage(m.key.remoteJid, { text: '✅ تم تعطيل الحماية' });

            case 'مطلقة':
                if (args[1] === 'شغل') {
                    if (protectionData.groups[groupId].enabled) {
                        protectionData.groups[groupId].enabled = false;
                    }
                    protectionData.groups[groupId].fullpro = true;
                    await fs.writeFile(proJsonPath, JSON.stringify(protectionData, null, 2));
                    return sock.sendMessage(m.key.remoteJid, { 
                        text: '✅ تم تفعيل الحماية المطلقة\n❎ تم تعطيل الحماية العادية تلقائياً' 
                    });
                } else if (args[1] === 'طفي') {
                    protectionData.groups[groupId].fullpro = false;
                    await fs.writeFile(proJsonPath, JSON.stringify(protectionData, null, 2));
                    return sock.sendMessage(m.key.remoteJid, { 
                        text: '✅ تم تعطيل الحماية المطلقة' 
                    });
                }
                return sock.sendMessage(m.key.remoteJid, { 
                    text: '❌ الرجاء تحديد الحالة: ح مطلقة شغل/طفي' 
                });

            default:
                return sock.sendMessage(m.key.remoteJid, { 
                    text: '❌ أمر غير صالح\n\nاستخدم:\nح (تفعيل الحماية)\nح شغل (تفعيل الحماية)\nح طفي (تعطيل الحماية)\nح حالة (عرض حالة الحماية)\nح مطلقة شغل/طفي (التحكم بالحماية المطلقة)' 
                });
        }
    }
};