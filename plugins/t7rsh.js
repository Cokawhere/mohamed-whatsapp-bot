const fs = require('fs'); const { eliteNumbers } = require('../haykala/elite');

module.exports = { command: 'تحرش', async execute(sock, m) { const chatId = m.key.remoteJid; const sender = m.key.participant || m.participant || m.key.remoteJid; const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

const contextInfo = m.message?.extendedTextMessage?.contextInfo || {};
    const mentionedJids = contextInfo.mentionedJid || [];
    const repliedJid = contextInfo.participant;

    let target = null;

    if (mentionedJids.length > 0) {
        target = mentionedJids[0];
    } else if (repliedJid) {
        target = repliedJid;
    }

    const flirtQuotes = [
        "🫦 جسمك عاجبني، ليه منجربش مع بعض ونولعها؟",
        "🫦 نفسي ألمس كل تفصيلة فيك.. بإيدي وشفايفي كمان.",
        "🫦 لما بشوفك، جسمي بيتشد ليك من غير ما أحس.",
        "🫦 تعالى ننسى الدنيا ونعيش اللحظة بكل تفاصيلها.",
        "🫦 كل حاجة فيك بتقولي قرب أكتر.. متبعدش.",
        "🫦 لو قربتك، مش هسيبك غير وإنت مش قادر تقوم.",
        "🫦 شهوتي مش بتسكت غير لما تكون معايا بالكامل.",
        "🫦 عايزك جنبي.. في حضني.. في كل تفصيلة فيا.",
        "🫦 نفسك بيغري، وصوتك بيكمل الإثارة.",
        "🫦 إنتي نار.. وانا جاهز أتحرق بكل رضا.",
        "🫦 قربك بيخليني أفقد السيطرة على كل حاجة.",
        "🫦 خليني أكتشف جسمك بلساني قبل عيني.",
        "🫦 تعالى نكتب ليلة متتنسيش في تاريخ الشوق.",
        "🫦 عايز ألمسك، أسمعك، أحسك، وأعيشك.",
        "🫦 خليني ألمس رغبتك وأعيش تفاصيلك كلها.",
        "🫦 كل جزء فيك بيصرخلي تعالى قرب.",
        "🫦 نفسي أنام على صدرك وأنسى الدنيا كلها.",
        "🫦 شفايفك بتناديني.. ومش قادر أقاوم أكتر.",
        "🫦 تعالي خلينا نتوه في بعضنا وننسى كل شي تاني.",
        "🫦 إنت مش بس مثيرة، إنتِ جريمة إغراء مكتملة.",
        "🫦 حضنك هو الجنة اللي بدور عليها كل ليلة.",
        "🫦 كل ملمس منك هو حلم نفسي أعيشه بالواقع.",
        "🫦 همستك في ودني تقدر تخلي قلبي يولع.",
        "🫦 قربك بيخليني أنسى اسمي وكل حاجة فيا."
    ];

    const randomQuote = flirtQuotes[Math.floor(Math.random() * flirtQuotes.length)];

    if (chatId.endsWith('@g.us')) {
        // داخل جروب
        if (!target) {
            return sock.sendMessage(chatId, {
                text: `❴✾❵──━━━━❨🍷❩━━━━──❴✾❵\n*منشن او رد علي حد متبقاش غبي 🗿*\n❴✾❵──━━━━❨🍷❩━━━━──❴✾❵`
            }, { quoted: m });
        }

        if (
            target === botNumber ||
            eliteNumbers.includes(target) ||
            mentionedJids.includes(botNumber) ||
            repliedJid === botNumber
        ) {
            return sock.sendMessage(chatId, {
                text: `❴✾❵──━━━━❨🍷❩━━━━──❴✾❵\n*عاوز تتحرش بلملك ياكلب 🗿*\n❴✾❵──━━━━❨🍷❩━━━━──❴✾❵`
            }, { quoted: m });
        }

        const username = target.split('@')[0];
        const message = `🫦 @${username}, ${randomQuote}`;
        await sock.sendMessage(chatId, { text: message, mentions: [target] }, { quoted: m });

    } else {
        // في الخاص
        const message = `🫦 ${randomQuote}`;
        await sock.sendMessage(chatId, { text: message }, { quoted: m });
    }
}

};

