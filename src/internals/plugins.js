'use strict'

const pluginsById = {}
const pluginList = []

function list() {
    return pluginList
}

function register(plugin) {
    pluginList.push(plugin)
    pluginsById[plugin.id] = plugin
}

function buildServiceContext(contextId) {
    return {
        logger: require('./logger')(contextId),
        config: require('./config')
    }
}

function run (pluginId) {
    pluginsById[pluginId].run({
        twitter: require('../services/twitter')(buildServiceContext(pluginId)),
        slack: require('../services/slack')(buildServiceContext(pluginId))
    })
}

function runAll () {
    Object.keys(pluginsById).forEach(run)
}

function load() {
    register(require('../plugins/pixelDailies'))
}

module.exports = { list, register, run, runAll, load }
