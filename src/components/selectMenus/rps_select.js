const { EmbedBuilder } = require('discord.js');
const config = require('../../configs/config');
const User = require('../../database/models/User');

// Logic game RPS
const RPSChoices = {
    rock: {
        description: 'sedimentary, igneous, or perhaps even metamorphic',
        virus: 'outwaits',
        computer: 'smashes',
        scissors: 'crushes',
    },
    cowboy: {
        description: 'yeehaw~',
        scissors: 'puts away',
        wumpus: 'lassos',
        rock: 'steel-toe kicks',
    },
    scissors: {
        description: 'careful ! sharp ! edges !!',
        paper: 'cuts',
        computer: 'cuts cord of',
        virus: 'cuts DNA of',
    },
    virus: {
        description: 'genetic mutation, malware, or something inbetween',
        cowboy: 'infects',
        computer: 'corrupts',
        wumpus: 'infects',
    },
    computer: {
        description: 'beep boop beep bzzrrhggggg',
        cowboy: 'overwhelms',
        paper: 'uninstalls firmware for',
        wumpus: 'deletes assets for',
    },
    wumpus: {
        description: 'the purple Discord fella',
        paper: 'draws picture on',
        rock: 'paints cute face on',
        scissors: 'admires own reflection in',
    },
    paper: {
        description: 'versatile and iconic',
        virus: 'ignores',
        cowboy: 'gives papercut to',
        rock: 'covers',
    },
};

function getResult(p1Choice, p2Choice) {
    if (RPSChoices[p1Choice] && RPSChoices[p1Choice][p2Choice]) {
        return { winner: 'player', verb: RPSChoices[p1Choice][p2Choice] };
    } else if (RPSChoices[p2Choice] && RPSChoices[p2Choice][p1Choice]) {
        return { winner: 'bot', verb: RPSChoices[p2Choice][p1Choice] };
    } else {
        return { winner: 'tie', verb: 'tie' };
    }
}

module.exports = {
    id: 'rps_select',
    async execute(interaction, client) {
        const playerChoice = interaction.values[0];
        const botChoice = Object.keys(RPSChoices)[Math.floor(Math.random() * Object.keys(RPSChoices).length)];
        
        const result = getResult(playerChoice, botChoice);
        
        let title, description, color;
        
        if (result.winner === 'player') {
            title = '🎉 Bạn thắng!';
            description = `**${playerChoice}** của bạn ${result.verb} **${botChoice}** của bot!`;
            color = config.colors.success;
            
            // Cập nhật stats nếu có DB
            try {
                if (process.env.MONGO_URI) {
                    await User.findOneAndUpdate(
                        { userId: interaction.user.id },
                        { 
                            $inc: { gamesPlayed: 1, gamesWon: 1, points: 10 },
                            $set: { username: interaction.user.tag }
                        },
                        { upsert: true, new: true }
                    );
                }
            } catch (err) {
                console.error('Lỗi cập nhật DB:', err);
            }
        } else if (result.winner === 'bot') {
            title = '😢 Bot thắng!';
            description = `**${botChoice}** của bot ${result.verb} **${playerChoice}** của bạn!`;
            color = config.colors.error;
            
            // Cập nhật stats
            try {
                if (process.env.MONGO_URI) {
                    await User.findOneAndUpdate(
                        { userId: interaction.user.id },
                        { 
                            $inc: { gamesPlayed: 1 },
                            $set: { username: interaction.user.tag }
                        },
                        { upsert: true, new: true }
                    );
                }
            } catch (err) {
                console.error('Lỗi cập nhật DB:', err);
            }
        } else {
            title = '🤝 Hòa!';
            description = `Cả hai đều chọn **${playerChoice}**!`;
            color = config.colors.warning;
            
            // Cập nhật stats
            try {
                if (process.env.MONGO_URI) {
                    await User.findOneAndUpdate(
                        { userId: interaction.user.id },
                        { 
                            $inc: { gamesPlayed: 1 },
                            $set: { username: interaction.user.tag }
                        },
                        { upsert: true, new: true }
                    );
                }
            } catch (err) {
                console.error('Lỗi cập nhật DB:', err);
            }
        }
        
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: '👤 Bạn chọn', value: playerChoice, inline: true },
                { name: '🤖 Bot chọn', value: botChoice, inline: true }
            )
            .setTimestamp();
        
        await interaction.update({ 
            content: null, 
            embeds: [embed], 
            components: [] 
        });
    }
};
