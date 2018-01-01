// copy this file to config.js and change the values to suit your deployment

module.exports = {
    email : {
        host        : 'smtp.gmail.com',
        user        : 'your.email@yourprovider.com',
        password    : 'yourpassword',
        sender      : 'Your Name <your.email@yourprovider.com>'
    },
    siteName : 'tenn16',
    domainName : 'tenn16.co.uk',
    //mongoDbName : 'tenn16',
    mongoDbName: process.env.MONGODB_URI,
    port : 8080
}