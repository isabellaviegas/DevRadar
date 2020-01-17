const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index (request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store (request, response) {
        const { github_username, techs, latitude, longitude} = request.body;

        let dev = await Dev.findOne({github_username});

        if(!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            //await vai aguardar a função do get terminar de executar
            const {name = login, avatar_url, bio} = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point', 
                coordinates: [longitude, latitude]
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio, 
                techs: techsArray,
                location
            });

            //Filtrar as conecções que estão a no máximo 10km de distância e que 
            // o novo dev tenha pelo menos 1 das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);

        }
        return response.json(dev);
    },

    async update(request, response) {
        const { github_username, techs, latitude, longitude, name, bio, avatar_url} = request.body;
        const techsArray = parseStringAsArray(techs);
        const location = {
            type: 'Point', 
            coordinates: [longitude, latitude]
        };

        const dev = await Dev.findOneAndUpdate({github_username: github_username}, {
            name,
            bio,
            avatar_url,
            location,
            techs: techsArray
        }, {new: true});

        return response.json(dev);
    },

    async delete(request, response) {
        const {name: github_username} = request.params;
        const dev = await Dev.findOneAndDelete({github_username: github_username});
        
        return response.json(request.params);
    }
}