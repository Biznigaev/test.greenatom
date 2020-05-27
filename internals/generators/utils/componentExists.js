/**
 * componentExists
 *
 * Check whether the given component exist in either the components or pages directory
 */

const fs = require('fs');
const path = require('path');
const pageComponents = fs.readdirSync(
  path.join(__dirname, '../../../app/components'),
);
const pagepages = fs.readdirSync(
  path.join(__dirname, '../../../app/pages'),
);
const components = pageComponents.concat(pagepages);

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
