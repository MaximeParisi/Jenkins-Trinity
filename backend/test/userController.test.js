const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const {
  getUser,
  getAllUsers,
  updateUser,
  setRole,
  deleteUser
} = require('../controllers/user.controller');

jest.mock('../models/user.model');
jest.mock('../models/role.model');
jest.mock('bcryptjs');

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user when requested by the same user', async () => {
      const mockUser = {
        _id: '12345',
        id: '12345',
        firstName: 'John',
        lastName: 'Doe',
        password: 'hashedPassword',
        roles: ['user']
      };

      const req = httpMocks.createRequest({
        params: { id: '12345' },
        user: mockUser
      });
      const res = httpMocks.createResponse();

      await getUser(req, res);

      expect(res.statusCode).toBe(200);
      const data = res._getData();
      expect(data.user.password).toBeNull();
      expect(data.user._id).toBe('12345');
    });

    it('should return user when requested by admin', async () => {
      const mockUser = {
        _id: '12345',
        id: '12345',
        firstName: 'John',
        lastName: 'Doe',
        password: 'hashedPassword',
      };

      const adminUser = {
        _id: 'admin123',
        id: 'admin123',
        roles: ['admin']
      };

      const req = httpMocks.createRequest({
        params: { id: '12345' },
        user: adminUser
      });
      const res = httpMocks.createResponse();

      req.user = mockUser;

      await getUser(req, res);

      expect(res.statusCode).toBe(200);
      const data = res._getData();
      expect(data.user.password).toBeNull();
    });

    it('should return 404 if user tries to access another user', async () => {
      const regularUser = {
        _id: 'user123',
        id: 'user123',
        roles: ['user']
      };

      const req = httpMocks.createRequest({
        params: { id: '12345' },
        user: regularUser
      });
      const res = httpMocks.createResponse();

      await getUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual({ message: "User not found." });
    });

    it('should return 500 on server error', async () => {
      const req = httpMocks.createRequest({
        params: { id: '12345' }
      });
      const res = httpMocks.createResponse();

      // Force an error by not providing req.user
      await getUser(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users for admin', async () => {
      const mockUsers = [
        { _id: 'user1', firstName: 'John' },
        { _id: 'user2', firstName: 'Jane' }
      ];

      const req = httpMocks.createRequest({
        user: {
          _id: 'admin123',
          roles: ['admin']
        }
      });
      const res = httpMocks.createResponse();

      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockUsers)
        })
      });

      await getAllUsers(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({ users: mockUsers });
    });

    it('should return only own user for non-admin', async () => {
      const mockUser = {
        _id: 'user123',
        firstName: 'John',
        password: 'password',
        roles: ['user']
      };

      const req = httpMocks.createRequest({
        user: mockUser
      });
      const res = httpMocks.createResponse();

      await getAllUsers(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({ user: { ...mockUser, password: '' } });
    });

    it('should return 500 on server error', async () => {
      const req = httpMocks.createRequest({
        user: {
          _id: 'admin123',
          roles: ['admin']
        }
      });
      const res = httpMocks.createResponse();

      User.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      await getAllUsers(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('updateUser', () => {
    it('should successfully update user details', async () => {
      const mockUpdatedUser = {
        _id: '12345',
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        phoneNumber: '1234567890',
        address: '123 Street'
      };

      const req = httpMocks.createRequest({
        params: { id: '12345' },
        user: {
          id: '12345',
          roles: ['user']
        },
        body: {
          firstName: 'John Updated',
          lastName: 'Doe Updated',
          phoneNumber: '1234567890',
          address: '123 Street'
        }
      });
      const res = httpMocks.createResponse();

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedUser);

      await updateUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({
        message: 'User updated successfully.',
        user: mockUpdatedUser
      });
    });

    it('should hash password when included in update', async () => {
      const req = httpMocks.createRequest({
        params: { id: '12345' },
        user: {
          id: '12345',
          roles: ['user']
        },
        body: {
          password: 'newPassword123'
        }
      });
      const res = httpMocks.createResponse();

      bcrypt.hashSync = jest.fn().mockReturnValue('hashedPassword');
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({ password: 'hashedPassword' });

      await updateUser(req, res);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('newPassword123', 8);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('12345', expect.objectContaining({
        password: 'hashedPassword'
      }), { new: true });
    });

    it('should update roles when included', async () => {
      const mockRoles = [
        { _id: 'role1', name: 'user' },
        { _id: 'role2', name: 'admin' }
      ];

      const req = httpMocks.createRequest({
        params: { id: '12345' },
        user: {
          id: '12345',
          roles: ['admin']
        },
        body: {
          roles: ['user', 'admin']
        }
      });
      const res = httpMocks.createResponse();

      Role.find = jest.fn().mockResolvedValue(mockRoles);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({ roles: mockRoles.map(r => r._id) });

      await updateUser(req, res);

      expect(Role.find).toHaveBeenCalledWith({ name: { $in: ['user', 'admin'] } });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('12345', expect.objectContaining({
        roles: ['role1', 'role2']
      }), { new: true });
    });

    it('should return 404 if user not found during update', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'nonexistent' },
        user: {
          id: '12345',
          roles: ['admin']
        },
        body: { firstName: 'John' }
      });
      const res = httpMocks.createResponse();

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await updateUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual({ message: 'User not found.' });
    });

    it('should return 404 if non-admin tries to update another user', async () => {
      const req = httpMocks.createRequest({
        params: { id: '67890' },
        user: {
          id: '12345',
          roles: ['user']
        },
        body: { firstName: 'John' }
      });
      const res = httpMocks.createResponse();

      await updateUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual({ message: 'User not found.' });
    });
  });

  describe('setRole', () => {
    it('should successfully update user roles', async () => {
      const mockRoles = [
        { _id: 'role1', name: 'user' },
        { _id: 'role2', name: 'admin' }
      ];
      const mockUser = {
        _id: '12345',
        roles: mockRoles.map(r => r._id)
      };

      const req = httpMocks.createRequest({
        params: { id: '12345' },
        body: { roles: ['user', 'admin'] }
      });
      const res = httpMocks.createResponse();

      Role.find = jest.fn().mockResolvedValue(mockRoles);
      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      await setRole(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({"message":"Rôles mis à jour avec succès.","user":{"_id":"12345","roles":["role1","role2"]}});
    });

    it('should return 400 if no roles provided', async () => {
      const req = httpMocks.createRequest({
        params: { id: '12345' },
        body: { roles: [] }
      });
      const res = httpMocks.createResponse();

      await setRole(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Veuillez fournir au moins un rôle.' });
    });

    it('should return 404 if no roles found', async () => {
      const req = httpMocks.createRequest({
        params: { id: '12345' },
        body: { roles: ['nonexistent'] }
      });
      const res = httpMocks.createResponse();

      Role.find = jest.fn().mockResolvedValue([]);

      await setRole(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'Aucun rôle correspondant trouvé.' });
    });

    it('should return 404 if user not found', async () => {
      const mockRoles = [{ _id: 'role1', name: 'user' }];

      const req = httpMocks.createRequest({
        params: { id: 'nonexistent' },
        body: { roles: ['user'] }
      });
      const res = httpMocks.createResponse();

      Role.find = jest.fn().mockResolvedValue(mockRoles);
      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await setRole(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: 'Utilisateur non trouvé.' });
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      const req = httpMocks.createRequest({
        params: { id: '12345' }
      });
      const res = httpMocks.createResponse();

      User.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: '12345' });

      await deleteUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({ message: 'User deleted successfully.' });
    });

    it('should return 404 if user not found for deletion', async () => {
      const req = httpMocks.createRequest({
        params: { id: 'nonexistent' }
      });
      const res = httpMocks.createResponse();

      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual({ message: 'User not found.' });
    });
  });
});