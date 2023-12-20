import Redis from 'ioredis';
import Document from '../modules/documents/Document.model.js';

const redisClient = new Redis({
    host: 'redis-3445ffdc-rohitkhan4141-ec69.a.aivencloud.com',
    port: 12952,
    username: 'default',
    password: 'AVNS_wompTucbkcNN7mGxy8P',
  });

async function handleSocket(io) {
  io.on('connection', (socket) => {
    socket.on('get-document', async (documentId) => {
      const document = await findOrCreateDocumentFromCacheOrDB(documentId);

      if (!document) {
        return;
      } else {
        socket.emit('load-document', document.content);
      }

      socket.join(documentId);

      socket.on('send-changes', (delta) => {
        socket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      socket.on('save-document', async (data) => {
        await updateDocument(documentId, data);
      });
    });
  });
}

async function findOrCreateDocumentFromCacheOrDB(id) {
  if (id == null) return;

  // Check if the document exists in the cache
  const cachedDocument = await redisClient.get(`document:${id}`);
  if (cachedDocument) {
    return JSON.parse(cachedDocument);
  }

  // If not in cache, fetch from the database
  const document = await Document.findById(id);
  if (document) {
    // Set the document in Redis cache for future use
    await redisClient.set(`document:${id}`, JSON.stringify(document));
    return document;
  }

  return null;
}

async function updateDocument(id, content) {
  if (id == null) return;

  await Document.findByIdAndUpdate(id, { content });

  // Update the cached document in Redis after updating in the database
  await redisClient.set(`document:${id}`, JSON.stringify({ _id: id, content }));
}

export { handleSocket };

