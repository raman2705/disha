const Icon = () => null;

module.exports = new Proxy(
  {},
  {
    get: () => Icon
  }
);
