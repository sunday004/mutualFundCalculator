exports.validateNumber = (value) => {
    return typeof value === 'number' && !isNaN(value);
};
