const usages = [];

class UsageRepository {
  create(usage) {
    usages.push(usage);

    return usage;
  }

  findAll() {
    return usages;
  }

  findById(id) {
    return usages.find((usage) => usage.id === id);
  }

  findActiveByCarId(carId) {
    return usages.find(
      (usage) =>
        usage.carId === carId &&
        usage.endDate === null
    );
  }

  findActiveByDriverId(driverId) {
    return usages.find(
      (usage) =>
        usage.driverId === driverId &&
        usage.endDate === null
    );
  }

  update(id, data) {
    const usage = this.findById(id);

    if (!usage) {
      return null;
    }

    Object.assign(usage, data);

    return usage;
  }

  clear() {
    usages.length = 0;
  }
}

module.exports = new UsageRepository();