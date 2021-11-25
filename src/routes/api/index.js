const KoaRouter = require('koa-router');
const candidates = require('./candidates');

const router = new KoaRouter({ prefix: '/api' });

router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      const { status, message } = err;
      ctx.app.emit('error', err, ctx);
      ctx.status = status;
      ctx.body = {
        status,
        message,
      };
    } else {
      throw err;
    }
  }
});

router.get('api.base', '/', async (ctx) => {
  const usersCount = await ctx.orm.user.count();
  ctx.body = {
    message: 'Bienvenidos a la API de la Interrogación del curso IIC2513',
    usersCount,
  };
});

router.use('/candidates', candidates.routes());

module.exports = router;
