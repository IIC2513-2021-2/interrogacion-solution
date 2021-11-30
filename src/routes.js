const KoaRouter = require('koa-router');

const candidates = require('./routes/candidates');
const index = require('./routes/index');
const { options, selectedOptions } = require('./utils');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  ctx.state.paths = {
    index: ctx.router.url('index'),
    candidates: ctx.router.url('candidates'),
    theory: ctx.router.url('theory'),
    selectLanding: ctx.router.url('select-landing'),
    selectProposals: ctx.router.url('select-proposals'),
  };
  ctx.state.path = ctx.path;
  ctx.state.options = options;
  ctx.state.selectedOptions = selectedOptions;

  await next();
});

router.use('/', index.routes());
router.use('/candidates', candidates.routes());

module.exports = router;
