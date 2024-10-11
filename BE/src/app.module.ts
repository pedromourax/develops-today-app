import { Module } from '@nestjs/common';
import { CountryInfoModule } from './country-info/country-info.module';

@Module({
  imports: [CountryInfoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
