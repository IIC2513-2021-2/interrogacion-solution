const KoaRouter = require('koa-router');
const differenceInYears = require('date-fns/differenceInYears');

const router = new KoaRouter();

router.get('api.candidates.index', '/', async (ctx) => {
  const candidates = await ctx.orm.candidate.findAll();
  ctx.body = candidates.map(({
    id, name, party, birthdate, description, photo, votes,
  }) => ({
    id,
    name,
    party,
    years: differenceInYears(new Date(), new Date(birthdate)),
    description,
    photo,
    votes,
  }));
});

module.exports = router;
