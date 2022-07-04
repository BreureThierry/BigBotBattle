const { Client, Intents, MessageEmbed, Guild } = require('discord.js');
const { token, channel, timer, authorizedId, guildId } = require('./config.json');
const { players, prepa, phrases, phrases2, winPhrases } = require('./phrases.json');

const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'], 
});
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Lorsque le client est prêt, fais ce code (une seule fois !)
client.once('ready', () => {
	console.log(`${client.user.tag} est connecté`);
  client.user.setActivity(`ZQSD`, { type: 'WATCHING' });
  const myGuild = client.guilds.cache.get(guildId);
  const botRole = myGuild.roles.cache.find(role => role.name === 'BigBotBattle');
  console.log(`Role trouvé !\n${botRole.name}`);
});

////////////////////////////////////////////////////////////
//////////////////////// INTERACTION ///////////////////////
////////////////////////////////////////////////////////////
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
  authorizedId.forEach(ok => {if (interaction.user.id != authorizedId) return; })
  
  const { commandName } = interaction;
  const chan = client.channels.cache.get(channel);
  ////////////////////////////////////////////////////////////
  ////////////////////// B A T T L E /////////////////////////
  if (interaction.commandName === 'battle') {
    console.log(`La commande /battle à été tapé par ${interaction.user.tag} (${interaction.user.username})`);
    const embed = new MessageEmbed()
    .setColor('#5d1a1a')
    .setTitle('**Nouvelle bataille !**')
    .setAuthor({ name: client.user.username, iconURL: "https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".jpeg" })
    .setThumbnail("https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".jpeg")
    .addFields(
      { name: '● Comment participer ?', value: 'Réagit à ce message en cliquant sur la réaction : 🦾' },
      { name: '● Infos', value: "- Pas de retour en arrière une fois inscrit.\n- La bataille est générée aléatoirement.\n- Les combattants s'affronte jusqu'à la mort.\n- Les combats s'enchaînerons jusqu'au dernier survivant.\n- Le dernier debout gagne la bataille." },
      { name: '● Comment jouer ?', value: "Une fois inscris, tu n'a plus rien à faire, le jeu se fera tout seul" },
    )
    .setTimestamp()
    .setFooter({ text: `Proposé par ${interaction.user.username}`, iconURL: "https://cdn.discordapp.com/avatars/"+interaction.user.id+"/"+interaction.user.avatar+".jpeg" });

    const message = await interaction.reply({ content: '@here', embeds: [embed], fetchReply: true})
    message.react('🦾');
    ////////////////////////////////////////////////////////////
    /////////////////// G O  B A T T L E ///////////////////////
  } else if (commandName === 'gobattle') {
    console.log(`La commande /gobattle à été tapé par ${interaction.user.tag} (${interaction.user.username})`);
    client.user.setActivity('la bataille !', { type: 'COMPETING' });
    goBattle()
    ////////////////////////////////////////////////////////////
    ////////////////////// S E R V E R /////////////////////////
  } else if (commandName === 'serv') {
    console.log(`La commande /serv à été tapé par ${interaction.user.tag}`);
    await interaction.reply(`**Nom du serveur :** ${interaction.guild.name}\n**Membres :** ${interaction.guild.memberCount}`);
    ////////////////////////////////////////////////////////////
    //////////////////////// U S E R ///////////////////////////
  } else if (commandName === 'user') {
    console.log(`La commande /user à été tapé par ${interaction.user.tag} (${interaction.user.username})`);
    await interaction.reply(`**Ton tag :** ${interaction.user.tag}\n**Ton id :** ${interaction.user.id}`);
    ////////////////////////////////////////////////////////////
    /////////////////////// L I S T E //////////////////////////
  } else if (commandName === 'list') {
    console.log(`La commande /list à été tapé par ${interaction.user.tag} (${interaction.user.username})`);
    var participants = [];
    players.forEach(p => {
      var randomPrepa = Math.floor(Math.random() * prepa.length);
      participants.push(`\n**${p}** ${prepa[randomPrepa]}`)
    });
    const listEmbed = new MessageEmbed()
      .setColor('#5d1a1a')
      .setTitle('**Liste des combatants !**')
      .setAuthor({ name: client.user.username, iconURL: "https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".jpeg" })
      .setDescription(`${participants}`)
      .setThumbnail("https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".jpeg")
      .setTimestamp()
      .setFooter({ text: `Proposé par ${interaction.user.username}`, iconURL: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/95/959045dd3ea937a7096442dcbb9fa020885bfe62_full.jpg' });
      chan.send({ embeds: [listEmbed], ephemeral: true });
  }
  ////////////////////////////////////////////////////////////
  //////////////////// R E A C T I O N ///////////////////////
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.username === players.find(p => p == user.username)){}
    else{players.push(user.username);}
    console.log(`il y a ${reaction.count} réaction(s)`);
  });
});
client.setMaxListeners(0);
/////////////////////////////// FONCTION REMOVEPLAYER()
async function removePlayer(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
/////////////////////////////// FONCTION BATTLE()
async function battle(){
  players.forEach(p => {
    // Les phrases random
    var random = Math.floor(Math.random() * phrases.length);
    var random2 = Math.floor(Math.random() * phrases2.length);
    var winRandom = Math.floor(Math.random() * winPhrases.length);
    // On récupère 2 joueurs aléatoirement
    p1 = players[Math.floor(Math.random() * players.length)];
    p2 = players[Math.floor(Math.random() * players.length)];

    // Si 'p1' est différent de 'p2'
    if(p1 != p2) {
      // 'p2' sort du combat (supprimé du tableau [players])
      removePlayer(players, p2);
      const battleEmbed = new MessageEmbed()
      .setColor('#5d1a1a')
      .setTitle(`**Combat !**`)
      .setAuthor({ name: client.user.username, iconURL: "https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".jpeg" })
      .setDescription(`**${p1}** ${phrases[random]} **${p2}** ${phrases2[random2]}`)
      .setTimestamp()
      client.channels.cache.get(channel).send({ embeds: [battleEmbed] });
      // Sinon, ('p1' identique à 'p2')
    }else{
      //  On redéfinis 'p1' et 'p2' aléatoirement
      p1 = players[Math.floor(Math.random() * players.length)]; 
      p2 = players[Math.floor(Math.random() * players.length)];
    }
    // Si 1 seul joueurs dans le tableau players[]
    if (players.length === 1) {
      // Message de victoire
      client.user.setActivity(players[0], { type: 'WATCHING' });
      const battleEmbed = new MessageEmbed()
      .setColor('#b61616')
      .setTitle(`**Victoire !**`)
      .setAuthor({ name: client.user.username, iconURL: "https://cdn.discordapp.com/avatars/"+client.user.id+"/"+client.user.avatar+".jpeg" })
      .setDescription(`\n**${players[0]} ${winPhrases[winRandom]}**`)
      .setTimestamp()
      client.channels.cache.get(channel).send({ embeds: [battleEmbed] });
      clearInterval(roundInterval);
    }
  });
}
async function goBattle(){
  roundInterval = setInterval(function() {battle()}, timer);
}
////////////////////////////////////////////////////////////
//////////////////////////// LOGIN /////////////////////////
////////////////////////////////////////////////////////////
client.login(token);