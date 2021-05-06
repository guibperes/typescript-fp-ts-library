import pino from 'pino';

export const logger = pino({
  redact: {
    remove: true,
    paths: [
      'hostname',
      'req.id',
      'req.headers',
      'req.remoteAddress',
      'req.remotePort',
      'res.headers',
    ],
  },
});
