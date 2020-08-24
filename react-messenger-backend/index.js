const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 5039;

const knex = require('knex')({
  client: 'postgres',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'qweasd123',
    database: 'messenger'
  }
});

const seeding = async () => {
  try {
    await knex('message').del();
    await knex('groups_users').del();
    await knex('groups').del();
    await knex('users').del();

    users = [
      { id: 'be164c6f-13b0-4dc1-b6d8-e83278dc37a1', name: 'aldi' },
      { id: 'c2572514-d98d-4e61-8d80-ce314ebc018a', name: 'goldi' },
      { name: 'budi' },
      { name: 'zefanya' },
    ];

    groups = [
      { name: null },
      { name: 'Jawascript Indonesia' },
    ];

    const [u1, u2, u3, u4] = await knex.batchInsert('users', users).returning('id');
    const [g1, g2] = await knex.batchInsert('groups', groups).returning('id');

    groups_users = [
      { group_id: g1, user_id: u1 },
      { group_id: g1, user_id: u2 },
      { group_id: g2, user_id: u2 },
      { group_id: g2, user_id: u4 },
      { group_id: g2, user_id: u1 }
    ];

    messages = [
      // ------------- private chat -------------
      { sender_id: u1, group_id: g1, contents: 'haloooo selamat pagiii', created_at: '2020-08-21 02:29:55' },
      { sender_id: u1, group_id: g1, contents: 'haloooo duniaa', created_at: '2020-08-20 02:29:55' },
      { sender_id: u2, group_id: g1, contents: 'selamat pagiii jugaa', created_at: '2020-08-22 02:29:55' },
      // ------------- group chat -------------
      { sender_id: u3, group_id: g2, contents: 'ini apa yaaaaa', created_at: '2020-08-23 02:29:55' },
      { sender_id: u1, group_id: g2, contents: 'http://localhost', created_at: '2020-08-22 02:29:55' },
      { sender_id: u2, group_id: g2, contents: 'ah masa sih??', created_at: '2020-08-21 02:29:55' },
      { sender_id: u4, group_id: g2, contents: 'iya kamu', created_at: '2020-08-20 02:29:55' },
    ];

    await knex.batchInsert('groups_users', groups_users);
    await knex.batchInsert('message', messages);

  } catch (error) {
    throw error;
  }
};

const MessageService = {
  addNewMessage: async (table, data) => {
    await knex(table).insert(data);
  },
  getListMessage: async ({ user_id }) => {
    return await knex.raw(`select coalesce(g.name, (select u2.name from users u2 
      inner join groups_users gu2 on gu2.user_id = u2.id
      inner join groups g2 on g2.id = gu2.group_id 
      where u2.id != ? and g2.id = g.id)) as name,
      m.contents, g.id as group_id
      from message m
      join (select max(created_at) maxtime, group_id from message m group by group_id) as latest on m.created_at = latest.maxtime and m.group_id = latest.group_id
      inner join groups g on g.id = m.group_id 
      inner join groups_users gu on gu.group_id = g.id
      inner join users u on u.id = gu.user_id 
      where u.id = ?`, [user_id, user_id]
    ).then(({ rows }) => rows);
  },
  getMessagesOfGroup: async ({ group_id }) => {
    return await knex.raw(`select m.id, m.contents, m.sender_id, u.name as sender_name, m.created_at as sent_at FROM message m
      inner join users u on m.sender_id = u.id
      where group_id = '${group_id}' 
      order by m.created_at asc`
    ).then(({ rows }) => rows);
  },
};

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.get('/seed', async (req, res) => {
  try {
    await seeding();
    return res.status(200).json({ message: 'migrated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('reset', async () => await seeding());
  socket.on('api', data => console.log(data));

  socket.on('add-new-message', async data => {
    await MessageService.addNewMessage('message', data);
    console.log(data);
  });

  socket.on('list-message', async data => {
    const { where } = data;
    const result = await MessageService.getListMessage(where);
    console.log(result);
    socket.emit('list-message', result);
  });

  socket.on('list-message-of-group', async data => {
    const { where } = data;
    const result = await MessageService.getMessagesOfGroup(where);
    socket.emit('list-message-of-group', result);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

http.listen(PORT, () => console.log(`listen at port ${PORT}`));