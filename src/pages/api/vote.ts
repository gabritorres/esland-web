import { addUserVotes, cleanUserVotes, createBasicTable } from '@/db/client';
import { type APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const username = session?.user?.name;

  if (!username) {
    return new Response('Unauthorized', { status: 401 });
  }

  let votesToSave = [];
  try {
    const { votes } = await request.json();
    // validar la estructura de los votos
    // se podría hacer con zod
    votesToSave = votes;
  } catch (e) {
    return new Response('Bad Request', { status: 400 });
  }

  console.log('estamos por aqui');

  try {
    console.log('entramos al try');
    await createBasicTable();
    console.log('creamos la tabla');
    // await cleanUserVotes(username);
    // await addUserVotes(username, votesToSave);
  } catch (e) {
    console.error(e);
    return new Response('Internal Server Error', { status: 500 });
  }

  return new Response('ok', { status: 200 });
};
