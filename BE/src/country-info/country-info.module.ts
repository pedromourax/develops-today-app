import { Module } from '@nestjs/common';
import { CountryInfoController } from './country-info.controller';
import { CountryInfoService } from './country-info.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CountryInfoController],
  providers: [CountryInfoService],
})
export class CountryInfoModule {}
