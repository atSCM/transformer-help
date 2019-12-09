import { join, basename, extname } from 'path';
import { promises } from 'fs';
import styles from 'bulma/css/bulma.min.css';
import Template from './Template.svelte';

const readJson = path => promises.readFile(path, 'utf8').then(JSON.parse);

export default (Transformer: any) =>
  class HelpTransformer extends Transformer {
    // Do not pull help nodes
    transformFromDB(node, context) {
      if (node.hasTypeDefinition('VariableTypes.ATVISE.HtmlHelp')) {
        context.remove(node);
      }

      return Promise.resolve();
    }

    readNodeFile(node) {
      if (node.isGenerated) return false;
    }

    // Generate help nodes
    async transformFromFilesystem(node, context) {
      const { FileNode } = require('atscm/out/lib/gulp/src');
      const { ReferenceTypeIds } = require('atscm/out/lib/model/Node');

      // FIXME: Should we even handle non-qd scripts?
      if (node.isDisplay || node.isScript || node.isQuickDynamic) {
        const name = basename(node.idName, extname(node.idName));
        const jsonFile = join(node.relative, `${name}.json`);
        const { title, description, parameters } = await readJson(jsonFile);

        const { head, html, css } = Template.render({
          name: title || name,
          description,
          parameters,
        });
        const help = `<!doctype html>
<html>
  <head>
    ${head}
    <style>${styles}</style>
    <style>${css.code}</style>
  </head>
  <body>
    ${html}
  </body>
</html>`;

        const child = new FileNode({
          name: 'en',
          parent: node,
          dataType: 'ByteString',
          arrayType: 'Scalar',
          references: {
            [ReferenceTypeIds.toParent]: [47],
            [ReferenceTypeIds.HasTypeDefinition]: ['VariableTypes.ATVISE.HtmlHelp'],
          },
        });

        Object.assign(child, { isGenerated: true });

        child.setRawValue(Buffer.from(help));

        context._processNode(child);

        return node;
      }
    }
  };
