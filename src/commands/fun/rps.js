const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../configs/config');
const User = require('../../database/models/User');

// Logic game RPS từ file game.js cũ
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
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Chơi Kéo-Búa-Bao với bot!'),
    
    async execute(interaction) {
        // Tạo select menu với các lựa chọn
        const choices = Object.keys(RPSChoices).map(choice => ({
            label: choice.charAt(0).toUpperCase() + choice.slice(1),
            value: choice,
            description: RPSChoices[choice].description
        }));
        
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('rps_select')
                    .setPlaceholder('Chọn đối tượng của bạn')
                    .addOptions(choices)
            );
        
        await interaction.reply({
            content: '🎮 Chọn đối tượng để chơi:',
            components: [row],
            ephemeral: false
        });
    }
};
