import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

// Fetches all artists
app.get('/artists', async (_, response) => {
  const artists = await prisma.artist.findMany();

  response.json({
    success: true,
    payload: artists,
    message: 'Operation Successful',
  });
});

// Creates a new artist
app.post('/artists', async (request, response) => {
  const { email, name } = request.body;

  const result = await prisma.artist.create({
    data: {
      email,
      name,
    },
  });
  response.json({
    success: true,
    payload: result,
  });
});

// Fetches all released songs
app.get('/playlist', async (_, response) => {
  const songs = await prisma.song.findMany({
    where: { released: true },
    include: { singer: true },
  });

  response.json({
    success: true,
    payload: songs,
  });
});

// Fetches all released songs
app.get('/songs', async (_, response) => {
  const songs = await prisma.song.findMany();

  response.json({
    success: true,
    payload: songs,
  });
});

// Fetches a specific song by its ID
app.get('/songs/:id', async (request, response) => {
  const { id } = request.params;

  const song = await prisma.song.findFirst({
    where: { id: Number(id) },
  });

  response.json({
    success: true,
    payload: song,
  });
});

// Creates (or compose) a new song (unreleased)
app.post('/songs', async (request, response) => {
  const { title, content, singerEmail } = request.body;

  const result = await prisma.song.create({
    data: {
      title,
      content,
      released: false,
      singer: { connect: { email: singerEmail } },
    },
  });
  response.json({
    success: true,
    payload: result,
  });
});

// Sets the released field of a song to true
app.put('/songs/release/:id', async (request, response) => {
  const { id } = request.params;

  const song = await prisma.song.update({
    where: { id: Number(id) },
    data: { released: true },
  });
  response.json({
    success: true,
    payload: song,
  });
});

// Deletes a song by its ID
app.delete('/songs/:id', async (request, response) => {
  const { id } = request.params;

  const song = await prisma.song.delete({
    where: { id: Number(id) },
  });
  response.json({
    success: true,
    payload: song,
  });
});

app.use((req, res, _) => {
  res.status(404);

  return res.json({
    success: false,
    payload: null,
    message: `API SAYS: Endpoint not found for path: ${req.path}`,
  });
});

const port = 3333;

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(
    `🚀 Server started at ${new Date().toLocaleDateString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })} on Port ${port}!`,
  );
});
