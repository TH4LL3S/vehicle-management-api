jest.mock('../src/repositories/carRepository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

const carService = require('../src/services/carService');
const carRepository = require('../src/repositories/carRepository');

describe('CarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a car', () => {
      const car = {
        id: 'car-1',
        plate: 'ABC-1234',
        color: 'Preto',
        brand: 'Toyota'
      };

      carRepository.create.mockReturnValue(car);

      const result = carService.create({
        plate: 'ABC-1234',
        color: 'Preto',
        brand: 'Toyota'
      });

      expect(carRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          plate: 'ABC-1234',
          color: 'Preto',
          brand: 'Toyota'
        })
      );

      expect(result).toEqual(car);
    });

    test('should throw an error when required fields are missing', () => {
      expect(() =>
        carService.create({
          plate: 'ABC-1234'
        })
      ).toThrow('Plate, color and brand are required');

      expect(carRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    test('should return all cars', () => {
      const cars = [
        {
          id: 'car-1',
          plate: 'ABC-1234',
          color: 'Preto',
          brand: 'Toyota'
        },
        {
          id: 'car-2',
          plate: 'XYZ-5678',
          color: 'Branco',
          brand: 'Honda'
        }
      ];

      carRepository.findAll.mockReturnValue(cars);

      const result = carService.findAll();

      expect(result).toEqual(cars);
    });

    test('should filter cars by color', () => {
      const cars = [
        {
          id: 'car-1',
          plate: 'ABC-1234',
          color: 'Preto',
          brand: 'Toyota'
        },
        {
          id: 'car-2',
          plate: 'XYZ-5678',
          color: 'Branco',
          brand: 'Honda'
        }
      ];

      carRepository.findAll.mockReturnValue(cars);

      const result = carService.findAll({
        color: 'preto'
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('car-1');
    });

    test('should filter cars by brand', () => {
      const cars = [
        {
          id: 'car-1',
          plate: 'ABC-1234',
          color: 'Preto',
          brand: 'Toyota'
        },
        {
          id: 'car-2',
          plate: 'XYZ-5678',
          color: 'Branco',
          brand: 'Honda'
        }
      ];

      carRepository.findAll.mockReturnValue(cars);

      const result = carService.findAll({
        brand: 'honda'
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('car-2');
    });
  });

  describe('findById', () => {
    test('should return a car when it exists', () => {
      const car = {
        id: 'car-1',
        plate: 'ABC-1234',
        color: 'Preto',
        brand: 'Toyota'
      };

      carRepository.findById.mockReturnValue(car);

      const result = carService.findById('car-1');

      expect(carRepository.findById).toHaveBeenCalledWith('car-1');
      expect(result).toEqual(car);
    });

    test('should throw an error when car does not exist', () => {
      carRepository.findById.mockReturnValue(undefined);

      expect(() =>
        carService.findById('invalid-id')
      ).toThrow('Car not found');
    });
  });
});