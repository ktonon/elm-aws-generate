const generateElmPackage = ({ dots, util }) => (metadata) => {
  const it = Object.assign({}, metadata);

  it.mod = util.moduleName(metadata);

  return dots.elmPackage(it);
};

module.exports = generateElmPackage;
