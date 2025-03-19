import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { NewShelterInput } from '../dtos/newShelterDTO';
import { UpdateShelterInput } from '../dtos/updateShelterDTO';
import { ShelterService } from './shelter.service';

@Controller('shelters')
export class ShelterController {
  constructor(private readonly shelterService: ShelterService) {}

  @Post()
  public async postShelter(@Body() shelterData: NewShelterInput) {
    try {
      return await this.shelterService.postShelter(shelterData);
    } catch (error) {
      throw new HttpException(
        `Unable to create shelter: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  public async getShelters() {
    return this.shelterService.getShelters();
  }

  @Patch('/:shelterId')
  public async updateShelter(
    @Param('shelterId') shelterId: string,
    @Body() updateData: UpdateShelterInput
  ) {
    return this.shelterService.updateShelter(shelterId, updateData);
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
