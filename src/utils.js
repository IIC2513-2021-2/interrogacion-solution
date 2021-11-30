const options = {
  landing: {
    first: {
      title: 'Wireframe 1',
      view: 'static/index',
    },
    second: {
      title: 'Wireframe 2',
      view: 'static/index_second',
    },
  },
  proposals: {
    first: {
      title: 'Proposals 1',
    },
    second: {
      title: 'Proposals 2',
    },
  },
};

const selectedOptions = {
  landing: 'first',
  proposals: 'first',
};

module.exports = {
  options,
  selectedOptions,
};
