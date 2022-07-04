const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('battle').setDescription('Préparer une bataille.'),
	new SlashCommandBuilder().setName('gobattle').setDescription('Démarrer la bataille.'),
	new SlashCommandBuilder().setName('list').setDescription('Afficher les participants de la bataille.'),
	new SlashCommandBuilder().setName('serv').setDescription('Afficher les infos du serveur.'),
	new SlashCommandBuilder().setName('user').setDescription('Afficher mes info membre.'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Les commandes de l\'application ont été enregistrées avec succès.'))
	.catch(console.error);