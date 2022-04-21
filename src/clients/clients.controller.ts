import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClientService } from '../management/services/client.service';
import { ExternalClientService } from '../management/services/external-client.service';
import { DossierClientDTO } from '../shared/dto/dossier-client.dto';
import { GetManagementDossiersByClientId } from '../shared/dto/dossier.dto';
import { CreateExternalUserDTO } from '../shared/dto/external-user.dto';
import { CreateFavouriteByUser } from '../shared/dto/favourites.dto';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';
import { DEFAULT_EMPTY_PASSWORD_EXTERNAL_CLIENT, DEFAULT_ROL_EXTERNAL_CLIENT } from './clients.constants';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService, private readonly externalClientsService: ExternalClientService) {}

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
  updateClientByUsername(@Param('username') username: string, @Body() updateClientDTO: Partial<DossierClientDTO>) {
    return this.clientService.patchClientByUsername(username, updateClientDTO);
  }

  @Post(':username/favourites')
  createFavouritesByUsername(@Param('username') username: string, @Body() createFavouriteByUser: CreateFavouriteByUser) {
    return this.clientService.createFavouriteByUsername(username, createFavouriteByUser);
  }

  @Delete(':username/favourites/:favouriteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFavouriteByUsername(@Param('username') username: string, @Param('favouriteId') favouriteId: string) {
    return this.clientService.deleteFavouriteByUsername(username, favouriteId);
  }

  @Put(':username/newsletter')
  subscribeToNewsletter(@Param('username') username: string, @Body() newsletterRequestDTO: { permit_email: boolean }) {
    return this.clientService.subscribeToNewsletter(username, newsletterRequestDTO);
  }

  @Post(['', ':username'])
  createClient(@Req() request: Request, @Body() createClient: CreateExternalUserDTO) {
    return this.externalClientsService.createExternalClient({
      ...createClient,
      agency: Number(request['agencyId']),
      agency_chain: Number(request['agencyChainId']),
      role: DEFAULT_ROL_EXTERNAL_CLIENT,
      password1: DEFAULT_EMPTY_PASSWORD_EXTERNAL_CLIENT,
      password2: DEFAULT_EMPTY_PASSWORD_EXTERNAL_CLIENT,
    });
  }
}
