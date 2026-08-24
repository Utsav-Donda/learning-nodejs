// A small hand-rolled validator — enough to demonstrate the pattern
// without pulling in a schema library like zod or joi. In a larger app,
// a schema library pays for itself quickly; for one resource, this is
// plenty.
function validateTodoInput(body) {
  const errors = [];

  if (typeof body.title !== 'string' || body.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'title is required and must be a non-empty string' });
  } else if (body.title.length > 200) {
    errors.push({ field: 'title', message: 'title must be 200 characters or fewer' });
  }

  if (body.done !== undefined && typeof body.done !== 'boolean') {
    errors.push({ field: 'done', message: 'done must be a boolean if provided' });
  }

  return errors; // empty array = valid
}

module.exports = { validateTodoInput };
