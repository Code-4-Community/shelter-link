// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository, SelectQueryBuilder } from 'typeorm';
// import { ShelterService } from './shelter.service';

// const mockShelterRepository = () => ({
//   find: jest.fn(),
//   create: jest.fn(),
//   save: jest.fn(),
//   findOneBy: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
//   createQueryBuilder: jest.fn(),
// });

// describe('UsersService', () => {
//   let service: ShelterService;
//   let shelterRepository: Repository<Shelter>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         SheltersService,
//         {
//           provide: getRepositoryToken(Shelter),
//           useFactory: mockShelterRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<SheltersService>(SheltersService);
//     shelterRepository = module.get<Repository<Shelter>>(
//       getRepositoryToken(Shelter)
//     );
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('findAll', () => {
//     it('should return an array of shelters', async () => {
//       const result = [new Shelter(), new Shelter()];
//       jest.spyOn(shelterRepository, 'find').mockResolvedValue(result);

//       expect(await service.findAll()).toBe(result);
//       expect(shelterRepository.find).toHaveBeenCalled();
//     });
//   });

//   describe('findByProximity', () => {
//     it('should return ordered shelters with calculated distances', async () => {
//       const mockShelters = [
//         { id: 1, latitude: 10, longitude: 10, distance: 10 },
//         { id: 2, latitude: 15, longitude: 15, distance: 5 },
//       ];

//       const mockQueryBuilder: Partial<SelectQueryBuilder<Shelter>> = {
//         select: jest.fn().mockReturnThis(),
//         addSelect: jest.fn().mockReturnThis(),
//         setParameter: jest.fn().mockReturnThis(),
//         orderBy: jest.fn().mockReturnThis(),
//         limit: jest.fn().mockReturnThis(),
//         getRawMany: jest.fn().mockResolvedValue(mockShelters),
//       };

//       // Mock the createQueryBuilder to return our mock query builder
//       jest
//         .spyOn(shelterRepository, 'createQueryBuilder')
//         .mockReturnValue(mockQueryBuilder as SelectQueryBuilder<Shelter>);

//       const result = await service.findByProximity(1, 1);
//       expect(result).toEqual([
//         { id: 1, latitude: 10, longitude: 10, distance: '10.00' },
//         { id: 2, latitude: 15, longitude: 15, distance: '5.00' },
//       ]);
//       expect(shelterRepository.createQueryBuilder).toHaveBeenCalled();
//       expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
//     });
//   });

//   describe('create', () => {
//     it('should successfully create a shelters', async () => {
//       const shelterData = { name: 'Test Shelter' };
//       const shelter = new Shelter();
//       jest.spyOn(shelterRepository, 'create').mockReturnValue(shelter);
//       jest.spyOn(shelterRepository, 'save').mockResolvedValue(shelter);

//       expect(await service.create(shelterData)).toBe(shelter);
//       expect(shelterRepository.create).toHaveBeenCalledWith(shelterData);
//       expect(shelterRepository.save).toHaveBeenCalledWith(shelter);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a shelters by ID', async () => {
//       const shelter = new Shelter();
//       jest.spyOn(shelterRepository, 'findOneBy').mockResolvedValue(shelter);

//       expect(await service.findOne(1)).toBe(shelter);
//       expect(shelterRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
//     });
//   });

//   describe('update', () => {
//     it('should update and return the updated shelters', async () => {
//       const shelterData = { name: 'Updated Shelter' };
//       const shelter = new Shelter();
//       jest.spyOn(shelterRepository, 'update').mockResolvedValue(undefined);
//       jest.spyOn(service, 'findOne').mockResolvedValue(shelter);

//       expect(await service.update(1, shelterData)).toBe(shelter);
//       expect(shelterRepository.update).toHaveBeenCalledWith(1, shelterData);
//     });
//   });

//   describe('remove', () => {
//     it('should delete a shelters by ID', async () => {
//       jest.spyOn(shelterRepository, 'delete').mockResolvedValue(undefined);

//       await service.remove(1);
//       expect(shelterRepository.delete).toHaveBeenCalledWith(1);
//     });
//   });
// });
