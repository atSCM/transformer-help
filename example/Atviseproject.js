const { Atviseproject, NodeId, Transformer } = require('atscm');
const setupHelp = require('@atscm/transformer-help');

const HelpTransformer = setupHelp(Transformer);

class ExampleProject extends Atviseproject {
  static get host() {
    return 'localhost';
  }

  static get port() {
    return {
      opc: 4840,
      http: 8080,
    };
  }

  static get nodes() {
    return [
      // Just some samples from the atvise standard resources
      new NodeId('SYSTEM.LIBRARY.PROJECT.OBJECTDISPLAYS.Advanced.button'),
      new NodeId('SYSTEM.LIBRARY.PROJECT.QUICKDYNAMICS.Move'),
    ];
  }

  static get useTransformers() {
    return [
      ...super.useTransformers,
      // Order matters here...
      new HelpTransformer(),
    ];
  }
}

module.exports = { default: ExampleProject };
