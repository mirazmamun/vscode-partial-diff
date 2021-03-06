const vscode = require('vscode')
const Bootstrapper = require('./bootstrapper')
const CommandFactory = require('./command-factory')
const ConfigStore = require('./config-store')
const ContentProvider = require('./content-provider')
const { EXTENSION_SCHEME } = require('./const')
const NormalisationRuleStore = require('./normalisation-rule-store')
const SelectionInfoRegistry = require('./selection-info-registry')
const TextResourceUtil = require('./text-resource-util')

class BootstrapperFactory {
  create () {
    const logger = console
    const selectionInfoRegistry = new SelectionInfoRegistry()
    const textResourceUtil = this._createTextResourceUtil()
    const normalisationRuleStore = this._createNormalisationRuleStore()
    const commandFactory = new CommandFactory({
      normalisationRuleStore,
      selectionInfoRegistry,
      textResourceUtil,
      vscode,
      logger
    })
    const contentProvider = new ContentProvider({
      normalisationRuleStore,
      selectionInfoRegistry,
      textResourceUtil
    })
    return new Bootstrapper({
      contentProvider,
      vscode,
      commandFactory
    })
  }

  _createTextResourceUtil () {
    return new TextResourceUtil({
      Uri: vscode.Uri,
      extensionScheme: EXTENSION_SCHEME,
      getCurrentDateFn: () => new Date()
    })
  }

  _createNormalisationRuleStore () {
    return new NormalisationRuleStore({
      configStore: new ConfigStore({ workspace: vscode.workspace })
    })
  }
}

module.exports = BootstrapperFactory
