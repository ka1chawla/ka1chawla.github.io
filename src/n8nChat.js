const webhookUrl =
  'https://kashishchawla.app.n8n.cloud/webhook/f863991d-b7d1-4922-a35a-97af424f4421/chat'

void import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
  .then(({ createChat }) => {
    createChat({ webhookUrl })
  })
  .catch((err) => {
    console.error('[n8n chat] failed to load', err)
  })
