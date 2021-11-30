const KoaRouter = require('koa-router');
const { selectedOptions } = require('../utils');

const router = new KoaRouter();

router.get('index', '/', async (ctx) => {
  const { landing: landingOptions } = ctx.state.options;
  await ctx.render(landingOptions[selectedOptions.landing].view);
});

router.post('select-landing', 'select-landing', (ctx) => {
  const { selectedLanding } = ctx.request.body;
  selectedOptions.landing = selectedLanding;
  ctx.redirect(ctx.router.url('index'));
});

router.post('select-proposals', 'select-proposals', (ctx) => {
  const { selectedProposals } = ctx.request.body;
  selectedOptions.proposals = selectedProposals;
  ctx.redirect(ctx.router.url('index'));
});

router.get('theory', 'preguntas-teoricas', async (ctx) => {
  await ctx.render('static/preguntas-teoricas');
});

module.exports = router;
