import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Query,
  Get,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { NewShelterInput } from '../dtos/newShelterDTO';
import { ShelterService } from './shelter.service';

@Controller('shelter')
export class ShelterController {
  constructor(private readonly shelterService: ShelterService) {}

  @Post()
  public async postShelter(@Body() shelterData: NewShelterInput) {
    return this.shelterService.postShelter(shelterData);
  }

  @Get()
  public async getShelters() {
    return this.shelterService.getShelters();
  }

  @Get('/:shelterId')
  public async getShelter(@Param('shelterId') shelterId: string) {
    return this.shelterService.getShelter(shelterId);
  }

  @Delete('/:shelterId')
  public async deleteShelter(@Param('shelterId') shelterId: string) {
    await this.shelterService.deleteShelter(shelterId);
    return { message: `Shelter with ID ${shelterId} deleted successfully.` };
  }
}
