// src/service/UsuarioService.ts 
export interface User {
  id: string;
  email: string;
  password: string;
}

export const usersDB: User[] = [
  {
    id: '1',
    email: 'estudiante@gmail.com',
    password: '1234'
  }
];

export const usuarioService = {
  // Retorna todos los usuarios
  findAllUsers: (): User[] => {
    return usersDB;
  },

  findByEmail: (email: string): User | undefined => {
    return usersDB.find((u) => u.email === email);
  },

  createUser: (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      id: String(usersDB.length + 1),
      ...userData
    };
    usersDB.push(newUser);
    return newUser;
  },

  validateCredentials: (email: string, password: string): User | null => {
    const user = usersDB.find((u) => u.email === email && u.password === password);
    return user || null;
  },
    updatePassword: async (email: string, newPassword: string): Promise<User | null> => {
    const user = usersDB.find((u) => u.email === email);
    if (!user) return null;
    user.password = newPassword;
    return user;
  }
};
