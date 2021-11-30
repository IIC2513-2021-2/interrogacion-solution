const KoaRouter = require('koa-router');
const differenceInYears = require('date-fns/differenceInYears');
const format = require('date-fns/format');
const { selectedOptions } = require('../../utils');

const router = new KoaRouter();

function generateSlug(str) {
  return str.toLowerCase()
    .replace(/á/, 'a')
    .replace(/é/, 'e')
    .replace(/í/, 'i')
    .replace(/ó/, 'o')
    .replace(/ú/, 'u')
    .replace(/\s+/g, '-');
}

router.param('id', async (id, ctx, next) => {
  const candidate = await ctx.orm.candidate.findByPk(id);
  if (!candidate) ctx.throw(404, "The candidate you are looking for doesn't exist");
  ctx.state.candidate = candidate;
  await next();
});

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

router.get('api.candidates.proposals', '/:id/proposals', async (ctx) => {
  const { candidate } = ctx.state;
  const proposals = await candidate.getProposals();

  let response;
  if (selectedOptions.proposals === 'first') {
    response = proposals.map(({ topic, content, createdAt }) => {
      const nameParts = candidate.name.split(' ');
      return {
        [topic]: content,
        candidateLastName: nameParts[nameParts.length - 1],
        createdAt: format(createdAt, 'PPP'),
      };
    });
  } else {
    response = proposals.reduce((acc, { topic, content }) => ({
      ...acc,
      [generateSlug(topic)]: {
        topic,
        content,
        candidate: candidate.name,
      },
    }), {});
  }

  ctx.body = response;
});

module.exports = router;
