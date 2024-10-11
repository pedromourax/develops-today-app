import { HttpService } from '@nestjs/axios';
export declare class CountryInfoService {
    private readonly httpService;
    private logger;
    constructor(httpService: HttpService);
    getFlagByName(name: string): Promise<any>;
    getAvailableCountries(): Promise<any>;
    getPopulationByCountryName(name: string): Promise<any>;
    getCountryInfo(code: string): Promise<any>;
}
