import { Get, Controller, Param } from '@nestjs/common';
import { CountryInfoService } from './country-info.service';

@Controller('country-info')
export class CountryInfoController {
  constructor(private readonly countryInfoService: CountryInfoService) {}

  @Get('available-countries')
  async getAvailableCountries() {
    return await this.countryInfoService.getAvailableCountries();
  }

  @Get(':code')
  async getCountryInfo(@Param('code') code: string) {
    return this.countryInfoService.getCountryInfo(code);
  }

  @Get('flag/:name')
  async getFlagByCode(@Param('name') name: string) {
    return this.countryInfoService.getFlagByName(name);
  }

  @Get('population/:name')
  async getPopulationByCountryName(@Param('name') name: string) {
    return this.countryInfoService.getPopulationByCountryName(name);
  }
}
