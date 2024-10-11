import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountryInfoService {
  private logger = new Logger(CountryInfoService.name);

  constructor(private readonly httpService: HttpService) {}

  async getFlagByName(name: string): Promise<any> {
    if (!name) {
      throw new Error('Country name not provided');
    }
    try {
      const flagsUrl = `https://countriesnow.space/api/v0.1/countries/flag/images`;

      const response = await firstValueFrom(this.httpService.get(flagsUrl));
      const flag = response.data.data.find((flag: any) => flag.name === name);
      if (!flag) {
        return '';
      }

      return flag;
    } catch (error) {
      this.logger.error(`Error fetching the flag: ${error.message}`);
      throw new Error(`Error fetching the flag: ${error.message}`);
    }
  }

  async getAvailableCountries(): Promise<any> {
    const url = 'https://date.nager.at/api/v3/AvailableCountries';
    const response = await firstValueFrom(this.httpService.get(url));
    const data = await Promise.all(
      response.data.map(async (country: any) => {
        try {
          const flag = await this.getFlagByName(country.name);
          return {
            name: country.name,
            code: country.countryCode,
            flag: flag.flag,
          };
        } catch (error) {
          this.logger.error(
            `Error obtaining the flag for ${country.name}: ${error.message}`,
          );
          return {
            name: country.name,
            code: country.countryCode,
          };
        }
      }),
    );
    return data;
  }

  async getPopulationByCountryName(name: string): Promise<any> {
    try {
      const url = 'https://countriesnow.space/api/v0.1/countries/population';
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data.data.find(
        (country: any) => country.country === name,
      );
      if (!data) return null;
      return data.populationCounts;
    } catch (error) {
      this.logger.error(`Error fetching country population: ${error.message}`);
      throw new Error(`Error fetching country population: ${error.message}`);
    }
  }

  async getCountryInfo(code: string): Promise<any> {
    try {
      const url = `https://date.nager.at/api/v3/CountryInfo/${code}`;
      const response = await firstValueFrom(this.httpService.get(url));
      response.data.borders = await Promise.all(
        response.data.borders.map(async (country: any) => {
          const flag = await this.getFlagByName(country.commonName);
          if (flag) {
            return {
              ...country,
              flag: flag.flag,
            };
          }
          return country;
        }),
      );
      const flag = await this.getFlagByName(response.data.commonName);
      const population = await this.getPopulationByCountryName(
        response.data.commonName,
      );
      if (population) {
        return { ...response.data, flag: flag.flag, population };
      }
      return { ...response.data, flag: flag.flag };
    } catch (error) {
      this.logger.error(`Error fetching country information: ${error.message}`);
      throw new Error(`Error fetching country information: ${error.message}`);
    }
  }
}
