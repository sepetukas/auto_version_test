/**
 * Application environment configuration
 */
module.exports = {
    local: {
        api: "http://localhost:3000"
    },
    e2e: {
        api: "https://cibc-omni-channel.devbstaging.com:3002"
    },
    dev: {
        api: "https://cibc-omni-channel.devbstaging.com:3000"
    },
    stg: {
        api: "https://cibc-omni-channel.devbstaging.com:3001"
    },
    prod: {
        api: "https://cibc-omni-channel.devbstaging.com:3000"
    }
};
