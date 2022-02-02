import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OtaClientDTO {
  @ApiPropertyOptional({ example: 822 })
  id?: number;
  @ApiPropertyOptional({ example: 'Pepe' })
  name?: string;
  @ApiPropertyOptional({ example: 'Tecnoturis' })
  surname?: string;
  @ApiPropertyOptional({ example: 'pepe@tecnoturis.com' })
  mail?: string;
  @ApiPropertyOptional({ example: '600101010' })
  phone?: string;
  @ApiPropertyOptional({ example: '+34' })
  prefix?: string;
  @ApiPropertyOptional({ example: true })
  promo?: boolean;
}
