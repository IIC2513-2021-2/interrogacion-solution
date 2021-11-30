require('dotenv').config();

const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const differenceInYears = require('date-fns/differenceInYears');
const format = require('date-fns/format');
const { selectedOptions } = require('../../utils');

const router = new KoaRouter();

function buildCandidatePayload(candidate) {
  const {
    id, name, party, birthdate, description, photo, votes,
  } = candidate;
  return {
    id,
    name,
    party,
    years: differenceInYears(new Date(), new Date(birthdate)),
    description,
    photo,
    votes,
  };
}

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
  ctx.body = candidates.map(buildCandidatePayload);
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

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));

router.post('api.candidates.votes', '/:id/votes', async (ctx) => {
  const { candidate } = ctx.state;
  await candidate.update({ votes: candidate.votes + 1 });
  ctx.status = 201;
  ctx.body = buildCandidatePayload(candidate);
});

router.patch('api.candidates.update', '/:id', async (ctx) => {
  const { candidate } = ctx.state;
  const { description, ...restBody } = ctx.request.body;
  if (Object.keys(restBody).length) ctx.throw(400, 'Only description can be updated');
  try {
    await candidate.update({ description });
  } catch (ValidationError) {
    ctx.throw(422, ValidationError.message);
  }

  ctx.body = buildCandidatePayload(candidate);
});

module.exports = router;
