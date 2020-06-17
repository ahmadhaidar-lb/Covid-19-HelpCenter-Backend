const users = [];

const addUser = ({ id, data }) => {
  let name = data.userId;
  let room = data.room;
  /* const existingUser = users.find((user) => user.room === room && user.name === name);
   */
  if (!name || !room) return { error: 'Username and room are required.' };
 /*  if (existingUser) 
  {
    
    users.push(existingUser);
    return {existingUser}
  }
 */
  const user = { id, name, room };

  users.push(user);
 
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);
const getUserById=(id)=>users.find((user)=>user.name===id);
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { getUserById,addUser, removeUser, getUser, getUsersInRoom };