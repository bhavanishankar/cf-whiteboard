var config = {}
config.port = process.env.VCAP_APP_PORT || 4000
module.exports = config;
