export const sanitizeInput = (req, _res, next) => {
  const sanitize = (value) => {
    if (typeof value === 'string') return value.replace(/[<>$]/g, '');
    if (Array.isArray(value)) return value.map(sanitize);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitize(v)]));
    }
    return value;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};
