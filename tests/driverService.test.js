jest.mock('../src/repositories/driverRepository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

const driverService = require('../src/services/driverService');
const driverRepository = require('../src/repositories/driverRepository');

describe('DriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a driver', () => {
      const driver = {
        id: 'driver-1',
        name: 'João Silva'
      };

      driverRepository.create.mockReturnValue(driver);

      const result = driverService.create({
        name: 'João Silva'
      });

      expect(driverRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'João Silva'
        })
      );

      expect(result).toEqual(driver);
    });

    test('should throw an error when name is missing', () => {
      expect(() =>
        driverService.create({})
      ).toThrow('Name is required');

      expect(driverRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    test('should return all drivers', () => {
      const drivers = [
        {
          id: 'driver-1',
          name: 'João Silva'
        },
        {
          id: 'driver-2',
          name: 'Maria Silva'
        }
      ];

      driverRepository.findAll.mockReturnValue(drivers);

      const result = driverService.findAll();

      expect(result).toEqual(drivers);
    });

    test('should filter drivers by name', () => {
      const drivers = [
        {
          id: 'driver-1',
          name: 'João Silva'
        },
        {
          id: 'driver-2',
          name: 'Maria Silva'
        }
      ];

      driverRepository.findAll.mockReturnValue(drivers);

      const result = driverService.findAll({
        name: 'joão'
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('driver-1');
    });
  });

  describe('findById', () => {
    test('should return a driver when it exists', () => {
      const driver = {
        id: 'driver-1',
        name: 'João Silva'
      };

      driverRepository.findById.mockReturnValue(driver);

      const result = driverService.findById('driver-1');

      expect(driverRepository.findById).toHaveBeenCalledWith(
        'driver-1'
      );

      expect(result).toEqual(driver);
    });

    test('should throw an error when driver does not exist', () => {
      driverRepository.findById.mockReturnValue(undefined);

      expect(() =>
        driverService.findById('invalid-id')
      ).toThrow('Driver not found');
    });
  });

  describe('update', () => {
    test('should update the driver name', () => {
      const driver = {
        id: 'driver-1',
        name: 'João Silva'
      };

      driverRepository.findById.mockReturnValue(driver);

      driverRepository.update.mockReturnValue({
        id: 'driver-1',
        name: 'João Santos'
      });

      const result = driverService.update('driver-1', {
        name: 'João Santos'
      });

      expect(driverRepository.update).toHaveBeenCalledWith(
        'driver-1',
        {
          name: 'João Santos'
        }
      );

      expect(result.name).toBe('João Santos');
    });

    test('should throw an error when updated name is empty', () => {
      driverRepository.findById.mockReturnValue({
        id: 'driver-1',
        name: 'João Silva'
      });

      expect(() =>
        driverService.update('driver-1', {
          name: ''
        })
      ).toThrow('Name is required');

      expect(driverRepository.update).not.toHaveBeenCalled();
    });
  });
});