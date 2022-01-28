import { ApiProperty } from '@nestjs/swagger';

export class OtaClientDTO {
  @ApiProperty({ example: 'Pepe' })
  name: string;
  @ApiProperty({ example: 'Tecnoturis' })
  surname: string;
  @ApiProperty({ example: 'pepe@tecnoturis.com' })
  mail: string;
  @ApiProperty({ example: '600101010' })
  phone: string;
  @ApiProperty({ example: '+34' })
  prefix: string;
  @ApiProperty({ example: true })
  promo: boolean;
}
