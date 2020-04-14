'use strict';

const Hapi = require('@hapi/hapi');
const axios = require('axios');


const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    });

    await server.register({
        plugin: require('hapi-cors'),
        options: {
          origins: ['*']
        }
    });

    server.route({
        method: ['GET'],
        path: '/{any*}',
        handler: async (request, h) => {
            const url = request.url.href.replace(request.url.origin, '').substr(1,)

            if (request.route.method == 'get') {
                return await axios.get(url)
                    .then(response => {
                        const data = response.data
                        return h.response(data).code(200)
                    }).catch(error => {
                        const data = {
                            "statusCode": 404,
                            "message": error.Error
                        }
                        return h.response(data).code(404)
                    })
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();