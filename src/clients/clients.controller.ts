import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientService } from '../management/services/client.service';
import { GetManagementDossiersByClientId } from '../shared/dto/dossier.dto';
import { CreateFavouriteByUser } from '../shared/dto/favourites.dto';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':username/dossiers')
  getClientDossiersById(
    @Param('username') username: string,
    @Query('type') type: string | string[],
  ): Promise<GetManagementDossiersByClientId> {
    return this.clientService.getDossiersByClientUsername(username, type);
  }

  @Get(':username/favourites')
  getFavouritesByClientId(@Param('username') username: string) {
    return this.clientService.getFavouritesByUsername(username);
  }

  @Get(':username')
  getClients(@Param('username') username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    return this.clientService.getClientInfoByUsername(username);
  }

  @Patch(':username')
  updateClientByUsername(@Param('username') username: string, @Body() updateClientDTO) {
    return this.clientService.patchClientByUsername(username, updateClientDTO);
  }

  @Post(':username/favourites')
  createFavouritesByUsername(@Param('username') username: string, @Body() createFavouriteByUser: CreateFavouriteByUser) {
    return this.clientService.createFavouriteByUsername(username, createFavouriteByUser);
  }

  @Delete(':username/favourites/:favouriteId')
  deleteFavouriteByUsername(@Param('username') username: string, @Param('favouriteId') favouriteId: string) {
    return this.clientService.deleteFavouriteByUsername(username, favouriteId);
  }

  @Post(':username/newsletter')
  subscribeToNewsletter(@Param('username') username: string, @Body() newsletterRequestDTO: { permit_email: boolean }) {
    return this.clientService.subscribeToNewsletter(username, newsletterRequestDTO);
  }
}
