jest.mock('../src/repositories/usageRepository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findActiveByCarId: jest.fn(),
  findActiveByDriverId: jest.fn(),
  update: jest.fn()
}));

jest.mock('../src/repositories/carRepository', () => ({
  findById: jest.fn()
}));

jest.mock('../src/repositories/driverRepository', () => ({
  findById: jest.fn()
}));

const usageService = require('../src/services/usageService');

const usageRepository = require('../src/repositories/usageRepository');
const carRepository = require('../src/repositories/carRepository');
const driverRepository = require('../src/repositories/driverRepository');

describe('UsageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const car = {
      id: 'car-1',
      plate: 'ABC-1234',
      color: 'Preto',
      brand: 'Toyota'
    };

    const driver = {
      id: 'driver-1',
      name: 'João Silva'
    };

    beforeEach(() => {
      carRepository.findById.mockReturnValue(car);
      driverRepository.findById.mockReturnValue(driver);
      usageRepository.findActiveByCarId.mockReturnValue(undefined);
      usageRepository.findActiveByDriverId.mockReturnValue(undefined);
    });

    test('should create a usage', () => {
      const usage = {
        id: 'usage-1',
        startDate: '2026-10-06T10:00:00.000Z',
        endDate: null,
        driverId: 'driver-1',
        carId: 'car-1',
        reason: 'Visita ao cliente'
      };

      usageRepository.create.mockReturnValue(usage);

      const result = usageService.create({
        carId: 'car-1',
        driverId: 'driver-1',
        reason: 'Visita ao cliente',
        startDate: '2026-10-06T10:00:00.000Z'
      });

      expect(usageRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          carId: 'car-1',
          driverId: 'driver-1',
          reason: 'Visita ao cliente',
          startDate: '2026-10-06T10:00:00.000Z',
          endDate: null
        })
      );

      expect(result).toEqual(usage);
    });

    test('should throw an error when car does not exist', () => {
      carRepository.findById.mockReturnValue(undefined);

      expect(() =>
        usageService.create({
          carId: 'invalid-car',
          driverId: 'driver-1',
          reason: 'Teste'
        })
      ).toThrow('Car not found');

      expect(usageRepository.create).not.toHaveBeenCalled();
    });

    test('should throw an error when driver does not exist', () => {
      driverRepository.findById.mockReturnValue(undefined);

      expect(() =>
        usageService.create({
          carId: 'car-1',
          driverId: 'invalid-driver',
          reason: 'Teste'
        })
      ).toThrow('Driver not found');

      expect(usageRepository.create).not.toHaveBeenCalled();
    });

    test('should prevent a car from being used by two drivers at the same time', () => {
      usageRepository.findActiveByCarId.mockReturnValue({
        id: 'active-usage',
        carId: 'car-1',
        driverId: 'another-driver',
        endDate: null
      });

      expect(() =>
        usageService.create({
          carId: 'car-1',
          driverId: 'driver-1',
          reason: 'Teste'
        })
      ).toThrow('Car is already being used');

      expect(usageRepository.create).not.toHaveBeenCalled();
    });

    test('should prevent a driver from using two cars at the same time', () => {
      usageRepository.findActiveByDriverId.mockReturnValue({
        id: 'active-usage',
        carId: 'another-car',
        driverId: 'driver-1',
        endDate: null
      });

      expect(() =>
        usageService.create({
          carId: 'car-1',
          driverId: 'driver-1',
          reason: 'Teste'
        })
      ).toThrow('Driver is already using a car');

      expect(usageRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('finish', () => {
    test('should finish an active usage', () => {
      const activeUsage = {
        id: 'usage-1',
        carId: 'car-1',
        driverId: 'driver-1',
        endDate: null
      };

      const finishedUsage = {
        ...activeUsage,
        endDate: '2026-10-06T12:00:00.000Z'
      };

      usageRepository.findById.mockReturnValue(activeUsage);
      usageRepository.update.mockReturnValue(finishedUsage);

      const result = usageService.finish('usage-1');

      expect(usageRepository.update).toHaveBeenCalledWith(
        'usage-1',
        expect.objectContaining({
          endDate: expect.any(String)
        })
      );

      expect(result).toEqual(finishedUsage);
    });

    test('should throw an error when usage does not exist', () => {
      usageRepository.findById.mockReturnValue(undefined);

      expect(() =>
        usageService.finish('invalid-usage')
      ).toThrow('Usage not found');

      expect(usageRepository.update).not.toHaveBeenCalled();
    });

    test('should prevent finishing an already finished usage', () => {
      usageRepository.findById.mockReturnValue({
        id: 'usage-1',
        endDate: '2026-10-06T12:00:00.000Z'
      });

      expect(() =>
        usageService.finish('usage-1')
      ).toThrow('Usage has already been finished');

      expect(usageRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    test('should return a usage when it exists', () => {
      const usage = {
        id: 'usage-1',
        carId: 'car-1',
        driverId: 'driver-1',
        reason: 'Visita ao cliente'
      };

      usageRepository.findById.mockReturnValue(usage);

      const result = usageService.findById('usage-1');

      expect(usageRepository.findById).toHaveBeenCalledWith(
        'usage-1'
      );

      expect(result).toEqual(usage);
    });

    test('should throw an error when usage does not exist', () => {
      usageRepository.findById.mockReturnValue(undefined);

      expect(() =>
        usageService.findById('invalid-usage')
      ).toThrow('Usage not found');
    });
  });
});